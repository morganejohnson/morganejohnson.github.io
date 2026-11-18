/* =====================================================================
   TRASH TALK — game.js
   Loop, input, difficulty, collisions, heckles, HUD and screens.
   Difficulty ramps every second; after four 30-second quarters the game
   goes to overtime, where the student section throws an unbroken
   curtain of trash and dodging is no longer possible.
   ===================================================================== */
(function (TT) {
  'use strict';
  var C = TT.C, W = C.W, H = C.H, F = TT.FONTS;
  var circle = TT.circle, ellipse = TT.ellipse, rr = TT.rr;

  var QUARTER = 30;            // seconds per quarter
  var OT_START = QUARTER * 4;  // overtime = impossible
  var LIVES = 3;
  var SPEED = 420, ACCEL = 3200;
  var HB = TT.COACH_HITBOX;
  var BEST_KEY = 'dn-trash-talk-best';

  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var stage = document.getElementById('stage');
  var $ = function (id) { return document.getElementById(id); };
  var startEl = $('start'), pauseEl = $('pause'), overEl = $('over');

  var rnd = Math.random;
  function rand(a, b) { return a + rnd() * (b - a); }
  function pick(arr) { return arr[(rnd() * arr.length) | 0]; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  var best = 0;
  try { best = parseFloat(localStorage.getItem(BEST_KEY)) || 0; } catch (e) { best = 0; }

  /* ---------- state ---------- */
  var G;
  function freshState(mode) {
    return {
      mode: mode,            // 'menu' | 'play' | 'dying' | 'over'
      paused: false,
      t: 0, elapsed: 0,
      lives: LIVES, dodged: 0, streak: 0, bestStreak: 0,
      coach: { x: W / 2, vx: 0, facing: 1, walk: 0, happy: 0, furious: 0, invuln: 0, red: 0 },
      trash: [], litter: [], bubbles: [], fx: [],
      energy: 0.35, shake: 0, flash: 0,
      spawnT: 1.0, heckleT: 1.5, curtainT: 0, quarter: 1, banner: null, dyingT: 0,
      lastHeckle: ''
    };
  }
  G = freshState('menu');

  /* ---------- input ---------- */
  var input = { left: false, right: false, touchL: false, touchR: false };
  var KEYS_L = { ArrowLeft: 1, a: 1, A: 1 }, KEYS_R = { ArrowRight: 1, d: 1, D: 1 };

  window.addEventListener('keydown', function (e) {
    if (KEYS_L[e.key]) input.left = true;
    if (KEYS_R[e.key]) input.right = true;
    var gameKey = e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowUp' || e.key === 'ArrowDown';
    if (G.mode === 'play' && gameKey) e.preventDefault();
    if ((e.key === 'Enter' || e.key === ' ') && (G.mode === 'menu' || G.mode === 'over')) {
      if (document.activeElement && document.activeElement.tagName === 'BUTTON') return; // let the button handle it
      e.preventDefault(); startGame();
    }
    if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && G.mode === 'play') togglePause();
    else if ((e.key === ' ' || e.key === 'Enter') && G.paused) { e.preventDefault(); togglePause(false); }
  });
  window.addEventListener('keyup', function (e) {
    if (KEYS_L[e.key]) input.left = false;
    if (KEYS_R[e.key]) input.right = false;
  });
  window.addEventListener('blur', function () {
    input.left = input.right = false;
    if (G.mode === 'play' && !G.paused) togglePause(true);
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && G.mode === 'play' && !G.paused) togglePause(true);
  });

  function holdButton(el, key) {
    if (!el) return;
    var on = function (e) { e.preventDefault(); input[key] = true; if (el.setPointerCapture) try { el.setPointerCapture(e.pointerId); } catch (x) {} };
    var off = function () { input[key] = false; };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointercancel', off);
    el.addEventListener('lostpointercapture', off);
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  }
  holdButton($('btn-left'), 'touchL');
  holdButton($('btn-right'), 'touchR');

  // touch / mouse directly on the field: hold left or right half
  var canvasPointer = null;
  canvas.addEventListener('pointerdown', function (e) {
    if (G.mode !== 'play' || G.paused) return;
    canvasPointer = e.pointerId;
    setCanvasDir(e);
    try { canvas.setPointerCapture(e.pointerId); } catch (x) {}
  });
  canvas.addEventListener('pointermove', function (e) { if (e.pointerId === canvasPointer) setCanvasDir(e); });
  function endCanvas(e) { if (e.pointerId === canvasPointer) { canvasPointer = null; input.cl = input.cr = false; } }
  canvas.addEventListener('pointerup', endCanvas);
  canvas.addEventListener('pointercancel', endCanvas);
  function setCanvasDir(e) {
    var r = canvas.getBoundingClientRect();
    var gx = (e.clientX - r.left) / r.width * W;
    input.cl = gx < G.coach.x - 12;
    input.cr = gx > G.coach.x + 12;
  }

  $('btn-start').addEventListener('click', startGame);
  $('btn-again').addEventListener('click', startGame);
  $('btn-resume').addEventListener('click', function () { togglePause(false); });

  function togglePause(force) {
    if (G.mode !== 'play') return;
    G.paused = typeof force === 'boolean' ? force : !G.paused;
    pauseEl.hidden = !G.paused;
    if (G.paused) $('btn-resume').focus({ preventScroll: true });
    else canvas.focus({ preventScroll: true });
  }

  /* ---------- game flow ---------- */
  function startGame() {
    G = freshState('play');
    G.banner = { title: '1ST QUARTER', sub: 'Kickoff under the lights', t: 0 };
    startEl.hidden = true; overEl.hidden = true; pauseEl.hidden = true;
    canvas.focus({ preventScroll: true });
  }

  function endGame() {
    G.mode = 'over';
    var survived = G.elapsed;
    var isBest = survived > best + 0.01;
    if (isBest) {
      best = survived;
      try { localStorage.setItem(BEST_KEY, String(best)); } catch (e) {}
    }
    $('sb-time').textContent = fmtTime(survived);
    $('sb-dodged').textContent = String(G.dodged);
    $('sb-best').textContent = fmtTime(best);
    $('sb-streak').textContent = String(G.bestStreak);
    $('sb-qtr').textContent = survived >= OT_START ? 'OT' : String(Math.min(4, Math.floor(survived / QUARTER) + 1));
    $('sb-msg').textContent = isBest ? 'NEW PERSONAL BEST — THE STUDENT SECTION STILL WINS' : pick([
      'THE STUDENT SECTION WINS', 'BURIED IN THE BLACKOUT', 'THAT ONE IS GOING ON THE POSTGAME SHOW'
    ]);
    overEl.hidden = false;
    $('btn-again').focus({ preventScroll: true });
    var b = $('best-line');
    if (b) b.textContent = 'Your best: ' + fmtTime(best);
  }

  function fmtTime(s) {
    s = Math.max(0, s);
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }

  /* ---------- difficulty ---------- */
  function difficulty(e) {
    return {
      interval: 1.15 * Math.exp(-e / 48) + 0.06,       // seconds between throws
      flight: Math.max(0.8, 2.25 - e * 0.0118),        // seconds in the air
      aim: Math.min(0.92, 0.12 + e / 105),             // share thrown at the coach
      lead: clamp((e - 50) / 50, 0, 1),                // how well they lead a moving target
      spread: Math.max(12, 70 - e * 0.5),              // aim error, px
      volley: e < 40 ? 0 : Math.min(0.6, (e - 40) / 120)
    };
  }

  /* ---------- throwing ---------- */
  var typeList = Object.keys(TT.TRASH_TYPES);
  function pickType(bigOnly) {
    var r = rnd(), acc = 0;
    for (var i = 0; i < typeList.length; i++) {
      var tp = TT.TRASH_TYPES[typeList[i]];
      if (bigOnly && tp.r < 10) continue;
      acc += tp.weight;
    }
    r *= acc; acc = 0;
    for (i = 0; i < typeList.length; i++) {
      tp = TT.TRASH_TYPES[typeList[i]];
      if (bigOnly && tp.r < 10) continue;
      acc += tp.weight;
      if (r <= acc) return typeList[i];
    }
    return 'bottle';
  }

  function randomStudent(minRow) {
    var s;
    for (var tries = 0; tries < 10; tries++) {
      s = pick(TT.stands.students);
      if (s.row >= (minRow || 0)) return s;
    }
    return s;
  }

  function throwTrash(tx, flight, opts) {
    opts = opts || {};
    var type = opts.type || pickType(opts.bigOnly);
    var spec = TT.TRASH_TYPES[type];
    var s = randomStudent(1);
    var sx = s.x + rand(-4, 4), sy = s.headY - 4;
    var T = flight * spec.time * (opts.exact ? 1 : rand(0.9, 1.1));
    var gy = C.GROUND - 3;
    var dy = gy - sy;
    var apex = rand(25, 100);
    var a = (Math.sqrt(2 * apex) + Math.sqrt(2 * apex + 2 * dy)) / T;
    var grav = a * a;
    var item = {
      type: type, r: spec.r,
      x: sx, y: sy, sy: sy, gy: gy, tx: tx,
      vx: (tx - sx) / T, vy: -Math.sqrt(2 * grav * apex), g: grav,
      rot: rand(0, 6.28), vr: rand(-1, 1) * spec.spin, flip: 0, vflip: rand(4, 9),
      age: 0, T: T, hit: false, done: false
    };
    TT.decorateTrash(item, rnd);
    G.trash.push(item);
    // the thrower's chunk pops up
    if (s.chunk) s.chunk.phase += 1.2;
  }

  function aimX(d) {
    var c = G.coach;
    if (rnd() < d.aim) {
      var lead = c.vx * d.flight * d.lead * rand(0.6, 1.0);
      return clamp(c.x + lead + rand(-1, 1) * d.spread, 20, W - 20);
    }
    return rand(24, W - 24);
  }

  function spawnLogic(dt) {
    var e = G.elapsed;
    if (e >= OT_START) {
      // overtime: an unbroken curtain — gaps are narrower than the coach
      G.curtainT -= dt;
      if (G.curtainT <= 0) {
        G.curtainT = 0.42;
        var off = rand(0, 30);
        for (var x = 12 + off; x < W; x += 30) throwTrash(x, 1.05, { bigOnly: true, exact: true });
      }
    }
    G.spawnT -= dt;
    if (G.spawnT <= 0) {
      var d = difficulty(e);
      G.spawnT = d.interval * rand(0.75, 1.25);
      throwTrash(aimX(d), d.flight);
      if (rnd() < d.volley) {
        var n = rnd() < 0.5 ? 1 : 2;
        for (var i = 0; i < n; i++) throwTrash(clamp(G.coach.x + rand(-140, 140), 20, W - 20), d.flight);
      }
    }
  }

  function menuSpawn(dt) {
    G.spawnT -= dt;
    if (G.spawnT <= 0) {
      G.spawnT = rand(0.9, 1.8);
      var x = rand(40, W - 40);
      if (Math.abs(x - G.coach.x) < 70) x += x < G.coach.x ? -90 : 90;
      throwTrash(clamp(x, 20, W - 20), 2.1);
    }
  }

  /* ---------- heckles ---------- */
  var measure = document.createElement('canvas').getContext('2d');
  function heckle(text, urgent) {
    if (!text) return;
    if (G.bubbles.length >= 3) {
      if (!urgent) return;
      G.bubbles.shift();
    }
    var s = null;
    for (var tries = 0; tries < 12; tries++) {
      var cand = randomStudent(2);
      var ok = G.bubbles.every(function (b) { return Math.abs(b.sx - cand.x) > 230; });
      if (ok) { s = cand; break; }
    }
    if (!s) s = randomStudent(2);
    measure.font = '700 15px ' + F.COND;
    var words = text.split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var test = cur ? cur + ' ' + w : w;
      if (measure.measureText(test).width > 200 && cur) { lines.push(cur); cur = w; }
      else cur = test;
    });
    if (cur) lines.push(cur);
    var tw = 0;
    lines.forEach(function (l) { tw = Math.max(tw, measure.measureText(l).width); });
    var bw = tw + 22, bh = lines.length * 17 + 14;
    var bx = clamp(s.x - bw / 2, 8, W - bw - 8);
    var by = Math.max(60, s.headY - 16 - bh);
    G.bubbles.push({ lines: lines, sx: s.x, sy: s.headY - 4, bx: bx, by: by, bw: bw, bh: bh, t: 0, life: 2.4 + lines.length * 0.35 });
    if (s.chunk) s.chunk.phase += 2;
  }

  function nextHeckle(pool) {
    var line, tries = 0;
    do { line = pick(pool); } while (line === G.lastHeckle && tries++ < 5);
    G.lastHeckle = line;
    return line;
  }

  /* ---------- update ---------- */
  function update(dt) {
    G.t += dt;
    var c = G.coach;
    var playing = G.mode === 'play';

    G.energy += ((playing ? 0.3 : 0.4) + (G.mode === 'dying' ? 0.6 : 0) - G.energy) * Math.min(1, dt * 1.1);
    G.shake = Math.max(0, G.shake - dt);
    G.flash = Math.max(0, G.flash - dt);
    c.happy = Math.max(0, c.happy - dt);
    c.furious = Math.max(0, c.furious - dt);
    c.invuln = Math.max(0, c.invuln - dt);

    if (playing) {
      G.elapsed += dt;
      var q = G.elapsed >= OT_START ? 5 : Math.floor(G.elapsed / QUARTER) + 1;
      if (q !== G.quarter) {
        G.quarter = q;
        G.banner = q === 5
          ? { title: 'OVERTIME', sub: 'The student section empties its pockets', t: 0, hot: true }
          : { title: ['', '1ST', '2ND', '3RD', '4TH'][q] + ' QUARTER', sub: ['', '', 'They’re warming up', 'The Blackout gets louder', 'Nowhere left to hide'][q], t: 0 };
        G.energy = 0.9;
      }
      // movement
      var dir = ((input.right || input.touchR || input.cr) ? 1 : 0) - ((input.left || input.touchL || input.cl) ? 1 : 0);
      var target = dir * SPEED;
      var dv = clamp(target - c.vx, -ACCEL * dt, ACCEL * dt);
      c.vx += dv;
      c.x += c.vx * dt;
      if (c.x < 30) { c.x = 30; c.vx = 0; }
      if (c.x > W - 30) { c.x = W - 30; c.vx = 0; }
      spawnLogic(dt);
      // heckles
      G.heckleT -= dt;
      if (G.heckleT <= 0) {
        var d = Math.min(1, G.elapsed / 100);
        G.heckleT = rand(3.4 - d * 1.6, 4.8 - d * 2);
        heckle(nextHeckle(TT.HECKLES.general));
      }
    } else if (G.mode === 'menu') {
      // idle pacing on the title screen
      var goal = W / 2 + Math.sin(G.t * 0.6) * 140;
      c.vx = clamp((goal - c.x) * 3, -200, 200);
      c.x += c.vx * dt;
      menuSpawn(dt);
      G.heckleT -= dt;
      if (G.heckleT <= 0) { G.heckleT = rand(2.5, 4); heckle(nextHeckle(TT.HECKLES.general)); }
    } else {
      c.vx *= Math.max(0, 1 - dt * 8);
      c.x += c.vx * dt;
    }
    if (Math.abs(c.vx) > 20) c.facing = c.vx > 0 ? 1 : -1;
    c.walk += Math.abs(c.vx) * dt * 0.055;
    var targetRed = c.furious > 0 ? 1 : (playing || G.mode === 'dying') ? (LIVES - G.lives) * 0.12 : 0.05;
    c.red += (targetRed - c.red) * Math.min(1, dt * 6);

    if (G.mode === 'dying') {
      G.elapsedFrozen = true;
      G.dyingT += dt;
      c.furious = Math.max(c.furious, 0.5);
      if (G.dyingT > 1.9) endGame();
    }

    updateTrash(dt);

    for (var i = G.bubbles.length - 1; i >= 0; i--) {
      G.bubbles[i].t += dt;
      if (G.bubbles[i].t > G.bubbles[i].life) G.bubbles.splice(i, 1);
    }
    for (i = G.fx.length - 1; i >= 0; i--) {
      G.fx[i].t += dt;
      if (G.fx[i].t > G.fx[i].life) G.fx.splice(i, 1);
    }
    if (G.banner) { G.banner.t += dt; if (G.banner.t > 2.4) G.banner = null; }
  }

  function updateTrash(dt) {
    var c = G.coach;
    var active = G.mode === 'play';
    var left = c.x - HB.halfW, right = c.x + HB.halfW;
    var top = C.GROUND - HB.top, bottom = C.GROUND - HB.bottom;
    for (var i = G.trash.length - 1; i >= 0; i--) {
      var it = G.trash[i];
      it.age += dt;
      it.vy += it.g * dt;
      it.x += it.vx * dt;
      it.y += it.vy * dt;
      it.rot += it.vr * dt;
      it.flip += it.vflip * dt;
      var prog = clamp((it.y - it.sy) / (it.gy - it.sy), 0, 1);
      it.scale = 0.42 + 0.58 * prog;

      if (!it.hit && active && c.invuln <= 0 && it.vy > 0 && it.y > top - 20) {
        var r = it.r * it.scale * 0.9;
        var nx = clamp(it.x, left, right), ny = clamp(it.y, top, bottom);
        var dx = it.x - nx, dy = it.y - ny;
        // the head is narrower than the shoulders
        if (it.y < top + 30 && Math.abs(it.x - c.x) > 16) dx += 4;
        if (dx * dx + dy * dy < r * r) { onHit(it); continue; }
      }

      if (it.y >= it.gy) {
        if (it.hit) { G.trash.splice(i, 1); continue; }
        it.y = it.gy;
        G.trash.splice(i, 1);
        G.litter.push({ type: it.type, x: it.x, y: it.gy - rand(0, 6), rot: it.rot, pts: it.pts, colors: it.colors, clear: it.clear, fill: it.fill, flip: 0.5, age: 0 });
        if (G.litter.length > 70) G.litter.shift();
        if (active) onDodge(it);
      }
    }
    for (i = 0; i < G.litter.length; i++) G.litter[i].age += dt;
  }

  function onDodge(it) {
    var c = G.coach;
    G.dodged++;
    var near = Math.abs(it.x - c.x);
    if (near < 150) {
      G.streak++;
      G.bestStreak = Math.max(G.bestStreak, G.streak);
      c.happy = Math.max(c.happy, near < 60 ? 0.95 : 0.6);
      if (near < 55 && c.furious <= 0) addFx(c.x, C.GROUND - 130, pick(['CLOSE ONE!', 'JUKED!', 'NICE!', 'DODGED!']), '#ffd24a');
      if (G.streak > 0 && G.streak % 15 === 0) {
        addFx(c.x, C.GROUND - 150, G.streak + ' IN A ROW!', '#ffffff');
        heckle(nextHeckle(TT.HECKLES.streak), true);
      }
    }
  }

  function onHit(it) {
    var c = G.coach;
    it.hit = true;
    it.vx = (it.x < c.x ? -1 : 1) * rand(150, 260);
    it.vy = -rand(220, 320);
    it.vr *= 2.5;
    G.lives--;
    G.streak = 0;
    c.happy = 0;
    c.furious = 1.7;
    c.invuln = 1.1;
    G.energy = 1;
    G.shake = 0.35;
    G.flash = 0.45;
    addFx(c.x, C.GROUND - 135, G.lives > 0 ? '-1 TIMEOUT' : 'NO TIMEOUTS LEFT', '#ff5a5a');
    if (G.lives <= 0) {
      G.mode = 'dying';
      G.dyingT = 0;
      heckle(nextHeckle(TT.HECKLES.over), true);
    } else {
      heckle(nextHeckle(TT.HECKLES.hit), true);
    }
  }

  function addFx(x, y, text, color) {
    G.fx.push({ x: x, y: y, text: text, color: color, t: 0, life: 1.1 });
  }

  /* ---------- render ---------- */
  function render() {
    var g = ctx;
    g.setTransform(K, 0, 0, K, 0, 0);
    g.save();
    if (G.shake > 0) {
      var m = G.shake * 14;
      g.translate(rand(-m, m), rand(-m, m) * 0.6);
    }
    TT.drawBackground(g, G.t, G.energy);
    TT.drawForeground(g);

    // litter on the turf
    for (var i = 0; i < G.litter.length; i++) {
      var L = G.litter[i];
      g.globalAlpha = i < G.litter.length - 50 ? 0.5 : 0.95;
      TT.drawTrash(g, L, 0.95, 0.55);
    }
    g.globalAlpha = 1;

    // landing shadows (the warning)
    for (i = 0; i < G.trash.length; i++) {
      var it = G.trash[i];
      if (it.hit) continue;
      var p = clamp(it.age / it.T, 0, 1);
      g.fillStyle = 'rgba(0,0,0,' + (0.12 + 0.4 * p) + ')';
      ellipse(g, it.tx, C.GROUND - 1, it.r * (0.5 + 0.9 * p), it.r * 0.28 * (0.5 + 0.9 * p)); g.fill();
    }

    // coach
    var c = G.coach;
    var expr = c.furious > 0 ? 'furious' : c.happy > 0 ? 'happy' : 'yell';
    var blink = c.invuln > 0 && G.mode === 'play' && Math.floor(G.t * 16) % 2 === 0;
    TT.drawCoach(g, c.x, C.GROUND, {
      expr: expr, facing: c.facing, walk: c.walk, speed: Math.min(1, Math.abs(c.vx) / SPEED),
      t: G.t, red: c.red, alpha: blink ? 0.45 : 1
    });

    // flying trash
    for (i = 0; i < G.trash.length; i++) TT.drawTrash(g, G.trash[i], G.trash[i].scale || 0.5);

    TT.drawGlow(g, 0.92 + Math.sin(G.t * 31) * 0.015);

    // heckle bubbles
    for (i = 0; i < G.bubbles.length; i++) drawBubble(g, G.bubbles[i]);

    // floating text
    g.textAlign = 'center'; g.textBaseline = 'middle';
    for (i = 0; i < G.fx.length; i++) {
      var f = G.fx[i], k = f.t / f.life;
      g.globalAlpha = 1 - k * k;
      g.font = '800 20px ' + F.COND;
      g.lineWidth = 4; g.strokeStyle = '#000';
      g.strokeText(f.text, f.x, f.y - k * 34);
      g.fillStyle = f.color;
      g.fillText(f.text, f.x, f.y - k * 34);
    }
    g.globalAlpha = 1;
    g.restore();

    // hit flash vignette
    if (G.flash > 0) {
      var vg = g.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.85);
      vg.addColorStop(0, 'rgba(186,31,31,0)');
      vg.addColorStop(1, 'rgba(186,31,31,' + (G.flash * 1.3) + ')');
      g.fillStyle = vg; g.fillRect(0, 0, W, H);
    }

    if (G.mode === 'play' || G.mode === 'dying') {
      drawHud(g, expr);
      if (G.banner) drawBanner(g, G.banner);
    }
  }

  function drawBubble(g, b) {
    var k = b.t / b.life;
    var pop = Math.min(1, b.t / 0.14);
    var a = k > 0.85 ? (1 - k) / 0.15 : 1;
    g.save();
    g.globalAlpha = a;
    var cx = b.bx + b.bw / 2, cy = b.by + b.bh / 2;
    g.translate(cx, cy);
    g.scale(0.6 + 0.4 * pop, 0.6 + 0.4 * pop);
    g.translate(-cx, -cy);
    // tail
    var tx = clamp(b.sx, b.bx + 14, b.bx + b.bw - 14);
    g.fillStyle = '#fff'; g.strokeStyle = '#0a0a0a'; g.lineWidth = 2;
    g.beginPath();
    g.moveTo(tx - 8, b.by + b.bh - 1);
    g.lineTo(b.sx, Math.max(b.by + b.bh + 8, b.sy));
    g.lineTo(tx + 8, b.by + b.bh - 1);
    g.closePath(); g.fill(); g.stroke();
    rr(g, b.bx, b.by, b.bw, b.bh, 9); g.fill(); g.stroke();
    g.fillStyle = '#fff';
    g.fillRect(tx - 7, b.by + b.bh - 3, 14, 4);
    g.fillStyle = '#ba1f1f';
    g.fillRect(b.bx + 6, b.by + 5, 3, b.bh - 10);
    g.fillStyle = '#111';
    g.font = '700 15px ' + F.COND;
    g.textAlign = 'left'; g.textBaseline = 'top';
    for (var i = 0; i < b.lines.length; i++) g.fillText(b.lines[i], b.bx + 14, b.by + 8 + i * 17);
    g.restore();
  }

  function drawHud(g, expr) {
    var x = 300, y = 6, w = 390, h = 46;
    g.save();
    g.fillStyle = 'rgba(6,6,8,0.9)';
    rr(g, x, y, w, h, 8); g.fill();
    g.strokeStyle = '#ba1f1f'; g.lineWidth = 2; g.stroke();

    // coach portrait
    g.fillStyle = '#16161a';
    circle(g, x, y + h / 2 + 6, 31); g.fill();
    g.save();
    g.beginPath(); g.arc(x, y + h / 2 + 6, 29, 0, Math.PI * 2); g.clip();
    var pg = g.createRadialGradient(x, y + 20, 4, x, y + 30, 34);
    pg.addColorStop(0, '#34343c'); pg.addColorStop(1, '#111114');
    g.fillStyle = pg; g.fillRect(x - 30, y - 30, 60, 100);
    g.translate(x, y + h / 2 + 9);
    g.scale(1.3, 1.3);
    TT.drawHead(g, expr, G.t, G.coach.red);
    g.restore();
    g.strokeStyle = '#ba1f1f'; g.lineWidth = 3;
    circle(g, x, y + h / 2 + 6, 30); g.stroke();

    var e = G.elapsed;
    var ot = e >= OT_START;
    var qtr = ot ? 'OT' : String(Math.floor(e / QUARTER) + 1);
    var clock = ot ? '--:--' : fmtTime(QUARTER - (e % QUARTER) + 0.999);
    var cells = [
      { x: x + 62, label: 'QTR', val: qtr },
      { x: x + 128, label: 'CLOCK', val: clock },
      { x: x + 218, label: 'DODGED', val: String(G.dodged) }
    ];
    g.textAlign = 'center';
    cells.forEach(function (cl) {
      g.fillStyle = '#9a9aa2';
      g.font = '700 9px ' + F.LABEL;
      g.textBaseline = 'top';
      g.fillText(cl.label, cl.x, y + 6);
      g.fillStyle = cl.label === 'QTR' && ot ? '#ff4a4a' : '#ffb21e';
      g.font = '900 19px ' + F.LED;
      g.shadowColor = 'rgba(255,170,30,0.6)'; g.shadowBlur = 6;
      g.fillText(cl.val, cl.x, y + 18);
      g.shadowBlur = 0;
    });
    g.fillStyle = '#9a9aa2';
    g.font = '700 9px ' + F.LABEL;
    g.fillText('TIMEOUTS', x + 320, y + 6);
    for (var i = 0; i < LIVES; i++) {
      var on = i < G.lives;
      g.fillStyle = on ? '#ffb21e' : '#2c2c31';
      if (on) { g.shadowColor = 'rgba(255,170,30,0.7)'; g.shadowBlur = 6; }
      rr(g, x + 290 + i * 22, y + 22, 16, 13, 2); g.fill();
      g.shadowBlur = 0;
    }
    g.restore();
  }

  function drawBanner(g, b) {
    var t = b.t;
    var inn = Math.min(1, t / 0.25), out = t > 2 ? 1 - (t - 2) / 0.4 : 1;
    var a = Math.max(0, Math.min(inn, out));
    g.save();
    g.globalAlpha = a;
    var y = 232, h = 74;
    g.fillStyle = b.hot ? 'rgba(186,31,31,0.94)' : 'rgba(8,8,10,0.86)';
    g.fillRect(0, y, W, h);
    g.fillStyle = b.hot ? '#0a0a0a' : '#ba1f1f';
    g.fillRect(0, y, W, 4); g.fillRect(0, y + h - 4, W, 4);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    var slide = (1 - inn) * -60;
    g.fillStyle = '#fff';
    g.font = '800 38px ' + F.COND;
    g.fillText(b.title, W / 2 + slide, y + 30);
    g.font = '600 15px "Open Sans", Arial, sans-serif';
    g.fillStyle = b.hot ? '#fff' : '#d8d8d8';
    g.fillText(b.sub.toUpperCase(), W / 2 - slide, y + 56);
    g.restore();
  }

  /* ---------- sizing ---------- */
  var K = 1;
  var builtK = 0;
  function resize() {
    var cssW = stage.clientWidth || W;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var newK = (cssW * dpr) / W;
    canvas.width = Math.round(W * newK);
    canvas.height = Math.round(H * newK);
    K = canvas.width / W;
    if (!builtK || Math.abs(K - builtK) / builtK > 0.08) { TT.buildScene(K); builtK = K; }
  }
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 120);
  });

  /* ---------- loop ---------- */
  var last = 0;
  function frame(now) {
    var dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
    last = now;
    if (!G.paused) update(dt);
    render();
    requestAnimationFrame(frame);
  }

  function boot() {
    resize();
    var b = $('best-line');
    if (b && best > 0) b.textContent = 'Your best: ' + fmtTime(best);
    requestAnimationFrame(frame);
  }

  // Wait (briefly) for web fonts so cached text renders in the right faces.
  var booted = false;
  function go() { if (!booted) { booted = true; boot(); } }
  if (document.fonts && document.fonts.load) {
    Promise.all([
      document.fonts.load('900 40px "Roboto Slab"'),
      document.fonts.load('700 19px "Roboto Condensed"'),
      document.fonts.load('800 19px "Roboto Condensed"'),
      document.fonts.load('900 19px Orbitron'),
      document.fonts.load('700 9px Montserrat')
    ]).then(go, go);
    setTimeout(go, 1800);
    document.fonts.ready.then(function () { if (booted) { TT.buildScene(K); builtK = K; } });
  } else {
    go();
  }

  // exposed for quick testing in the console
  TT.debug = {
    state: function () { return G; },
    input: input,
    skipTo: function (s) { if (G.mode === 'play') G.elapsed = s; },
    step: function (seconds) { for (var i = 0; i < seconds * 60; i++) update(1 / 60); render(); }
  };
})(window.TT);
