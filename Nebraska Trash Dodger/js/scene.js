/* =====================================================================
   TRASH TALK — scene.js
   Memorial Stadium at night: light banks, a blacked-out student section,
   the ribbon board, the wall, the end zone and the goalpost.
   Everything is drawn in a fixed 960 x 600 coordinate space.
   ===================================================================== */
window.TT = window.TT || {};
(function (TT) {
  'use strict';

  var W = 960, H = 600;
  var C = TT.C = {
    W: W, H: H,
    STANDS_TOP: 58,
    WALL_TOP: 348, RIBBON_TOP: 356, RIBBON_BOT: 382, WALL_BOT: 404,
    END_LINE: 414, GROUND: 588,
    RED: '#ba1f1f', RED_HOT: '#e3262d', CORN: '#f3c623', POST: '#f2c230'
  };

  var SLAB = '"Roboto Slab", Georgia, "Times New Roman", serif';
  var COND = '"Roboto Condensed", "Arial Narrow", Arial, sans-serif';
  var LED = 'Orbitron, "Roboto Condensed", monospace';
  var LABEL = 'Montserrat, Arial, sans-serif';
  TT.FONTS = { SLAB: SLAB, COND: COND, LED: LED, LABEL: LABEL };

  /* ---------- helpers ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  TT.mulberry32 = mulberry32;

  function rr(g, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }
  function circle(g, x, y, r) { g.beginPath(); g.arc(x, y, Math.max(0, r), 0, Math.PI * 2); }
  function ellipse(g, x, y, rx, ry, rot) { g.beginPath(); g.ellipse(x, y, Math.max(0, rx), Math.max(0, ry), rot || 0, 0, Math.PI * 2); }
  TT.rr = rr; TT.circle = circle; TT.ellipse = ellipse;

  function makeCanvas(w, h, k) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w * k));
    c.height = Math.max(1, Math.ceil(h * k));
    var g = c.getContext('2d');
    g.setTransform(k, 0, 0, k, 0, 0);
    return { c: c, g: g };
  }
  TT.makeCanvas = makeCanvas;

  /* ---------- Nebraska icons ---------- */
  function drawN(g, x, y, size, fill, stroke, sw) {
    g.save();
    g.font = '900 ' + size + 'px ' + SLAB;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    var yy = y + size * 0.05;
    if (stroke) {
      g.lineJoin = 'round';
      g.lineWidth = sw || size * 0.16;
      g.strokeStyle = stroke;
      g.strokeText('N', x, yy);
    }
    g.fillStyle = fill;
    g.fillText('N', x, yy);
    g.restore();
  }
  TT.drawN = drawN;

  /* Blackshirts skull and crossbones */
  function drawSkull(g, x, y, s, col, bg) {
    g.save();
    g.translate(x, y);
    g.strokeStyle = col; g.fillStyle = col;
    g.lineCap = 'round';
    g.lineWidth = s * 0.11;
    var b = s * 0.44, cy = s * 0.2;
    g.beginPath(); g.moveTo(-b, cy - b * 0.5); g.lineTo(b, cy + b * 0.5); g.stroke();
    g.beginPath(); g.moveTo(-b, cy + b * 0.5); g.lineTo(b, cy - b * 0.5); g.stroke();
    var ends = [[-b, cy - b * 0.5], [b, cy + b * 0.5], [-b, cy + b * 0.5], [b, cy - b * 0.5]];
    for (var i = 0; i < ends.length; i++) {
      circle(g, ends[i][0], ends[i][1] - s * 0.05, s * 0.07); g.fill();
      circle(g, ends[i][0], ends[i][1] + s * 0.05, s * 0.07); g.fill();
    }
    // cranium + jaw
    circle(g, 0, -s * 0.1, s * 0.3); g.fill();
    rr(g, -s * 0.17, s * 0.06, s * 0.34, s * 0.2, s * 0.05); g.fill();
    // sockets, nose, teeth
    g.fillStyle = bg;
    circle(g, -s * 0.115, -s * 0.08, s * 0.08); g.fill();
    circle(g, s * 0.115, -s * 0.08, s * 0.08); g.fill();
    g.beginPath(); g.moveTo(0, s * 0.0); g.lineTo(-s * 0.04, s * 0.07); g.lineTo(s * 0.04, s * 0.07); g.closePath(); g.fill();
    g.strokeStyle = bg; g.lineWidth = s * 0.03; g.lineCap = 'butt';
    for (var tx = -0.08; tx <= 0.081; tx += 0.08) {
      g.beginPath(); g.moveTo(tx * s, s * 0.15); g.lineTo(tx * s, s * 0.26); g.stroke();
    }
    g.restore();
  }
  TT.drawSkull = drawSkull;

  function drawCorn(g, x, y, len, ang) {
    g.save();
    g.translate(x, y);
    g.rotate(ang || 0);
    g.fillStyle = C.CORN;
    ellipse(g, 0, -len * 0.05, len * 0.17, len * 0.42); g.fill();
    g.fillStyle = '#d29a12';
    for (var yy = -len * 0.36; yy < len * 0.25; yy += len * 0.09) {
      for (var c = -1; c <= 1; c++) {
        circle(g, c * len * 0.075, yy + (c === 0 ? len * 0.04 : 0), len * 0.022); g.fill();
      }
    }
    g.fillStyle = '#3f8a2e';
    g.beginPath();
    g.moveTo(0, len * 0.5);
    g.quadraticCurveTo(-len * 0.32, len * 0.2, -len * 0.18, -len * 0.18);
    g.quadraticCurveTo(-len * 0.12, len * 0.15, 0, len * 0.3);
    g.quadraticCurveTo(len * 0.12, len * 0.15, len * 0.18, -len * 0.18);
    g.quadraticCurveTo(len * 0.32, len * 0.2, 0, len * 0.5);
    g.fill();
    g.restore();
  }
  TT.drawCorn = drawCorn;

  /* ---------- student section geometry ---------- */
  var S = TT.stands = { rows: [], students: [], flags: [], k: 0 };
  var N_ROWS = 13;
  var AISLES = [118, 328, 632, 842];

  var SKINS = ['#f3cfb3', '#eab896', '#d9a07a', '#c28461', '#9c6544', '#7a4b31', '#5a3522', '#f6dcc7'];
  var HAIRS = ['#1d140e', '#2e1d12', '#4a2f1b', '#6b4a2b', '#a77b45', '#d8b26a', '#111', '#3a2a22'];
  var BLACKS = ['#0c0c0e', '#111114', '#141417', '#0f1013', '#18181b'];

  function makeStudent(r) {
    var st = {
      skin: SKINS[(r() * SKINS.length) | 0],
      hair: HAIRS[(r() * HAIRS.length) | 0],
      longHair: r() < 0.32,
      paint: r() < 0.12,
      hat: 'none', prop: 'none', chest: 'none'
    };
    var sr = r();
    st.shirt = sr < 0.9 ? BLACKS[(r() * BLACKS.length) | 0] : sr < 0.95 ? (r() < 0.5 ? '#ba1f1f' : '#a3121c') : '#2a2a2e';
    var hr = r();
    if (hr < 0.075) st.hat = 'corn';
    else if (hr < 0.11) st.hat = 'red';
    else if (hr < 0.22) st.hat = 'black';
    else if (hr < 0.26) st.hat = 'beanie';
    var pr = r();
    if (pr < 0.05) st.prop = 'sign';
    else if (pr < 0.14) st.prop = 'phone';
    else if (pr < 0.17) st.prop = 'skull';
    else if (pr < 0.21) st.prop = 'pom';
    if (st.shirt.charAt(1) === '0' || st.shirt.charAt(1) === '1') {
      var cr = r();
      if (cr < 0.16) st.chest = 'N';
      else if (cr < 0.24) st.chest = 'skull';
    }
    return st;
  }

  function buildStands() {
    var r = mulberry32(1923); // Memorial Stadium opened in 1923
    S.rows = []; S.students = []; S.flags = [];
    var weights = [], total = 0;
    for (var i = 0; i < N_ROWS; i++) { weights.push(1 + i * 0.09); total += weights[i]; }
    var span = C.WALL_TOP - C.STANDS_TOP;
    var y = C.STANDS_TOP;
    for (i = 0; i < N_ROWS; i++) {
      var h = span * weights[i] / total;
      var f = i / (N_ROWS - 1);
      var row = {
        i: i, top: y, bot: y + h, h: h, riserTop: y + h * 0.5,
        aisles: AISLES.map(function (ax) { return 480 + (ax - 480) * (0.8 + 0.2 * f); }),
        aw: h * 0.95,
        students: [], chunks: [], canv: null,
        waist: h * 3.5, ch: h * 4.0,
        tread: shade('#2a2c33', '#3a3c44', f),
        riser: shade('#16171b', '#1e2025', f)
      };
      var sp = h * 0.8;
      var x = r() * sp * 0.4;
      while (x < W + sp * 0.5) {
        var inAisle = false;
        for (var a = 0; a < row.aisles.length; a++) {
          if (Math.abs(x - row.aisles[a]) < row.aw * 0.5 + sp * 0.32) { inAisle = true; break; }
        }
        if (!inAisle) {
          var s = { x: x, row: i, st: makeStudent(r) };
          s.headY = row.riserTop - h * 0.64 - h * 0.23 * 0.8;
          row.students.push(s);
          S.students.push(s);
        }
        x += sp * (0.9 + r() * 0.2);
      }
      // group neighbours into chunks that bounce together
      var cur = null;
      for (var j = 0; j < row.students.length; j++) {
        var st = row.students[j];
        var prev = row.students[j - 1];
        var gapBreak = !prev || (st.x - prev.x) > sp * 1.6;
        if (!cur || gapBreak || cur.list.length >= 3) {
          var x0 = (!prev || gapBreak) ? st.x - sp * 0.75 : (prev.x + st.x) / 2;
          if (cur) cur.x1 = (!prev || gapBreak) ? prev.x + sp * 0.75 : x0;
          cur = { list: [], x0: x0, x1: 0, phase: r() * 6.28, phase2: r() * 6.28, freq: 5 + r() * 3, f2: 0.6 + r() * 0.9 };
          row.chunks.push(cur);
        }
        cur.list.push(st);
        st.chunk = cur;
      }
      if (cur) cur.x1 = row.students[row.students.length - 1].x + sp * 0.75;
      row.chunks.forEach(function (c) { c.x0 = Math.max(0, c.x0); c.x1 = Math.min(W, c.x1); });
      S.rows.push(row);
      y += h;
    }
    S.flags = [
      { row: 4, x: 214, type: 'skull' },
      { row: 7, x: 724, type: 'N' },
      { row: 10, x: 60, type: 'N' },
      { row: 9, x: 900, type: 'skull' },
      { row: 2, x: 650, type: 'skull' }
    ];
  }

  function shade(a, b, f) {
    var pa = hex(a), pb = hex(b);
    return 'rgb(' + Math.round(pa[0] + (pb[0] - pa[0]) * f) + ',' + Math.round(pa[1] + (pb[1] - pa[1]) * f) + ',' + Math.round(pa[2] + (pb[2] - pa[2]) * f) + ')';
  }
  function hex(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
  }
  TT.mix = function (a, b, f) { return shade(a, b, Math.max(0, Math.min(1, f))); };

  /* ---------- one student, drawn into a row canvas ---------- */
  function drawStudent(g, x, wy, h, st, pose) {
    var tw = h * 0.56, th = h * 0.64, r = h * 0.23;
    var hy = wy - th - r * 0.8;
    var shY = wy - th + h * 0.08;
    var hands = null;

    if (pose) {
      var spread = st.prop === 'sign' ? 0.2 : 0.42;
      var ay = hy - r * 1.7;
      hands = [[x - h * spread, ay], [x + h * spread, ay - h * 0.04]];
      g.strokeStyle = st.shirt === '#0c0c0e' ? '#141417' : st.shirt;
      g.lineWidth = h * 0.15; g.lineCap = 'round';
      g.beginPath(); g.moveTo(x - tw * 0.38, shY); g.lineTo(hands[0][0], hands[0][1]); g.stroke();
      g.beginPath(); g.moveTo(x + tw * 0.38, shY); g.lineTo(hands[1][0], hands[1][1]); g.stroke();
      g.fillStyle = st.skin;
      circle(g, hands[0][0], hands[0][1], h * 0.075); g.fill();
      circle(g, hands[1][0], hands[1][1], h * 0.075); g.fill();
    }

    // torso (extends below the waist; the riser covers it)
    g.fillStyle = st.shirt;
    rr(g, x - tw / 2, wy - th, tw, th + h * 0.55, h * 0.2); g.fill();
    // subtle top light on shoulders
    g.fillStyle = 'rgba(255,255,255,0.06)';
    rr(g, x - tw / 2 + h * 0.04, wy - th, tw - h * 0.08, h * 0.12, h * 0.06); g.fill();
    if (st.chest === 'N') drawN(g, x, wy - th * 0.5, h * 0.3, '#ba1f1f');
    else if (st.chest === 'skull') drawSkull(g, x, wy - th * 0.52, h * 0.3, '#e9e9e9', st.shirt);

    // neck + head
    g.fillStyle = st.skin;
    g.fillRect(x - r * 0.35, hy + r * 0.6, r * 0.7, r * 0.6);
    if (st.longHair && st.hat !== 'corn') {
      g.fillStyle = st.hair;
      rr(g, x - r * 1.05, hy - r * 0.4, r * 2.1, r * 1.9, r * 0.5); g.fill();
    }
    g.fillStyle = st.skin;
    circle(g, x, hy, r); g.fill();
    // hair cap
    g.fillStyle = st.hair;
    g.beginPath(); g.arc(x, hy, r * 1.03, Math.PI * 1.02, Math.PI * 1.98); g.closePath(); g.fill();
    // eyes (only show on nearer rows)
    if (h > 18) {
      g.fillStyle = 'rgba(20,10,5,0.85)';
      circle(g, x - r * 0.36, hy + r * 0.1, h * 0.028); g.fill();
      circle(g, x + r * 0.36, hy + r * 0.1, h * 0.028); g.fill();
    }
    if (st.paint) {
      g.fillStyle = '#ba1f1f';
      g.fillRect(x - r * 0.62, hy + r * 0.32, r * 0.42, r * 0.16);
      g.fillRect(x + r * 0.2, hy + r * 0.32, r * 0.42, r * 0.16);
      g.fillStyle = '#050505';
      g.fillRect(x - r * 0.62, hy + r * 0.48, r * 0.42, r * 0.12);
      g.fillRect(x + r * 0.2, hy + r * 0.48, r * 0.42, r * 0.12);
    }

    // hats
    if (st.hat === 'corn') {
      drawCorn(g, x, hy - r * 1.35, r * 2.6, 0);
    } else if (st.hat === 'red' || st.hat === 'black') {
      g.fillStyle = st.hat === 'red' ? '#ba1f1f' : '#0a0a0b';
      g.beginPath(); g.arc(x, hy - r * 0.1, r * 1.05, Math.PI, 0); g.closePath(); g.fill();
      g.fillRect(x - r * 1.2, hy - r * 0.2, r * 2.4, r * 0.26);
      if (st.hat === 'black') drawN(g, x, hy - r * 0.55, r * 0.75, '#ba1f1f');
      else drawN(g, x, hy - r * 0.55, r * 0.75, '#fff');
    } else if (st.hat === 'beanie') {
      g.fillStyle = '#0a0a0b';
      g.beginPath(); g.arc(x, hy - r * 0.05, r * 1.05, Math.PI, 0); g.closePath(); g.fill();
      g.fillStyle = '#ba1f1f';
      g.fillRect(x - r * 1.05, hy - r * 0.3, r * 2.1, r * 0.3);
      circle(g, x, hy - r * 1.15, r * 0.3); g.fill();
    }

    // props held up
    if (pose && hands) {
      if (st.prop === 'sign') {
        var sw = h * 0.75, sh = h * 0.55;
        var sx = (hands[0][0] + hands[1][0]) / 2, sy = hands[0][1] - sh * 0.45;
        g.fillStyle = '#f2efe8';
        g.fillRect(sx - sw / 2, sy - sh / 2, sw, sh);
        drawN(g, sx, sy, sh * 0.85, '#ba1f1f');
      } else if (st.prop === 'phone') {
        var px = hands[1][0], py = hands[1][1] - h * 0.07;
        var gl = g.createRadialGradient(px, py, 0, px, py, h * 0.45);
        gl.addColorStop(0, 'rgba(255,255,240,0.9)');
        gl.addColorStop(1, 'rgba(255,255,240,0)');
        g.fillStyle = gl;
        circle(g, px, py, h * 0.45); g.fill();
        g.fillStyle = '#fff';
        g.fillRect(px - h * 0.04, py - h * 0.06, h * 0.08, h * 0.12);
      } else if (st.prop === 'skull') {
        var fx = hands[1][0], fy = hands[1][1];
        g.strokeStyle = '#777'; g.lineWidth = h * 0.04;
        g.beginPath(); g.moveTo(fx, fy + h * 0.1); g.lineTo(fx, fy - h * 0.75); g.stroke();
        g.fillStyle = '#050505';
        g.fillRect(fx, fy - h * 0.75, h * 0.62, h * 0.42);
        drawSkull(g, fx + h * 0.31, fy - h * 0.55, h * 0.36, '#f0f0f0', '#050505');
      } else if (st.prop === 'pom') {
        for (var p = 0; p < 2; p++) {
          var hx = hands[p][0], hyy = hands[p][1];
          g.fillStyle = p ? '#ba1f1f' : '#0b0b0b';
          circle(g, hx, hyy - h * 0.05, h * 0.17); g.fill();
          g.fillStyle = p ? '#e3262d' : '#2a2a2a';
          circle(g, hx - h * 0.05, hyy - h * 0.1, h * 0.07); g.fill();
        }
      }
    }
  }

  /* ---------- static layers (rebuilt when the canvas is resized) ---------- */
  var L = TT.layers = {};

  function renderRowCanvases(k) {
    S.rows.forEach(function (row) {
      row.canv = [0, 1].map(function (pose) {
        var m = makeCanvas(W, row.ch, k);
        row.students.forEach(function (s) { drawStudent(m.g, s.x, row.waist, row.h, s.st, pose); });
        return m.c;
      });
    });
  }

  function renderSky(k) {
    var m = makeCanvas(W, 120, k), g = m.g;
    var gr = g.createLinearGradient(0, 0, 0, 70);
    gr.addColorStop(0, '#03060f');
    gr.addColorStop(1, '#0e1630');
    g.fillStyle = gr; g.fillRect(0, 0, W, 120);
    var r = mulberry32(7);
    for (var i = 0; i < 40; i++) {
      g.fillStyle = 'rgba(255,255,255,' + (0.25 + r() * 0.5) + ')';
      g.fillRect(300 + r() * 360, r() * 40, 1.2, 1.2);
    }
    // light banks
    [[14, 300], [660, 946]].forEach(function (b) {
      g.fillStyle = '#1a1d25';
      g.fillRect(b[0], 8, b[1] - b[0], 30);
      g.strokeStyle = '#2b2f3a'; g.lineWidth = 1;
      for (var x = b[0]; x < b[1]; x += 12) {
        g.beginPath(); g.moveTo(x, 38); g.lineTo(x + 12, 58); g.stroke();
      }
      for (var rI = 0; rI < 2; rI++) {
        for (var lx = b[0] + 9; lx < b[1] - 4; lx += 13) {
          g.fillStyle = '#fffdf0';
          circle(g, lx, 16 + rI * 13, 4.2); g.fill();
          g.fillStyle = 'rgba(255,240,190,0.7)';
          circle(g, lx, 16 + rI * 13, 5.5); g.fill();
          g.fillStyle = '#ffffff';
          circle(g, lx, 16 + rI * 13, 3); g.fill();
        }
      }
    });
    // rim / parapet
    g.fillStyle = '#20222a';
    g.fillRect(0, 44, W, 16);
    g.fillStyle = '#7d1418';
    g.fillRect(0, 55, W, 3);
    L.sky = m.c;
  }

  function renderGlow(k) {
    var m = makeCanvas(W, H, k), g = m.g;
    [[157, 24], [803, 24]].forEach(function (p) {
      var gr = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], 320);
      gr.addColorStop(0, 'rgba(255,244,214,0.55)');
      gr.addColorStop(0.15, 'rgba(255,240,200,0.20)');
      gr.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = gr;
      g.fillRect(0, 0, W, H);
      // light cone toward the field
      var cg = g.createLinearGradient(0, p[1], 0, H);
      cg.addColorStop(0, 'rgba(255,248,225,0.07)');
      cg.addColorStop(1, 'rgba(255,248,225,0)');
      g.fillStyle = cg;
      g.beginPath();
      g.moveTo(p[0] - 140, p[1]); g.lineTo(p[0] + 140, p[1]);
      g.lineTo(480 + (p[0] - 480) * 0.1 + 220, H); g.lineTo(480 + (p[0] - 480) * 0.1 - 220, H);
      g.closePath(); g.fill();
    });
    L.glow = m.c;
  }

  function renderWall(k) {
    var m = makeCanvas(W, 60, k), g = m.g, top = C.WALL_TOP;
    g.translate(0, -top);
    g.fillStyle = '#0a0a0c';
    g.fillRect(0, top, W, C.WALL_BOT - top);
    // padded seams
    g.strokeStyle = 'rgba(255,255,255,0.05)';
    for (var x = 0; x < W; x += 64) { g.beginPath(); g.moveTo(x, C.RIBBON_BOT); g.lineTo(x, C.WALL_BOT); g.stroke(); }
    // red rail
    g.fillStyle = '#ba1f1f';
    g.fillRect(0, top - 2, W, 5);
    g.fillStyle = 'rgba(255,255,255,0.25)';
    g.fillRect(0, top - 2, W, 1);
    g.fillStyle = '#8f1616';
    g.fillRect(0, C.WALL_BOT - 3, W, 3);
    g.font = '700 11px ' + COND;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = 'rgba(255,255,255,0.85)';
    [[202, 'MEMORIAL STADIUM'], [762, 'LINCOLN, NEB.']].forEach(function (p) {
      g.fillText(p[1].split('').join(' '), p[0], C.RIBBON_BOT + 10);
    });
    L.wall = m.c;
  }

  function renderRibbon(k) {
    var items = ['GO BIG RED', 'skull', 'BLACKOUT', 'N', 'BLACKSHIRTS', 'corn', 'THERE IS NO PLACE LIKE NEBRASKA', 'skull', 'HUSKERS', 'N'];
    var hgt = C.RIBBON_BOT - C.RIBBON_TOP;
    var meas = makeCanvas(10, 10, 1).g;
    meas.font = '700 19px ' + COND;
    var len = 0;
    var widths = items.map(function (it) {
      var isIcon = it === 'skull' || it === 'N' || it === 'corn';
      var w = isIcon ? 26 : meas.measureText(it).width;
      len += w + 34;
      return w;
    });
    var m = makeCanvas(len, hgt, k), g = m.g;
    g.fillStyle = '#050505'; g.fillRect(0, 0, len, hgt);
    g.font = '700 19px ' + COND;
    g.textBaseline = 'middle';
    var x = 17;
    items.forEach(function (it, i) {
      if (it === 'skull') drawSkull(g, x + 13, hgt / 2 - 1, 22, '#f2f2f2', '#050505');
      else if (it === 'N') drawN(g, x + 11, hgt / 2, 22, '#e3262d', '#fff', 2.5);
      else if (it === 'corn') drawCorn(g, x + 13, hgt / 2, 22, Math.PI / 2.4);
      else {
        g.fillStyle = i % 4 === 0 ? '#ff3b3b' : '#ffffff';
        g.fillText(it, x, hgt / 2 + 1);
      }
      x += widths[i] + 34;
    });
    L.ribbon = m.c; L.ribbonLen = len;
    // LED grid overlay
    var o = makeCanvas(W, hgt, k), og = o.g;
    og.fillStyle = 'rgba(0,0,0,0.42)';
    for (var gx = 0; gx < W; gx += 2.5) og.fillRect(gx, 0, 0.8, hgt);
    for (var gy = 0; gy < hgt; gy += 2.5) og.fillRect(0, gy, W, 0.8);
    L.ledGrid = o.c;
  }

  function drawBedsheet(g, x, y, w, h, lines, seed) {
    var r = mulberry32(seed);
    g.save();
    g.fillStyle = '#ebe6da';
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + w, y);
    g.lineTo(x + w - 2, y + h);
    var n = 6;
    for (var i = n; i >= 0; i--) {
      var px = x + (w * i) / n;
      g.lineTo(px, y + h + (r() - 0.5) * 5);
    }
    g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 1;
    for (i = 1; i < 4; i++) { g.beginPath(); g.moveTo(x + w * i / 4 + (r() - 0.5) * 8, y + 2); g.lineTo(x + w * i / 4 + (r() - 0.5) * 8, y + h - 2); g.stroke(); }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    lines.forEach(function (ln, li) {
      g.font = '700 ' + ln.size + 'px ' + COND;
      g.fillStyle = ln.color;
      g.save();
      g.translate(x + w / 2, y + ln.y);
      g.rotate((r() - 0.5) * 0.06);
      g.fillText(ln.text, 0, 0);
      g.restore();
    });
    // ties
    g.fillStyle = '#222';
    circle(g, x + 3, y + 1, 2.2); g.fill();
    circle(g, x + w - 3, y + 1, 2.2); g.fill();
    g.restore();
  }

  function renderFront(k) {
    var m = makeCanvas(W, H, k), g = m.g;

    /* banners hanging over the wall */
    var top = C.WALL_TOP;
    // skull banner
    g.fillStyle = '#050505'; g.fillRect(58, top + 1, 74, 50);
    g.strokeStyle = '#ba1f1f'; g.lineWidth = 3; g.strokeRect(59.5, top + 2.5, 71, 47);
    drawSkull(g, 95, top + 24, 40, '#f4f4f4', '#050505');
    // N banner
    g.fillStyle = '#ba1f1f'; g.fillRect(826, top + 1, 74, 50);
    g.strokeStyle = '#0a0a0a'; g.lineWidth = 3; g.strokeRect(827.5, top + 2.5, 71, 47);
    drawN(g, 863, top + 26, 40, '#fff');
    drawBedsheet(g, 272, top + 1, 146, 46, [
      { text: 'BLACKOUT', size: 26, y: 20, color: '#0a0a0a' },
      { text: 'SEA OF BLACK', size: 13, y: 38, color: '#ba1f1f' }
    ], 3);
    drawBedsheet(g, 548, top + 1, 150, 46, [
      { text: 'DODGE THIS,', size: 18, y: 15, color: '#ba1f1f' },
      { text: 'COACH!', size: 22, y: 34, color: '#0a0a0a' }
    ], 9);

    /* apron + end line */
    g.fillStyle = '#18231a';
    g.fillRect(0, C.WALL_BOT, W, C.END_LINE - C.WALL_BOT);
    g.fillStyle = '#f2f2ee';
    g.fillRect(0, C.END_LINE, W, 4);

    /* blacked-out end zone turf */
    var ez = C.END_LINE + 4;
    var gr = g.createLinearGradient(0, ez, 0, H);
    gr.addColorStop(0, '#0f1711');
    gr.addColorStop(1, '#16241a');
    g.fillStyle = gr; g.fillRect(0, ez, W, H - ez);
    for (var sx = 0; sx < W; sx += 60) {
      g.fillStyle = (sx / 60) % 2 ? 'rgba(255,255,255,0.015)' : 'rgba(0,0,0,0.12)';
      g.beginPath();
      g.moveTo(sx, ez); g.lineTo(sx + 60, ez);
      g.lineTo(480 + (sx + 60 - 480) * 1.5, H); g.lineTo(480 + (sx - 480) * 1.5, H);
      g.closePath(); g.fill();
    }
    var r = mulberry32(42);
    for (var i = 0; i < 900; i++) {
      g.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.25)' : 'rgba(120,170,120,0.06)';
      g.fillRect(r() * W, ez + r() * (H - ez), 1.5, 1);
    }

    /* end zone lettering, in perspective */
    g.save();
    g.translate(480, 478);
    g.scale(1, 0.42);
    g.font = '900 150px ' + SLAB;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    var tw = g.measureText('NEBRASKA').width || 800;
    g.scale(870 / tw, 1);
    g.lineJoin = 'round';
    g.lineWidth = 16; g.strokeStyle = '#ba1f1f';
    g.strokeText('NEBRASKA', 0, 0);
    g.fillStyle = 'rgba(240,240,236,0.93)';
    g.fillText('NEBRASKA', 0, 0);
    g.restore();

    /* pooled light on the field */
    var pool = g.createRadialGradient(480, 520, 20, 480, 520, 520);
    pool.addColorStop(0, 'rgba(255,250,230,0.10)');
    pool.addColorStop(1, 'rgba(0,0,0,0.25)');
    g.fillStyle = pool; g.fillRect(0, C.WALL_BOT, W, H - C.WALL_BOT);

    /* goalpost */
    var post = C.POST;
    function bar(x, y, w, h) {
      g.fillStyle = post; g.fillRect(x, y, w, h);
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x + w * 0.62, y, w * 0.38, h);
      g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x + w * 0.12, y, w * 0.14, h);
    }
    bar(376, 70, 8, 168);
    bar(576, 70, 8, 168);
    g.fillStyle = post; g.fillRect(376, 230, 208, 8);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(376, 235, 208, 3);
    bar(474, 236, 12, 100);
    // wind ribbons
    [380, 580].forEach(function (x) {
      g.fillStyle = '#e3262d';
      g.beginPath(); g.moveTo(x, 70); g.lineTo(x + 16, 76); g.lineTo(x + 2, 82); g.closePath(); g.fill();
    });
    // pad
    var pg = g.createLinearGradient(460, 0, 500, 0);
    pg.addColorStop(0, '#8f1616'); pg.addColorStop(0.35, '#c92424'); pg.addColorStop(1, '#7a1111');
    g.fillStyle = pg;
    rr(g, 461, 326, 38, 94, 7); g.fill();
    drawN(g, 480, 362, 26, '#fff');
    g.fillStyle = 'rgba(0,0,0,0.35)';
    ellipse(g, 480, 420, 26, 4); g.fill();

    L.front = m.c;
  }

  /* ---------- waving flags ---------- */
  function renderFlagImages(k) {
    L.flagImgs = {};
    var fw = 64, fh = 42;
    ['skull', 'N'].forEach(function (type) {
      var m = makeCanvas(fw, fh, k), g = m.g;
      if (type === 'skull') {
        g.fillStyle = '#060606'; g.fillRect(0, 0, fw, fh);
        drawSkull(g, fw / 2, fh / 2 - 1, 34, '#f3f3f3', '#060606');
      } else {
        g.fillStyle = '#ba1f1f'; g.fillRect(0, 0, fw, fh);
        drawN(g, fw / 2, fh / 2, 34, '#fff', '#0a0a0a', 3);
      }
      L.flagImgs[type] = m.c;
    });
    L.flagW = fw; L.flagH = fh;
  }

  function drawFlag(g, f, row, t, k) {
    var h = row.h;
    var hx = f.x, hy = row.riserTop - h * 0.7;
    var poleTop = hy - h * 3.6;
    g.strokeStyle = '#8a8a8a'; g.lineWidth = Math.max(1.2, h * 0.07);
    g.beginPath(); g.moveTo(hx, hy + h * 0.2); g.lineTo(hx, poleTop); g.stroke();
    var img = L.flagImgs[f.type];
    var dw = h * 2.6, dh = h * 1.7;
    var slices = 14, sw = dw / slices, srcW = img.width / slices;
    for (var i = 0; i < slices; i++) {
      var u = i / slices;
      var wave = Math.sin(t * 5 + f.x * 0.05 - u * 5) * h * 0.22 * u;
      g.drawImage(img, i * srcW, 0, srcW + 0.5, img.height, hx + i * sw, poleTop + wave + 1, sw + 0.6, dh);
    }
  }

  /* ---------- public drawing API ---------- */
  TT.buildScene = function (k) {
    if (!S.rows.length) buildStands();
    S.k = k;
    renderSky(k);
    renderRowCanvases(k);
    renderGlow(k);
    renderWall(k);
    renderRibbon(k);
    renderFront(k);
    renderFlagImages(k);
  };

  TT.drawBackground = function (g, t, energy) {
    var k = S.k;
    g.drawImage(L.sky, 0, 0, W, 120);
    for (var ri = 0; ri < S.rows.length; ri++) {
      var row = S.rows[ri];
      g.fillStyle = row.tread;
      g.fillRect(0, row.top, W, row.riserTop - row.top + 0.5);
      g.fillStyle = 'rgba(255,255,255,0.06)';
      for (var a = 0; a < row.aisles.length; a++) g.fillRect(row.aisles[a] - row.aw / 2, row.top, row.aw, row.h);

      for (var c = 0; c < row.chunks.length; c++) {
        var ch = row.chunks[c];
        var bob = -Math.abs(Math.sin(t * ch.freq + ch.phase)) * row.h * (0.04 + 0.16 * energy);
        var up = Math.sin(t * ch.f2 + ch.phase2) > (0.72 - energy * 0.95) ? 1 : 0;
        var w = ch.x1 - ch.x0;
        if (w <= 0) continue;
        var sx = Math.floor(ch.x0 * k), sw = Math.min(row.canv[up].width - sx, Math.ceil(w * k));
        if (sw <= 0) continue;
        g.drawImage(row.canv[up], sx, 0, sw, row.canv[up].height,
          sx / k, row.riserTop - row.waist + bob, sw / k, row.ch);
      }
      for (var fi = 0; fi < S.flags.length; fi++) if (S.flags[fi].row === ri) drawFlag(g, S.flags[fi], row, t, k);

      g.fillStyle = row.riser;
      g.fillRect(0, row.riserTop, W, row.bot - row.riserTop + 0.5);
      g.fillStyle = 'rgba(255,255,255,0.07)';
      g.fillRect(0, row.riserTop, W, 1);
      for (a = 0; a < row.aisles.length; a++) {
        g.fillStyle = '#2c2f37';
        g.fillRect(row.aisles[a] - row.aw / 2, row.riserTop, row.aw, row.bot - row.riserTop);
        g.fillStyle = 'rgba(214,170,40,0.55)';
        g.fillRect(row.aisles[a] - row.aw / 2, row.riserTop, row.aw, 1.2);
      }
    }
    // depth haze: far rows sink into the night
    var hz = g.createLinearGradient(0, C.STANDS_TOP, 0, C.WALL_TOP);
    hz.addColorStop(0, 'rgba(6,9,22,0.42)');
    hz.addColorStop(1, 'rgba(6,9,22,0)');
    g.fillStyle = hz;
    g.fillRect(0, C.STANDS_TOP - 30, W, C.WALL_TOP - C.STANDS_TOP + 30);

    // wall + ribbon board
    g.drawImage(L.wall, 0, C.WALL_TOP, W, 60);
    var rh = C.RIBBON_BOT - C.RIBBON_TOP;
    var off = (t * 70) % L.ribbonLen;
    for (var x = -off; x < W; x += L.ribbonLen) g.drawImage(L.ribbon, x, C.RIBBON_TOP, L.ribbonLen, rh);
    g.drawImage(L.ledGrid, 0, C.RIBBON_TOP, W, rh);
  };

  TT.drawForeground = function (g) {
    g.drawImage(L.front, 0, 0, W, H);
  };

  TT.drawGlow = function (g, flicker) {
    g.save();
    g.globalCompositeOperation = 'lighter';
    g.globalAlpha = flicker;
    g.drawImage(L.glow, 0, 0, W, H);
    g.restore();
  };
})(window.TT);
