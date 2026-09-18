const fs = require("fs");
const path = require("path");

const SITE_DIR = path.join(__dirname, "_site");
const htmlFiles = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}
walk(SITE_DIR);

function resolveUrl(url, fromFile) {
  if (/^https?:\/\//.test(url) || url.startsWith("mailto:") || url.startsWith("#")) return null;
  let clean = url.split("#")[0].split("?")[0];
  if (!clean) return null;
  if (!clean.startsWith("/")) return null; // we only emit absolute paths in templates

  let target = path.join(SITE_DIR, clean);
  if (clean.endsWith("/") || !path.extname(clean)) {
    target = path.join(target, "index.html");
  }
  return target;
}

let brokenCount = 0;
const checked = new Set();

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const linkRe = /(?:href|src)="([^"]+)"/g;
  let m;
  while ((m = linkRe.exec(html))) {
    const url = m[1];
    const target = resolveUrl(url, file);
    if (!target) continue;
    const key = target;
    if (checked.has(key)) continue;
    checked.add(key);
    if (!fs.existsSync(target)) {
      console.log("BROKEN:", url, " (referenced in " + path.relative(SITE_DIR, file) + ") -> missing " + path.relative(SITE_DIR, target));
      brokenCount++;
    }
  }
}

console.log("\nChecked " + checked.size + " unique internal links across " + htmlFiles.length + " pages.");
console.log(brokenCount === 0 ? "No broken internal links found." : brokenCount + " broken link(s) found.");
