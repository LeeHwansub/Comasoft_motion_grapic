// COMASOFT intro (5s) — render(t) 는 순수하게 시간 t(초)만으로 화면을 결정한다.
// 재생: requestAnimationFrame / 영상: window.renderAt(t) 로 프레임 단위 캡처.
(() => {
  const DURATION = 5;
  const params = new URLSearchParams(location.search);
  if (params.get('theme') === 'dark') document.documentElement.dataset.theme = 'dark';

  // ---- easing ----
  const E = {
    lin: x => x,
    out: x => 1 - (1 - x) ** 3,
    inOut: x => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2),
    expo: x => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
    back: x => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2,
  };

  // track: [[time, value, easeOfSegmentEndingHere], ...]
  const at = (track, t) => {
    if (t <= track[0][0]) return track[0][1];
    for (let i = 1; i < track.length; i++) {
      const [t1, v1, ease = 'inOut'] = track[i];
      const [t0, v0] = track[i - 1];
      if (t <= t1) return v0 + (v1 - v0) * E[ease]((t - t0) / (t1 - t0 || 1));
    }
    return track[track.length - 1][1];
  };

  // ---- timeline (1920x1080 좌표) ----
  // 01 0-1 IDEA / 02 1-2 AI / 03 2-3 MEET / 04 3-4 TRANSFORM / 05 4-5 COMASOFT
  const T = {
    circle: {
      cx: [[0, 560], [1, 560], [1.4, 360], [2, 400], [2.6, 820, 'expo'], [3, 830], [3.8, 900], [4.05, 900], [4.75, -40]],
      cy: [[0, 540], [4.05, 540], [4.75, 1180]],
      r:  [[0, 0], [0.45, 30, 'back'], [1, 30], [1.4, 10], [2, 10], [2.6, 290, 'expo'], [3, 290], [3.8, 250], [4.05, 250], [4.75, 520]],
    },
    square: {
      x:  [[1, 260], [1.85, 1290, 'out'], [2, 1290], [2.6, 1110, 'expo'], [3, 1100], [3.8, 1010], [4.05, 1010], [4.75, 1790]],
      y:  [[0, 540], [4.05, 540], [4.75, 1010]],
      s:  [[0, 340], [3, 340], [3.8, 320], [4.05, 320], [4.75, 420]],
      rx: [[0, 0], [3, 0], [3.7, 70], [4.05, 70], [4.75, 48]],
      rot:[[0, 0], [3, 0], [3.7, -10], [4.05, -10], [4.75, 0]],
      o:  [[0.98, 0], [1.08, 1], [4.05, 1], [4.75, 0.22]],
    },
    // 01 오른쪽 그라데이션 원 → 05 오른쪽 위 연한 원으로 재등장
    soft: {
      cx: [[0, 1780], [0.8, 1600, 'out'], [1.4, 1820], [4.2, 1820], [4.8, 1760, 'out']],
      cy: [[0, 470], [4.2, 470], [4.21, 90], [4.8, 110, 'out']],
      r:  [[0, 430], [4.2, 430], [4.21, 320]],
      o:  [[0, 0], [0.7, 1], [1.05, 1], [1.4, 0], [4.2, 0], [4.8, 0.85]],
    },
    overlap: { o: [[2.2, 0], [2.5, 1], [4.05, 1], [4.3, 0]] },
    orbit: {
      cx: [[0, 960], [4.05, 960], [4.75, 1900]],
      cy: [[0, 540], [4.05, 540], [4.75, -80]],
      r:  [[0, 760], [4.05, 760], [4.75, 520]],
      draw: [[0, 0], [1.2, 1, 'out']],
      o:  [[0, 0.9]],
    },
    dotline: { o: [[0, 0], [0.4, 1], [2.3, 1], [2.7, 0]], drift: [[0, 0], [3, -180, 'lin']] },
    net:   { draw: [[3, 0], [3.5, 1, 'out']], o: [[3, 1], [4.05, 1], [4.35, 0]] },
    spark: { o: [[4.3, 0], [4.7, 1]], r: [[4.3, 0], [4.7, 11, 'back']] },
    logo:  { o: [[4.15, 0], [4.7, 1, 'out']], y: [[4.15, 580], [4.75, 540, 'out']], ls: [[4.15, 40], [4.9, 6, 'out']] },
  };

  // scene 04 네트워크 라인/점
  const NET = [[600, 300], [960, 210], [1340, 330], [1420, 760], [980, 880], [560, 740]];
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const mk = (tag, parent, attrs = {}) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    parent.appendChild(el);
    return el;
  };
  const set = (el, attrs) => { for (const k in attrs) el.setAttribute(k, attrs[k]); };

  const netLines = NET.map((p, i) => {
    const q = NET[(i + 1) % NET.length];
    const len = Math.hypot(q[0] - p[0], q[1] - p[1]);
    return [mk('line', $('net'), { x1: p[0], y1: p[1], x2: q[0], y2: q[1], 'stroke-dasharray': len }), len];
  });
  const netDots = NET.map(p => mk('circle', $('net'), { cx: p[0], cy: p[1], r: 0 }));
  const ghosts = [0, 1, 2, 3].map(() => mk('rect', $('ghosts')));

  const orbitLen = 2 * Math.PI * 760;
  set($('orbit'), { 'stroke-dasharray': orbitLen });

  const squareAt = t => {
    const s = at(T.square.s, t), x = at(T.square.x, t), y = at(T.square.y, t);
    return { x: x - s / 2, y: y - s / 2, width: s, height: s, cx: x, cy: y };
  };

  function render(t) {
    t = Math.max(0, Math.min(DURATION, t));

    const o = T.orbit;
    set($('orbit'), {
      cx: at(o.cx, t), cy: at(o.cy, t), r: at(o.r, t), opacity: at(o.o, t),
      'stroke-dashoffset': orbitLen * (1 - at(o.draw, t)),
    });

    set($('dotline'), { opacity: at(T.dotline.o, t), 'stroke-dashoffset': at(T.dotline.drift, t) });
    set($('soft'), { cx: at(T.soft.cx, t), cy: at(T.soft.cy, t), r: at(T.soft.r, t), opacity: at(T.soft.o, t) });

    const c = T.circle;
    const circ = { cx: at(c.cx, t), cy: at(c.cy, t), r: at(c.r, t) };
    set($('circle'), circ);

    const sq = squareAt(t), rot = at(T.square.rot, t), rx = at(T.square.rx, t);
    const sqAttrs = { x: sq.x, y: sq.y, width: sq.width, height: sq.height, rx, transform: `rotate(${rot} ${sq.cx} ${sq.cy})` };
    set($('square'), { ...sqAttrs, opacity: at(T.square.o, t) });

    // scene 03~04 겹침 영역: 사각형으로 잘라낸 원을 남색으로
    set($('squareClip'), sqAttrs);
    set($('overlap'), { ...circ, opacity: at(T.overlap.o, t) });

    // scene 02 잔상: 과거 시점의 위치를 따라감
    const trail = at([[1, 0], [1.1, 1], [1.85, 1], [2.25, 0]], t);
    ghosts.forEach((g, i) => {
      const p = squareAt(t - 0.07 * (i + 1));
      set(g, { x: p.x, y: p.y, width: p.width, height: p.height, opacity: trail * (0.34 - i * 0.07) });
    });

    const nd = at(T.net.draw, t), no = at(T.net.o, t);
    $('net').setAttribute('opacity', no);
    netLines.forEach(([l, len]) => l.setAttribute('stroke-dashoffset', len * (1 - nd)));
    netDots.forEach((d, i) => d.setAttribute('r', i % 2 ? 6 * nd : 9 * nd));

    set($('spark'), { cx: 330, cy: 250, r: at(T.spark.r, t), opacity: at(T.spark.o, t) });

    const lg = T.logo;
    set($('logo'), { opacity: at(lg.o, t), y: at(lg.y, t), 'letter-spacing': at(lg.ls, t) });
  }

  // ---- 외부 인터페이스 ----
  window.renderAt = render;
  window.__ready = document.fonts.load('800 150px Montserrat').then(() => document.fonts.ready);

  const fixed = params.get('t');
  if (fixed !== null) { window.__ready.then(() => render(parseFloat(fixed) || 0)); return; }

  // 재생: 5초 + 1.2초 정지 후 반복, 클릭 시 처음부터
  const HOLD = 1.2;
  let start;
  window.__ready.then(() => {
    start = performance.now();
    const loop = now => {
      render(((now - start) / 1000) % (DURATION + HOLD));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
  document.addEventListener('click', () => { start = performance.now(); });
})();
