// @ts-nocheck
// To No One — flickbook cinematic for the Comics page.
// Usage: <ToNoOneFlickbook src="/to-no-one-atlas.webp" onComplete={() => setShowText(true)} />
// Give the parent element a size (for example the full viewport). On wide screens the scene
// settles in the left half; on tall screens it settles in the top half.
import { useEffect, useRef } from "react";

export const TO_NO_ONE_PAPER = "#EADFCD";

export default function ToNoOneFlickbook({ src = "/to-no-one-atlas.webp", play = true, paper = TO_NO_ONE_PAPER, settle = "auto", onComplete, className, style }) {
  const ref = useRef(null);
  const api = useRef(null);
  const done = useRef(onComplete);
  done.current = onComplete;
  useEffect(() => {
    if (!ref.current) return;
    api.current = createToNoOne(ref.current, { src, paper, settle, autoplay: false, onComplete: () => done.current && done.current() });
    return () => { api.current && api.current.destroy(); api.current = null; };
  }, [src, paper, settle]);
  useEffect(() => { if (play && api.current) api.current.play(); }, [play, src, paper, settle]);
  return <div ref={ref} className={className} style={{ width: "100%", height: "100%", background: paper, ...style }} />;
}

/* To No One — flickbook cinematic. Plain canvas, no libraries.
   createToNoOne(container, { src, autoplay, paper, onSettled, onComplete }) -> { play, restart, seek, destroy } */
function createToNoOne(container, opts) {
  opts = opts || {};
  var META = {"frame": [0, 0, 624, 850], "outside": [624, 0, 624, 850], "head": [1250, 0, 226, 200], "headC": [145.5, 118], "bird": [1250, 210, 90, 55], "birdAt": [384, 424], "quads": [[[160, 183], [300, 152], [300, 303], [160, 322]], [[333, 144], [524, 101], [523, 270], [332, 298]], [[161, 361], [521, 313], [521, 720], [161, 697]]]};
  var PAPER = opts.paper || '#EADFCD';
  var FPS = 12;                       // flickbook frame rate
  var TAU = Math.PI * 2;

  // ---------- world constants (1 unit = 1 pixel of the character art) ----------
  var R = 66;                          // head radius
  var NECK = 12, TORSO = 96, THIGH = 76, SHIN = 76, UARM = 54, FARM = 58, FOOT = 24;
  var STRIDE = 100, CYCLE = 1.15;      // walk
  var V0 = 2 * STRIDE / CYCLE;
  var WS = 0.52, WXO = 50, WYO = -672; // window art scale and top-left in world
  var LIGHT = { x: 620, h: 950, z: -320 }, WINZ = -120, KY = 0.42;
  var INK = '#1d1d20';

  function wq(p) { return { x: WXO + p[0] * WS, y: WYO + p[1] * WS }; }
  var PANES = META.quads.map(function (q) { return q.map(wq); });
  var PB = { x0: 1e9, x1: -1e9, y0: 1e9, y1: -1e9 };
  PANES.forEach(function (q) { q.forEach(function (p) {
    PB.x0 = Math.min(PB.x0, p.x); PB.x1 = Math.max(PB.x1, p.x);
    PB.y0 = Math.min(PB.y0, p.y); PB.y1 = Math.max(PB.y1, p.y); }); });
  var WIN_RIGHT = WXO + 592 * WS, SILL_Y = WYO + 800 * WS;

  // ---------- helpers ----------
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function sstep(a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }
  function ease(t) { t = clamp(t, 0, 1); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function hash(n) { var s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
  function rng(seed) { var s = seed >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  // light through the window: project a point (x, height, z=0) onto the floor
  function castFloor(L, x, h, z) {
    var t = L.h / Math.max(40, L.h - h);
    var fx = L.x + (x - L.x) * t, fz = L.z + ((z || 0) - L.z) * t;
    return { x: fx, y: fz * KY };
  }
  // does the ray from the light to this point pass through the glass? 0..1
  function litAt(x, h) {
    var s = (WINZ - LIGHT.z) / (0 - LIGHT.z);
    var px = LIGHT.x + (x - LIGHT.x) * s, ph = LIGHT.h + (h - LIGHT.h) * s;
    var m = 85;
    return sstep(PB.x0 - m, PB.x0 + m, px) * (1 - sstep(PB.x1 - m, PB.x1 + m, px)) *
           sstep(-PB.y1 - m, -PB.y1 + m, ph) * (1 - sstep(-PB.y0 - m, -PB.y0 + m, ph));
  }

  // ---------- canvas ----------
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'display:block;width:100%;height:100%;background:' + PAPER;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', 'Pencil flickbook animation: a stick figure walks to a window and looks out at a bird in a tree.');
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var lightC = document.createElement('canvas'), lctx = lightC.getContext('2d');
  var shadC = document.createElement('canvas'), sctx = shadC.getContext('2d');
  var outC = document.createElement('canvas'), octx = outC.getContext('2d'); outC.width = META.frame[2]; outC.height = META.frame[3];
  var W = 0, H = 0, DPR = 1, LS = 1 / 6, SS = 1 / 3;

  // paper grain tile: fine speckle, a cold-press "tooth" and a few fibres
  var GN = 512, grainMean = 1;
  var grain = document.createElement('canvas'); grain.width = grain.height = GN;
  (function () {
    var g = grain.getContext('2d'), id = g.createImageData(GN, GN), d = id.data, r = rng(7), sum = 0;
    function field(cell) { var n = GN / cell, a = []; for (var i = 0; i < n * n; i++) a.push(r());
      return function (x, y) { var fx = x / cell, fy = y / cell, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = fx - x0, ty = fy - y0;
        tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
        function at(i, j) { return a[(((j % n) + n) % n) * n + (((i % n) + n) % n)]; }
        return lerp(lerp(at(x0, y0), at(x0 + 1, y0), tx), lerp(at(x0, y0 + 1), at(x0 + 1, y0 + 1), tx), ty); }; }
    var tooth = field(4), tooth2 = field(8), blot = field(64);
    for (var y = 0; y < GN; y++) for (var x = 0; x < GN; x++) {
      var emb = (tooth(x, y) - tooth(x + 2.2, y + 2.2)) * 1.0 + (tooth2(x, y) - tooth2(x + 3, y + 3)) * 0.8;   // lit from top-left
      var fibre = hash(y * 3.1 + (x >> 4) * 17.7) > 0.93 ? 0.6 : 0;
      var v = 255 - (r() * 9 + clamp(0.42 + emb, 0, 1) * 19 + blot(x, y) * 6 + fibre * 6);
      var k = (y * GN + x) * 4; d[k] = v; d[k + 1] = v - 1; d[k + 2] = v - 3; d[k + 3] = 255; sum += v;
    }
    g.putImageData(id, 0, 0); grainMean = sum / (GN * GN * 255);
  })();
  var grainPat = null;
  var PAPER_LIT = (function () { var n = parseInt(PAPER.replace('#', ''), 16), k = 1 / grainMean;
    return 'rgb(' + Math.min(255, Math.round((n >> 16 & 255) * k)) + ',' + Math.min(255, Math.round((n >> 8 & 255) * k)) + ',' + Math.min(255, Math.round((n & 255) * k)) + ')'; })();

  // ---------- art ----------
  var atlas = new Image(), ready = false;
  atlas.onload = function () { ready = true; dirty = true; if (pendingPlay) { pendingPlay = false; start(); } };
  atlas.src = opts.src || /*SRC*/''/*END*/;

  // ---------- timeline ----------
  var TL = null;
  function buildTimeline() {
    var camA = shotA();
    var leftEdge = camA.cx - (W / 2) / camA.zoom;
    var startX = Math.min(leftEdge - 150, -320);
    var dist = -startX, D = 0.75;                  // slow to a stop over D seconds
    // distance covered while slowing = V0 * D / 2
    var t1 = (dist - V0 * D / 2) / V0, tArr = t1 + D;
    var n = Math.ceil((tArr + 0.2) * 120), xs = [], ph = [], ws = [];
    var x = startX, p = 0;
    for (var i = 0; i <= n; i++) {
      var t = i / 120, w = 1 - sstep(t1, tArr, t);
      xs.push(x); ph.push(p); ws.push(w);
      x += V0 * w / 120; p += w / CYCLE / 120;
    }
    var off = 0.27 - (p % 1);                      // finish on a mid-step pose
    TL = { xs: xs, ph: ph, ws: ws, off: off, tArr: tArr, endX: x, n: n,
           winA: Math.max(0.25, tArr - 2.3), light0: Math.max(0.5, tArr - 1.7),
           cam0: tArr + 1.0, cam1: tArr + 7.5 };
    TL.total = TL.cam1;
  }
  function walkAt(t) {
    var f = clamp(t * 120, 0, TL.n), i = Math.min(TL.n - 1, f | 0), u = f - i;
    return { x: lerp(TL.xs[i], TL.xs[i + 1], u) - TL.endX, ph: lerp(TL.ph[i], TL.ph[i + 1], u) + TL.off, w: lerp(TL.ws[i], TL.ws[i + 1], u) };
  }

  // ---------- skeleton ----------
  function ik(hx, hy, ax, ay) {
    var dx = ax - hx, dy = ay - hy, d = Math.sqrt(dx * dx + dy * dy);
    d = clamp(d, 20, THIGH + SHIN - 0.6);
    var base = Math.atan2(dy, dx);
    var a = Math.acos(clamp((THIGH * THIGH + d * d - SHIN * SHIN) / (2 * THIGH * d), -1, 1));
    var ka = base - a;                              // knee bends forward (to the right)
    return { x: hx + Math.cos(ka) * THIGH, y: hy + Math.sin(ka) * THIGH };
  }
  function legPose(hx, hy, phase, w) {
    var p = ((phase % 1) + 1) % 1, ax, ay, fa;
    if (p < 0.5) { var u = p * 2; ax = STRIDE / 2 - STRIDE * u; ay = -3; fa = u > 0.8 ? (u - 0.8) * 1.2 : 0; }
    else { var s = (p - 0.5) * 2, es = s * s * (3 - 2 * s); ax = -STRIDE / 2 + STRIDE * es; ay = -3 - 24 * Math.sin(Math.PI * s);
           fa = 0.6 * Math.sin(Math.PI * s) * (1 - s) * 1.6 - 0.28 * s * s * s; }
    return { ax: ax * w, ay: lerp(-3, ay, w), fa: fa * w };
  }
  function pose(t) {
    var wk = walkAt(t), w = wk.w, ph = wk.ph;
    var idle = Math.max(0, t - TL.tArr);
    var breath = Math.sin(idle * 1.5) * 1.1 * (1 - w);
    var look = sstep(TL.tArr + 0.15, TL.tArr + 0.9, t);
    var hipH = lerp(154.3, 147 - 3 * Math.cos(2 * TAU * ph), w);
    var hip = { x: wk.x, y: -hipH };
    var lean = lerp(-0.035 * look, 0.07, w);
    var up = { x: Math.sin(lean), y: -Math.cos(lean) };
    var sh = { x: hip.x + up.x * TORSO, y: hip.y + up.y * TORSO - breath };
    var nk = { x: sh.x + up.x * NECK, y: sh.y + up.y * NECK };
    var ha = lean * 0.5 - 0.21 * look + Math.sin(2 * TAU * ph + 0.6) * 0.02 * w;
    var hc = { x: nk.x + Math.sin(ha) * (R - 2), y: nk.y - Math.cos(ha) * (R - 2) };
    function leg(phase, side) {
      var L = legPose(hip.x, hip.y, phase, w);
      var an = { x: hip.x + L.ax + side * 7 * (1 - w), y: L.ay };
      var kn = ik(hip.x, hip.y, an.x, an.y);
      return { hip: hip, knee: kn, ankle: an, toe: { x: an.x + Math.cos(L.fa) * FOOT, y: an.y + Math.sin(L.fa) * FOOT + 2 } };
    }
    function arm(phase, side) {
      var sw = Math.sin(TAU * phase) * 0.44 * w + side * 0.05 * (1 - w);
      var a1 = Math.PI / 2 - sw + lean;
      var bend = (0.2 + 0.28 * Math.max(0, Math.sin(TAU * phase))) * w + 0.06 * (1 - w);
      var el = { x: sh.x + Math.cos(a1) * UARM, y: sh.y + 3 + Math.sin(a1) * UARM };
      var a2 = a1 - bend;
      return { sh: { x: sh.x, y: sh.y + 3 }, el: el, hand: { x: el.x + Math.cos(a2) * FARM, y: el.y + Math.sin(a2) * FARM }, a: a2 };
    }
    return { hip: hip, sh: sh, nk: nk, hc: hc, ha: ha, w: w, look: look,
      legF: leg(ph + 0.5, -1), legN: leg(ph, 1), armF: arm(ph, -1), armN: arm(ph + 0.5, 1) };
  }

  // ---------- hair physics (a damped spring driven by how the head accelerates) ----------
  var hair = { a: 0, v: 0, t: 0, px: null, py: 0, vx: 0, vy: 0 };
  function simHair(toT) {
    if (toT < hair.t || hair.px === null || toT - hair.t > 1.5) { var p0 = pose(toT); hair = { a: 0, v: 0, t: toT, px: p0.hc.x, py: p0.hc.y, vx: toT < TL.tArr - 0.8 ? V0 : 0, vy: 0 }; return; }
    var dt = 1 / 120;
    while (hair.t + dt <= toT) {
      hair.t += dt;
      var p = pose(hair.t), vx = (p.hc.x - hair.px) / dt, vy = (p.hc.y - hair.py) / dt;
      var ax = (vx - hair.vx) / dt, ay = (vy - hair.vy) / dt;
      hair.px = p.hc.x; hair.py = p.hc.y; hair.vx = vx; hair.vy = vy;
      var drive = clamp(ax * 0.0007 - ay * 0.0006, -4, 4) + Math.sin(hair.t * 0.9) * 0.02;
      hair.v += (-150 * hair.a - 9 * hair.v + drive * 60) * dt;
      hair.a = clamp(hair.a + hair.v * dt, -0.13, 0.13);
    }
  }

  // ---------- incidental life: blinks, gusts, pecks ----------
  var events = null;
  function buildEvents() {
    var r = rng(opts.seed || 20261116), blinks = [], gusts = [], pecks = [], t;
    blinks.push(Math.min(1.4, TL.tArr * 0.35), TL.tArr * 0.78, TL.tArr + 1.6);
    t = TL.cam1 + 0.8; var gaps = [8, 10, 4];
    for (var i = 0; i < 400; i++) { blinks.push(t); if (r() < 0.18) blinks.push(t + 0.42); t += gaps[i % 3] * (0.8 + r() * 0.45); }
    t = 0.4; for (i = 0; i < 2500; i++) { var dur = 0.7 + r() * 1.1; gusts.push([t, dur, 0.45 + r() * 0.55]); t += dur * 0.6 + 0.6 + r() * 2.2; }
    t = TL.winA + 1.2; for (i = 0; i < 700; i++) { pecks.push([t, r() < 0.4 ? 1 : 0]); t += 2.6 + r() * 5.5; }
    events = { blinks: blinks, gusts: gusts, pecks: pecks };
  }
  var BLINK = [0.45, 0, 0, 0.45];               // eye openness on each flick frame
  function eyeOpen(t) {
    var b = events.blinks;
    for (var i = 0; i < b.length; i++) { if (b[i] > t) break; var f = Math.floor((t - b[i]) * FPS + 1e-6); if (f < BLINK.length) return BLINK[f]; }
    return 1;
  }
  function gustAt(t) {
    var g = events.gusts, v = 0.12;
    for (var i = 0; i < g.length; i++) { if (g[i][0] > t) break; var u = (t - g[i][0]) / g[i][1]; if (u < 1) v += g[i][2] * Math.pow(Math.sin(Math.PI * u), 2); }
    return v;
  }
  var PECK = [[0, 10, 26, 30, 12, 0], [0, 12, 28, 28, 8, 0, 0, 14, 30, 26, 8, 0]];
  function peckAt(t) {
    var p = events.pecks;
    for (var i = 0; i < p.length; i++) { if (p[i][0] > t) break; var seq = PECK[p[i][1]], f = Math.floor((t - p[i][0]) * FPS + 1e-6); if (f < seq.length) return seq[f]; }
    return 0;
  }

  // ---------- camera ----------
  function shotA() {
    var r = { x0: -430, x1: 440, y0: -700, y1: 80 };
    var z = Math.min(W / (r.x1 - r.x0), H / (r.y1 - r.y0));
    return { cx: (r.x0 + r.x1) / 2, cy: (r.y0 + r.y1) / 2, zoom: z, sx: W / 2, sy: H / 2 };
  }
  function settleMode() {
    var m = opts.settle || 'auto';
    if (m !== 'auto') return m;
    return W / H > 1.25 ? 'left' : (H / W > 1.3 ? 'top' : 'center');
  }
  function shotB() { return shotIn({ x0: -70, x1: WIN_RIGHT + 8, y0: -480, y1: -236 }); }   // his face and the tree side of the window
  function shotIn(r) {
    var m = settleMode(), rw = W, rh = H, sx = W / 2, sy = H / 2;
    if (m === 'left') { rw = W * 0.56; sx = W * 0.28; }
    else if (m === 'top') { rh = H * 0.5; sy = H * 0.27; }
    var z = Math.min(rw * 0.97 / (r.x1 - r.x0), rh * 0.97 / (r.y1 - r.y0));
    return { cx: (r.x0 + r.x1) / 2, cy: (r.y0 + r.y1) / 2, zoom: z, sx: sx, sy: sy };
  }
  function camAt(t) {
    // one continuous move: the slide left and the zoom share a single ease
    var a = shotA(), b = shotB(), u = clamp((t - TL.cam0) / (TL.cam1 - TL.cam0), 0, 1), e = (1 - Math.cos(Math.PI * u)) / 2;
    return { cx: lerp(a.cx, b.cx, e), cy: lerp(a.cy, b.cy, e), zoom: Math.exp(lerp(Math.log(a.zoom), Math.log(b.zoom), e)),
             sx: lerp(a.sx, b.sx, e), sy: lerp(a.sy, b.sy, e), e: e };
  }
  function setCam(c, cam, k) { c.setTransform(cam.zoom * k, 0, 0, cam.zoom * k, (cam.sx - cam.cx * cam.zoom) * k, (cam.sy - cam.cy * cam.zoom) * k); }

  // ---------- drawing ----------
  function hull(pts) {
    pts = pts.slice().sort(function (a, b) { return a.x - b.x || a.y - b.y; });
    function cr(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
    var lo = [], up = [], i;
    for (i = 0; i < pts.length; i++) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pts[i]) <= 0) lo.pop(); lo.push(pts[i]); }
    for (i = pts.length - 1; i >= 0; i--) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pts[i]) <= 0) up.pop(); up.push(pts[i]); }
    lo.pop(); up.pop(); return lo.concat(up);
  }
  function grow(q, d) { var cx = 0, cy = 0; q.forEach(function (p) { cx += p.x / q.length; cy += p.y / q.length; });
    return q.map(function (p) { var dx = p.x - cx, dy = p.y - cy, l = Math.sqrt(dx * dx + dy * dy) || 1; return { x: p.x + dx / l * d, y: p.y + dy / l * d }; }); }
  function poly(c, pts) { c.beginPath(); for (var i = 0; i < pts.length; i++) i ? c.lineTo(pts[i].x, pts[i].y) : c.moveTo(pts[i].x, pts[i].y); c.closePath(); }

  function drawLight(cam, L) {
    lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, lightC.width, lightC.height);
    if (L <= 0.001) return;
    setCam(lctx, cam, DPR * LS);
    var all = [], patches = [];
    PANES.forEach(function (q) {
      var fl = q.map(function (p) { return castFloor(LIGHT, p.x, -p.y, WINZ); });
      patches.push(fl); q.forEach(function (p) { all.push(p); }); fl.forEach(function (p) { all.push(p); });
    });
    // the shaft itself, fading as it leaves the glass
    var hl = hull(all), far = castFloor(LIGHT, PB.x0, -PB.y0, WINZ);
    var g = lctx.createLinearGradient((PB.x0 + PB.x1) / 2, (PB.y0 + PB.y1) / 2, far.x * 0.75, far.y);
    g.addColorStop(0, 'rgba(255,251,238,' + (0.42 * L) + ')'); g.addColorStop(1, 'rgba(255,251,238,' + (0.14 * L) + ')');
    lctx.fillStyle = g; poly(lctx, hl); lctx.fill();
    // pools of light on the floor, one per pane (the bars cast their own gaps)
    lctx.fillStyle = 'rgba(255,251,238,' + (0.8 * L) + ')';
    patches.forEach(function (p) { poly(lctx, p); lctx.fill(); });
  }

  function limbPath(c, pts, jit) {
    c.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var x = pts[i].x + (jit ? (hash(jit + i * 7.3) - 0.5) * 1.3 : 0), y = pts[i].y + (jit ? (hash(jit + i * 3.9 + 50) - 0.5) * 1.3 : 0);
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
  }
  function figureLimbs(P) {
    return [ [P.armF.sh, P.armF.el, P.armF.hand], [P.legF.hip, P.legF.knee, P.legF.ankle],
             [P.hip, P.sh, P.nk], [P.legN.hip, P.legN.knee, P.legN.ankle], [P.armN.sh, P.armN.el, P.armN.hand] ];
  }
  function drawShadow(cam, P, light, alpha, soft) {
    if (alpha <= 0.004) return;
    sctx.save(); setCam(sctx, cam, DPR * SS);
    sctx.globalAlpha = alpha; sctx.strokeStyle = sctx.fillStyle = 'rgb(58,44,34)';
    sctx.lineCap = sctx.lineJoin = 'round';
    function pr(p) { return castFloor(light, p.x, -p.y, 0); }
    // everything in one path so overlaps do not double up
    var limbs = figureLimbs(P).concat([[P.legF.ankle, P.legF.toe], [P.legN.ankle, P.legN.toe]]);
    sctx.lineWidth = soft; sctx.beginPath();
    limbs.forEach(function (l) { l.forEach(function (p, i) { var q = pr(p); i ? sctx.lineTo(q.x, q.y) : sctx.moveTo(q.x, q.y); }); });
    sctx.stroke();
    sctx.beginPath();
    for (var i = 0; i < 28; i++) {
      var a = i / 28 * TAU, ca = Math.cos(a), sa = Math.sin(a);
      var back = Math.max(0, -ca * 0.75 - sa * 0.55);          // hair bulks out behind and above
      var rr = R * (1 + 0.5 * back);
      var q = pr({ x: P.hc.x + ca * rr, y: P.hc.y + sa * rr });
      i ? sctx.lineTo(q.x, q.y) : sctx.moveTo(q.x, q.y);
    }
    sctx.closePath(); sctx.fill();
    sctx.restore();
  }

  function drawWindow(cam, alpha, L, t) {
    if (alpha <= 0.004) return;
    var f = META.frame, o = META.outside, b = META.bird;
    ctx.save(); setCam(ctx, cam, DPR);
    // daylight in the glass
    ctx.fillStyle = 'rgba(255,253,245,' + (0.95 * L * alpha) + ')';
    PANES.forEach(function (q) { poly(ctx, grow(q, 1.6)); ctx.fill(); });
    // outdoors: tree and bird, clipped to the glass
    ctx.save();
    ctx.beginPath(); PANES.forEach(function (q) { q.forEach(function (p, i) { var x = p.x - ((i === 0 || i === 3) ? 3 : 0); i ? ctx.lineTo(x, p.y) : ctx.moveTo(x, p.y); }); ctx.closePath(); }); ctx.clip();
    // composed at the art's own resolution first, so the moving strips leave no seams
    octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(0, 0, outC.width, outC.height);
    var gust = gustAt(t), STRIP = 4;
    for (var y = 96; y < 728; y += STRIP) {
      var sway = gust * (1.5 * Math.sin(y * 0.041 + t * 5.1) + 0.9 * Math.sin(y * 0.093 - t * 7.7 + 1.7));
      octx.drawImage(atlas, o[0] + 146, o[1] + y, 384, STRIP, 146, y, 384 + sway * 1.6, STRIP);
    }
    var peck = peckAt(t) * Math.PI / 180;
    octx.translate(META.birdAt[0] + 50, META.birdAt[1] + 53); octx.rotate(peck);
    octx.drawImage(atlas, b[0], b[1], b[2], b[3], -50, -53, b[2], b[3]);
    ctx.globalAlpha = alpha * 0.94;
    ctx.drawImage(outC, 0, 0, f[2], f[3], WXO, WYO, f[2] * WS, f[3] * WS);
    ctx.restore();
    // the frame
    ctx.globalAlpha = alpha;
    ctx.drawImage(atlas, f[0], f[1], f[2], f[3], WXO, WYO, f[2] * WS, f[3] * WS);
    ctx.restore();
  }

  function drawFigure(cam, P, t, lit, boil, am, jit) {
    var h = META.head, hc = META.headC;
    ctx.save(); setCam(ctx, cam, DPR);
    if (jit) { ctx.translate((hash(jit) - 0.5) * 1.1, (hash(jit + 9) - 0.5) * 0.9); }
    ctx.lineCap = ctx.lineJoin = 'round';
    var limbs = figureLimbs(P), feet = [[P.legF.ankle, P.legF.toe], [P.legN.ankle, P.legN.toe]];
    // pencil lines: a solid pass and a looser one on top, re-drawn a little differently each flick
    ctx.strokeStyle = INK; ctx.globalAlpha = am * (0.9); ctx.lineWidth = 6.2;
    limbs.forEach(function (l, i) { limbPath(ctx, l, boil + i * 31); ctx.stroke(); });
    ctx.lineWidth = 7.6; feet.forEach(function (l, i) { limbPath(ctx, l, boil + 400 + i * 31); ctx.stroke(); });
    ctx.globalAlpha = am * (0.32); ctx.lineWidth = 2.4;
    limbs.forEach(function (l, i) { limbPath(ctx, l, boil * 1.7 + 900 + i * 13); ctx.stroke(); });
    // hands
    ctx.globalAlpha = am * (0.9); ctx.fillStyle = INK;
    [P.armF, P.armN].forEach(function (a) { ctx.save(); ctx.translate(a.hand.x, a.hand.y); ctx.rotate(a.a); ctx.beginPath(); ctx.ellipse(1, 0, 6.5, 4.6, 0, 0, TAU); ctx.fill(); ctx.restore(); });
    // light catching the side that faces the window
    if (lit > 0.01) {
      ctx.strokeStyle = '#fff8e8'; ctx.lineWidth = 2.6;
      limbs.concat(feet).forEach(function (l, i) {
        var mid = l[1], k = litAt(mid.x, -mid.y) * lit; if (k < 0.02) return;
        ctx.globalAlpha = am * (0.3 * k); ctx.save(); ctx.translate(2.2, -0.9); limbPath(ctx, l, boil + i * 31); ctx.stroke(); ctx.restore();
      });
    }
    // head: drawn in rings so the hair can lag behind the skull
    var hw = jit ? 1 : 0.4;
    ctx.translate(P.hc.x, P.hc.y); ctx.rotate(P.ha + (hash(boil + 3) - 0.5) * 0.02 * hw);
    ctx.scale(1 + (hash(boil + 5) - 0.5) * 0.013 * hw, 1 + (hash(boil + 6) - 0.5) * 0.013 * hw);
    // the whole head drawing turns a touch with the hair spring: the outline is a circle, so only the hair reads as moving
    ctx.globalAlpha = am * (1);
    ctx.save(); ctx.rotate(hair.a * 0.85);
    ctx.drawImage(atlas, h[0], h[1], h[2], h[3], -hc[0], -hc[1], h[2], h[3]);
    ctx.restore();
    // face light and form shadow
    var hl = lit * litAt(P.hc.x, -P.hc.y);
    if (hl > 0.01) {
      ctx.save(); ctx.beginPath(); ctx.arc(0, 0, R - 5.5, 0, TAU); ctx.clip();
      var g = ctx.createRadialGradient(44, -26, 4, 30, -14, 96);
      g.addColorStop(0, 'rgba(255,253,244,' + (0.6 * hl) + ')'); g.addColorStop(0.3, 'rgba(255,253,244,' + (0.42 * hl) + ')'); g.addColorStop(0.65, 'rgba(255,253,244,' + (0.16 * hl) + ')'); g.addColorStop(1, 'rgba(255,252,240,0)');
      ctx.fillStyle = g; ctx.fillRect(-R, -R, 2 * R, 2 * R);
      var d = ctx.createRadialGradient(-52, 30, 6, -40, 22, 84);
      d.addColorStop(0, 'rgba(48,38,30,' + (0.28 * hl) + ')'); d.addColorStop(0.5, 'rgba(48,38,30,' + (0.12 * hl) + ')'); d.addColorStop(1, 'rgba(48,38,30,0)');
      ctx.fillStyle = d; ctx.fillRect(-R, -R, 2 * R, 2 * R);
      ctx.restore();
    }
    // eye: a vertical dash that turns horizontal when he blinks
    var o = eyeOpen(t);
    ctx.strokeStyle = INK; ctx.globalAlpha = am * (0.93); ctx.lineWidth = 7.4; ctx.lineCap = 'round';
    ctx.beginPath();
    if (o > 0.9) { ctx.moveTo(33, -31); ctx.lineTo(41.5, 0); }
    else if (o > 0.2) { ctx.moveTo(35.5, -19); ctx.lineTo(39, -8); }
    else { ctx.moveTo(24, -9); ctx.lineTo(51, -11); }
    ctx.stroke();
    ctx.restore();
  }

  var lastSettled = false;
  function render(t) {
    var fq = Math.floor(t * FPS + 1e-6), tq = fq / FPS;
    var cam = camAt(t), P = pose(tq);
    var winA = sstep(TL.winA, TL.winA + 1.4, t), L = sstep(TL.light0, TL.tArr + 0.7, t) * winA;
    var moving = t < TL.tArr + 0.95, boil = (moving ? fq : Math.floor(t * 4)) * 13.37 + 1;
    var chestLit = L * litAt(P.sh.x, -P.sh.y + 0);
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = PAPER_LIT; ctx.fillRect(0, 0, canvas.width, canvas.height);
    // the room dims a touch around him so the daylight reads
    if (L > 0.001) {
      ctx.save(); setCam(ctx, cam, DPR);
      var g = ctx.createRadialGradient(40, -360, 260, 40, -360, 900);
      g.addColorStop(0, 'rgba(70,52,38,' + (0.3 * L) + ')'); g.addColorStop(0.55, 'rgba(70,52,38,' + (0.2 * L) + ')'); g.addColorStop(1, 'rgba(74,56,40,0)');
      ctx.fillStyle = g; ctx.fillRect(-3000, -3000, 6000, 6000); ctx.restore();
      drawLight(cam, L);
      ctx.imageSmoothingEnabled = true; ctx.drawImage(lightC, 0, 0, canvas.width, canvas.height);
    }
    // shadows: a small one from the room, a long one thrown by the window
    sctx.setTransform(1, 0, 0, 1, 0, 0); sctx.clearRect(0, 0, shadC.width, shadC.height);
    drawShadow(cam, P, { x: P.hip.x + 70, h: 2100, z: -260 }, 0.2 * (1 - 0.75 * chestLit), 13);
    drawShadow(cam, P, LIGHT, 0.58 * chestLit, 9);
    ctx.drawImage(shadC, 0, 0, canvas.width, canvas.height);
    drawWindow(cam, winA, L, t);
    drawFigure(cam, P, t, L, boil, 1, moving ? fq : 0);
    // dust in the shaft
    if (L > 0.05) {
      ctx.save(); setCam(ctx, cam, DPR); ctx.fillStyle = '#fffaf0';
      for (var i = 0; i < 16; i++) {
        var u = (hash(i * 9.1) + t * (0.012 + hash(i * 3.3) * 0.02)) % 1, v = hash(i * 5.7);
        var x = lerp(PB.x1 - 20, -260, u) + Math.sin(t * 0.7 + i) * 9, y = lerp(PB.y0 + 40, -40, u) + (v - 0.5) * 170;
        ctx.globalAlpha = 0.5 * L * Math.sin(Math.PI * u) * (0.4 + 0.6 * hash(i + Math.floor(t * 3)));
        ctx.beginPath(); ctx.arc(x, y, 1.5, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    // once settled, everything beyond his half of the page fades back to plain paper
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    var m = settleMode(), e = cam.e, cw = canvas.width, ch = canvas.height, fg;
    if (e > 0 && m === 'left') { fg = ctx.createLinearGradient(cw * 0.565, 0, cw * 0.7, 0); }
    else if (e > 0 && m === 'top') { fg = ctx.createLinearGradient(0, ch * 0.5, 0, ch * 0.6); }
    if (fg) { ctx.globalAlpha = e; fg.addColorStop(0, PAPER_LIT.replace('rgb(', 'rgba(').replace(')', ',0)')); fg.addColorStop(1, PAPER_LIT.replace('rgb(', 'rgba(').replace(')', ',1)')); ctx.fillStyle = fg; ctx.fillRect(0, 0, cw, ch); ctx.globalAlpha = 1; }
    // paper grain over everything, so the drawing sits in the page
    if (!grainPat) grainPat = ctx.createPattern(grain, 'repeat');
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; // the grain belongs to the page, so it pans and zooms with the camera
    var gk = DPR * cam.zoom * (0.85 / shotB().zoom), gx = (cam.sx - cam.cx * cam.zoom) * DPR, gy = (cam.sy - cam.cy * cam.zoom) * DPR;
    ctx.setTransform(gk, 0, 0, gk, gx, gy); ctx.fillStyle = grainPat;
    ctx.fillRect(-gx / gk - 1, -gy / gk - 1, cw / gk + 2, ch / gk + 2); ctx.restore();
  }
  function hexA(hex, a) {
    var n = parseInt(hex.replace('#', ''), 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  // ---------- run loop ----------
  var raf = 0, t0 = 0, playing = false, pendingPlay = false, dirty = true, lastFrame = -1, visible = true, destroyed = false, pausedAt = 0;
  function resize() {
    var r = container.getBoundingClientRect(); if (!r.width || !r.height) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2); W = r.width; H = r.height;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    lightC.width = Math.ceil(canvas.width * LS); lightC.height = Math.ceil(canvas.height * LS);
    shadC.width = Math.ceil(canvas.width * SS); shadC.height = Math.ceil(canvas.height * SS);
    grainPat = null;
    if (!TL || !playing) { buildTimeline(); buildEvents(); }
    dirty = true;
  }
  function now() { return performance.now() / 1000 * 1.3; } // playback speed
  function tick() {
    raf = 0; if (destroyed) return;
    if (playing && ready && visible) {
      var t = now() - t0, fq = Math.floor(t * FPS);
      lastFrame++;
      if (t < TL.cam1 + 0.2 || dirty || (lastFrame & 1)) {
        dirty = false;
        var tq = fq / FPS; simHair(tq); render(t);
        if (!lastSettled && t >= TL.cam1) { lastSettled = true; if (opts.onSettled) opts.onSettled(); if (opts.onComplete) opts.onComplete(); }
      }
    } else if (dirty && ready && TL) { dirty = false; simHair(Math.floor(pausedAt * FPS + 1e-6) / FPS); render(pausedAt); }
    raf = requestAnimationFrame(tick);
  }
  function start() {
    if (!ready) { pendingPlay = true; return; }
    resize(); buildTimeline(); buildEvents();
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && !opts.ignoreReducedMotion;
    t0 = now() - (reduce ? TL.cam1 : 0); lastSettled = false; lastFrame = -1; playing = true; hair.px = null;
  }
  var ro = window.ResizeObserver ? new ResizeObserver(resize) : null;
  if (ro) ro.observe(container); else window.addEventListener('resize', resize);
  var io = window.IntersectionObserver ? new IntersectionObserver(function (en) {
    var v = en[0].isIntersecting; if (v && !visible && playing) { t0 = now() - pausedAt; } if (!v && visible && playing) pausedAt = now() - t0; visible = v; }) : null;
  if (io) io.observe(canvas);
  resize(); raf = requestAnimationFrame(tick);
  if (opts.autoplay !== false) start();

  return {
    play: function () { if (!playing) start(); },
    restart: start,
    seek: function (t) { playing = false; if (!TL) { resize(); } hair.px = null; var a = Math.max(0, t - 1.2); simHair(a); simHair(Math.floor(t * FPS + 1e-6) / FPS); pausedAt = t; render(t); return TL; },
    isReady: function () { return ready && !!TL; },
    destroy: function () { destroyed = true; cancelAnimationFrame(raf); if (ro) ro.disconnect(); if (io) io.disconnect(); if (canvas.parentNode) canvas.parentNode.removeChild(canvas); }
  };
}
