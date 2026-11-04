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
      cx: [[0, 560], [1, 560], [1.4, 360], [2, 400], [2.6, 820, 'expo'], [3, 830], [3.6, 813, 'out'], [4.05, 813], [4.75, -40]],
      cy: [[0, 540], [4.05, 540], [4.75, 1180]],
      r:  [[0, 0], [0.45, 30, 'back'], [1, 30], [1.4, 10], [2, 10], [2.6, 290, 'expo'], [3, 290], [3.6, 216, 'out'], [4.05, 216], [4.75, 520]],
    },
    square: {
      x:  [[1, 260], [1.85, 1290, 'out'], [2, 1290], [2.6, 1110, 'expo'], [3, 1100], [3.6, 1208, 'out'], [4.05, 1208], [4.75, 1790]],
      y:  [[0, 540], [4.05, 540], [4.75, 1010]],
      // s: 높이, w: 너비 — 04 에서 세로로 긴 직사각형이 됨 (상세 시안)
      s:  [[0, 340], [3, 340], [3.6, 386, 'out'], [4.05, 386], [4.75, 420]],
      w:  [[0, 340], [3, 340], [3.6, 230, 'out'], [4.05, 230], [4.75, 420]],
      rx: [[0, 0], [4.05, 0], [4.75, 48]],
      rot:[[0, 0]],
      o:  [[0.98, 0], [1.08, 1], [4.05, 1], [4.75, 0.22]],
    },
    // 01 오른쪽 그라데이션 원 → 05 오른쪽 위 연한 원으로 재등장
    soft: {
      cx: [[0, 1780], [0.8, 1600, 'out'], [1.4, 1820], [4.2, 1820], [4.8, 1760, 'out']],
      cy: [[0, 470], [4.2, 470], [4.21, 90], [4.8, 110, 'out']],
      r:  [[0, 430], [4.2, 430], [4.21, 320]],
      o:  [[0, 0], [0.7, 1], [1.05, 1], [1.4, 0], [4.2, 0], [4.8, 0.85]],
    },
    overlap: { o: [[2.2, 0], [2.5, 1], [3.1, 1], [3.35, 0]] },
    // 04 키프레임: 3.0 형태 회전 → 3.3 곡선 변형 → 3.7 형태 정렬 → 4.0 완성
    fuse: {
      o:    [[3, 0], [3.25, 1], [3.95, 1], [4.25, 0]],         // 융합 레이어 표시
      rot:  [[3, -35], [3.7, 0, 'out']],                        // 형태 회전 (deg)
      m:    [[3.15, 0], [3.7, 1, 'out']],                       // 곡선 변형 정도
    },
    orbit: {
      cx: [[0, 960], [4.05, 960], [4.75, 1900]],
      cy: [[0, 540], [4.05, 540], [4.75, -80]],
      r:  [[0, 760], [4.05, 760], [4.75, 520]],
      draw: [[0, 0], [1.2, 1, 'out']],
      o:  [[0, 0.9], [2.9, 0.9], [3.1, 0], [4.05, 0], [4.4, 0.9]],   // 04 동안 숨김
    },
    dotline: { o: [[0, 0], [0.4, 1], [2.3, 1], [2.7, 0]], drift: [[0, 0], [3, -180, 'lin']] },
    net:   { draw: [[3, 0], [3.5, 1, 'out']], o: [[3, 1], [4.05, 1], [4.35, 0]] },
    spark: { o: [[4.3, 0], [4.7, 1]], r: [[4.3, 0], [4.7, 11, 'back']] },
    logo:  { o: [[4.15, 0], [4.7, 1, 'out']], y: [[4.15, 580], [4.75, 540, 'out']], ls: [[4.15, 40], [4.9, 6, 'out']] },
  };

  // scene 04 네트워크 라인/점
  // scene 04 열린 선/호 (화면 밖으로 이어짐): path d 문자열
  // (상세 시안 04 좌표를 화면 비율로 환산)
  const NET = [
    'M159,0 L159,1080',                      // 왼쪽 세로 가이드
    'M0,690 Q760,330 1920,250',              // 왼쪽 아래 → 오른쪽 위로 휘는 선
    'M1650,120 Q1620,640 870,776',           // 오른쪽 위 → 도형 아래로 감싸는 호
    'M504,624 Q540,700 680,705',             // 왼쪽 아래 작은 호
    'M1323,611 L1776,773', 'M1086,732 L1776,529', 'M1776,529 L1776,776',   // 오른쪽 아래 교차선
  ];
  // [x, y, 종류(dot|sq|bsq)]
  const NET_NODES = [[159, 405, 'dot'], [159, 621, 'dot'], [1634, 297, 'dot'], [1776, 529, 'dot'],
    [1776, 776, 'dot'], [1330, 636, 'dot'], [870, 776, 'dot'], [1296, 739, 'bsq']];
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const mk = (tag, parent, attrs = {}) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    parent.appendChild(el);
    return el;
  };
  const set = (el, attrs) => { for (const k in attrs) el.setAttribute(k, attrs[k]); };

  const netLines = NET.map(d => mk('path', $('net'), { d, pathLength: 1, 'stroke-dasharray': 1 }));
  const netDots = NET_NODES.map(([x, y, kind]) => kind === 'dot'
    ? mk('circle', $('net'), { cx: x, cy: y, r: 0, class: 'blue' })
    : mk('rect', $('net'), { x: x - 6, y: y - 6, width: 12, height: 12, class: kind === 'bsq' ? 'blue' : '' }));
  const ghosts = [0, 1, 2, 3].map(() => mk('rect', $('ghosts')));

  const orbitLen = 2 * Math.PI * 760;
  set($('orbit'), { 'stroke-dasharray': orbitLen });

  const squareAt = t => {
    const s = at(T.square.s, t), w = at(T.square.w, t), x = at(T.square.x, t), y = at(T.square.y, t);
    return { x: x - w / 2, y: y - s / 2, width: w, height: s, cx: x, cy: y };
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

    // scene 04 융합: 실루엣(원+직사각형)은 유지, 안쪽 색이 휘감기며 하나로 녹아듦
    const fo = at(T.fuse.o, t), m = at(T.fuse.m, t);
    $('circle').setAttribute('opacity', 1 - fo);                       // 기본 도형은 숨겨 비침 방지
    $('square').setAttribute('opacity', at(T.square.o, t) * (1 - fo));
    set($('square4'), sqAttrs);
    $('fused').setAttribute('opacity', fo);
    if (fo > 0) {
      // 상세 시안 비율: 원 오른쪽 위에 돌출부(lobe)가 붙고, 그 아래가 S 곡선으로 파여
      // 원 아래쪽 끝(spike)까지 내려감. 파인 자리는 밝은 접힘면이 되어 직사각형 아래와 이어짐.
      const { cx, cy, r } = circ, P = (a, R, ox = cx, oy = cy) => [ox + R * Math.cos(a), oy + R * Math.sin(a)];
      const deg = Math.PI / 180;
      // 몸체 = 가로로 조금 긴 타원, 오른쪽 아래를 S 곡선으로 파냄 (r 단위 좌표는 상세 시안에서 측정)
      const ex0 = cx + 0.11 * r, rx = 1.11 * r, ry = r;
      const ep = a => [ex0 + rx * Math.cos(a * deg), cy + ry * Math.sin(a * deg)];
      const U = (u, v) => [cx + u * r, cy + v * r];
      const mix = (a, b) => [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m];
      const E = ep(8), spike = ep(80);                          // 파이기 시작점(오른쪽) / 아래 끝
      // m=0 이면 곡선이 타원 둘레를 따라가고(파임 없음), m=1 이면 시안의 S 곡선
      const k1 = mix(ep(25), U(1.19, 0.26)), k2 = mix(ep(35), U(0.89, 0.2)), M1 = mix(ep(45), U(0.575, 0.24));
      const k3 = mix(ep(55), U(0.356, 0.29)), k4 = mix(ep(70), U(0.29, 0.69));
      const S = `C${k1} ${k2} ${M1} C${k3} ${k4} ${spike}`;
      $('body').setAttribute('d', `M${spike} A${rx},${ry} 0 1 1 ${E} ${S} Z`);
      const sl = sq.x, sb = sq.y + sq.height;
      $('fold').setAttribute('d', `M${E} ${S} L${sl},${sb} L${sl},${E[1] - 0.1 * r} Z`);
      $('fold').setAttribute('opacity', m);
      // 형태 회전: 원과 직사각형 사이 중심을 기준으로
      const pivot = [(cx - r + sq.x + sq.width) / 2, cy];
      $('fused').setAttribute('transform', `rotate(${at(T.fuse.rot, t)} ${pivot})`);
    }

    // scene 02 잔상: 과거 시점의 위치를 따라감
    const trail = at([[1, 0], [1.1, 1], [1.85, 1], [2.25, 0]], t);
    ghosts.forEach((g, i) => {
      const p = squareAt(t - 0.07 * (i + 1));
      set(g, { x: p.x, y: p.y, width: p.width, height: p.height, opacity: trail * (0.34 - i * 0.07) });
    });

    const nd = at(T.net.draw, t), no = at(T.net.o, t);
    $('net').setAttribute('opacity', no);
    netLines.forEach(l => l.setAttribute('stroke-dashoffset', 1 - nd));
    netDots.forEach(d => d.tagName === 'circle' ? d.setAttribute('r', 6 * nd) : d.setAttribute('opacity', nd));

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
