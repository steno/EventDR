"use client";

import { useEffect, useRef } from "react";

const COURT_H = 168;
const PADDLE_W = 64;
const PADDLE_H = 8;
const BALL_R = 5;
const SPEED = 220;

/**
 * Tiny one-paddle rally: bat follows pointer/finger X while over the court.
 * Infinite bounce; missing resets the ball. Pauses when off-screen or hidden.
 *
 * Draws only on the canvas bitmap — never mutates the React DOM tree.
 * With Reduce Motion, the court still draws; the ball waits for a tap/drag.
 */
export function EmptyPong({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapEl = wrapRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapEl || !canvasEl) return;

    const context = canvasEl.getContext("2d");
    if (!context) return;

    // Narrowed locals — closures must not see the possibly-null refs.
    const wrap = wrapEl;
    const canvas = canvasEl;
    const ctx = context;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let alive = true;
    let width = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let seeded = false;
    // When Reduce Motion is on, draw the court but wait for a tap/drag to rally.
    let motionArmed = !prefersReduced;

    const paddle = { x: 0, y: 0 };
    const ball = { x: 0, y: 0, vx: SPEED, vy: -SPEED * 0.85 };

    function resize() {
      if (!alive) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(wrap.clientWidth, 1);
      // Bitmap size only — CSS size stays on the React className (w-full / h).
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(COURT_H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paddle.y = COURT_H - 18;
      if (!seeded) {
        paddle.x = width / 2;
        resetBall();
        seeded = true;
      } else {
        paddle.x = Math.min(
          width - PADDLE_W / 2,
          Math.max(PADDLE_W / 2, paddle.x),
        );
      }
    }

    function resetBall() {
      ball.x = width / 2;
      ball.y = COURT_H * 0.35;
      const dir = Math.random() > 0.5 ? 1 : -1;
      ball.vx = SPEED * dir * (0.75 + Math.random() * 0.35);
      ball.vy = -SPEED * (0.7 + Math.random() * 0.35);
    }

    function setPaddleFromClientX(clientX: number) {
      const rect = canvas.getBoundingClientRect();
      paddle.x = Math.min(
        width - PADDLE_W / 2,
        Math.max(PADDLE_W / 2, clientX - rect.left),
      );
    }

    function armMotion() {
      if (motionArmed) return;
      motionArmed = true;
      if (visible && !document.hidden) start();
    }

    function onPointerMove(e: PointerEvent) {
      setPaddleFromClientX(e.clientX);
      if (!running) draw();
      if (e.pointerType !== "mouse" || e.buttons > 0) armMotion();
    }

    function onPointerDown(e: PointerEvent) {
      // Avoid setPointerCapture — capturing a node React later removes
      // can desync the tree (insertBefore / removeChild NotFoundError).
      setPaddleFromClientX(e.clientX);
      if (!running) draw();
      armMotion();
    }

    function draw() {
      if (!alive || width <= 0) return;
      const dark = document.documentElement.classList.contains("dark");
      ctx.clearRect(0, 0, width, COURT_H);

      const wash = ctx.createLinearGradient(0, 0, width, COURT_H);
      if (dark) {
        wash.addColorStop(0, "rgba(244, 63, 94, 0.08)");
        wash.addColorStop(0.55, "rgba(24, 24, 27, 0.4)");
        wash.addColorStop(1, "rgba(217, 70, 239, 0.1)");
      } else {
        wash.addColorStop(0, "rgba(249, 115, 22, 0.08)");
        wash.addColorStop(0.55, "rgba(250, 250, 250, 0.5)");
        wash.addColorStop(1, "rgba(244, 63, 94, 0.1)");
      }
      ctx.fillStyle = wash;
      roundRect(ctx, 0, 0, width, COURT_H, 16);
      ctx.fill();

      ctx.strokeStyle = dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 10);
      ctx.lineTo(width / 2, COURT_H - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
      ctx.fillRect(12, 8, width - 24, 3);

      const paddleGrad = ctx.createLinearGradient(
        paddle.x - PADDLE_W / 2,
        0,
        paddle.x + PADDLE_W / 2,
        0,
      );
      paddleGrad.addColorStop(0, "#f97316");
      paddleGrad.addColorStop(0.5, "#f43f5e");
      paddleGrad.addColorStop(1, "#d946ef");
      ctx.fillStyle = paddleGrad;
      roundRect(
        ctx,
        paddle.x - PADDLE_W / 2,
        paddle.y - PADDLE_H / 2,
        PADDLE_W,
        PADDLE_H,
        4,
      );
      ctx.fill();

      const ballGrad = ctx.createRadialGradient(
        ball.x - 1,
        ball.y - 1,
        0,
        ball.x,
        ball.y,
        BALL_R * 1.6,
      );
      ballGrad.addColorStop(0, "#fda4af");
      ballGrad.addColorStop(1, "#f43f5e");
      ctx.fillStyle = ballGrad;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fill();
    }

    function step(ts: number) {
      if (!alive || !running) return;
      const dt = Math.min((ts - last) / 1000, 0.04);
      last = ts;

      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      if (ball.x - BALL_R <= 8) {
        ball.x = 8 + BALL_R;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x + BALL_R >= width - 8) {
        ball.x = width - 8 - BALL_R;
        ball.vx = -Math.abs(ball.vx);
      }

      if (ball.y - BALL_R <= 12) {
        ball.y = 12 + BALL_R;
        ball.vy = Math.abs(ball.vy);
      }

      const half = PADDLE_W / 2;
      const withinX =
        ball.x >= paddle.x - half - BALL_R &&
        ball.x <= paddle.x + half + BALL_R;
      const crossing =
        ball.vy > 0 &&
        ball.y + BALL_R >= paddle.y - PADDLE_H / 2 &&
        ball.y - BALL_R <= paddle.y + PADDLE_H / 2;

      if (withinX && crossing) {
        ball.y = paddle.y - PADDLE_H / 2 - BALL_R;
        const offset = (ball.x - paddle.x) / half;
        ball.vx = SPEED * offset * 0.95;
        ball.vy = -Math.abs(ball.vy) * (1 + Math.abs(offset) * 0.08);
        const mag = Math.hypot(ball.vx, ball.vy) || 1;
        const target = SPEED * (0.95 + Math.random() * 0.12);
        ball.vx = (ball.vx / mag) * target;
        ball.vy = (ball.vy / mag) * target;
        if (ball.vy > -120) ball.vy = -120;
      }

      if (ball.y - BALL_R > COURT_H + 8) resetBall();

      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (!alive || running || !visible || !motionArmed || document.hidden) {
        return;
      }
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function onVisibility() {
      if (!alive) return;
      if (document.hidden) stop();
      else if (visible) start();
    }

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      if (!alive) return;
      resize();
      if (!running) draw();
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!alive) return;
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0.15 },
    );
    io.observe(wrap);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      alive = false;
      stop();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`relative touch-none select-none ${className}`}
      style={{ height: COURT_H }}
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="mx-auto block h-full w-full cursor-none rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-800/80"
      />
    </div>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}
