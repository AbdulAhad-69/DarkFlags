// Rewrite the script-src hashes in _headers from the inline <script> blocks in
// index.html. Run this after ANY edit to index.html and before deploying: a
// stale hash makes the browser refuse the page's own script, which is the whole
// app. Usage: node tools/csp-hash.mjs [directory]   (default: the repo root)
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const dir = process.argv[2] || fileURLToPath(new URL("../", import.meta.url));
const htmlPath = join(dir, "index.html");
const headersPath = join(dir, "_headers");

const html = readFileSync(htmlPath, "utf8");
const blocks = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1].replace(/\r\n/g, "\n"));
if (!blocks.length) throw new Error(`no inline <script> blocks found in ${htmlPath}`);
const hashes = blocks.map((s) => `'sha256-${createHash("sha256").update(s, "utf8").digest("base64")}'`);

let headers = readFileSync(headersPath, "utf8");
const re = /'sha256-[A-Za-z0-9+/=]+'(?: 'sha256-[A-Za-z0-9+/=]+')*/;
if (!re.test(headers)) throw new Error(`no sha256 source found in ${headersPath}`);
headers = headers.replace(re, hashes.join(" "));
writeFileSync(headersPath, headers);
console.log(`${headersPath}: script-src ${hashes.join(" ")}`);

