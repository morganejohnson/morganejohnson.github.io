/* =====================================================================
   TRASH TALK — trash.js
   Pizza boxes, water bottles, wrappers and shooters.
   Each drawer works around the item's centre at scale 1.
   ===================================================================== */
(function (TT) {
  'use strict';
  var rr = TT.rr, circle = TT.circle, ellipse = TT.ellipse;

  TT.TRASH_TYPES = {
    pizza:   { r: 17, weight: 0.24, time: 1.1,  spin: 3.5 },
    bottle:  { r: 12, weight: 0.30, time: 1.0,  spin: 8 },
    wrapper: { r: 10, weight: 0.24, time: 1.15, spin: 5 },
    shooter: { r: 8,  weight: 0.22, time: 0.88, spin: 11 }
  };

  var WRAPPER_COLORS = [
    ['#d22630', '#f5c400'], ['#c9c9d1', '#8d8d97'], ['#3a7bd5', '#ffffff'],
    ['#6b3e1f', '#e8b923'], ['#1c9b4b', '#ffffff'], ['#f08a1c', '#3a1a08']
  ];

  TT.decorateTrash = function (item, rnd) {
    if (item.type === 'wrapper') {
      var pts = [], n = 9;
      for (var i = 0; i < n; i++) {
        var a = (i / n) * Math.PI * 2;
        var rad = (i % 2 ? 7 : 10) * (0.8 + rnd() * 0.35);
        pts.push([Math.cos(a) * rad * 1.25, Math.sin(a) * rad * 0.75]);
      }
      item.pts = pts;
      item.colors = WRAPPER_COLORS[(rnd() * WRAPPER_COLORS.length) | 0];
    } else if (item.type === 'shooter') {
      item.clear = rnd() < 0.4;
    } else if (item.type === 'bottle') {
      item.fill = 0.25 + rnd() * 0.5;
    }
  };

  function pizza(g, item) {
    // tumbling: squash along one axis
    var squash = 0.3 + 0.7 * Math.abs(Math.cos(item.flip || 0));
    g.scale(1, squash);
    g.fillStyle = '#c99a5e';
    rr(g, -18, -18, 36, 36, 2.5); g.fill();
    g.strokeStyle = '#8d6436'; g.lineWidth = 1.5; g.stroke();
    g.strokeStyle = 'rgba(110,70,30,0.6)'; g.lineWidth = 1;
    g.strokeRect(-14, -14, 28, 28);
    g.fillStyle = '#b3261e';
    circle(g, 0, 0, 8); g.fill();
    g.fillStyle = '#fff';
    g.font = '700 6px ' + TT.FONTS.COND;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('PIZZA', 0, 0.5);
    g.fillStyle = 'rgba(90,50,10,0.35)';
    ellipse(g, 9, -9, 4, 3); g.fill();
  }

  function bottle(g, item) {
    g.fillStyle = 'rgba(190,225,245,0.55)';
    rr(g, -5.5, -12, 11, 27, 4); g.fill();
    g.beginPath(); g.moveTo(-5.5, -10); g.quadraticCurveTo(-5, -15, -3, -16); g.lineTo(3, -16); g.quadraticCurveTo(5, -15, 5.5, -10); g.fill();
    g.fillStyle = 'rgba(80,160,220,0.5)';
    var fh = 27 * (item.fill || 0.5);
    rr(g, -5.5, 15 - fh, 11, fh, 3.5); g.fill();
    g.strokeStyle = 'rgba(235,248,255,0.9)'; g.lineWidth = 1;
    rr(g, -5.5, -12, 11, 27, 4); g.stroke();
    g.fillStyle = '#eaf4fb'; g.fillRect(-5.5, -2, 11, 8);
    g.fillStyle = '#2a6fb0'; g.fillRect(-5.5, 0.5, 11, 3);
    g.fillStyle = '#1e5fae'; rr(g, -3.5, -20, 7, 5, 1.2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(-3.5, -9, 1.6, 20);
  }

  function wrapper(g, item) {
    var c = item.colors || WRAPPER_COLORS[0];
    g.fillStyle = c[0];
    // twisted ends
    g.beginPath(); g.moveTo(-11, 0); g.lineTo(-17, -5); g.lineTo(-16, 5); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(11, 0); g.lineTo(17, -5); g.lineTo(16, 5); g.closePath(); g.fill();
    var pts = item.pts;
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
    g.closePath(); g.fill();
    g.strokeStyle = c[1]; g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(-7, -2); g.lineTo(-1, 3); g.lineTo(5, -3); g.stroke();
    g.fillStyle = 'rgba(255,255,255,0.45)';
    g.beginPath(); g.moveTo(-6, -5); g.lineTo(2, -6); g.lineTo(-2, -3); g.closePath(); g.fill();
  }

  function shooter(g, item) {
    g.fillStyle = item.clear ? 'rgba(220,232,238,0.7)' : 'rgba(196,120,30,0.9)';
    rr(g, -4.5, -6, 9, 15, 2); g.fill();
    g.fillRect(-2, -11, 4, 6);
    g.fillStyle = '#0d0d0d'; rr(g, -2.5, -14, 5, 3.5, 1); g.fill();
    g.fillStyle = '#f3efe4'; g.fillRect(-4.5, -1.5, 9, 5.5);
    g.fillStyle = '#ba1f1f'; g.fillRect(-4.5, 0.5, 9, 1.4);
    g.fillStyle = 'rgba(255,255,255,0.55)'; g.fillRect(-3.4, -5, 1.2, 12);
  }

  var DRAW = { pizza: pizza, bottle: bottle, wrapper: wrapper, shooter: shooter };

  TT.drawTrash = function (g, item, scale, flatten) {
    g.save();
    g.translate(item.x, item.y);
    g.rotate(item.rot);
    if (flatten) g.scale(scale, scale * flatten);
    else g.scale(scale, scale);
    DRAW[item.type](g, item);
    g.restore();
  };
})(window.TT);
