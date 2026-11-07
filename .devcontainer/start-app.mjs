import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  openSync,
  closeSync,
  writeFileSync,
} from "node:fs";
import { request } from "node:http";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const runtime = join(
  tmpdir(),
  "bings-bakery-" +
    createHash("sha256").update(root).digest("hex").slice(0, 12),
);
const logFile = join(runtime, "vite.log");
const pidFile = join(runtime, "vite.pid");
const url = "http://127.0.0.1:5173/";

function probe() {
  return new Promise((done) => {
    const req = request(url, { timeout: 1000 }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        if (body.length < 100000) body += chunk;
      });
      res.on("end", () =>
        done({
          status: res.statusCode,
          ownApp:
            res.statusCode === 200 &&
            body.includes("<title>Bing's Bakery</title>") &&
            body.includes("/@vite/client"),
        }),
      );
      res.on("error", () => done(null));
    });
    req.on("timeout", () => req.destroy());
    req.on("error", () => done(null));
    req.end();
  });
}

async function main() {
  const existing = await probe();
  if (existing?.ownApp) {
    console.log(
      "Bing's Bakery is already responding on port 5173. Open 5173 from the Codespaces Ports panel (protocol: HTTP).",
    );
    return;
  }
  if (existing)
    throw new Error(
      "Port 5173 is serving a different application. Stop that application's process or free port 5173, then run this command again. Nothing was stopped automatically.",
    );
  const vite = join(root, "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(vite))
    throw new Error(
      "Dependencies are missing. Run npm ci in the repository, then run node .devcontainer/start-app.mjs again.",
    );
  mkdirSync(runtime, { recursive: true });
  const log = openSync(logFile, "a");
  let child;
  try {
    child = spawn(process.execPath, [vite], {
      cwd: root,
      detached: true,
      stdio: ["ignore", log, log],
    });
  } finally {
    closeSync(log);
  }
  let spawnError;
  let exited = false;
  child.on("error", (error) => {
    spawnError = error;
  });
  child.on("exit", () => {
    exited = true;
  });
  child.unref();
  const deadline = Date.now() + 20000;
  while (Date.now() < deadline) {
    if (spawnError || exited)
      throw new Error(
        `The development server could not start on port 5173. See ${logFile} for the error. ${spawnError?.message || ""}`,
      );
    if ((await probe())?.ownApp) {
      writeFileSync(pidFile, String(child.pid));
      console.log(
        `Bing's Bakery is responding on port 5173. Open 5173 from the Codespaces Ports panel (protocol: HTTP).\nServer log: ${logFile}`,
      );
      return;
    }
    await new Promise((done) => setTimeout(done, 200));
  }
  // Stop only the server started by this invocation if it never became ready.
  if (child.pid && !exited) {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {}
  }
  throw new Error(
    `The development server did not become ready on port 5173 within 20 seconds. See ${logFile}.`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
