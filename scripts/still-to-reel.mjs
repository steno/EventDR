#!/usr/bin/env node
/**
 * Turn a still image into a short vertical MP4 for Instagram Reels (9:16).
 * Requires ffmpeg on PATH (GitHub Action installs it).
 */

import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const REEL_SECONDS = 5;
const REEL_W = 1080;
const REEL_H = 1920;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve(undefined);
      else reject(new Error(stderr.trim() || `${cmd} exited ${code}`));
    });
  });
}

/**
 * @param {string} imageUrl
 * @returns {Promise<Buffer>}
 */
export async function stillImageToReelMp4(imageUrl) {
  const dir = await mkdtemp(join(tmpdir(), "pop-reel-"));
  const inPath = join(dir, "still.jpg");
  const outPath = join(dir, "reel.mp4");
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image (${response.status}): ${imageUrl}`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) throw new Error("Empty image download");
    await writeFile(inPath, bytes);

    const vf = [
      `scale=${REEL_W}:${REEL_H}:force_original_aspect_ratio=increase`,
      `crop=${REEL_W}:${REEL_H}`,
      "format=yuv420p",
    ].join(",");

    await run("ffmpeg", [
      "-y",
      "-loop",
      "1",
      "-i",
      inPath,
      "-f",
      "lavfi",
      "-i",
      "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-t",
      String(REEL_SECONDS),
      "-vf",
      vf,
      "-c:v",
      "libx264",
      "-tune",
      "stillimage",
      "-pix_fmt",
      "yuv420p",
      "-r",
      "30",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-shortest",
      "-movflags",
      "+faststart",
      "-crf",
      "28",
      "-preset",
      "veryfast",
      outPath,
    ]);

    return await readFile(outPath);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}
