"use client";

import { useEffect, useRef } from "react";

const COURT_H = 200;
const PADDLE_W = 64;
const PADDLE_H = 8;
const BALL_R = 5;
const SPEED = 220;
/** Empty-state message on the court before PLAY. */
const WELCOME_HOLD_MS = 1600;
/** Brief PLAY flash before the rally starts on its own. */
const PLAY_HOLD_MS = 900;

/**
 * Tiny one-paddle rally: bat follows pointer/finger X while over the court.
 * A miss pauses on a RESTART prompt; tap to play again. Pauses when
 * off-screen or hidden. Score lives in a centered HUD above the court.
 *
 * Game draws only on the canvas bitmap. Score updates via a ref — never
 * React setState from the rAF loop — so the React tree stays stable.
 * Optional welcome flash, then PLAY, then auto-starts; tap skips waits.
 */
export function EmptyPong({
  className = "",
  welcome,
  labels,
}: {
  className?: string;
  /** Empty-state copy shown on the court before PLAY (e.g. "Nothing turned up."). */
  welcome?: string;
  labels: {
    score: string;
    play: string;
    restart: string;
    tapToRestart: string;
  };
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreRef = useRef<HTMLSpanElement>(null);

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
    const scoreEl = scoreRef.current;
    const welcomeText = welcome?.replace(/\.$/, "").trim() || "";

    // Canvas ctx.font can't parse CSS var(); resolve the real family names
    // once, or every font assignment is silently ignored (stuck at 10px).
    const rootStyle = getComputedStyle(document.documentElement);
    const displayFont =
      rootStyle.getPropertyValue("--font-syne").trim() || "system-ui";
    const bodyFont =
      rootStyle.getPropertyValue("--font-inter").trim() || "system-ui";
    const displayStack = `${displayFont}, system-ui, sans-serif`;
    const bodyStack = `${bodyFont}, system-ui, sans-serif`;

    let alive = true;
    let width = 0;
    let dpr = 1;
    let raf = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let seeded = false;
    let showingWelcome = Boolean(welcomeText);
    let motionArmed = false;
    let awaitingRestart = false;
    let welcomeHoldTimer = 0;
    let playHoldTimer = 0;
    let score = 0;

    function paintHud() {
      if (scoreEl) scoreEl.textContent = String(score);
    }

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

    function clearHoldTimers() {
      if (welcomeHoldTimer) {
        window.clearTimeout(welcomeHoldTimer);
        welcomeHoldTimer = 0;
      }
      if (playHoldTimer) {
        window.clearTimeout(playHoldTimer);
        playHoldTimer = 0;
      }
    }

    function showPlayThenArm() {
      showingWelcome = false;
      draw();
      playHoldTimer = window.setTimeout(() => {
        if (!alive) return;
        armMotion();
      }, PLAY_HOLD_MS);
    }

    function armMotion() {
      if (motionArmed || awaitingRestart) return;
      showingWelcome = false;
      motionArmed = true;
      clearHoldTimers();
      if (visible && !document.hidden) start();
      else draw();
    }

    function goToRestart() {
      stop();
      awaitingRestart = true;
      draw();
    }

    function restartGame() {
      if (!awaitingRestart) return;
      awaitingRestart = false;
      score = 0;
      paintHud();
      resetBall();
      paddle.x = width / 2;
      if (visible && !document.hidden) start();
      else draw();
    }

    function onPointerMove(e: PointerEvent) {
      if (!motionArmed || awaitingRestart) return;
      setPaddleFromClientX(e.clientX);
      if (!running) draw();
    }

    function onPointerDown(e: PointerEvent) {
      // Avoid setPointerCapture — capturing a node React later removes
      // can desync the tree (insertBefore / removeChild NotFoundError).
      if (awaitingRestart) {
        restartGame();
        return;
      }
      setPaddleFromClientX(e.clientX);
      armMotion();
      if (!running) draw();
    }

    function promptGradient() {
      const grad = ctx.createLinearGradient(
        width / 2 - 80,
        COURT_H / 2,
        width / 2 + 80,
        COURT_H / 2,
      );
      grad.addColorStop(0, "#f97316");
      grad.addColorStop(0.5, "#f43f5e");
      grad.addColorStop(1, "#d946ef");
      return grad;
    }

    function drawWelcomePrompt(text: string) {
      const display = text.toUpperCase();
      const maxWidth = width - 28;
      let fontSize = Math.min(32, Math.max(22, width * 0.08));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.04em";
      ctx.fillStyle = promptGradient();

      function measure(size: number) {
        ctx.font = `800 ${size}px ${displayStack}`;
        return ctx.measureText(display).width;
      }

      while (fontSize > 18 && measure(fontSize) > maxWidth) {
        fontSize -= 1;
      }

      const words = display.split(/\s+/);
      let lines: string[] = [display];
      if (measure(fontSize) > maxWidth && words.length > 1) {
        const mid = Math.ceil(words.length / 2);
        lines = [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
        fontSize = Math.min(34, Math.max(24, width * 0.085));
        while (
          fontSize > 18 &&
          lines.some((line) => {
            ctx.font = `800 ${fontSize}px ${displayStack}`;
            return ctx.measureText(line).width > maxWidth;
          })
        ) {
          fontSize -= 1;
        }
      }

      ctx.font = `800 ${fontSize}px ${displayStack}`;
      const lineGap = fontSize * 1.15;
      const startY = COURT_H / 2 - ((lines.length - 1) * lineGap) / 2;
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], width / 2, startY + i * lineGap);
      }
    }

    function drawCenteredPrompt(label: string, hint?: string) {
      const maxWidth = width - 32;
      let fontSize = Math.min(48, Math.max(32, width * 0.13));
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.letterSpacing = "0.06em";
      ctx.fillStyle = promptGradient();

      while (fontSize > 22) {
        ctx.font = `800 ${fontSize}px ${displayStack}`;
        if (ctx.measureText(label).width <= maxWidth) break;
        fontSize -= 1;
      }

      ctx.font = `800 ${fontSize}px ${displayStack}`;
      ctx.fillText(label, width / 2, hint ? COURT_H / 2 - 10 : COURT_H / 2);

      if (hint) {
        const hintSize = Math.max(13, fontSize * 0.28);
        ctx.font = `600 ${hintSize}px ${bodyStack}`;
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.letterSpacing = "0.12em";
        ctx.fillText(hint, width / 2, COURT_H / 2 + fontSize * 0.52);
      }
    }

    function drawCourtChrome() {
      const wash = ctx.createLinearGradient(0, 0, width, COURT_H);
      wash.addColorStop(0, "#1a0a14");
      wash.addColorStop(0.45, "#0c0c10");
      wash.addColorStop(1, "#160a1c");
      ctx.fillStyle = wash;
      roundRect(ctx, 0, 0, width, COURT_H, 16);
      ctx.fill();

      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 10);
      ctx.lineTo(width / 2, COURT_H - 10);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(12, 8, width - 24, 3);
    }

    function draw() {
      if (!alive || width <= 0) return;
      ctx.clearRect(0, 0, width, COURT_H);
      drawCourtChrome();

      if (showingWelcome && welcomeText) {
        drawWelcomePrompt(welcomeText);
        return;
      }

      if (!motionArmed) {
        drawCenteredPrompt(labels.play.toUpperCase());
        return;
      }

      if (awaitingRestart) {
        const text = labels.tapToRestart.toUpperCase();
        const maxWidth = width - 32;
        let fontSize = Math.min(20, Math.max(14, width * 0.05));
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.letterSpacing = "0.12em";
        ctx.fillStyle = promptGradient();
        while (fontSize > 12) {
          ctx.font = `600 ${fontSize}px ${bodyStack}`;
          if (ctx.measureText(text).width <= maxWidth) break;
          fontSize -= 1;
        }
        ctx.font = `600 ${fontSize}px ${bodyStack}`;
        ctx.fillText(text, width / 2, COURT_H / 2);
        return;
      }

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
      if (!alive || !running || awaitingRestart) return;
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
        score += 1;
        paintHud();
      }

      if (ball.y - BALL_R > COURT_H + 8) {
        goToRestart();
        return;
      }

      draw();
      raf = requestAnimationFrame(step);
    }

    function start() {
      if (
        !alive ||
        running ||
        !visible ||
        !motionArmed ||
        awaitingRestart ||
        document.hidden
      ) {
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

    paintHud();
    resize();
    draw();

    if (showingWelcome) {
      welcomeHoldTimer = window.setTimeout(() => {
        if (!alive) return;
        showPlayThenArm();
      }, WELCOME_HOLD_MS);
    } else {
      playHoldTimer = window.setTimeout(() => {
        if (!alive) return;
        armMotion();
      }, PLAY_HOLD_MS);
    }

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

    return () => {
      alive = false;
      stop();
      clearHoldTimers();
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [labels, welcome]);

  return (
    <div
      className={`mx-auto w-full max-w-[22rem] ${className}`}
      aria-hidden
    >
      <div className="mb-2 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-neutral-400">
          {labels.score}
        </p>
        <p className="text-4xl font-bold leading-none tracking-tight text-neutral-900 tabular-nums dark:text-white">
          <span ref={scoreRef}>0</span>
        </p>
      </div>

      <div
        ref={wrapRef}
        className="relative touch-none select-none"
        style={{ height: COURT_H }}
      >
        <canvas
          ref={canvasRef}
          className="mx-auto block h-full w-full cursor-pointer rounded-2xl bg-[#0c0c10] ring-1 ring-white/10"
        />
      </div>
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
