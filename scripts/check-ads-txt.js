#!/usr/bin/env node
"use strict";
const fs = require("fs");
const path = require("path");
const file = path.resolve(__dirname, "..", "ads.txt");
const expected = "google.com, pub-9920624452359557, DIRECT, f08c47fec0942fa0";
if (!fs.existsSync(file)) throw new Error("Missing root ads.txt");
const raw = fs.readFileSync(file);
if (raw.includes(0)) throw new Error("ads.txt must be plain UTF-8 text, not UTF-16");
if (raw.toString("utf8").replace(/^\uFEFF/, "").trim() !== expected) throw new Error(`Invalid ads.txt seller record. Expected: ${expected}`);
console.log(`ads.txt ok: ${expected}`);
