import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const underWjs = typeof process.versions.wjs === "string";
const command = underWjs ? "wjs" : process.execPath;
const args = underWjs
  ? ["check"]
  : [
      fileURLToPath(new URL("../node_modules/typescript/bin/tsc", import.meta.url)),
      "--noEmit",
    ];

const result = spawnSync(command, args, { stdio: "inherit" });

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
