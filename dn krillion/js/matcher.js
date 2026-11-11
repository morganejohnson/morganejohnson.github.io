/* =====================================================================
   NEBRASKA OUTLIER — ANSWER MATCHER
   Turns a player's typed answer into a database match. Deterministic:
   the same text always gets the same score. No AI judging.
   ===================================================================== */
(function (root) {
  "use strict";

  var TIER_ORDER = ["common", "familiar", "unusual", "rare", "extreme"];
  var LEADING_FILLER = ["a", "an", "the", "some", "my", "your", "lots of", "a lot of", "bunch of", "a bunch of", "i would say", "i think"];

  function singular(word) {
    if (word.length <= 3) return word;
    if (/ies$/.test(word)) return word.slice(0, -3) + "y";
    if (/(ss|us|is)$/.test(word)) return word;
    if (/(sh|ch|x|z)es$/.test(word)) return word.slice(0, -2);
    if (/s$/.test(word)) return word.slice(0, -1);
    return word;
  }

  /** Lowercase, strip accents/punctuation/filler/plurals → array of words. */
  function words(text, ignore) {
    var t = String(text || "")
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/['’`]/g, "")
      .replace(/[^a-z0-9$]+/g, " ")
      .trim();
    var changed = true;
    while (changed) {
      changed = false;
      for (var i = 0; i < LEADING_FILLER.length; i++) {
        var f = LEADING_FILLER[i] + " ";
        if (t.indexOf(f) === 0) { t = t.slice(f.length); changed = true; }
      }
    }
    var list = t ? t.split(" ") : [];
    if (ignore && ignore.length) {
      var ig = {};
      ignore.forEach(function (w) { words(w).forEach(function (x) { ig[x] = 1; }); });
      var kept = list.filter(function (w) { return !ig[singular(w)] && !ig[w]; });
      if (kept.length) list = kept; // never ignore everything
    }
    return list.map(singular);
  }

  function key(ws) { return ws.join(""); }

  function levenshtein(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var rowMin = i;
      for (j = 1; j <= b.length; j++) {
        var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > max) return max + 1;
      prev = cur;
    }
    return prev[b.length];
  }

  /** How many typos we forgive for a word of this length. */
  function typoAllowance(len) {
    if (len >= 9) return 2;
    if (len >= 5) return 1;
    return 0;
  }

  /** Build (and cache) the searchable index for one question. */
  function indexQuestion(q, tiers) {
    if (q._index) return q._index;
    var entries = [];
    TIER_ORDER.forEach(function (tierKey) {
      (q.answers[tierKey] || []).forEach(function (raw) {
        var parts = String(raw).split("|").map(function (s) { return s.trim(); }).filter(Boolean);
        var entry = {
          display: parts[0],
          tier: tierKey,
          points: tiers && tiers[tierKey] ? tiers[tierKey].points : 0,
          aliases: [],
        };
        parts.forEach(function (p) {
          var w = words(p, q.ignore);
          if (w.length) entry.aliases.push({ words: w, key: key(w) });
        });
        entries.push(entry);
      });
    });
    var banned = (q.banned || []).map(function (b) { return key(words(b, q.ignore)); });
    q._index = { entries: entries, banned: banned };
    return q._index;
  }

  function findSpan(hay, needle) {
    outer: for (var i = 0; i + needle.length <= hay.length; i++) {
      for (var j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
      return i;
    }
    return -1;
  }

  /**
   * Match a typed answer against a question.
   * Returns { status: "match"|"banned"|"miss"|"empty", entry, note }
   */
  function match(input, q, tiers) {
    var idx = indexQuestion(q, tiers);
    var w = words(input, q.ignore);
    var k = key(w);
    if (!k) return { status: "empty" };
    if (idx.banned.indexOf(k) !== -1) return { status: "banned" };

    var i, j, e, a;

    // 1) Exact match (after normalizing)
    for (i = 0; i < idx.entries.length; i++) {
      e = idx.entries[i];
      for (j = 0; j < e.aliases.length; j++) if (e.aliases[j].key === k) return { status: "match", entry: e, how: "exact" };
    }

    // 2) Close spelling (small typos)
    var best = null, bestDist = 99;
    for (i = 0; i < idx.entries.length; i++) {
      e = idx.entries[i];
      for (j = 0; j < e.aliases.length; j++) {
        a = e.aliases[j];
        var allow = typoAllowance(Math.min(a.key.length, k.length));
        if (!allow) continue;
        var d = levenshtein(k, a.key, allow);
        if (d <= allow && (d < bestDist || (d === bestDist && e.points < best.points))) {
          best = e; bestDist = d;
        }
      }
    }
    if (best) return { status: "match", entry: best, how: "typo" };

    // 3) Answer phrase found inside a longer answer ("a big red grill" → Grill)
    var hits = [];
    for (i = 0; i < idx.entries.length; i++) {
      e = idx.entries[i];
      for (j = 0; j < e.aliases.length; j++) {
        a = e.aliases[j];
        if (a.key.length < 3) continue;
        if (w.length - a.words.length > 3) continue;
        var at = findSpan(w, a.words);
        if (at !== -1) hits.push({ entry: e, start: at, end: at + a.words.length });
      }
    }
    if (!hits.length) return { status: "miss" };
    // Drop hits sitting inside a longer hit ("corn" inside "corn cob hat")
    hits = hits.filter(function (h) {
      return !hits.some(function (o) {
        return o !== h && o.start <= h.start && o.end >= h.end && (o.end - o.start) > (h.end - h.start);
      });
    });
    var distinct = [];
    hits.forEach(function (h) { if (distinct.indexOf(h.entry) === -1) distinct.push(h.entry); });
    distinct.sort(function (x, y) { return x.points - y.points; });
    // Listing several answers at once only earns the least rare one.
    return { status: "match", entry: distinct[0], how: "contains", multiple: distinct.length > 1 };
  }

  /** Every answer for a question, highest points first (for reveals). */
  function allAnswers(q, tiers) {
    return indexQuestion(q, tiers).entries.slice().sort(function (a, b) { return b.points - a.points; });
  }

  var api = { match: match, words: words, key: key, levenshtein: levenshtein, typoAllowance: typoAllowance, indexQuestion: indexQuestion, allAnswers: allAnswers, TIER_ORDER: TIER_ORDER };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.NOMatcher = api;
})(this);
