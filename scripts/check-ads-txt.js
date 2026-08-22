#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const adsPath = path.resolve(__dirname, "..", "ads.txt");
const expected = "google.com, pub-9920624452359557, DIRECT, f08c47fec0942fa0";

if (!fs.existsSync(adsPath)) throw new Error("Missing root ads.txt");

const raw = fs.readFileSync(adsPath);
const text = raw.toString("utf8").replace(/^\uFEFF/, "").trim();

if (text !== expected) {
  throw new Error(`Invalid ads.txt seller record. Expected: ${expected}`);
}
if (raw.includes(0)) throw new Error("ads.txt must be plain UTF-8 text, not UTF-16");

console.log(`ads.txt ok: ${expected}`);
