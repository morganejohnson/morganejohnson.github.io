#!/usr/bin/env node
/* Checks the question database and the answer matcher.
   Run from the game folder:   node tests/validate.js
   (No Node? Open tests/test.html in a browser instead.)            */
"use strict";
var path = require("path"), fs = require("fs"), vm = require("vm");
var root = path.join(__dirname, "..");
var sandbox = { window: {} };
vm.createContext(sandbox);
["js/config.js", "js/questions.js"].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox, { filename: f });
});
var M = require(path.join(root, "js/matcher.js"));
var run = require(path.join(__dirname, "checks.js"));
var r = run(sandbox.window.NO_QUESTIONS, sandbox.window.NO_TIERS, sandbox.window.NO_CATEGORIES, M);
console.log("Questions: " + r.questions + "   Answers: " + r.answers);
console.log("Per category: " + r.perCategory);
console.log("Matcher tests: " + r.passed + "/" + r.tests + " passed");
if (r.warnings.length) { console.log("\nWarnings (" + r.warnings.length + "):"); r.warnings.forEach(function (w) { console.log("  ! " + w); }); }
if (r.errors.length) { console.log("\nErrors (" + r.errors.length + "):"); r.errors.forEach(function (e) { console.log("  x " + e); }); process.exit(1); }
console.log("\nAll good");
