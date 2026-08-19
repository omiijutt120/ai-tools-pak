const { spawnSync } = require("child_process");
const path = require("path");

const root = path.resolve(__dirname, "..");
const commands = [
  ["node", ["scripts/generate-products.js"]],
  ["node", ["scripts/generate-social-services.js"]],
  ["node", ["scripts/generate-llms-txt.js"]],
  ["node", ["scripts/generate-llms-full-txt.js"]],
  ["node", ["scripts/check-product-pipeline.js"]],
  ["node", ["scripts/check-catalog.js"]],
  ["node", ["scripts/check-social-services.js"]],
  ["node", ["scripts/check-site-links.js"]],
  ["node", ["scripts/seo-audit.js"]],
  ["node", ["--check", "script.js"]],
  ["node", ["--check", "social-media-services/social-services.js"]],
  ["node", ["--check", "scripts/generate-products.js"]]
];

for (const [command, args] of commands) {
  console.log(`\n> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { cwd: root, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log("\nProduction validation passed.");
