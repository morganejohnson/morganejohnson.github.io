/* =====================================================================
   NEBRASKA OUTLIER — GAME ENGINE
   Screens, timer, daily/practice selection, scoring, results, sharing.
   Content lives in questions.js and config.js — edit those first.
   ===================================================================== */
(function () {
  "use strict";

  const C = window.NO_CONFIG;
  const TIERS = window.NO_TIERS;
  const MISS = window.NO_MISS;
  const CATS = window.NO_CATEGORIES;
  const RESULTS = window.NO_RESULTS;
  const QUESTIONS = window.NO_QUESTIONS;
  const M = window.NOMatcher;
  const CAT_IDS = Object.keys(CATS);
  const PER_GAME = C.questionsPerGame;
  const MAX_SCORE = PER_GAME * TIERS.extreme.points;
  const STORE_KEY = "nebraskaOutlier.v1";

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const mod = (n, m) => ((n % m) + m) % m;
  const QBYID = {};
  QUESTIONS.forEach((q) => { QBYID[q.id] = q; });

  /* ------------------------------------------------------------------
     Local storage (personal scores only — never leaves this device)
     ------------------------------------------------------------------ */
  function loadStore() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY));
      if (s && typeof s === "object") return s;
    } catch (e) { /* storage blocked or corrupt */ }
    return {};
  }
  const store = loadStore();
  store.daily = store.daily || {};
  store.stats = Object.assign({ dailyPlayed: 0, dailyBest: 0, streak: 0, maxStreak: 0, lastDaily: null, practicePlayed: 0, practiceBest: 0, recentPractice: [] }, store.stats || {});
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ } }

  /* ------------------------------------------------------------------
     Dates — "today" is the calendar day in Central Time for everyone
     ------------------------------------------------------------------ */
  function zonedParts(date) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: C.dailyTimeZone, year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
      }).formatToParts(date);
      const o = {};
      parts.forEach((p) => { o[p.type] = p.value; });
      return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour % 24, min: +o.minute, s: +o.second };
    } catch (e) {
      return { y: date.getFullYear(), m: date.getMonth() + 1, d: date.getDate(), h: date.getHours(), min: date.getMinutes(), s: date.getSeconds() };
    }
  }
  const pad = (n) => String(n).padStart(2, "0");
  function todayStr() { const p = zonedParts(new Date()); return p.y + "-" + pad(p.m) + "-" + pad(p.d); }
  function dateUTC(str) { const [y, m, d] = str.split("-").map(Number); return Date.UTC(y, m - 1, d); }
  function dayNumber(str) { return Math.round((dateUTC(str) - dateUTC(C.dailyEpoch)) / 864e5); }
  function shiftDate(str, days) { const t = new Date(dateUTC(str) + days * 864e5); return t.getUTCFullYear() + "-" + pad(t.getUTCMonth() + 1) + "-" + pad(t.getUTCDate()); }
  function prettyDate(str, opts) {
    return new Date(dateUTC(str) + 12 * 36e5).toLocaleDateString("en-US", Object.assign({ timeZone: "UTC", weekday: "long", month: "long", day: "numeric", year: "numeric" }, opts || {}));
  }
  function secondsToMidnight() { const p = zonedParts(new Date()); return 86400 - (p.h * 3600 + p.min * 60 + p.s); }
  function edition(str) { return dayNumber(str) + 1; }

  /* ------------------------------------------------------------------
     Seeded randomness → identical Daily Challenge on every device
     ------------------------------------------------------------------ */
  function seedFrom(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
  function seededRandom(str) {
    let a = seedFrom(str);
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rand) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Questions grouped by category, sorted by id so file order never matters.
  const BYCAT = {};
  CAT_IDS.forEach((c) => { BYCAT[c] = QUESTIONS.filter((q) => q.category === c).sort((a, b) => (a.id < b.id ? -1 : 1)); });
  const ACTIVE_CATS = CAT_IDS.filter((c) => BYCAT[c].length);

  /* The daily schedule is one long round-robin across categories. Each
     category walks through a seeded shuffle of its own questions, so a
     prompt doesn't come back until the rest of its category has been used. */
  const cycleCache = {};
  function cycleOrder(cat, cycle) {
    const cacheKey = cat + "|" + cycle;
    if (cycleCache[cacheKey]) return cycleCache[cacheKey];
    const list = BYCAT[cat];
    const order = shuffle(list, seededRandom("cycle|" + cat + "|" + cycle));
    const n = order.length, W = 3;
    // Keep the end of one pass and the start of the next apart, so a prompt
    // never shows up on back-to-back days.
    if (n >= 2 * W + 1) {
      const tail = shuffle(list, seededRandom("cycle|" + cat + "|" + (cycle - 1))).slice(n - W);
      for (let i = 0; i < W; i++) {
        if (tail.indexOf(order[i]) === -1) continue;
        for (let j = W; j < n - W; j++) {
          if (tail.indexOf(order[j]) === -1) { [order[i], order[j]] = [order[j], order[i]]; break; }
        }
      }
    }
    return (cycleCache[cacheKey] = order);
  }
  function nthInCategory(cat, k) {
    const list = BYCAT[cat];
    return cycleOrder(cat, Math.floor(k / list.length))[mod(k, list.length)];
  }
  function dailyQuestions(dateStr) {
    const n = ACTIVE_CATS.length;
    const d = Math.max(0, dayNumber(dateStr));
    const picks = [];
    for (let s = 0; s < PER_GAME; s++) {
      const g = d * PER_GAME + s;
      const cat = ACTIVE_CATS[g % n];
      let k = Math.floor(g / n);
      let q = nthInCategory(cat, k);
      let guard = 0;
      while (picks.indexOf(q) !== -1 && guard++ < BYCAT[cat].length * 2) q = nthInCategory(cat, ++k);
      if (picks.indexOf(q) === -1) picks.push(q);
    }
    // Top up if a category is too small to supply distinct questions
    const rand = seededRandom("fill|" + dateStr);
    shuffle(QUESTIONS, rand).forEach((q) => { if (picks.length < PER_GAME && picks.indexOf(q) === -1) picks.push(q); });
    return shuffle(picks, seededRandom("order|" + dateStr));
  }

  function practiceQuestions() {
    const recent = store.stats.recentPractice || [];
    const fresh = (q) => recent.indexOf(q.id) === -1;
    const rand = Math.random;
    const picks = [];
    shuffle(ACTIVE_CATS, rand).forEach((c) => {
      if (picks.length >= PER_GAME) return;
      const pool = shuffle(BYCAT[c], rand);
      picks.push(pool.filter(fresh)[0] || pool[0]);
    });
    const rest = shuffle(QUESTIONS.filter((q) => picks.indexOf(q) === -1), rand);
    rest.sort((a, b) => fresh(b) - fresh(a));
    while (picks.length < PER_GAME && rest.length) picks.push(rest.shift());
    return shuffle(picks, rand);
  }

  /* ------------------------------------------------------------------
     Screens
     ------------------------------------------------------------------ */
  const screens = { home: $("screen-home"), game: $("screen-game"), results: $("screen-results") };
  function show(name, focusEl) {
    Object.keys(screens).forEach((k) => { screens[k].hidden = k !== name; });
    window.scrollTo(0, 0);
    if (focusEl) setTimeout(() => focusEl.focus({ preventScroll: true }), 30);
  }

  function tierIcon(tierKey) { return '<svg><use href="#ic-' + tierKey + '"/></svg>'; }
  function tierInfo(tierKey) { return TIERS[tierKey] || MISS; }

  /* ------------------------------------------------------------------
     Home
     ------------------------------------------------------------------ */
  let homeTimer = null;
  function renderHome() {
    const today = todayStr();
    $("home-date").textContent = "Daily Challenge No. " + edition(today) + " · " + prettyDate(today);
    $("masthead-right").textContent = "";
    $("footer-pub").textContent = C.publication;

    const rec = store.daily[today];
    const btn = $("btn-daily");
    btn.classList.toggle("btn--done", !!(rec && rec.status === "done"));
    btn.classList.toggle("btn--primary", !(rec && rec.status === "done"));
    clearInterval(homeTimer);
    if (rec && rec.status === "done") {
      $("btn-daily-label").textContent = "Today's score: " + totalOf(rec.answers) + " / " + MAX_SCORE;
      const tick = () => { $("btn-daily-sub").textContent = "See your results · next challenge in " + fmtCountdown(secondsToMidnight()); };
      tick(); homeTimer = setInterval(tick, 1000);
    } else if (rec && rec.status === "playing") {
      $("btn-daily-label").textContent = "Resume the Daily Challenge";
      $("btn-daily-sub").textContent = "Question " + Math.min(PER_GAME, rec.answers.length + 1) + " of " + PER_GAME + " · your progress is saved";
    } else {
      $("btn-daily-label").textContent = "Play the Daily Challenge";
      $("btn-daily-sub").textContent = "Same " + PER_GAME + " prompts for everyone today";
    }

    const s = store.stats;
    const stats = [
      ["Today", rec && rec.status === "done" ? totalOf(rec.answers) : "—"],
      ["Best daily", s.dailyPlayed ? s.dailyBest : "—"],
      ["Daily streak", currentStreak()],
      ["Best practice", s.practicePlayed ? s.practiceBest : "—"],
    ];
    $("home-stats").innerHTML = stats.map((x) => "<div><dt>" + x[0] + "</dt><dd>" + x[1] + "</dd></div>").join("");

    $("rarity-scale").innerHTML = M.TIER_ORDER.map((k) => {
      const t = TIERS[k];
      return '<li class="t-' + k + '"><span class="scale__icon tbg">' + tierIcon(k) + "</span>" +
        '<span><span class="scale__name">' + esc(t.name) + ' <span class="scale__label">' + esc(t.label) + "</span></span>" +
        '<span class="scale__blurb">' + esc(t.blurb) + "</span></span>" +
        '<span class="scale__pts">' + t.points + " <small>pts</small></span></li>";
    }).join("");

    $("nickname").value = store.nickname || "";
    show("home");
  }
  function currentStreak() {
    const s = store.stats;
    if (!s.lastDaily) return 0;
    const today = todayStr();
    return s.lastDaily === today || s.lastDaily === shiftDate(today, -1) ? s.streak : 0;
  }
  function fmtCountdown(sec) {
    const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    return h + ":" + pad(m) + ":" + pad(s);
  }

  /* ------------------------------------------------------------------
     Game flow
     ------------------------------------------------------------------ */
  let game = null; // { mode, date, questions, answers, index, locked, deadline, raf, timeout }

  function startDaily() {
    const today = todayStr();
    let rec = store.daily[today];
    if (rec && rec.status === "done") { showResults({ mode: "daily", date: today, questions: rec.ids.map((id) => QBYID[id]).filter(Boolean), answers: rec.answers }); return; }
    let questions = rec && rec.ids ? rec.ids.map((id) => QBYID[id]) : null;
    if (!questions || questions.some((q) => !q) || questions.length !== PER_GAME) {
      questions = dailyQuestions(today);
      rec = { status: "playing", ids: questions.map((q) => q.id), answers: [], seen: -1 };
    }
    // A question that was shown but never answered (page closed or quit mid-question) counts as 0.
    if (rec.seen >= rec.answers.length && rec.answers.length < PER_GAME) {
      const q = questions[rec.answers.length];
      rec.answers.push(blankAnswer(q, "left"));
    }
    store.daily[today] = rec;
    save();
    game = { mode: "daily", date: today, questions, answers: rec.answers, index: rec.answers.length };
    if (game.index >= PER_GAME) return finishGame();
    beginRound();
  }

  function startPractice() {
    const questions = practiceQuestions();
    store.stats.recentPractice = questions.map((q) => q.id).concat(store.stats.recentPractice || []).slice(0, 21);
    save();
    game = { mode: "practice", date: todayStr(), questions, answers: [], index: 0 };
    beginRound();
  }

  function beginRound() {
    $("masthead-right").textContent = game.mode === "daily" ? "Daily No. " + edition(game.date) : "Practice";
    $("dots").innerHTML = game.questions.map(() => "<li></li>").join("");
    $("hud-score").textContent = totalOf(game.answers);
    show("game");
    showQuestion();
  }

  function showQuestion() {
    const q = game.questions[game.index];
    game.locked = false;
    if (game.mode === "daily") { store.daily[game.date].seen = game.index; save(); }

    $("shield-num").textContent = game.index + 1;
    const shield = document.querySelector(".shield");
    shield.classList.remove("bump"); void shield.offsetWidth; shield.classList.add("bump");
    $("hud-progress").textContent = "Question " + (game.index + 1) + " of " + PER_GAME;
    $("hud-category").textContent = CATS[q.category] ? CATS[q.category].name : q.category;
    updateDots();

    const prompt = $("prompt");
    prompt.textContent = q.prompt;
    prompt.style.animation = "none"; void prompt.offsetWidth; prompt.style.animation = "";

    const input = $("answer-input");
    input.value = "";
    input.disabled = false;
    $("lock-btn").disabled = false;
    $("answer-form").hidden = false;
    $("reveal").hidden = true;
    $("timer").className = "timer";
    $("timer-announce").textContent = "";
    setTimeout(() => { input.focus({ preventScroll: true }); }, 40);

    startTimer();
  }

  function updateDots() {
    const lis = $("dots").children;
    for (let i = 0; i < lis.length; i++) {
      const a = game.answers[i];
      lis[i].className = (a ? "is-done t-" + a.tier : "") + (i === game.index && !a ? " is-current" : "");
    }
  }

  /* ---------- timer ---------- */
  function startTimer() {
    stopTimer();
    const total = C.secondsPerQuestion * 1000;
    game.deadline = performance.now() + total;
    let lastSec = null;
    const fill = $("timer-fill"), num = $("timer-num"), box = $("timer");
    const frame = () => {
      const left = Math.max(0, game.deadline - performance.now());
      fill.style.transform = "scaleX(" + left / total + ")";
      const sec = Math.ceil(left / 1000);
      if (sec !== lastSec) {
        lastSec = sec;
        num.textContent = sec;
        box.classList.toggle("is-low", sec <= 5 && sec > 0);
        if (sec === 10 || sec === 5) $("timer-announce").textContent = sec + " seconds left";
      }
      if (left <= 0) { lockAnswer(true); return; }
      game.raf = requestAnimationFrame(frame);
    };
    game.raf = requestAnimationFrame(frame);
    // Backup in case the tab is in the background (requestAnimationFrame pauses there)
    game.timeout = setTimeout(() => lockAnswer(true), total + 50);
  }
  function stopTimer() {
    if (!game) return;
    cancelAnimationFrame(game.raf);
    clearTimeout(game.timeout);
  }

  /* ---------- scoring ---------- */
  function blankAnswer(q, status) {
    return { qid: q.id, category: q.category, input: "", display: "", tier: "miss", points: 0, status };
  }

  function lockAnswer(timedOut) {
    if (!game || game.locked || screens.game.hidden) return;
    game.locked = true;
    stopTimer();
    const q = game.questions[game.index];
    const input = $("answer-input");
    const raw = input.value.trim().slice(0, 80);
    input.disabled = true;
    $("lock-btn").disabled = true;
    $("timer").classList.remove("is-low");
    $("timer").classList.add("is-stopped");

    let ans;
    if (!raw) {
      ans = blankAnswer(q, timedOut ? "timeout" : "empty");
    } else {
      const r = M.match(raw, q, TIERS);
      if (r.status === "match") {
        ans = { qid: q.id, category: q.category, input: raw, display: r.entry.display, tier: r.entry.tier, points: r.entry.points, status: "match", multiple: !!r.multiple };
      } else {
        ans = Object.assign(blankAnswer(q, r.status === "banned" ? "banned" : "miss"), { input: raw });
      }
    }
    if (timedOut && raw) ans.autoLocked = true;
    game.answers.push(ans);
    if (game.mode === "daily") { store.daily[game.date].answers = game.answers; save(); }

    renderReveal(q, ans);
    updateDots();
    animateNumber($("hud-score"), totalOf(game.answers) - ans.points, totalOf(game.answers), 600);
    if (ans.points) { const el = $("hud-score"); el.classList.remove("bump"); void el.offsetWidth; el.classList.add("bump"); }
  }

  const QUIPS = {
    common: ["Everybody's go-to. Points are points.", "Popular pick. You and half of Nebraska.", "Safe as a cornfield in July.", "The obvious one. Can you go weirder next time?"],
    familiar: ["Good answer. Plenty of people thought of it, too.", "Solid. You'll find this one in every town.", "Respectable. Not quite off the beaten path."],
    unusual: ["Now we're off the interstate.", "Nice. Not many people go there.", "That's a two-lane highway answer."],
    rare: ["A real landmark answer.", "Ooh, a deep cut. The locals approve.", "You can see that one from miles away, and hardly anyone does."],
    extreme: ["Carhenge-level weird. Perfect.", "Pure Outlier. Almost nobody says that.", "That's a population-one answer. Incredible."],
    miss: ["That one blew right past us. It's not on our list for this prompt.", "Hmm, that's not on our list. Rarity only counts if it fits!", "No match this time. Tumbleweed."],
    banned: ["Nice try. The prompt rules that one out!"],
    timeout: ["Time's up! No answer, no points."],
    empty: ["No answer, no points. Shake it off."],
    left: ["You left mid-question, so this one counts as 0."],
  };

  function renderReveal(q, ans) {
    const info = tierInfo(ans.tier);
    const reveal = $("reveal");
    reveal.className = "reveal t-" + ans.tier;
    $("reveal-icon").setAttribute("href", "#ic-" + ans.tier);
    $("reveal-name").textContent = info.name;
    $("reveal-label").textContent = info.label;
    $("reveal-points").textContent = "+" + ans.points;

    let answerLine = "";
    if (ans.status === "match") {
      const same = M.key(M.words(ans.input, q.ignore)) === M.key(M.words(ans.display, q.ignore));
      answerLine = same ? ans.display : "“" + ans.input + "” counts as " + ans.display;
    } else if (ans.input) {
      answerLine = "“" + ans.input + "”";
    }
    $("reveal-answer").textContent = answerLine;
    let msg = pick(QUIPS[ans.status === "match" ? ans.tier : ans.status] || QUIPS.miss);
    if (ans.multiple) msg = "One answer at a time! We scored the most common one you listed.";
    if (ans.autoLocked) msg = "Locked in at the buzzer. " + msg;
    $("reveal-msg").textContent = msg;

    // Show what an Outlier answer would have looked like
    const all = M.allAnswers(q, TIERS);
    const extremes = all.filter((e) => e.tier === "extreme" && e.display !== ans.display);
    const rares = all.filter((e) => e.tier === "rare" && e.display !== ans.display);
    let hint = "";
    if (ans.tier === "extreme") {
      const other = pick(extremes);
      hint = other ? "Another Carhenge-level answer: <strong>" + esc(other.display) + "</strong>." : "";
    } else {
      const ex = pick(extremes), ra = pick(rares);
      if (ex) hint = "A " + esc(TIERS.extreme.name) + " answer: <strong>" + esc(ex.display) + "</strong>" + (ra ? " · A " + esc(TIERS.rare.name) + ": <strong>" + esc(ra.display) + "</strong>" : "");
    }
    $("reveal-hint").innerHTML = hint;

    const last = game.index >= PER_GAME - 1;
    $("next-btn").textContent = last ? "See my results" : "Next question";
    $("answer-form").hidden = true;
    reveal.hidden = false;
    setTimeout(() => $("next-btn").focus({ preventScroll: true }), 50);
  }

  function nextQuestion() {
    if (!game || !game.locked) return;
    game.index++;
    if (game.index >= PER_GAME) finishGame();
    else showQuestion();
  }

  function totalOf(answers) { return (answers || []).reduce((n, a) => n + (a.points || 0), 0); }

  function finishGame() {
    stopTimer();
    const total = totalOf(game.answers);
    const s = store.stats;
    if (game.mode === "daily") {
      const rec = store.daily[game.date];
      if (rec.status !== "done") {
        rec.status = "done";
        rec.score = total;
        s.dailyPlayed++;
        s.dailyBest = Math.max(s.dailyBest, total);
        s.streak = s.lastDaily === shiftDate(game.date, -1) ? s.streak + 1 : 1;
        s.maxStreak = Math.max(s.maxStreak, s.streak);
        s.lastDaily = game.date;
      }
    } else {
      s.practicePlayed++;
      s.practiceBest = Math.max(s.practiceBest, total);
    }
    save();
    showResults(game);
  }

  /* ------------------------------------------------------------------
     Results
     ------------------------------------------------------------------ */
  let lastResult = null;
  let resultTimer = null;

  function resultTitle(total) {
    // Scale the thresholds if the game length was changed in config.js
    const scale = MAX_SCORE / 700;
    for (let i = 0; i < RESULTS.length; i++) if (total >= RESULTS[i].min * scale) return RESULTS[i];
    return RESULTS[RESULTS.length - 1];
  }

  function showResults(res) {
    game = null;
    lastResult = res;
    const total = totalOf(res.answers);
    const title = resultTitle(total);
    $("masthead-right").textContent = res.mode === "daily" ? "Daily No. " + edition(res.date) : "Practice";
    $("results-kicker").textContent = res.mode === "daily"
      ? "Daily Challenge No. " + edition(res.date) + " · " + prettyDate(res.date, { weekday: undefined, month: "short" })
      : "Practice round";
    $("results-title").textContent = title.title;
    $("results-line").textContent = title.line;
    document.querySelector(".results-hero__max").textContent = "/" + MAX_SCORE;
    $("results-strip").innerHTML = res.answers.map((a, i) =>
      '<span class="tbg t-' + a.tier + '" style="animation-delay:' + (0.15 + i * 0.08) + 's" title="' + esc(tierInfo(a.tier).name) + '">' + tierIcon(a.tier) + "</span>").join("");

    // Best answer
    let best = null;
    res.answers.forEach((a, i) => { if (!best || a.points > best.a.points) best = { a, q: res.questions[i] }; });
    if (best && best.a.points > 0) {
      const t = tierInfo(best.a.tier);
      $("best-card").className = "best__card t-" + best.a.tier;
      $("best-card").innerHTML = '<span class="best__icon tbg">' + tierIcon(best.a.tier) + "</span>" +
        '<div><p class="best__answer">' + esc(best.a.display) + '</p><p class="best__q">' + esc(best.q.prompt) + "</p></div>" +
        '<p class="best__pts">' + best.a.points + "<small>" + esc(t.name) + " · " + esc(t.label) + "</small></p>";
    } else {
      $("best-card").className = "best__card t-miss";
      $("best-card").innerHTML = '<span class="best__icon tbg">' + tierIcon("miss") + '</span><div><p class="best__answer">Tumbleweeds all around</p><p class="best__q">No matches this round. Try Practice Mode to warm up!</p></div><p class="best__pts">0</p>';
    }

    // Breakdown
    $("breakdown").innerHTML = res.answers.map((a, i) => {
      const q = res.questions[i];
      const t = tierInfo(a.tier);
      let said;
      if (a.status === "match") said = esc(a.display);
      else if (a.input) said = "“" + esc(a.input) + "” <span class=\"breakdown__tier\">(" + (a.status === "banned" ? "ruled out" : "not on our list") + ")</span>";
      else said = '<span class="breakdown__tier">' + (a.status === "left" ? "Left mid-question" : "No answer") + "</span>";
      const top = q ? M.allAnswers(q, TIERS).filter((e) => e.tier === "extreme" && e.display !== a.display).slice(0, 2) : [];
      return '<li class="t-' + a.tier + '"><span class="breakdown__icon tbg">' + tierIcon(a.tier) + "</span><div>" +
        '<p class="breakdown__q">' + esc(q ? q.prompt : "") + "</p>" +
        '<p class="breakdown__a">' + said + (a.status === "match" ? ' <span class="breakdown__tier">' + esc(t.name) + " · " + esc(t.label) + "</span>" : "") + "</p>" +
        (a.tier !== "extreme" && top.length ? '<p class="breakdown__alt">Outlier answers: <b>' + top.map((e) => esc(e.display)).join("</b>, <b>") + "</b></p>" : "") +
        '</div><span class="breakdown__pts">' + a.points + "</span></li>";
    }).join("");

    // Category performance
    const cats = {};
    res.answers.forEach((a) => {
      cats[a.category] = cats[a.category] || { got: 0, max: 0 };
      cats[a.category].got += a.points;
      cats[a.category].max += TIERS.extreme.points;
    });
    $("catbars").innerHTML = CAT_IDS.filter((c) => cats[c]).map((c) =>
      '<li><span class="catbars__name">' + esc(CATS[c].name) + '</span><span class="catbars__track"><span class="catbars__fill" data-w="' + Math.round((cats[c].got / cats[c].max) * 100) + '"></span></span><span class="catbars__val">' + cats[c].got + " / " + cats[c].max + "</span></li>").join("");
    setTimeout(() => {
      document.querySelectorAll(".catbars__fill").forEach((el) => { el.style.width = el.dataset.w + "%"; });
    }, 60);

    // Buttons & countdown
    $("again-btn").textContent = res.mode === "daily" ? "Play again (Practice Mode)" : "Play again";
    clearInterval(resultTimer);
    const nd = $("next-daily");
    if (res.mode === "daily") {
      nd.hidden = false;
      const tick = () => { nd.innerHTML = "Next Daily Challenge in <strong>" + fmtCountdown(secondsToMidnight()) + "</strong>"; };
      tick(); resultTimer = setInterval(tick, 1000);
    } else {
      const rec = store.daily[todayStr()];
      nd.hidden = !!(rec && rec.status === "done");
      nd.innerHTML = "Practice scores don't count toward your daily stats. Ready for the real thing? <button class=\"linkbtn\" data-action=\"daily\">Play today's Daily Challenge</button>";
    }

    show("results", $("results-title"));
    animateNumber($("results-score"), 0, total, 1100);
  }

  function animateNumber(el, from, to, ms) {
    if (document.hidden || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) { el.textContent = to; return; }
    const start = performance.now();
    const token = (el._anim = (el._anim || 0) + 1);
    // Fallback so the final number always lands even if animation frames are paused
    setTimeout(() => { if (el._anim === token) el.textContent = to; }, ms + 80);
    const step = (now) => {
      if (el._anim !== token) return;
      const p = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (to - from) * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------
     Sharing
     ------------------------------------------------------------------ */
  function shareUrl() {
    if (C.shareUrl) return C.shareUrl;
    return /^https?:/.test(location.protocol) ? location.origin + location.pathname : "";
  }
  function shareText(res) {
    const total = totalOf(res.answers);
    const head = res.mode === "daily"
      ? "Nebraska Outlier No. " + edition(res.date) + " · " + prettyDate(res.date, { weekday: undefined, month: "short" })
      : "Nebraska Outlier (Practice)";
    const grid = res.answers.map((a) => tierInfo(a.tier).emoji).join("");
    const lines = [
      head,
      grid + "  " + total + "/" + MAX_SCORE,
      resultTitle(total).title,
      "I scored " + total + " points on Nebraska Outlier! Think you know Nebraska better than me?",
    ];
    const url = shareUrl();
    if (url) lines.push(url);
    return lines.join("\n");
  }

  async function shareScore() {
    if (!lastResult) return;
    const text = shareText(lastResult);
    if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
      try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    try {
      await navigator.clipboard.writeText(text);
      toast("Score copied! Paste it anywhere.");
    } catch (e) {
      // Very old browsers / blocked clipboard: show the text so it can be copied by hand
      window.prompt("Copy your score:", text);
    }
  }

  async function saveImage() {
    if (!lastResult) return;
    const canvas = await drawShareCard(lastResult);
    const name = "nebraska-outlier-" + (lastResult.mode === "daily" ? lastResult.date : "practice") + ".png";
    canvas.toBlob(async (blob) => {
      if (!blob) { toast("Couldn't make the image in this browser."); return; }
      const file = typeof File === "function" ? new File([blob], name, { type: "image/png" }) : null;
      if (file && navigator.canShare && navigator.canShare({ files: [file] }) && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        try { await navigator.share({ files: [file], text: shareText(lastResult) }); return; } catch (e) { if (e && e.name === "AbortError") return; }
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast("Score image saved.");
    }, "image/png");
  }

  const CSSV = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  async function drawShareCard(res) {
    try { await document.fonts.ready; } catch (e) { /* ignore */ }
    const W = 1080, H = 1350;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const x = cv.getContext("2d");
    const red = CSSV("--red"), cream = CSSV("--cream"), gold = CSSV("--gold"), ink = CSSV("--ink"), navy = CSSV("--navy");
    const display = '"Bungee", "Arial Black", Impact, sans-serif';
    const body = '"Archivo", "Helvetica Neue", Arial, sans-serif';
    const total = totalOf(res.answers);
    const title = resultTitle(total);

    // background + subtle rows
    x.fillStyle = cream; x.fillRect(0, 0, W, H);
    x.strokeStyle = "rgba(163,18,28,.05)"; x.lineWidth = 2;
    for (let i = -H; i < W; i += 28) { x.beginPath(); x.moveTo(i, H); x.lineTo(i + H * 0.18, 0); x.stroke(); }

    // header band
    x.fillStyle = red; x.fillRect(0, 0, W, 330);
    x.fillStyle = ink; x.fillRect(0, 330, W, 10);
    x.textAlign = "center";
    x.fillStyle = navy; roundRect(x, W / 2 - 190, 70, 380, 52, 8); x.fill();
    x.fillStyle = cream; x.font = "800 30px " + body;
    drawSpaced(x, "NEBRASKA", W / 2, 107, 16);
    x.font = "150px " + display;
    x.fillStyle = ink; x.fillText("OUTLIER", W / 2 + 12, 282);
    x.fillStyle = gold; x.fillText("OUTLIER", W / 2 + 6, 276);
    x.fillStyle = cream; x.fillText("OUTLIER", W / 2, 270);

    // kicker
    x.fillStyle = ink; x.font = "800 34px " + body;
    const kicker = res.mode === "daily" ? "DAILY CHALLENGE NO. " + edition(res.date) + "  ·  " + prettyDate(res.date, { weekday: undefined, month: "short" }).toUpperCase() : "PRACTICE ROUND";
    x.fillText(kicker, W / 2, 420);

    // score
    x.font = "250px " + display;
    x.fillStyle = gold; x.fillText(String(total), W / 2 + 8, 668);
    x.fillStyle = red; x.fillText(String(total), W / 2, 660);
    x.font = "800 44px " + body; x.fillStyle = ink;
    x.fillText("OUT OF " + MAX_SCORE, W / 2, 728);
    x.font = "60px " + display; x.fillStyle = navy;
    fitText(x, title.title.toUpperCase(), W / 2, 820, W - 120);

    // tier tiles
    const n = res.answers.length, size = 118, gap = 18;
    const startX = (W - (n * size + (n - 1) * gap)) / 2;
    res.answers.forEach((a, i) => {
      const tx = startX + i * (size + gap), ty = 880;
      x.fillStyle = ink; roundRect(x, tx + 5, ty + 7, size, size, 18); x.fill();
      x.fillStyle = CSSV("--t-" + a.tier); roundRect(x, tx, ty, size, size, 18); x.fill();
      x.strokeStyle = ink; x.lineWidth = 5; roundRect(x, tx, ty, size, size, 18); x.stroke();
      x.fillStyle = a.tier === "common" || a.tier === "extreme" || a.tier === "miss" ? ink : "#fff";
      x.font = "52px " + display; x.fillText(String(a.points), tx + size / 2, ty + 80);
    });

    // legend: colored swatch + tier name + points, in two centered rows
    x.font = "700 28px " + body;
    [M.TIER_ORDER.slice(0, 3), M.TIER_ORDER.slice(3)].forEach((row, r) => {
      const items = row.map((k) => ({ k, label: TIERS[k].name + " " + TIERS[k].points }));
      items.forEach((it) => { it.w = 34 + x.measureText(it.label).width; });
      const rowW = items.reduce((n, it) => n + it.w, 0) + 40 * (items.length - 1);
      let lx = (W - rowW) / 2;
      const ly = 1060 + r * 50;
      items.forEach((it) => {
        x.fillStyle = CSSV("--t-" + it.k); roundRect(x, lx, ly - 22, 24, 24, 6); x.fill();
        x.strokeStyle = ink; x.lineWidth = 3; roundRect(x, lx, ly - 22, 24, 24, 6); x.stroke();
        x.fillStyle = ink; x.textAlign = "left"; x.fillText(it.label, lx + 34, ly);
        lx += it.w + 40;
      });
    });
    x.textAlign = "center";

    // footer
    x.fillStyle = ink; x.fillRect(0, H - 190, W, 190);
    x.fillStyle = gold;
    for (let i = 0; i < W; i += 70) x.fillRect(i, H - 190, 38, 8);
    x.fillStyle = cream; x.font = "italic 800 42px " + body;
    x.fillText("Think you know Nebraska? Think again.", W / 2, H - 110);
    x.font = "600 30px " + body; x.fillStyle = "rgba(247,240,225,.8)";
    const nick = (store.nickname || "").trim();
    x.fillText((nick ? nick + "  ·  " : "") + "Play at " + C.publication, W / 2, H - 58);
    return cv;
  }
  function roundRect(x, l, t, w, h, r) {
    x.beginPath(); x.moveTo(l + r, t); x.arcTo(l + w, t, l + w, t + h, r); x.arcTo(l + w, t + h, l, t + h, r);
    x.arcTo(l, t + h, l, t, r); x.arcTo(l, t, l + w, t, r); x.closePath();
  }
  function drawSpaced(x, text, cx, y, spacing) {
    const widths = [...text].map((ch) => x.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (text.length - 1);
    let px = cx - total / 2;
    x.textAlign = "left";
    [...text].forEach((ch, i) => { x.fillText(ch, px, y); px += widths[i] + spacing; });
    x.textAlign = "center";
  }
  function fitText(x, text, cx, y, maxW) {
    let size = parseInt(x.font, 10);
    const family = x.font.replace(/^[^"]*?(\d+)px\s*/, "");
    while (x.measureText(text).width > maxW && size > 20) { size -= 2; x.font = size + "px " + family; }
    x.fillText(text, cx, y);
  }

  let toastTimer = null;
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
  }

  /* ------------------------------------------------------------------
     Quit / leave
     ------------------------------------------------------------------ */
  function askQuit() {
    if (!game) { renderHome(); return; }
    const dlg = $("quit-dialog");
    $("quit-text").textContent = game.mode === "daily"
      ? (game.locked ? "Your Daily Challenge progress is saved. Come back any time today to finish it." : "Your progress is saved, but this question will count as 0 points since you've already seen it.")
      : "This practice round won't be saved.";
    if (typeof dlg.showModal !== "function") {
      if (window.confirm($("quit-text").textContent + "\n\nLeave this round?")) quitRound();
      return;
    }
    dlg.returnValue = "";
    dlg.showModal();
  }
  $("quit-dialog").querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const choice = e.submitter ? e.submitter.value : "cancel";
    $("quit-dialog").close(choice);
    if (choice === "quit") quitRound();
    else if (game && !game.locked) $("answer-input").focus({ preventScroll: true });
  });
  function quitRound() {
    if (!game) return renderHome();
    stopTimer();
    if (game.mode === "daily" && !game.locked) {
      const q = game.questions[game.index];
      game.answers.push(blankAnswer(q, "left"));
      store.daily[game.date].answers = game.answers;
      save();
    }
    game = null;
    renderHome();
  }

  /* ------------------------------------------------------------------
     Events
     ------------------------------------------------------------------ */
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const action = el.dataset.action;
    if (action !== "home" || el.tagName === "A") e.preventDefault();
    switch (action) {
      case "daily": startDaily(); break;
      case "practice": startPractice(); break;
      case "next": nextQuestion(); break;
      case "quit": askQuit(); break;
      case "share": shareScore(); break;
      case "save-image": saveImage(); break;
      case "again": startPractice(); break;
      case "home": if (game) askQuit(); else renderHome(); break;
    }
  });
  $("answer-form").addEventListener("submit", (e) => { e.preventDefault(); lockAnswer(false); });
  $("nickname").addEventListener("input", (e) => { store.nickname = e.target.value.slice(0, 20); save(); });

  // Midnight rollover while the home screen is open
  let shownDate = todayStr();
  setInterval(() => {
    const t = todayStr();
    if (t !== shownDate) { shownDate = t; if (!game && !screens.home.hidden) renderHome(); }
  }, 30000);

  // Testing hooks (used by the automated checks; harmless for players)
  window.NOGame = { dailyQuestions, practiceQuestions, todayStr, edition, shareText, drawShareCard, get state() { return game; }, get lastResult() { return lastResult; }, store };

  renderHome();
})();
