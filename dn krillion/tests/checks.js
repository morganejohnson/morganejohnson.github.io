/* Shared database + matcher checks. Used by tests/test.html (browser)
   and tests/validate.js (Node). */
function runOutlierChecks(Q, TIERS, CATS, M) {
  "use strict";
var errors = [], warnings = [];
var ids = {};
var perCat = {};

Q.forEach(function (q) {
  var where = "[" + q.id + "] ";
  if (!q.id || ids[q.id]) errors.push(where + "missing or duplicate id");
  ids[q.id] = 1;
  if (!CATS[q.category]) errors.push(where + "unknown category " + q.category);
  perCat[q.category] = (perCat[q.category] || 0) + 1;
  if (!q.prompt) errors.push(where + "missing prompt");
  M.TIER_ORDER.forEach(function (t) {
    if (!q.answers[t] || !q.answers[t].length) errors.push(where + "no answers in tier " + t);
  });
  Object.keys(q.answers).forEach(function (t) {
    if (M.TIER_ORDER.indexOf(t) === -1) errors.push(where + "unknown tier " + t);
  });

  var idx = M.indexQuestion(q, TIERS);
  var seen = {};
  idx.entries.forEach(function (e) {
    e.aliases.forEach(function (a) {
      if (seen[a.key] && seen[a.key] !== e) {
        errors.push(where + 'alias "' + a.key + '" used by both "' + seen[a.key].display + '" (' + seen[a.key].tier + ') and "' + e.display + '" (' + e.tier + ')');
      }
      seen[a.key] = e;
    });
    // Every alias must match its own entry
    e.aliases.forEach(function (a) {
      var r = M.match(a.words.join(" "), q, TIERS);
      if (r.status !== "match" || r.entry !== e) {
        errors.push(where + 'alias "' + a.words.join(" ") + '" does not resolve to "' + e.display + '" (got ' + (r.entry ? r.entry.display : r.status) + ")");
      }
    });
  });
  // Typo-collisions: two different answers close enough that a typo could jump between them
  var flat = [];
  idx.entries.forEach(function (e) { e.aliases.forEach(function (a) { flat.push({ e: e, k: a.key }); }); });
  for (var i = 0; i < flat.length; i++) for (var j = i + 1; j < flat.length; j++) {
    if (flat[i].e === flat[j].e) continue;
    var allow = M.typoAllowance(Math.min(flat[i].k.length, flat[j].k.length));
    if (allow && M.levenshtein(flat[i].k, flat[j].k, allow) <= allow) {
      warnings.push(where + 'near-identical: "' + flat[i].k + '" (' + flat[i].e.display + ') vs "' + flat[j].k + '" (' + flat[j].e.display + ")");
    }
  }
  (q.banned || []).forEach(function (b) {
    var r = M.match(b, q, TIERS);
    if (r.status !== "banned") errors.push(where + 'banned answer "' + b + '" is not blocked');
  });
});

/* ---------- Matcher behaviour tests ---------- */
function byId(id) { return Q.filter(function (q) { return q.id === id; })[0]; }
var tests = [
  ["husker-tailgate", "GRILL", "Grill", 10],
  ["husker-tailgate", "  a   grill!! ", "Grill", 10],
  ["husker-tailgate", "Grills", "Grill", 10],
  ["husker-tailgate", "busch lite", "Busch Light", 25],
  ["husker-tailgate", "corncob hat", "Corn cob hat", 50],
  ["husker-tailgate", "tom osborne cutout", "Tom Osborne cutout", 75],
  ["husker-tailgate", "a chandelier", "Chandelier", 100],
  ["husker-tailgate", "a really big couch", "Couch", 100],
  ["husker-tailgate", "couch and grill", "Grill", 10],         // listing two → lower one
  ["husker-tailgate", "spaceship", null, 0],
  ["only-towns", "Lincoln", "BANNED", 0],
  ["only-towns", "omaha", "BANNED", 0],
  ["only-towns", "Monowi", "Monowi", 100],
  ["only-towns", "oneill", "O'Neill", 75],
  ["only-towns", "O'Neill", "O'Neill", 75],
  ["only-towns", "kearny", "Kearney", 10],                    // typo
  ["only-towns", "Scotsbluff", "Scottsbluff", 25],            // typo
  ["only-counties", "Lancaster County", "Lancaster", 10],
  ["only-counties", "keya paha co", "Keya Paha", 100],
  ["only-water", "the Platte", "Platte River", 10],
  ["only-water", "dismal", "Dismal River", 75],
  ["only-produce", "kool aid", "Kool-Aid", 25],
  ["only-produce", "Koolaid", "Kool-Aid", 25],
  ["midwest-ope", "bumped into someone", "Bumping into someone", 10],
  ["campus-unl-spot", "Love Library", "Love Library", 10],
  ["campus-unl-spot", "mueller tower", "Mueller Tower", 75],
  ["road-state-parks", "Indian Cave State Park", "Indian Cave State Park", 25],
  ["road-state-parks", "ponca", "Ponca State Park", 25],
  ["weather-complaint", "corn sweat", "Corn sweat", 100],
  ["husker-opponent", "Texas A&M", "Texas A&M", 50],
  ["husker-opponent", "texas am", "Texas A&M", 50],
  ["husker-opponent", "kstate", "Kansas State", 25],
  ["husker-opponent", "Kansas", "Kansas", 25],
  ["husker-tailgate", "", "EMPTY", 0],
];
var passed = 0;
tests.forEach(function (t) {
  var r = M.match(t[1], byId(t[0]), TIERS);
  var got = r.status === "match" ? r.entry.display : r.status === "banned" ? "BANNED" : r.status === "empty" ? "EMPTY" : null;
  var pts = r.status === "match" ? r.entry.points : 0;
  if (got === t[2] && pts === t[3]) passed++;
  else errors.push('TEST [' + t[0] + '] "' + t[1] + '" expected ' + t[2] + "/" + t[3] + " got " + got + "/" + pts);
});

  var totalAnswers = Q.reduce(function (n, q) { return n + M.indexQuestion(q, TIERS).entries.length; }, 0);
  return { errors: errors, warnings: warnings, passed: passed, tests: tests.length, questions: Q.length, answers: totalAnswers,
    perCategory: Object.keys(CATS).map(function (c) { return CATS[c].short + " " + (perCat[c] || 0); }).join(", ") };
}
if (typeof module !== "undefined" && module.exports) module.exports = runOutlierChecks;
