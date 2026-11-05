// COMASOFT intro v5 — 룩 테스트 (01 IDEA → 02 AI → 03 MEET → 04 TRANSFORM → 05 COMASOFT, 0 ~ 5.0s)
// 04: 원과 사각형이 태극처럼 휘감기며 경계 없는 하나의 원이 되고(네트워크가 원을 엮어 냄),
//     옅어지며 입자로 좌우로 흩어져 05 로 이어진다.
// 05: 흩어진 입자가 왼쪽 아래 원 · 오른쪽 아래 사각형으로 흘러들어 도형이 되고, 로고와 슬로건이 나타나며 멈춘다.
// render(t) 는 시간 t(초)만으로 화면을 결정한다 → 실시간 재생과 프레임 캡처가 같은 결과.
//   ?t=3.4          고정 프레임
//   ?theme=dark     다크 테마
//   ?from=0&to=5.4  재생 구간 (한 번 재생 후 to 에서 정지. 5.0 이후는 최종 정지 화면)
// 텍스트 · 로고 내용은 content.js
(() => {
  const q = new URLSearchParams(location.search);
  const root = document.documentElement;
  const setTheme = name => { root.dataset.theme = name; };
  setTheme(q.get('theme') === 'dark' ? 'dark' : 'light');
  const FROM = parseFloat(q.get('from') ?? '0'), TO = parseFloat(q.get('to') ?? '5.4');
  const isDark = () => root.dataset.theme === 'dark';
  const CONTENT = window.INTRO_CONTENT;

  // ---------------------------------------------------------------- 색
  // 라이트 값은 시안(comasoft4_detail / COMASOFT4)에서 샘플링한 색.
  // 다크는 같은 단계를 반전: 밝은 면 → 깊은 남색, 짙은 면 → 밝은 블루.
  const PAL = {
    light: {
      bg: '#f7f9fe', haze: 'rgba(196,214,253,', glow: 'rgba(120,160,255,',
      circle: ['#8ab0fd', '#4784fb', '#0a56fc'],
      rect: ['#0956fd', '#1d63fd', '#5a8ffe'],
      navy: ['#011a7f', '#022692'],
      rectPale: ['#dbe6fe', '#b1c8fd', '#8eb0fd'], ghost: '#7ba6fe',
      soft1: ['rgba(214,227,254,0)', 'rgba(170,198,253,.75)', 'rgba(128,166,252,.95)'], arc1: '#4f7dff',
      // 태극 위쪽(원에서 온 쪽): 머리가 짙고 꼬리로 갈수록 밝아짐
      yang: ['#0038e6', '#0a56fc', '#4f88fb', '#a9c4fc'],
      // 태극 아래쪽(사각형에서 온 쪽): 원뿔 그라데이션으로 휘감기는 밝은 면
      yin: [[0, '#d9e5fe'], [.2, '#b6cefd'], [.42, '#7ba6fe'], [.6, '#3f7dfe'], [.78, '#9dbcfd'], [1, '#d9e5fe']],
      crease: '#0a3fe0', rim: 'rgba(255,255,255,',
      dotA: ['#0a56fc', '#4f88fb'], dotB: ['#7ba6fe', '#c4d6fe'],
      // 하나가 된 원: 짙은 블루 → 밝은 블루 한 면, 안쪽에 아주 옅은 소용돌이
      one: ['#0034d6', '#0a56fc', '#3f7cfb', '#8fb2fd', '#d4e2fe'],
      // 구: 하이라이트 → 중간 → 짙은 면 → 가장자리 그림자 (빛은 왼쪽 위에서)
      sphere: ['#5b8efc', '#1f60fc', '#4f88fb', '#a9c4fc', '#dde8fe'],
      rimLight: 'rgba(240,245,255,', shade: 'rgba(30,60,150,', floor: 'rgba(40,70,170,', shadeA: [0, 0], netA: 1,
      c5: ['#0a56fc', '#4f88fb', '#d0defe'], r5: ['rgba(160,190,253,.62)', 'rgba(214,227,254,.4)'], r5line: 'rgba(255,255,255,0)',
      arc5: '#4f7dff', arc5fill: 'rgba(190,210,253,', dot5: '#1f5bff', sheen5: 'rgba(255,255,255,',
      netIn: 'rgba(255,255,255,', netOut: 'rgba(31,91,255,', node: '#ffffff', nodeOut: '#1f5bff',
    },
    dark: {
      bg: '#0a090a', haze: 'rgba(16,36,110,', glow: 'rgba(40,100,255,',
      circle: ['#0a2a8f', '#0843cf', '#2a6bff'],
      rect: ['#1f5bff', '#1747d8', '#0d2a85'],
      navy: ['#01061f', '#020b33'],
      rectPale: ['#0c1a4c', '#122d80', '#1a3fae'], ghost: '#1d4fd6',
      soft1: ['rgba(12,30,100,0)', 'rgba(18,44,140,.7)', 'rgba(26,62,190,.9)'], arc1: 'rgba(170,195,255,.8)',
      yang: ['#5a8dff', '#3d7bff', '#1d55f0', '#11318f'],
      yin: [[0, '#070f2e'], [.2, '#0a1a50'], [.42, '#112c82'], [.6, '#1842b8'], [.78, '#0c2268'], [1, '#070f2e']],
      crease: '#7aa3ff', rim: 'rgba(150,185,255,',
      dotA: ['#3d7bff', '#7aa3ff'], dotB: ['#173fae', '#2a5bd8'],
      one: ['#6f9bff', '#3d7bff', '#1d55f0', '#11318f', '#081a52'],
      sphere: ['#3f74ff', '#1f5bff', '#1747d8', '#0c2a8c', '#0a1a55'],
      rimLight: 'rgba(110,150,255,', shade: 'rgba(0,4,24,', floor: 'rgba(0,0,0,', shadeA: [.08, .2], netA: .8,
      c5: ['#2a6bff', '#123fc4', '#0a1f6b'], r5: ['rgba(16,40,130,.9)', 'rgba(10,26,90,.7)'], r5line: 'rgba(70,120,255,.55)',
      arc5: 'rgba(225,232,255,.85)', arc5fill: 'rgba(20,40,120,', dot5: '#2a6bff', sheen5: 'rgba(130,170,255,',
      netIn: 'rgba(200,220,255,', netOut: 'rgba(110,150,255,', node: '#dbe7ff', nodeOut: '#5a8dff',
    },
  };
  const pal = () => PAL[root.dataset.theme] || PAL.light;

  // ---------------------------------------------------------------- 이징 / 트랙
  const E = {
    lin: x => x,
    out: x => 1 - (1 - x) ** 3,
    in: x => x * x * x,
    inOut: x => (x < .5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
    quint: x => (x < .5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2),
    expo: x => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
    back: x => 1 + 2.2 * (x - 1) ** 3 + 1.2 * (x - 1) ** 2,
  };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  // [[time, value, easeOfSegmentEndingHere], ...]
  const at = (tr, t) => {
    if (t <= tr[0][0]) return tr[0][1];
    for (let i = 1; i < tr.length; i++) {
      const [t1, v1, e = 'inOut'] = tr[i], [t0, v0] = tr[i - 1];
      if (t <= t1) return v0 + (v1 - v0) * E[e]((t - t0) / (t1 - t0 || 1));
    }
    return tr[tr.length - 1][1];
  };

  // ---------------------------------------------------------------- 레이아웃 (디자인 좌표)
  // land: 가로 16:9 (시안 COMASOFT4 좌표 → 1920x1080)
  // port: 세로 9:16 (1080x1920, 시안에 없는 구도 — 같은 모션을 세로 화면에 다시 배치)
  // safe: 화면이 디자인 비율과 달라도 항상 보여야 하는 가운데 영역 [w, h]
  const LAYOUTS = {
    land: {
      W: 1920, H: 1080, safe: [1100, 700],
      tracks: {
        // 원: 점으로 태어나 왼쪽으로 이동 → 원으로 커짐 → 02 동안 선 위의 점으로 작아짐 → 03 에서 다시 커짐
        cx:  [[0, 960], [.18, 960], [.52, 431, 'expo'], [1.0, 431], [1.28, 330], [1.75, 330], [2.0, 600], [2.3, 690], [2.7, 753, 'expo'], [3.0, 760]],
        cy:  [[0, 546]],
        r:   [[0, 0], [.14, 11, 'back'], [.36, 12], [.66, 77, 'back'], [1.0, 77], [1.28, 9], [1.75, 9], [2.0, 165, 'expo'], [2.3, 215], [2.7, 300, 'expo'], [3.0, 287]],
        // 사각형: 같은 크기로 왼쪽에서 미끄러져 들어와 감속하며 멈춤(잔상이 따라옴) → 03 으로 이어짐
        rx:  [[1.0, 260], [1.85, 1290, 'out'], [2.0, 1290], [2.3, 1130], [2.7, 1143, 'expo'], [3.0, 1143]],
        ry:  [[0, 540]],
        rw:  [[1.0, 340], [2.0, 340], [2.3, 380], [2.7, 520, 'expo'], [3.0, 503]],
        rh:  [[1.0, 340], [2.0, 340], [2.3, 330], [2.7, 470, 'expo'], [3.0, 456]],
        // 01 오른쪽 큰 옅은 원
        s1r: [[.38, 400], [1.05, 563, 'out']],
      },
      s1: [1773, 394],
      TC: [960, 543], TR: 318,
      C5: { x: 205, y: 1066, r: 422 }, R5: { x: 1404, y: 793, w: 600, h: 330, rx: 34 },
      ARC5: { x: 1856, y: -41, r: 495 }, DOT5: { x: 122, y: 321, r: 14 },
      LOGO5: { x: 472, y: 494, w: 976 },                     // 로고 왼쪽 위 / 너비 (캡 높이 ≈ 95)
      slogan: { x: 960, y: 650, size: 19, ls: [14, 8] },     // ls: 등장 전 → 정지 시 자간
      blobs: [[1720, 1120, 620, .85], [1880, 40, 520, .45], [80, 980, 520, .3]],   // 배경 연한 빛 면
      flare: [960, 541], flareR: [700, 300], bloomR: [520, 260],
      lines: [
        { // 01 IDEA
          guides: ['M0,546 H1920', 'M96,0 V1080', 'M1577,0 V1080'],
          paths: ['M717,0 C770,330 1050,560 1577,546', 'M1139,652 Q1185,830 1370,1000'],
          dots: [[96, 546, 6], [1577, 546, 7], [1139, 652, 8],
                 ...Array.from({ length: 22 }, (_, i) => [560 + i * 52, 546, i % 3 === 0 ? 3.6 : 2.6])],
          sqs: [],
        },
        { // 02 AI
          guides: ['M1514,0 V1080', 'M698,430 V640', 'M380,500 V650'],
          paths: [],
          dots: [[62, 546, 3.5], [164, 546, 3.5], [484, 546, 3], [698, 546, 3], [920, 546, 3], [1013, 546, 3]],
          sqs: [[270, 546, 12], [380, 546, 10], [591, 546, 26]],
          hollows: [[1745, 546, 30]],
        },
        { // 03 MEET
          guides: ['M0,546 H1920', 'M965,0 V1080', 'M1574,66 L1331,316'],
          paths: ['M640,40 Q380,230 243,459', 'M242,645 L470,553', 'M758,934 L1011,662',
                  'M1395,312 L1505,388', 'M1505,388 A736,736 0 0 1 1888,1040'],
          dots: [[243, 459, 9], [119, 548, 5], [119, 645, 5], [758, 934, 7], [1617, 397, 4], [1640, 486, 4], [1505, 486, 4], [965, 546, 5]],
          sqs: [[242, 645, 38], [1505, 388, 30]],
        },
        { // 04 TRANSFORM
          guides: ['M92,0 V1080'],
          paths: ['M90,358 Q560,410 1370,688 T1920,990', 'M0,714 Q700,250 1587,171',
                  'M1587,171 C1610,520 1330,770 851,934', 'M1216,791 L1805,567', 'M1805,567 V932'],
          dots: [[90, 669, 6], [529, 432, 6], [1370, 688, 6], [1805, 932, 6], [1114, 829, 5]],
          sqs: [[1805, 567, 16], [851, 934, 14], [1367, 938, 14]],
          inks: [[90, 358, 16], [1587, 171, 18]],
        },
      ],
    },
  };
  // 세로: 가운데 가로선 y=900. 01·02 는 같은 선 위의 가로 이동, 03 은 원(위)·사각형(오른쪽 아래)이 대각선으로 겹침,
  //       04 는 화면 가운데 구, 05 는 로고 아래 왼쪽 아래 원 · 오른쪽 아래 사각형 · 오른쪽 위 원호.
  //       폰(≈9:19.5)에서는 x 80~1000 정도가 보이므로 주요 요소는 그 안에 둔다.
  LAYOUTS.port = {
    W: 1080, H: 1920, safe: [920, 1300],
    tracks: {
      cx:  [[0, 540], [.18, 540], [.52, 300, 'expo'], [1.0, 300], [1.28, 220], [1.75, 220], [2.0, 380], [2.3, 430], [2.7, 447, 'expo'], [3.0, 450]],
      cy:  [[0, 900], [1.75, 900], [2.0, 810], [2.3, 780], [2.7, 762, 'expo'], [3.0, 760]],
      r:   [[0, 0], [.14, 11, 'back'], [.36, 12], [.66, 70, 'back'], [1.0, 70], [1.28, 9], [1.75, 9], [2.0, 145, 'expo'], [2.3, 190], [2.7, 262, 'expo'], [3.0, 250]],
      rx:  [[1.0, 120], [1.85, 700, 'out'], [2.0, 700], [2.3, 630], [2.7, 640, 'expo'], [3.0, 640]],
      ry:  [[0, 900], [2.0, 900], [2.3, 1030], [2.7, 1062, 'expo'], [3.0, 1060]],
      rw:  [[1.0, 300], [2.0, 300], [2.3, 340], [2.7, 435, 'expo'], [3.0, 420]],
      rh:  [[1.0, 300], [2.0, 300], [2.3, 290], [2.7, 415, 'expo'], [3.0, 400]],
      s1r: [[.38, 330], [1.05, 450, 'out']],
    },
    s1: [1010, 560],
    TC: [540, 900], TR: 300,
    C5: { x: 150, y: 1780, r: 400 }, R5: { x: 690, y: 1560, w: 520, h: 400, rx: 34 },
    ARC5: { x: 1040, y: -20, r: 420 }, DOT5: { x: 140, y: 470, r: 14 },
    LOGO5: { x: 160, y: 863, w: 760 },
    slogan: { x: 540, y: 1002, size: 24, ls: [14, 8] },
    blobs: [[960, 1950, 600, .85], [1060, 60, 480, .45], [60, 1500, 480, .3]],
    flare: [540, 900], flareR: [600, 260], bloomR: [460, 230],
    lines: [
      { // 01 IDEA
        guides: ['M-200,900 H1280', 'M110,-400 V2320', 'M930,-400 V2320'],
        paths: ['M420,-60 C470,420 640,840 930,900', 'M700,1010 Q740,1210 900,1380'],
        dots: [[110, 900, 6], [930, 900, 7], [700, 1010, 8],
               ...Array.from({ length: 12 }, (_, i) => [400 + i * 48, 900, i % 3 === 0 ? 3.6 : 2.6])],
        sqs: [],
      },
      { // 02 AI
        guides: ['M900,-400 V2320', 'M440,790 V1000', 'M262,840 V990'],
        paths: [],
        dots: [[120, 900, 3.5], [165, 900, 3.5], [330, 900, 3], [440, 900, 3], [500, 900, 3], [540, 900, 3]],
        sqs: [[180, 900, 12], [262, 900, 10], [390, 900, 24]],
        hollows: [[960, 900, 28]],
      },
      { // 03 MEET
        guides: ['M-200,900 H1280', 'M540,-400 V2320', 'M1000,420 L800,640'],
        paths: ['M560,380 Q330,450 180,640', 'M190,1120 L390,1040', 'M330,1460 L520,1262',
                'M860,700 L950,780', 'M950,780 A700,700 0 0 1 1060,1500'],
        dots: [[180, 640, 9], [120, 880, 5], [120, 980, 5], [330, 1460, 7], [985, 830, 4], [1000, 920, 4], [900, 920, 4], [540, 900, 5]],
        sqs: [[190, 1120, 34], [950, 780, 28]],
      },
      { // 04 TRANSFORM
        guides: ['M110,-400 V2320'],
        paths: ['M110,640 Q330,700 760,1080 T1080,1400', 'M-20,1220 Q420,700 930,560',
                'M930,560 C950,900 780,1150 420,1340', 'M640,1260 L990,1120', 'M990,1120 V1400'],
        dots: [[110, 1060, 6], [320, 735, 6], [760, 1080, 6], [990, 1400, 6], [600, 1300, 5]],
        sqs: [[990, 1120, 16], [420, 1340, 14], [780, 1420, 14]],
        inks: [[110, 640, 16], [930, 560, 18]],
      },
    ],
  };

  function buildScene(LY) {
    const { W, H } = LY;
    // ---------------------------------------------------------------- 타임라인 (좌표 트랙은 LY.tracks)
    // 03  2.00 요소 이동 → 2.30 교차·결합 → 2.70 형태 확장 → 3.00 안정화
    // 04  3.00 휘감기 시작 → 3.55 하나의 원(태극) → 3.90 회전하며 머묾 → 4.0~4.8 옅어지며 흩어짐
    // 01  0.00 배경 대기 → 0.25 점 이동 → 0.50 원형 등장 → 1.00 확대 및 정지
    // 02  1.00 사각형 등장 → 1.30 회전 및 이동 → 1.60 블루 컬러 강조 → 2.00 정렬 및 전환
    const T = {
      ...LY.tracks,
      cA:  [[0, 1], [1.78, 1], [2.0, .6], [2.4, 1, 'out']],
      rA: [[.98, 0], [1.08, 1, 'out']],
      rRot:[[0, 0]],
      rSat:[[1.25, 0], [1.62, 1, 'out']],                     // 1.60 블루 컬러 강조 (한 방향으로만)
      trail:[[1.0, 0], [1.1, 1], [1.85, 1], [2.25, 0]],       // 잔상
      // 01 오른쪽 큰 옅은 원
      s1:  [[.38, 0], [.9, 1, 'out'], [1.08, 1], [1.4, 0]],
      l1draw: [[.05, 0], [.95, 1, 'out']],
      l1o:  [[0, 1], [1.02, 1], [1.3, 0]],
      l2draw: [[1.0, 0], [1.55, 1, 'out']],
      l2o:  [[1.0, 1], [1.85, 1], [2.05, 0]],
      ov:  [[2.12, 0], [2.45, 1, 'out'], [3.05, 1], [3.3, 0]],
      // 04
      m:     [[3.0, 0], [3.6, 1, 'quint']],                  // 두 도형이 휘감기며 한 원으로
      spin:  [[3.0, -120], [3.6, 0, 'out'], [5.0, 16, 'lin']],   // 휘감기는 회전(deg)
      unify: [[3.25, 0], [3.56, 1, 'out']],                    // 경계 없는 하나의 원
      net:   [[3.15, 0], [3.85, 1, 'out']],                    // 네트워크가 원을 엮어 냄
      netGlow: [[3.6, 0], [3.82, 1, 'out'], [4.1, .55]],
      globe: [[3.1, -1.1], [4.6, .55, 'lin']],               // 네트워크 구 회전 (rad, 세로축)
      fade:  [[4.06, 1], [4.3, 0, 'inOut']],                  // 깎이고 남은 가운데가 마지막에 옅어짐
      grow:  [[3.95, 1], [4.46, 1.03, 'out']],
      burst: [[3.92, 0], [4.86, 1, 'lin']],                   // 좌우로 흩어짐 진행
      // 05  4.00 로고 등장 → 4.30 슬로건 → 4.70 라이트 확산 → 5.00 최종 정지
      s5c:   [[4.22, 0], [4.78, 1, 'out']],                   // 왼쪽 아래 원 (입자가 모여 생김)
      s5r:   [[4.3, 0], [4.85, 1, 'out']],                    // 오른쪽 아래 사각형
      s5arc: [[4.3, 0], [4.95, 1, 'out']],                    // 오른쪽 위 원호
      s5dot: [[4.5, 0], [4.72, 1, 'back']],
      logo:  [[4.28, 0], [4.86, 1, 'out']],                   // 글자가 모이며 등장
      slogan:[[4.55, 0], [4.98, 1, 'out']],
      flare: [[4.62, 0], [4.78, 1, 'out'], [5.15, .28]],      // 라이트 확산
      sweep: [[4.62, 0], [5.05, 1, 'inOut']],
      bloom: [[2.4, 0], [2.7, 1, 'out'], [3.1, .3], [3.65, .9, 'out'], [4.0, .45], [4.6, 0]],
      l3draw: [[2.0, 0], [2.65, 1, 'out']],
      l3o:  [[1.8, 0], [2.0, 1], [3.0, 1], [3.25, 0]],
      l4draw: [[3.15, 0], [3.8, 1, 'out']],
      l4o:  [[3.1, 0], [3.2, 1], [4.1, 1], [4.6, 0]],
    };
    const { TC, TR } = LY;                                   // 하나가 된 원의 중심 / 반지름

    const D2R = Math.PI / 180;
    const state = t => {
      const s = { t };
      for (const k in T) s[k] = at(T[k], t);
      return s;
    };

    // ---------------------------------------------------------------- 외곽선 샘플링
    const N = 220;
    const resample = (poly, n) => {                          // 닫힌 다각형을 둘레 길이 기준 n점으로
      const seg = [], L = [0];
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i], b = poly[(i + 1) % poly.length];
        seg.push([a, b]); L.push(L[i] + Math.hypot(b[0] - a[0], b[1] - a[1]));
      }
      const total = L[L.length - 1], out = [];
      let j = 0;
      for (let k = 0; k < n; k++) {
        const d = total * k / n;
        while (L[j + 1] < d) j++;
        const [a, b] = seg[j], u = (d - L[j]) / (L[j + 1] - L[j] || 1);
        out.push([a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]);
      }
      return out;
    };
    const arc = (cx, cy, r, a0, a1, n) => Array.from({ length: n }, (_, i) => {
      const a = a0 + (a1 - a0) * i / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    // 태극 위쪽 곡옥(단위 원): 위 반원 + 왼쪽 아래로 불룩한 머리 − 오른쪽 위로 파인 꼬리
    const YANG = resample([
      ...arc(0, 0, 1, Math.PI, Math.PI * 2, 120),            // 바깥 위 반원 (왼→오, 시계 방향)
      ...arc(.5, 0, .5, Math.PI * 2, Math.PI, 60),           // 오른쪽 작은 반원: 위로 휘며 중심으로
      ...arc(-.5, 0, .5, 0, Math.PI, 60),                    // 왼쪽 작은 반원: 아래로 휘며 왼쪽 끝으로
    ], N);
    const YIN = YANG.map(([x, y]) => [-x, -y]);               // 180° 회전 = 아래쪽 곡옥
    const toWorld = (pts, s) => {
      const a = s.spin * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), R = TR * s.grow;
      return pts.map(([x, y]) => [TC[0] + R * (x * c - y * sn), TC[1] + R * (x * sn + y * c)]);
    };
    const SRC = state(3.0);                                   // 변형 출발점: 03 안정화 상태
    const srcCircle = resample(arc(SRC.cx, SRC.cy, SRC.r, 0, Math.PI * 2, 360), N);
    const rb = { x: SRC.rx - SRC.rw / 2, y: SRC.ry - SRC.rh / 2, w: SRC.rw, h: SRC.rh };
    const srcRect = resample([[rb.x, rb.y], [rb.x + rb.w, rb.y], [rb.x + rb.w, rb.y + rb.h], [rb.x, rb.y + rb.h]], N);
    // 출발점-도착점 대응: 이동 거리 합이 최소가 되는 시작 인덱스 (변형이 꼬이지 않게)
    const bestShift = (src, tgt) => {
      let best = 0, min = Infinity;
      for (let k = 0; k < N; k++) {
        let d = 0;
        for (let i = 0; i < N; i += 4) { const a = src[i], b = tgt[(i + k) % N]; d += (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2; }
        if (d < min) { min = d; best = k; }
      }
      return best;
    };
    const END = state(3.6);
    const shiftA = bestShift(srcCircle, toWorld(YANG, END)), shiftB = bestShift(srcRect, toWorld(YIN, END));
    const morph = (src, tgt, k, m) => src.map((a, i) => { const b = tgt[(i + k) % N]; return [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m]; });

    // ---------------------------------------------------------------- 입자 · 네트워크 (결정적 난수 → 같은 t 면 같은 화면)
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    // 좌우로 흩어지는 법칙
    //  - 원은 양옆 가장자리부터 안쪽으로 깎여 나가고(ERODE), 깎인 자리에서 입자가 떨어져 나감
    //  - 왼쪽 절반은 왼쪽(살짝 아래, 05 의 왼쪽 아래 원 쪽), 오른쪽 절반은 오른쪽으로
    //  - z(깊이): 가까울수록 크고 빠르고 진함, 멀수록 작고 느리고 옅음 → 공간감
    const ERODE = .45;
    const { C5, R5, ARC5, DOT5, LOGO5 } = LY;               // 05 구도
    const scatterSpec = (x, y, far) => {
      const z = rnd(), side = x < 0 ? -1 : 1;
      const ang = side < 0 ? Math.PI - .12 + (rnd() - .5) * .5 : .06 + (rnd() - .5) * .5;
      return { z, ang, dist: (.7 + z * 2 + rnd() * .5) * far, delay: (1 - Math.abs(x)) * ERODE + rnd() * .04,
               dur: .5 + (1 - z) * .45, wave: (rnd() - .5) * .5 };
    };
    const PARTS = Array.from({ length: 2600 }, () => {
      const rr = Math.sqrt(rnd()), a = rnd() * Math.PI * 2, x = rr * Math.cos(a), y = rr * Math.sin(a);
      const o = { x, y, ...scatterSpec(x, y, 1) };
      const big = rnd() < .035;
      o.size = big ? 9 + rnd() * 6 : o.z < .55 ? 1.2 + o.z * 2.2 : 2.5 + (o.z - .55) * 14;
      o.kind = big ? 'sq' : o.z < .55 ? 'dust' : rnd() < .55 ? 'sq' : 'dot';
      o.trail = o.z > .9 && !big;
      // 05 도착점: 왼쪽 절반 → 왼쪽 아래 원 안, 오른쪽 절반 → 오른쪽 아래 사각형 안 (일부는 그대로 흩어져 사라짐)
      o.land = rnd() < .7;
      if (x < 0) { const aa = -Math.PI / 2 + rnd() * Math.PI / 2, rr2 = C5.r * (.25 + .7 * Math.sqrt(rnd())); o.tx = C5.x + Math.cos(aa) * rr2; o.ty = Math.min(H - 10, C5.y + Math.sin(aa) * rr2); }
      else { o.tx = R5.x + 20 + rnd() * (W - R5.x - 20); o.ty = R5.y + 20 + rnd() * (H - R5.y - 20); }
      return o;
    });
    // 원을 엮는 네트워크: 둘레 노드(윤곽) + 구 표면 노드(3D, 지구본처럼 회전)
    const TILT = .38;
    const globeAt = t => at(T.globe, t);
    const project = (n, th) => {                              // 구 표면 점 → 단위 원 좌표 + 깊이
      const X = Math.cos(n.lat) * Math.sin(n.lon + th), Y0 = Math.sin(n.lat), Z0 = Math.cos(n.lat) * Math.cos(n.lon + th);
      return [X * .985, (Y0 * Math.cos(TILT) - Z0 * Math.sin(TILT)) * .985, Y0 * Math.sin(TILT) + Z0 * Math.cos(TILT)];
    };
    const NODES = [];
    for (let i = 0; i < 30; i++) {
      const a = (i + (rnd() - .5) * .5) / 30 * Math.PI * 2;
      NODES.push({ x: Math.cos(a), y: Math.sin(a), rim: true });
    }
    const NG = 78;                                            // 피보나치 구 + 흔들림
    for (let i = 0; i < NG; i++) {
      const yy = 1 - 2 * (i + .5) / NG, lat = Math.asin(yy) + (rnd() - .5) * .12;
      const lon = i * 2.39996 + (rnd() - .5) * .3;
      NODES.push({ lat, lon, rim: false });
    }
    const TH_REF = globeAt(4.0);
    NODES.forEach(n => {
      if (!n.rim) { const [x, y] = project(n, TH_REF); n.x = x; n.y = y; }
      // 원을 그리듯 한 바퀴 도는 순서 + 바깥에서 안쪽으로
      const ang = (Math.atan2(n.y, n.x) + Math.PI * 1.5) % (Math.PI * 2) / (Math.PI * 2);
      n.birth = n.rim ? ang * .55 : .22 + ((n.lon % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * .45 + rnd() * .1;
      n.size = n.rim ? 4 + rnd() * 3 : 2.5 + rnd() * 3.5;
      n.sq = rnd() < .35;
      Object.assign(n, scatterSpec(n.x, n.y, 1.25));
    });
    const EDGES = [];
    const pos3 = n => [Math.cos(n.lat) * Math.cos(n.lon), Math.sin(n.lat), Math.cos(n.lat) * Math.sin(n.lon)];
    NODES.forEach((n, i) => {
      const cand = NODES.map((o, j) => [j, o]).filter(([j, o]) => j !== i && o.rim === n.rim)
        .map(([j, o]) => [j, n.rim ? Math.hypot(o.x - n.x, o.y - n.y) : Math.hypot(...pos3(o).map((v, k) => v - pos3(n)[k]))])
        .sort((a, b) => a[1] - b[1]).slice(0, n.rim ? 2 : 3);
      cand.forEach(([j]) => { if (!EDGES.some(([a, b]) => (a === j && b === i) || (a === i && b === j))) EDGES.push([i, j]); });
    });

    // 흩어짐 진행도 d(0~1) → 이동량 (디자인 좌표): 빠르게 떨어져 나가 미끄러지듯 감속, 살짝 휘는 궤적
    const SCATTER_SPAN = 1.4;
    const progress = (o, s) => clamp((s.burst * SCATTER_SPAN - o.delay) / o.dur);
    const offsetAt = (o, d) => {
      const e = 1 - (1 - d) ** 2.6;
      return { d, e, dx: Math.cos(o.ang) * o.dist * TR * e,
               dy: Math.sin(o.ang) * o.dist * TR * e * .6 + Math.sin(d * Math.PI) * o.wave * TR * .35 };
    };
    const scatterAt = (o, s) => offsetAt(o, progress(o, s));
    // 원 가장자리가 깎여 들어온 위치 (단위 원 x, 1 → 0)
    const erodeFront = s => 1 - s.burst * SCATTER_SPAN / ERODE;
    // 입자 색 = 떨어져 나온 자리의 원 색 (원 그라데이션 방향으로 투영)
    const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
    const sampleOne = (stops, x, y) => {
      // 구 그라데이션과 같은 식: 하이라이트(-.4,-.45) 에서의 거리
      const u = clamp((Math.hypot(x + .4, y + .45) - .02) / 1.3);
      const ST = [0, .2, .52, .8, 1];
      let i = 0; while (i < 3 && u > ST[i + 1]) i++;
      const k = (u - ST[i]) / (ST[i + 1] - ST[i]);
      const a = hex(stops[i]), b = hex(stops[i + 1]);
      return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(',')})`;
    };
    const colorCache = {};
    const partColors = name => colorCache[name] ||= PARTS.map(o => sampleOne(PAL[name].sphere, o.x, o.y));

    // ---------------------------------------------------------------- canvas 준비
    const fx = document.getElementById('fx');
    const ctx = fx.getContext('2d');
    const mkLayer = () => { const c = document.createElement('canvas'); return { c, x: c.getContext('2d') }; };
    const L = { form: mkLayer(), tmp: mkLayer(), glow: mkLayer() };
    let dpr = 1, view = { s: 1, ox: 0, oy: 0 }, pw = 1, ph = 1;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const vw = innerWidth, vh = innerHeight;
      pw = Math.round(vw * dpr); ph = Math.round(vh * dpr);
      for (const c of [fx, L.form.c, L.tmp.c]) { c.width = pw; c.height = ph; }
      L.glow.c.width = Math.ceil(pw / 6); L.glow.c.height = Math.ceil(ph / 6);
      // cover 로 채우되, 안전영역(로고·슬로건)은 잘리지 않을 만큼만 확대
      const s = Math.min(Math.max(vw / W, vh / H), vw / LY.safe[0], vh / LY.safe[1]);
      view = { s, ox: (vw - W * s) / 2, oy: (vh - H * s) / 2 };
    }
    const toDesign = c => c.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * view.ox, dpr * view.oy);
    const poly = (c, pts) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };

    // ---------------------------------------------------------------- 형태
    function draw03(c, s, p) {
      const { cx, cy, r } = s, b = { x: s.rx - s.rw / 2, y: s.ry - s.rh / 2, w: s.rw, h: s.rh };
      let g;
      if (s.rA > 0) {
        // 02 잔상: 지나온 자리에 옅은 사각형이 겹겹이 남음 (멈추면 사각형 뒤로 정렬되며 사라짐)
        if (s.trail > 0) {
          for (let k = 4; k >= 1; k--) {
            const q = state(s.t - .07 * k), w = q.rw, h = q.rh;
            c.save(); c.translate(q.rx, q.ry); c.rotate(q.rRot * D2R);
            c.globalAlpha = s.trail * (.34 - .07 * (k - 1)); c.fillStyle = p.ghost; c.fillRect(-w / 2, -h / 2, w, h);
            c.restore();
          }
        }
        c.save(); c.translate(s.rx, s.ry); c.rotate(s.rRot * D2R); c.translate(-s.rx, -s.ry);
        if (s.rSat < 1) {
          g = c.createLinearGradient(b.x, b.y, b.x + b.w, b.y + b.h);
          g.addColorStop(0, p.rectPale[0]); g.addColorStop(.6, p.rectPale[1]); g.addColorStop(1, p.rectPale[2]);
          c.globalAlpha = s.rA * (1 - s.rSat); c.fillStyle = g; c.fillRect(b.x, b.y, b.w, b.h);
        }
        g = c.createLinearGradient(b.x, 0, b.x + b.w, 0);
        g.addColorStop(0, p.rect[0]); g.addColorStop(.6, p.rect[1]); g.addColorStop(1, p.rect[2]);
        c.globalAlpha = s.rA * s.rSat; c.fillStyle = g; c.fillRect(b.x, b.y, b.w, b.h);
        c.restore();
      }
      g = c.createLinearGradient(cx - .72 * r, cy + .72 * r, cx + .72 * r, cy - .72 * r);
      g.addColorStop(0, p.circle[0]); g.addColorStop(.5, p.circle[1]); g.addColorStop(1, p.circle[2]);
      c.globalAlpha = s.cA; c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
      if (s.ov > 0) {
        c.save(); c.beginPath(); c.rect(b.x, b.y, b.w, b.h); c.clip();
        g = c.createLinearGradient(b.x, 0, cx + r, 0);
        g.addColorStop(0, p.navy[0]); g.addColorStop(.55, p.navy[1]); g.addColorStop(1, p.navy[0]);
        c.globalAlpha = s.ov; c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fill();
        c.restore();
      }
      c.globalAlpha = 1;
    }

    function draw04(c, s, p) {
      const m = s.m, a = s.spin * Math.PI / 180, R = TR * s.grow;
      const A = morph(srcCircle, toWorld(YANG, s), shiftA, m);
      const B = morph(srcRect, toWorld(YIN, s), shiftB, m);
      const rot = (x, y) => [TC[0] + R * (x * Math.cos(a) - y * Math.sin(a)), TC[1] + R * (x * Math.sin(a) + y * Math.cos(a))];
      const oneGrad = () => {
        const hx = TC[0] - .4 * R, hy = TC[1] - .45 * R;
        const g = c.createRadialGradient(hx, hy, R * .02, TC[0] - .12 * R, TC[1] - .14 * R, R * 1.32);
        [0, .2, .52, .8, 1].forEach((o, i) => g.addColorStop(o, p.sphere[i]));
        return g;
      };
      c.save();

      // ── 휘감기는 두 조각: 출발 색(원/사각형) → 같은 한 가지 색으로 수렴
      const src = [
        [B, () => { const g = c.createLinearGradient(rb.x, 0, rb.x + rb.w, 0); g.addColorStop(0, p.rect[0]); g.addColorStop(.6, p.rect[1]); g.addColorStop(1, p.rect[2]); return g; }],
        [A, () => { const g = c.createLinearGradient(SRC.cx - .72 * SRC.r, SRC.cy + .72 * SRC.r, SRC.cx + .72 * SRC.r, SRC.cy - .72 * SRC.r); g.addColorStop(0, p.circle[0]); g.addColorStop(.5, p.circle[1]); g.addColorStop(1, p.circle[2]); return g; }],
      ];
      if (s.unify < 1) {
        for (const [pts, grad] of src) {
          poly(c, pts);
          c.globalAlpha = s.fade * (1 - m); c.fillStyle = grad(); c.fill();
          c.globalAlpha = s.fade * m; c.fillStyle = oneGrad(); c.fill();
        }
        // 변형 중 겹친 부분은 03 의 남색을 이어받아 사라짐
        if (s.ov > 0) {
          c.save(); poly(c, B); c.clip();
          c.globalAlpha = s.fade * s.ov; c.fillStyle = p.navy[1]; poly(c, A); c.fill();
          c.restore();
        }
      }

      // ── 하나의 원: 두 조각 위를 같은 색의 완전한 원이 덮어 경계를 지움
      if (s.unify > 0) {
        const front = erodeFront(s);
        if (front <= -.1) { c.restore(); c.globalAlpha = 1; return; }
        if (front < 1) {
          // 가장자리가 부스러지듯: 경계가 다른 3겹(바깥일수록 옅음)으로 원을 그림
          const n = (y, k) => .045 * Math.sin(y * 7.3 + k * 1.7) + .03 * Math.sin(y * 17.9 - k * 2.9) + .018 * Math.sin(y * 41.3 + k * 5.1);
          for (const [off, al] of [[.2, .22], [.09, .5], [0, 1]]) {
            c.save();
            c.translate(TC[0], TC[1]); c.rotate(a);
            c.beginPath();
            const f = front + off;
            for (let i2 = 0; i2 <= 48; i2++) { const y = -1.05 + 2.1 * i2 / 48; c.lineTo(R * (f + n(y, 1 + off * 10)), y * R); }
            for (let i2 = 48; i2 >= 0; i2--) { const y = -1.05 + 2.1 * i2 / 48; c.lineTo(-R * (f + n(y, -1 - off * 10)), y * R); }
            c.closePath(); c.clip();
            c.rotate(-a); c.translate(-TC[0], -TC[1]);
            drawSphere(c, s, p, R, oneGrad, al, true);
            c.restore();
          }
          c.restore(); c.globalAlpha = 1; return;
        }
        drawSphere(c, s, p, R, oneGrad, 1);
      }
      c.restore();
      c.globalAlpha = 1;
    }

    // 구 그리기: 셰이딩 · 아래쪽 반사 역광 · 왼쪽 위 반사광 · 바닥 그림자
    function drawSphere(c, s, p, R, grad, al, noFloor) {
      const A = s.fade * s.unify * al, a = s.spin * Math.PI / 180;
      c.beginPath(); c.arc(TC[0], TC[1], R, 0, Math.PI * 2);
      c.globalAlpha = A; c.fillStyle = grad(); c.fill();
      // 휘감겨 들어온 흔적: 구 안을 도는 아주 옅은 소용돌이
      let g = c.createConicGradient(a + Math.PI * .9, TC[0], TC[1]);
      g.addColorStop(0, p.rim + '0)'); g.addColorStop(.3, p.rim + '.08)'); g.addColorStop(.55, p.rim + '0)');
      g.addColorStop(.8, p.rim + '.05)'); g.addColorStop(1, p.rim + '0)');
      c.fillStyle = g; c.fill();
      // 오른쪽 아래 그림자 면 (명암 경계)
      g = c.createRadialGradient(TC[0] - .3 * R, TC[1] - .35 * R, R * .55, TC[0] - .1 * R, TC[1] - .1 * R, R * 1.15);
      g.addColorStop(0, p.shade + '0)'); g.addColorStop(.75, p.shade + p.shadeA[0] + ')'); g.addColorStop(1, p.shade + p.shadeA[1] + ')');
      c.fillStyle = g; c.fill();
      // 아래쪽 가장자리 역광 (배경빛이 돌아 들어옴)
      c.save(); c.clip();
      g = c.createLinearGradient(TC[0] - .5 * R, TC[1] - .6 * R, TC[0] + .55 * R, TC[1] + .85 * R);
      g.addColorStop(0, p.rimLight + '0)'); g.addColorStop(.62, p.rimLight + '0)'); g.addColorStop(1, p.rimLight + '.7)');
      c.strokeStyle = g; c.lineWidth = R * .1;
      c.filter = `blur(${Math.max(1, 7 * view.s * dpr)}px)`;
      c.beginPath(); c.arc(TC[0], TC[1], R, 0, Math.PI * 2); c.stroke();
      c.filter = 'none';
      c.restore();
      // 반사광
      g = c.createRadialGradient(TC[0] - .42 * R, TC[1] - .48 * R, 0, TC[0] - .42 * R, TC[1] - .48 * R, R * .42);
      g.addColorStop(0, p.rim + (isDark() ? '.12)' : '.14)')); g.addColorStop(1, p.rim + '0)');
      c.fillStyle = g; c.beginPath(); c.arc(TC[0], TC[1], R, 0, Math.PI * 2); c.fill();
      c.globalAlpha = 1;
    }

    // 네트워크: 원이 생기는 동안 노드와 선이 원을 엮어 내고, 흩어질 때는 선이 늘어나며 끊어짐
    function drawNet(c, s, p) {
      if (s.net <= 0) return;
      const a = s.spin * Math.PI / 180, R = TR * s.grow, ca = Math.cos(a), sa = Math.sin(a);
      const inside = s.fade;                                      // 원 위에서는 밝은 선, 배경 위에서는 블루 선
      const P = NODES.map(n => {
        const sc = scatterAt(n, s);
        let ux = n.x, uy = n.y, depth = 1;
        if (!n.rim) {
          const [x, y, z] = project(n, s.globe);
          ux = x; uy = y;
          // 앞면은 진하게, 뒷면은 구를 비쳐 보이듯 희미하게. 흩어지기 시작하면 모두 같은 진하기로
          depth = z > 0 ? .45 + .55 * z : .14 * (1 + z);
          depth += (1 - depth) * sc.e;
        }
        return { x: TC[0] + R * (ux * ca - uy * sa) + sc.dx, y: TC[1] + R * (ux * sa + uy * ca) + sc.dy, sc, depth,
                 k: clamp((s.net - n.birth) / .12) };
      });
      c.lineWidth = 1.4;
      for (const [i, j] of EDGES) {
        const u = P[i], v = P[j];
        const k = clamp((s.net - Math.max(NODES[i].birth, NODES[j].birth)) / .14);
        if (k <= 0) continue;
        const stretch = Math.max(u.sc.e, v.sc.e);               // 흩어지며 선이 끊어짐
        const al = k * clamp(1 - stretch * 2.2) ** 2 * (.35 + .45 * s.netGlow) * Math.min(u.depth, v.depth);   // 늘어나자마자 끊어짐
        if (al <= .01) continue;
        const x2 = u.x + (v.x - u.x) * k, y2 = u.y + (v.y - u.y) * k;
        c.beginPath(); c.moveTo(u.x, u.y); c.lineTo(x2, y2);
        c.strokeStyle = p.netIn + (al * inside) + ')'; c.stroke();
        c.strokeStyle = p.netOut + (al * (1 - inside) * .8) + ')'; c.stroke();
      }
      P.forEach((q, i) => {
        const n = NODES[i];
        if (q.k <= 0 || q.sc.d >= 1) return;
        const z = n.size * E.back(q.k) * (1 - .4 * q.sc.e) * (.6 + .4 * q.depth);
        c.globalAlpha = (1 - q.sc.d) ** 1.2 * q.depth;
        c.fillStyle = inside > .5 ? p.node : p.nodeOut;
        if (n.sq) c.fillRect(q.x - z / 2, q.y - z / 2, z, z);
        else { c.beginPath(); c.arc(q.x, q.y, z / 2, 0, Math.PI * 2); c.fill(); }
      });
      c.globalAlpha = 1;
    }

    const drawForm = (c, s, p) => (s.m <= 0 ? draw03(c, s, p) : draw04(c, s, p));

    // 입자: 깎여 나간 자리에서 원 색 그대로 떨어져 나와 좌우로 흐름. 가까운(빠른) 입자는 꼬리 잔상.
    function drawParticles(c, s, p) {
      if (s.burst <= 0) return;
      const a = s.spin * Math.PI / 180, R = TR * s.grow, ca = Math.cos(a), sa = Math.sin(a);
      const cols = partColors(root.dataset.theme in PAL ? root.dataset.theme : 'light');
      const at0 = (pt, o) => [TC[0] + R * (pt.x * ca - pt.y * sa) + o.dx, TC[1] + R * (pt.x * sa + pt.y * ca) + o.dy];
      for (let i = 0; i < PARTS.length; i++) {
        const pt = PARTS[i], d = progress(pt, s);
        if (d <= 0 || d >= 1) continue;
        const o = offsetAt(pt, d);
        let [x, y] = at0(pt, o);
        if (pt.land) { const k = E.inOut(clamp((d - .38) / .62)); x += (pt.tx - x) * k; y += (pt.ty - y) * k; }
        // 막 떨어져 나올 때는 원과 같은 진하기 → 멀어질수록 깊이에 맞는 옅기로
        const base = .3 + .7 * pt.z;
        const alpha = (1 + (base - 1) * clamp(d * 4)) * (1 - d) ** 1.3;
        c.fillStyle = cols[i];
        if (pt.trail && d > .02 && d < .55) {
          const [tx, ty] = at0(pt, offsetAt(pt, Math.max(0, d - .022)));
          const g = c.createLinearGradient(tx, ty, x, y);
          g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, cols[i]);
          c.globalAlpha = alpha * .4; c.strokeStyle = g; c.lineWidth = pt.size * .35;
          c.beginPath(); c.moveTo(tx, ty); c.lineTo(x, y); c.stroke();
        }
        c.globalAlpha = alpha;
        const z = pt.size * (1 - .45 * o.e);
        if (pt.kind === 'dot') { c.beginPath(); c.arc(x, y, z / 2, 0, Math.PI * 2); c.fill(); }
        else c.fillRect(x - z / 2, y - z / 2, z, z);
      }
      c.globalAlpha = 1;
    }

    // 05: 왼쪽 아래 원 · 오른쪽 아래 사각형 · 오른쪽 위 원호 · 점
    function draw05(c, s, p) {
      if (s.s5c <= 0 && s.s5r <= 0 && s.s5arc <= 0) return;
      // 오른쪽 위 원호: 연한 면 + 선이 그려짐
      if (s.s5arc > 0) {
        const g = c.createRadialGradient(ARC5.x, ARC5.y, ARC5.r * .2, ARC5.x, ARC5.y, ARC5.r);
        g.addColorStop(0, p.arc5fill + (.55 * s.s5arc) + ')'); g.addColorStop(1, p.arc5fill + (.12 * s.s5arc) + ')');
        c.fillStyle = g; c.beginPath(); c.arc(ARC5.x, ARC5.y, ARC5.r, 0, Math.PI * 2); c.fill();
        c.strokeStyle = p.arc5; c.lineWidth = 2.4;
        const a0 = Math.PI * .5, a1 = Math.PI * 1.02;
        c.beginPath(); c.arc(ARC5.x, ARC5.y, ARC5.r, a1, a1 - (a1 - a0) * s.s5arc, true); c.stroke();
      }
      // 오른쪽 아래 사각형 (뒤에 옅은 한 장 더)
      if (s.s5r > 0) {
        const k = s.s5r, dy = (1 - k) * 70;
        const rr = (x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
        c.globalAlpha = k * .5; c.fillStyle = p.r5[1]; rr(R5.x - 105, R5.y + 36 + dy * 1.3, 140, R5.h, 22); c.fill();
        const g = c.createLinearGradient(R5.x, R5.y, R5.x + R5.w, R5.y + R5.h);
        g.addColorStop(0, p.r5[0]); g.addColorStop(1, p.r5[1]);
        c.globalAlpha = k; c.fillStyle = g; rr(R5.x, R5.y + dy, R5.w, R5.h, R5.rx); c.fill();
        c.strokeStyle = p.r5line; c.lineWidth = 1.5; c.stroke();
        c.globalAlpha = 1;
      }
      // 왼쪽 아래 원: 입자가 모여 차오르듯 (반지름 + 진하기)
      if (s.s5c > 0) {
        const k = s.s5c, r = C5.r * (.82 + .18 * k), cy = C5.y + (1 - k) * 60;
        const g = c.createLinearGradient(C5.x - r * .6, cy - r, C5.x + r * .75, cy + r * .2);
        g.addColorStop(0, p.c5[0]); g.addColorStop(.45, p.c5[1]); g.addColorStop(1, p.c5[2]);
        c.globalAlpha = k; c.fillStyle = g; c.beginPath(); c.arc(C5.x, cy, r, 0, Math.PI * 2); c.fill();
        // 위쪽 가장자리 빛
        c.save(); c.clip();
        c.strokeStyle = p.sheen5 + (.5 * k) + ')'; c.lineWidth = 10;
        c.filter = `blur(${Math.max(1, 5 * view.s * dpr)}px)`;
        c.beginPath(); c.arc(C5.x, cy, r, Math.PI * 1.25, Math.PI * 1.75); c.stroke();
        c.restore();
        c.globalAlpha = 1;
      }
      if (s.s5dot > 0) {
        c.fillStyle = p.dot5; c.beginPath(); c.arc(DOT5.x, DOT5.y, DOT5.r * s.s5dot, 0, Math.PI * 2); c.fill();
      }
    }

    // 모션 블러: 빠르게 움직이는 구간만 셔터 시간 동안 여러 시점을 평균
    const SHUTTER = 1 / 90;
    function speed(t) {
      const a = state(t), b = state(t - 1 / 60);
      return Math.max(Math.abs(a.cx - b.cx), Math.abs(a.r - b.r) * 1.5, Math.abs(a.rx - b.rx), Math.abs(a.rw - b.rw),
        Math.abs(a.rh - b.rh), Math.abs(a.m - b.m) * 500, Math.abs(a.spin - b.spin) * Math.PI / 180 * TR);
    }
    function renderForm(t, p) {
      const F = L.form.x;
      F.setTransform(1, 0, 0, 1, 0, 0); F.clearRect(0, 0, pw, ph);
      const n = Math.min(8, Math.max(1, Math.round(speed(t) / 6)));
      if (n === 1) { toDesign(F); drawForm(F, state(t), p); return; }
      const X = L.tmp.x;
      F.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i++) {
        X.setTransform(1, 0, 0, 1, 0, 0); X.clearRect(0, 0, pw, ph);
        toDesign(X); drawForm(X, state(t - SHUTTER * i / (n - 1)), p);
        F.globalAlpha = 1 / n; F.drawImage(L.tmp.c, 0, 0);
      }
      F.globalAlpha = 1; F.globalCompositeOperation = 'source-over';
    }

    // ---------------------------------------------------------------- 배경
    function drawBg(c, s, p) {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillStyle = p.bg; c.fillRect(0, 0, pw, ph);
      toDesign(c);
      const blob = (x, y, rad, a) => {
        const g = c.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, p.haze + a + ')'); g.addColorStop(1, p.haze + '0)');
        c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      };
      LY.blobs.forEach(([x, y, rad, a]) => blob(x, y, rad, a));
      // 01 오른쪽 큰 옅은 원 (원형 등장 → 확대 및 정지)
      if (s.s1 > 0) {
        const [x, y] = LY.s1, r = s.s1r;
        const g = c.createLinearGradient(x - r, 0, x + r * .6, 0);
        g.addColorStop(0, p.soft1[0]); g.addColorStop(.55, p.soft1[1]); g.addColorStop(1, p.soft1[2]);
        c.globalAlpha = s.s1; c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
        c.globalAlpha = 1;
      }
      // 구 아래 바닥 그림자
      if (s.unify > 0 && s.fade > 0) {
        const R = TR * s.grow, front = clamp(erodeFront(s));
        c.save();
        c.filter = `blur(${Math.max(1, 26 * view.s * dpr)}px)`;
        c.globalAlpha = s.unify * s.fade * (isDark() ? .45 : .12); c.fillStyle = p.floor + '1)';
        c.beginPath(); c.ellipse(TC[0] + .08 * R, TC[1] + 1.06 * R, R * .78 * front, R * .1, 0, 0, Math.PI * 2); c.fill();
        c.restore();
      }
      // 05 라이트 확산: 로고 뒤로 넓게 퍼지는 빛
      if (s.flare > 0) {
        const [x, y] = LY.flare, rad = LY.flareR[0] + LY.flareR[1] * s.flare;
        const g = c.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, p.glow + (.26 * s.flare) + ')'); g.addColorStop(1, p.glow + '0)');
        c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
      // 형태 뒤 빛 확산 (03 2.70 '형태 확장', 04 합체 순간)
      if (s.bloom > 0) {
        const k = s.m, x = (s.cx + s.rx) / 2 * (1 - k) + TC[0] * k, y = s.cy * (1 - k) + TC[1] * k, rad = LY.bloomR[0] + LY.bloomR[1] * s.bloom;
        const g = c.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, p.glow + (.32 * s.bloom) + ')'); g.addColorStop(1, p.glow + '0)');
        c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
    }

    // ---------------------------------------------------------------- 선·점 (SVG)
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.getElementById('lines');
    svg.replaceChildren();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const mk = (tag, parent, attrs) => {
      const el = document.createElementNS(NS, tag);
      for (const k in attrs) el.setAttribute(k, attrs[k]);
      parent.appendChild(el); return el;
    };
    const group = () => mk('g', svg, {});
    const [L1, L2, L3, L4] = LY.lines;
    const G1 = group(), G2 = group(), G3 = group(), G4 = group();
    const build = (g, d) => ({
      guides: d.guides.map(dd => mk('path', g, { d: dd, class: 'guide' })),
      paths: d.paths.map(dd => mk('path', g, { d: dd, class: 'ln', pathLength: 1, 'stroke-dasharray': '1 1' })),
      dots: d.dots.map(([x, y, r]) => mk('circle', g, { cx: x, cy: y, r, class: 'dot', 'data-r': r })),
      sqs: [...d.sqs.map(([x, y, z]) => mk('rect', g, { x: x - z / 2, y: y - z / 2, width: z, height: z, class: 'dot' })),
            ...(d.inks || []).map(([x, y, z]) => mk('rect', g, { x: x - z / 2, y: y - z / 2, width: z, height: z, class: 'ink' })),
            ...(d.hollows || []).map(([x, y, z]) => mk('rect', g, { x: x - z / 2, y: y - z / 2, width: z, height: z, class: 'hollow' }))],
    });
    const S1 = build(G1, L1), S2 = build(G2, L2), S3 = build(G3, L3), S4 = build(G4, L4);
    // 05 로고 · 슬로건: 내용은 content.js (INTRO_CONTENT)
    const LOGO_LETTERS = CONTENT.logo.letters, LOGO_W = CONTENT.logo.width, LS = LOGO5.w / LOGO_W;
    const GL = mk('g', svg, { class: 'logo', transform: `translate(${LOGO5.x} ${LOGO5.y}) scale(${LS})` });
    mk('rect', mk('clipPath', GL, { id: 'logoCap' }), { x: -40, y: 0, width: 240, height: 100 });
    const letterEls = LOGO_LETTERS.map(([x, d]) => mk('path', GL, { d, 'data-x': x, 'clip-path': 'url(#logoCap)' }));
    // 라이트 확산 때 로고 위를 지나가는 빛
    const sweepGrad = mk('linearGradient', mk('defs', svg, {}), { id: 'sweep', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 260, y1: 0, y2: 0 });
    [['0', 0], ['.5', .9], ['1', 0]].forEach(([o, a]) => mk('stop', sweepGrad, { offset: o, 'stop-color': '#ffffff', 'stop-opacity': a }));
    const GLs = mk('g', GL, { class: 'logo-sweep' });
    LOGO_LETTERS.forEach(([x, d]) => mk('path', GLs, { d, transform: `translate(${x} 0)`, 'clip-path': 'url(#logoCap)' }));
    const slogan = mk('text', svg, { x: LY.slogan.x, y: LY.slogan.y, class: 'slogan', 'text-anchor': 'middle' });
    slogan.style.fontSize = LY.slogan.size + 'px';
    slogan.textContent = CONTENT.slogan;
    const drawLogo = s => {
      // 글자가 가운데로 모여들며 자리 잡음 (바깥 글자일수록 멀리서, 조금 늦게)
      letterEls.forEach((el, i) => {
        const off = (i - (letterEls.length - 1) / 2), k = E.out(clamp(s.logo * 1.25 - Math.abs(off) * .05));
        const x = +el.dataset.x + off * 46 * (1 - k);
        el.setAttribute('transform', `translate(${x.toFixed(2)} ${(18 * (1 - k)).toFixed(2)})`);
        el.setAttribute('opacity', k.toFixed(3));
      });
      GL.setAttribute('opacity', s.logo > 0 ? 1 : 0);
      const sw = s.sweep, sx = -300 + sw * (LOGO_W + 600);
      sweepGrad.setAttribute('x1', sx); sweepGrad.setAttribute('x2', sx + 260);
      GLs.setAttribute('opacity', (Math.sin(Math.PI * sw) * (isDark() ? .9 : .55)).toFixed(3));
      slogan.setAttribute('opacity', s.slogan.toFixed(3));
      const [ls0, ls1] = LY.slogan.ls;
      slogan.setAttribute('transform', `translate(0 ${(14 * (1 - s.slogan)).toFixed(2)})`);
      slogan.setAttribute('letter-spacing', (ls0 - (ls0 - ls1) * s.slogan).toFixed(2));
    };
    const drawLines = (S, g, draw, o) => {
      g.setAttribute('opacity', o.toFixed(3));
      S.paths.forEach((p, i) => p.setAttribute('stroke-dashoffset', 1 - clamp(draw * 1.25 - i * .06)));
      S.guides.forEach(p => p.setAttribute('opacity', draw.toFixed(3)));
      S.dots.forEach((d, i) => d.setAttribute('r', (+d.dataset.r * E.back(clamp(draw * 1.6 - .3 - i * Math.min(.05, .9 / S.dots.length)))).toFixed(2)));
      S.sqs.forEach(r => r.setAttribute('opacity', clamp(draw * 2 - .6).toFixed(3)));
    };

    // ---------------------------------------------------------------- render
    function render(t) {
      const p = pal(), s = state(t);
      drawBg(ctx, s, p);
      renderForm(t, p);
      // 형태 주변 은은한 발광: 작게 줄인 레이어를 크게 늘려 블러처럼 사용
      const G = L.glow;
      G.x.setTransform(1, 0, 0, 1, 0, 0); G.x.clearRect(0, 0, G.c.width, G.c.height);
      G.x.filter = 'blur(6px)'; G.x.drawImage(L.form.c, 0, 0, G.c.width, G.c.height); G.x.filter = 'none';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = isDark() ? .55 : .22;
      ctx.globalCompositeOperation = isDark() ? 'screen' : 'multiply';
      ctx.drawImage(G.c, 0, 0, pw, ph);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(L.form.c, 0, 0);
      toDesign(ctx); draw05(ctx, s, p); drawParticles(ctx, s, p); drawNet(ctx, s, p);
      drawLines(S1, G1, s.l1draw, s.l1o);
      drawLines(S2, G2, s.l2draw, s.l2o);
      drawLines(S3, G3, s.l3draw, s.l3o);
      drawLines(S4, G4, s.l4draw, s.l4o);
      drawLogo(s);
    }
    return { render, resize };
  }

  // ---------------------------------------------------------------- 레이아웃 선택
  // 화면 비율이 PORTRAIT_BELOW 보다 좁으면 세로 구도(9:16), 아니면 가로 구도(16:9)
  const PORTRAIT_BELOW = .8;
  const pickLayout = () => (innerWidth / innerHeight < PORTRAIT_BELOW ? 'port' : 'land');
  let scene = null, sceneKey = '', lastT = FROM;
  const render = t => { scene.render(t); lastT = t; };
  const fit = () => {
    const k = pickLayout();
    if (k !== sceneKey) { sceneKey = k; scene = buildScene(LAYOUTS[k]); }
    scene.resize();
  };

  // ---------------------------------------------------------------- 재생 (한 번 재생 후 최종 화면에서 정지) / Skip
  const skipBtn = document.getElementById('skip');
  let t0 = 0, done = false;
  // 끝까지 재생했거나 Skip 을 누르면 최종 화면에서 멈추고 알림 (홈페이지에서 window 'intro:end' 로 받을 수 있음)
  const finish = skipped => {
    if (done) return;
    done = true;
    render(TO);
    skipBtn.classList.add('done');
    dispatchEvent(new CustomEvent('intro:end', { detail: { skipped } }));
  };

  fit();
  addEventListener('resize', () => { fit(); render(lastT); });
  window.renderAt = t => { render(t); return true; };
  window.__ready = Promise.resolve();

  const fixed = q.get('t');
  if (fixed !== null) { document.body.classList.add('hide-ui'); render(parseFloat(fixed) || 0); return; }

  const loop = now => {
    if (done) return;
    const t = FROM + (now - t0) / 1000;
    if (t >= TO) { finish(false); return; }
    render(t);
    requestAnimationFrame(loop);
  };
  t0 = performance.now();
  requestAnimationFrame(loop);
  skipBtn.onclick = () => finish(true);
  document.getElementById('theme').onclick = () => { setTheme(isDark() ? 'light' : 'dark'); render(lastT); };
})();
