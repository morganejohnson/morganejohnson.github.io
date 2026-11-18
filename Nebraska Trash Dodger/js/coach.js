/* =====================================================================
   TRASH TALK — coach.js
   The coach: short, grey hair, brown mustache, all-black Husker gear,
   clipboard in hand, headset around his neck.
   Expressions: 'yell' (resting), 'happy' (dodged), 'furious' (hit).
   Origin = point between his feet; he is about 114 units tall.
   ===================================================================== */
(function (TT) {
  'use strict';
  var circle = TT.circle, ellipse = TT.ellipse, rr = TT.rr;

  var SKIN = '#f2c7a5';
  var HAIR = '#c3c3c3', HAIR_DARK = '#9b9b9b';
  var BROW = '#808080';
  var STACHE = '#6b4423', STACHE_DARK = '#4b2e17';
  var GEAR = '#141416', GEAR_HI = '#232327';
  var MOUTH = '#4a1010', TONGUE = '#d4545a';

  TT.COACH_HITBOX = { halfW: 19, top: 112, bottom: 2 };

  /* ---------- head (origin = head centre) ---------- */
  function drawHead(g, expr, t, red) {
    var skin = TT.mix(SKIN, '#e0604e', red);
    var skinDark = TT.mix('#d9a07e', '#b8463a', red);

    // ears
    g.fillStyle = skin;
    circle(g, -17.2, 1, 4.6); g.fill();
    circle(g, 17.2, 1, 4.6); g.fill();
    g.strokeStyle = skinDark; g.lineWidth = 1.2;
    g.beginPath(); g.arc(-17.2, 1, 2.4, -1.2, 1.6); g.stroke();
    g.beginPath(); g.arc(17.2, 1, 2.4, 1.5, 4.3); g.stroke();

    // face
    g.fillStyle = skin;
    ellipse(g, 0, 0, 17, 18.5); g.fill();
    // jowl shading
    g.fillStyle = 'rgba(150,70,40,0.12)';
    ellipse(g, 0, 11, 14, 7); g.fill();

    // grey hair: receding on top, bushy at the sides
    g.fillStyle = HAIR;
    ellipse(g, -15.4, -4, 4.6, 8.5, 0.15); g.fill();
    ellipse(g, 15.4, -4, 4.6, 8.5, -0.15); g.fill();
    g.beginPath();
    g.moveTo(-17, -2);
    g.bezierCurveTo(-19.5, -16, -10, -22.5, 0, -22);
    g.bezierCurveTo(10, -22.5, 19.5, -16, 17, -2);
    g.lineTo(14.6, -6.5);
    g.quadraticCurveTo(12, -13.5, 6, -13.6);
    g.quadraticCurveTo(0, -11.2, -6, -13.6);
    g.quadraticCurveTo(-12, -13.5, -14.6, -6.5);
    g.closePath();
    g.fill();
    g.strokeStyle = HAIR_DARK; g.lineWidth = 1;
    for (var i = -2; i <= 2; i++) {
      g.beginPath(); g.moveTo(i * 4.5, -20.5); g.quadraticCurveTo(i * 5.5 + 2, -17, i * 5.2 + 1, -14.5); g.stroke();
    }

    // brows
    g.strokeStyle = BROW; g.lineCap = 'round';
    if (expr === 'happy') {
      g.lineWidth = 3.2;
      g.beginPath(); g.moveTo(-12.5, -8.5); g.quadraticCurveTo(-7.5, -13.5, -3, -9.5); g.stroke();
      g.beginPath(); g.moveTo(12.5, -8.5); g.quadraticCurveTo(7.5, -13.5, 3, -9.5); g.stroke();
    } else if (expr === 'furious') {
      g.lineWidth = 4.2;
      g.beginPath(); g.moveTo(-13.5, -12); g.lineTo(-2.5, -5); g.stroke();
      g.beginPath(); g.moveTo(13.5, -12); g.lineTo(2.5, -5); g.stroke();
    } else {
      g.lineWidth = 3.4;
      g.beginPath(); g.moveTo(-12.5, -9.5); g.lineTo(-3, -5.8); g.stroke();
      g.beginPath(); g.moveTo(12.5, -9.5); g.lineTo(3, -5.8); g.stroke();
    }

    // eyes
    if (expr === 'happy') {
      g.strokeStyle = '#3b2414'; g.lineWidth = 2.1;
      g.beginPath(); g.arc(-7.5, -0.5, 3.2, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      g.beginPath(); g.arc(7.5, -0.5, 3.2, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
      g.fillStyle = 'rgba(232,96,96,0.35)';
      circle(g, -11, 5, 3.6); g.fill();
      circle(g, 11, 5, 3.6); g.fill();
    } else {
      var big = expr === 'furious';
      g.fillStyle = '#fff';
      ellipse(g, -7.5, -1.6, big ? 4 : 3.3, big ? 3.8 : 2.5); g.fill();
      ellipse(g, 7.5, -1.6, big ? 4 : 3.3, big ? 3.8 : 2.5); g.fill();
      g.fillStyle = '#2b1a10';
      circle(g, -7, -1.4, big ? 1.2 : 1.7); g.fill();
      circle(g, 7, -1.4, big ? 1.2 : 1.7); g.fill();
      // angry lids
      g.strokeStyle = skinDark; g.lineWidth = 1.4;
      g.beginPath(); g.moveTo(-11, -4.2); g.lineTo(-4, -2.6); g.stroke();
      g.beginPath(); g.moveTo(11, -4.2); g.lineTo(4, -2.6); g.stroke();
      if (big) {
        // forehead vein
        g.strokeStyle = '#a3121c'; g.lineWidth = 1.6;
        g.beginPath();
        g.moveTo(7, -15); g.lineTo(9.5, -12.5); g.moveTo(12, -15); g.lineTo(9.5, -12.5);
        g.moveTo(9.5, -12.5); g.lineTo(9.5, -10); g.stroke();
      }
    }

    // nose
    g.fillStyle = TT.mix('#e2a684', '#c84f40', red);
    circle(g, 0, 3, 3.9); g.fill();

    // mouth (drawn before the mustache so the mustache sits on top)
    if (expr === 'happy') {
      g.fillStyle = MOUTH;
      g.beginPath(); g.moveTo(-8.5, 9.5); g.quadraticCurveTo(0, 21, 8.5, 9.5); g.closePath(); g.fill();
      g.fillStyle = '#fff';
      g.fillRect(-7, 9.5, 14, 2.6);
      g.fillStyle = TONGUE;
      ellipse(g, 0, 15.2, 3.6, 1.6); g.fill();
    } else if (expr === 'furious') {
      var j = Math.sin(t * 30) * 0.8;
      g.fillStyle = MOUTH;
      ellipse(g, 0, 13.5, 7.5, 6 + j); g.fill();
      g.fillStyle = '#fff';
      g.fillRect(-6, 8.6, 12, 2.4);
      g.fillRect(-5, 17.4 + j, 10, 2);
      g.fillStyle = TONGUE;
      ellipse(g, 0, 16.5 + j * 0.5, 4, 1.8); g.fill();
    } else {
      var o = Math.sin(t * 15);
      g.fillStyle = MOUTH;
      ellipse(g, 0, 12.8, 5.6, 3.6 + o * 1.3); g.fill();
      g.fillStyle = TONGUE;
      ellipse(g, 0, 14.6 + o * 0.6, 3.4, 1.4); g.fill();
    }

    // mustache
    g.fillStyle = STACHE;
    g.beginPath();
    g.moveTo(0, 5.2);
    g.bezierCurveTo(-5, 3.2, -12.5, 5, -14, 10.8);
    g.bezierCurveTo(-9.5, 12.2, -4, 10.6, 0, 9.6);
    g.bezierCurveTo(4, 10.6, 9.5, 12.2, 14, 10.8);
    g.bezierCurveTo(12.5, 5, 5, 3.2, 0, 5.2);
    g.fill();
    g.strokeStyle = STACHE_DARK; g.lineWidth = 0.9;
    for (var s = -3; s <= 3; s++) {
      if (!s) continue;
      g.beginPath(); g.moveTo(s * 3.2, 6.2 + Math.abs(s) * 0.2); g.lineTo(s * 3.6, 9.6 + Math.abs(s) * 0.3); g.stroke();
    }
  }
  TT.drawHead = drawHead;

  /* ---------- props ---------- */
  function drawClipboard(g, x, y, ang) {
    g.save();
    g.translate(x, y); g.rotate(ang);
    g.fillStyle = '#8a5a2b'; rr(g, -11, -14, 22, 29, 2); g.fill();
    g.fillStyle = '#f4f1e8'; g.fillRect(-9, -10, 18, 23);
    // the play: X's, O's and a red arrow
    g.strokeStyle = '#222'; g.lineWidth = 1.1;
    [[-5, -5], [0, -5], [5, -5]].forEach(function (p) {
      g.beginPath(); g.moveTo(p[0] - 1.5, p[1] - 1.5); g.lineTo(p[0] + 1.5, p[1] + 1.5);
      g.moveTo(p[0] + 1.5, p[1] - 1.5); g.lineTo(p[0] - 1.5, p[1] + 1.5); g.stroke();
    });
    [[-5, 3], [0, 3], [5, 3]].forEach(function (p) { circle(g, p[0], p[1], 1.6); g.stroke(); });
    g.strokeStyle = '#ba1f1f';
    g.beginPath(); g.moveTo(0, 6); g.quadraticCurveTo(6, 8, 6, 11); g.stroke();
    g.fillStyle = '#b9bcc2'; rr(g, -5, -16, 10, 5, 1.5); g.fill();
    g.restore();
  }

  function arm(g, sx, sy, ex, ey, hx, hy, skin) {
    g.strokeStyle = GEAR; g.lineWidth = 9; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(sx, sy); g.lineTo(ex, ey); g.lineTo(hx, hy); g.stroke();
    g.fillStyle = skin;
    circle(g, hx, hy, 4.7); g.fill();
  }

  /* ---------- full body ---------- */
  // o: { expr, facing, walk, speed (0..1), t, red, alpha }
  TT.drawCoach = function (g, x, y, o) {
    var t = o.t, expr = o.expr;
    var skin = TT.mix(SKIN, '#e0604e', o.red);

    g.save();
    g.translate(x, y);
    // ground shadow
    g.fillStyle = 'rgba(0,0,0,0.5)';
    ellipse(g, 0, 0, 30, 6); g.fill();

    if (o.alpha < 1) g.globalAlpha = o.alpha;
    if (expr === 'furious') g.translate(Math.sin(t * 47) * 1.6, Math.cos(t * 39) * 0.8);
    if (expr === 'happy') g.translate(0, -Math.abs(Math.sin(t * 11)) * 4);
    if (o.facing < 0) g.scale(-1, 1);

    var sw = Math.sin(o.walk) * o.speed;
    if (o.speed > 0.05) g.rotate(0.05 * o.speed);

    // legs + shoes
    g.strokeStyle = '#0e0e10'; g.lineWidth = 11; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-7, -30); g.lineTo(-7 - sw * 7, -5); g.stroke();
    g.beginPath(); g.moveTo(7, -30); g.lineTo(7 + sw * 7, -5); g.stroke();
    [[-7 - sw * 7], [7 + sw * 7]].forEach(function (f) {
      g.fillStyle = '#050505'; ellipse(g, f[0] + 3, -2.5, 8.5, 4.2); g.fill();
      g.fillStyle = '#ba1f1f'; g.fillRect(f[0] - 1, -4, 7, 1.4);
      g.fillStyle = '#dcdcdc'; g.fillRect(f[0] - 4.5, 0.4, 15, 1.3);
    });

    // back arm (behind torso)
    var shoulderL = [-16, -67], shoulderR = [16, -67];
    var back, front, clip;
    if (expr === 'happy') {
      var pump = Math.sin(t * 11) * 3;
      back = [shoulderL[0], shoulderL[1], -27, -86 + pump, -19, -107 + pump];
      front = [shoulderR[0], shoulderR[1], 25, -60, 22, -76];
      clip = [24, -82, 0.25];
    } else if (expr === 'furious') {
      var lift = Math.sin(t * 22) * 4;
      back = [shoulderL[0], shoulderL[1], -25, -94, -9, -119 + lift];
      front = [shoulderR[0], shoulderR[1], 25, -94, 9, -119 + lift];
      clip = [0, -126 + lift, Math.PI / 2 + Math.sin(t * 22) * 0.1];
    } else {
      var shake = Math.sin(t * 17) * 2.5;
      back = [shoulderL[0], shoulderL[1], -28, -80, -24 + shake, -101];
      front = [shoulderR[0], shoulderR[1], 23, -56, 15, -48];
      clip = [14, -48, -0.18];
    }
    arm(g, back[0], back[1], back[2], back[3], back[4], back[5], skin);

    // torso: black quarter-zip
    var tg = g.createLinearGradient(-22, 0, 22, 0);
    tg.addColorStop(0, GEAR); tg.addColorStop(0.45, GEAR_HI); tg.addColorStop(1, '#0d0d0f');
    g.fillStyle = tg;
    g.beginPath();
    g.moveTo(-17, -72);
    g.quadraticCurveTo(-25, -50, -20.5, -28);
    g.lineTo(20.5, -28);
    g.quadraticCurveTo(25, -50, 17, -72);
    g.quadraticCurveTo(0, -77, -17, -72);
    g.fill();
    g.fillStyle = '#ba1f1f';
    g.fillRect(-20.5, -31.5, 41, 2.2);
    g.strokeStyle = '#3c3c42'; g.lineWidth = 1.4;
    g.beginPath(); g.moveTo(0, -74); g.lineTo(0, -61); g.stroke();
    g.fillStyle = '#8d8d93'; g.fillRect(-1.2, -62, 2.4, 3);
    // chest N (un-mirror so it always reads correctly)
    g.save();
    g.translate(-9, -58);
    if (o.facing < 0) g.scale(-1, 1);
    TT.drawN(g, 0, 0, 13, '#ba1f1f', '#fff', 2.2);
    g.restore();

    // neck
    g.fillStyle = skin;
    g.fillRect(-6, -79, 12, 7);

    // headset hanging around the neck
    g.strokeStyle = '#2a2a2e'; g.lineWidth = 3;
    g.beginPath(); g.arc(0, -78, 12, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    g.fillStyle = '#232326'; g.strokeStyle = '#ba1f1f'; g.lineWidth = 1.5;
    rr(g, -18, -80, 7.5, 11, 3); g.fill(); g.stroke();
    rr(g, 10.5, -80, 7.5, 11, 3); g.fill(); g.stroke();
    g.strokeStyle = '#2a2a2e'; g.lineWidth = 1.8;
    g.beginPath(); g.moveTo(17, -71); g.quadraticCurveTo(15, -63, 6, -64); g.stroke();
    g.fillStyle = '#111'; circle(g, 5.5, -64, 2.2); g.fill();

    // head
    g.save();
    g.translate(0, -92);
    drawHead(g, expr, t, o.red);
    g.restore();

    // front arm + clipboard
    if (expr === 'furious') {
      drawClipboard(g, clip[0], clip[1], clip[2]);
      arm(g, front[0], front[1], front[2], front[3], front[4], front[5], skin);
    } else {
      arm(g, front[0], front[1], front[2], front[3], front[4], front[5], skin);
      drawClipboard(g, clip[0], clip[1], clip[2]);
      g.fillStyle = skin;
      circle(g, front[4] + 1, front[5] + 2, 4.3); g.fill();
    }

    g.restore();

    // steam when he's furious
    if (expr === 'furious') {
      g.save();
      g.translate(x, y);
      for (var i = 0; i < 4; i++) {
        var ph = (t * 1.6 + i / 4) % 1;
        var side = i % 2 ? 1 : -1;
        g.fillStyle = 'rgba(235,235,235,' + (0.55 * (1 - ph)) + ')';
        circle(g, side * (19 + ph * 12), -98 - ph * 26, 3 + ph * 6); g.fill();
      }
      g.restore();
    }
  };
})(window.TT);
