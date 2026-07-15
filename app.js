(function () {
  'use strict';

  // 키 순서 = GRID_ORDER와 동일하게 유지한다: Object.keys(LABELS)가 스핀 스태거 애니메이션의
  // 정지 순서(좌→우, 행 순)를 결정하므로, 그리드 배치가 바뀌면 이 순서도 맞춰줘야 시각적으로 자연스럽다.
  var LABELS = {
    genre: 'GENRE', backdrop: 'BACKDROP', props: 'PROPS', lighting: 'LIGHTING', angle: 'ANGLE',
    subject: 'SUBJECT', color: 'COLOR', scale: 'SCALE', condition: 'CONDITION', density: 'DENSITY',
    gender: 'GENDER', age: 'AGE', role: 'ROLE', race: 'RACE', figures: 'FIGURES'
  };
  // 5x3 그리드(15칸 전부 사용): row1 genre/backdrop/props/lighting/angle,
  // row2 subject/color/scale/condition/density, row3 gender/age/role/race/figures.
  // color/scale/condition/density는 SUBJECT 게이팅과 무관하게 항상 활성(적용대상: 전체).
  var GRID_ORDER = ['genre', 'backdrop', 'props', 'lighting', 'angle',
                     'subject', 'color', 'scale', 'condition', 'density',
                     'gender', 'age', 'role', 'race', 'figures'];
  var GATED_IDS = ['gender', 'age', 'role', 'race', 'figures'];
  var ASPECTS = ['16:9', '9:16', '1:1', '4:3', '3:2', '21:9', '2:3', '3:4', '5:4', '4:5'];
  var COUNTS = [1, 2, 3, 4, 6];
  var STAT_IDS = ['genre', 'backdrop', 'lighting', 'angle', 'role', 'figures'];
  var TAG_LABEL = { idle: '대기', spinning: '회전중', stopped: '정지', locked: '잠김', disabled: '비활성' };
  var NEON_PALETTE = ['#22e0ff', '#ff2d95', '#7cff6b', '#ffe14d', '#b47bff', '#ff7a45'];
  var NEGATIVE_PROMPT = 'lowres, blurry, jpeg artifacts, watermark, text, signature, extra limbs, deformed hands, bad anatomy';
  var SUFFIX = ', highly detailed, sharp focus, shallow depth of field, 4k, highres';
  var PREFIX_OPTIONS = [
    { label: '없음', value: '' },
    { label: '일러스트', value: 'illustration, ' },
    { label: '사진', value: 'photograph, ' },
    { label: '애니메이션', value: 'anime screencap, ' },
    { label: '영화 스틸', value: 'cinematic film still, ' },
    { label: '영화 포스터', value: 'movie poster, ' },
    { label: '만화/코믹', value: 'comic book art, ' },
    { label: '수채화', value: 'watercolor painting, ' },
    { label: '유화', value: 'oil painting, ' },
    { label: '3D 렌더', value: '3D render, ' },
    { label: '픽셀아트', value: 'pixel art, ' },
    { label: '목판화', value: 'woodblock print, ' },
    { label: '스케치', value: 'pencil sketch, ' }
  ];
  var GENDER_GROUP_IDXS = [4, 5, 6];
  var AGE_BLOCKS_ROLE_IDXS = [0, 1];
  var ROLE_BANNED_BY_AGE = [30, 31, 33, 35, 36];

  var ICONS = {
    lockOff: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4"/><rect x="5" y="11" width="14" height="10"/></svg>',
    lockOn: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7A5 5 0 0 0 7 7v2H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1h-2zM9 7a3 3 0 0 1 6 0v2H9z"/></svg>',
    reroll: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v5h-5"/></svg>',
    dice: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="16" r="1.3" fill="currentColor" stroke="none"/><circle cx="16" cy="16" r="1.3" fill="currentColor" stroke="none"/></svg>'
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function longestIdx(pool) {
    var bi = 0, bl = -1;
    pool.forEach(function (p, i) { if (p.en.length > bl) { bl = p.en.length; bi = i; } });
    return bi;
  }

  // ---- state ----
  var state = null;

  function initState() {
    var reels = {};
    Object.keys(LABELS).forEach(function (id) {
      reels[id] = { i: longestIdx(SLOTS[id]), locked: false };
    });
    return {
      view: 'machine',
      reels: reels,
      spinning: {},
      landed: {},
      outputs: [],
      log: [],
      spins: 0,
      wins: 0,
      lightingPhysRatio: 50,
      anglePhysRatio: 50,
      raceHumanWeight: 65,
      subjectWeights: { human: 40, creature: 20, machine: 20, structure: 20 },
      aspect: '16:9',
      count: 1,
      conflict: true,
      prefixIndex: 1, // 기본값 '일러스트' — 0번은 새로 추가된 '없음'
      gateType: SLOTS.subject[reels.subject.i].type
    };
  }

  // ---- gating (트리거: SUBJECT 값 → GENDER/AGE/ROLE/RACE/FIGURES on/off) ----
  // SUBJECT가 human이 아니면 GENDER·FIGURES를 포함해 전부 비활성 — docs/slots_v2.md·DECISIONS.md의
  // "생물→성별·인물수, 기계→인물수" 규칙과 달리, 이 다섯 릴은 인간 분기에만 적용한다(사용자 지시로 변경).
  // state.gateType은 SUBJECT 릴이 "착지"하는 순간에만 갱신한다(spinReels 참고).
  // 회전 중인 SUBJECT의 실시간 플리커 값을 그대로 쓰면, 스핀 도중 게이팅 대상 셀들이
  // 매 틱마다 비활성↔활성으로 깜빡여 네온 효과가 끊기므로 스냅샷 값을 사용한다.
  function subjectType() { return SLOTS.subject[state.reels.subject.i].type; }
  function gateFor(type) {
    if (type === 'human') return { gender: true, age: true, role: true, race: true, figures: true };
    return {};
  }
  function enabledIds() {
    var on = gateFor(state.gateType);
    return Object.keys(LABELS).filter(function (id) {
      return GATED_IDS.indexOf(id) === -1 || on[id];
    });
  }

  function rateValue() {
    return state.spins ? Math.min(100, Math.max(0, Math.round(state.wins / state.spins * 100))) : 0;
  }
  function pad4(n) { return String(n).padStart(4, '0'); }
  function pad2(n) { return String(n).padStart(2, '0'); }

  // ---- 추첨 로직 (DECISIONS §5·§6·§8) ----
  function pickTagged(pool, physRatio) {
    var series = Math.random() * 100 < physRatio ? 'phys' : 'dir';
    var idxs = [];
    pool.forEach(function (v, i) { if (v.tag === series) idxs.push(i); });
    return idxs[Math.floor(Math.random() * idxs.length)];
  }
  function pickRace() {
    if (Math.random() * 100 < state.raceHumanWeight) return Math.random() < 0.5 ? 0 : 1;
    return 2 + Math.floor(Math.random() * (SLOTS.race.length - 2));
  }
  function pickSubject() {
    var w = state.subjectWeights;
    var entries = SLOTS.subject.map(function (v, i) { return { i: i, w: Math.max(0, +w[v.type] || 0) }; });
    var total = entries.reduce(function (s, e) { return s + e.w; }, 0);
    if (total <= 0) return Math.floor(Math.random() * SLOTS.subject.length);
    var r = Math.random() * total;
    for (var k = 0; k < entries.length; k++) {
      r -= entries[k].w;
      if (r < 0) return entries[k].i;
    }
    return entries[entries.length - 1].i;
  }
  function conflictReset(genreI, raceI) {
    if (!state.conflict) return raceI;
    var g = SLOTS.genre[genreI].series;
    var r = SLOTS.race[raceI].series;
    if ((g === 'sf' && r === 'fantasy') || (g === 'fantasy' && r === 'sf')) return 0;
    return raceI;
  }

  // rollAll(): 잠긴 릴은 유지하고 나머지는 §6-5의 확정 순서(SUBJECT→FIGURES→AGE→GENDER→ROLE→RACE→나머지)로
  // 새 값을 뽑는다. state.reels를 변경하지 않는 순수 함수 — SPIN 착지 목표값과 count>1 추가 출력 모두에 쓴다.
  function rollAll() {
    var reels = state.reels;
    function locked(id) { return reels[id].locked; }

    var subjectI = locked('subject') ? reels.subject.i : pickSubject();
    var gate = gateFor(SLOTS.subject[subjectI].type);

    var figuresI = reels.figures.i;
    if (!locked('figures') && gate.figures) figuresI = Math.floor(Math.random() * SLOTS.figures.length);
    var figuresSolo = SLOTS.figures[figuresI].solo;

    var ageI = reels.age.i;
    if (!locked('age') && gate.age) ageI = Math.floor(Math.random() * SLOTS.age.length);
    var ageBlocksRole = gate.role && AGE_BLOCKS_ROLE_IDXS.indexOf(ageI) !== -1;

    var genderI = reels.gender.i;
    if (!locked('gender') && gate.gender) {
      var genderPool = SLOTS.gender.map(function (v, i) { return i; });
      if (figuresSolo) genderPool = genderPool.filter(function (i) { return GENDER_GROUP_IDXS.indexOf(i) === -1; });
      genderI = genderPool[Math.floor(Math.random() * genderPool.length)];
    }

    var roleI = reels.role.i;
    if (!locked('role') && gate.role) {
      var rolePool = SLOTS.role.map(function (v, i) { return i; });
      if (ageBlocksRole) rolePool = rolePool.filter(function (i) { return ROLE_BANNED_BY_AGE.indexOf(i) === -1; });
      roleI = rolePool[Math.floor(Math.random() * rolePool.length)];
    }

    var raceI = reels.race.i;
    if (!locked('race') && gate.race) raceI = pickRace();

    var genreI = locked('genre') ? reels.genre.i : Math.floor(Math.random() * SLOTS.genre.length);
    var backdropI = locked('backdrop') ? reels.backdrop.i : Math.floor(Math.random() * SLOTS.backdrop.length);
    var propsI = locked('props') ? reels.props.i : Math.floor(Math.random() * SLOTS.props.length);
    var lightingI = locked('lighting') ? reels.lighting.i : pickTagged(SLOTS.lighting, state.lightingPhysRatio);
    var angleI = locked('angle') ? reels.angle.i : pickTagged(SLOTS.angle, state.anglePhysRatio);

    // color/scale/condition/density는 SUBJECT 게이팅과 무관하게 항상 활성 — 단순 균등 추첨
    var colorI = locked('color') ? reels.color.i : Math.floor(Math.random() * SLOTS.color.length);
    var scaleI = locked('scale') ? reels.scale.i : Math.floor(Math.random() * SLOTS.scale.length);
    var conditionI = locked('condition') ? reels.condition.i : Math.floor(Math.random() * SLOTS.condition.length);
    var densityI = locked('density') ? reels.density.i : Math.floor(Math.random() * SLOTS.density.length);

    // §6-4 종족↔장르 충돌 필터: RACE가 이번에 새로 뽑힌 경우에만 적용(잠금 우선, §6-5)
    if (!locked('race') && gate.race) raceI = conflictReset(genreI, raceI);

    return {
      genre: genreI, backdrop: backdropI, props: propsI, lighting: lightingI, angle: angleI,
      subject: subjectI, gender: genderI, age: ageI, role: roleI, race: raceI, figures: figuresI,
      color: colorI, scale: scaleI, condition: conditionI, density: densityI
    };
  }

  // 개별 재추첨: 해당 셀만 다시 뽑는다. 선행 조건은 "현재(변경되지 않는) 다른 릴 값" 기준으로 판단한다.
  function rollSingle(id) {
    if (id === 'subject') return pickSubject();
    if (id === 'figures') return Math.floor(Math.random() * SLOTS.figures.length);
    if (id === 'gender') {
      var soloNow = SLOTS.figures[state.reels.figures.i].solo;
      var pool = SLOTS.gender.map(function (v, i) { return i; });
      if (soloNow) pool = pool.filter(function (i) { return GENDER_GROUP_IDXS.indexOf(i) === -1; });
      return pool[Math.floor(Math.random() * pool.length)];
    }
    if (id === 'age') return Math.floor(Math.random() * SLOTS.age.length);
    if (id === 'role') {
      var blocksNow = AGE_BLOCKS_ROLE_IDXS.indexOf(state.reels.age.i) !== -1;
      var rp = SLOTS.role.map(function (v, i) { return i; });
      if (blocksNow) rp = rp.filter(function (i) { return ROLE_BANNED_BY_AGE.indexOf(i) === -1; });
      return rp[Math.floor(Math.random() * rp.length)];
    }
    if (id === 'race') return conflictReset(state.reels.genre.i, pickRace());
    if (id === 'lighting') return pickTagged(SLOTS.lighting, state.lightingPhysRatio);
    if (id === 'angle') return pickTagged(SLOTS.angle, state.anglePhysRatio);
    return Math.floor(Math.random() * SLOTS[id].length);
  }

  // 이번 SPIN에서 실제로 회전할 릴: 잠기지 않고, (게이팅 대상이면) target.subject 기준 게이팅이 켜진 릴만.
  function idsToSpin(target) {
    var gate = gateFor(SLOTS.subject[target.subject].type);
    return Object.keys(LABELS).filter(function (id) {
      if (state.reels[id].locked) return false;
      if (GATED_IDS.indexOf(id) !== -1 && !gate[id]) return false;
      return true;
    });
  }

  // ---- 프롬프트 조립 (DECISIONS §9) ----
  function vals() {
    var v = {};
    Object.keys(LABELS).forEach(function (id) { v[id] = state.reels[id].i; });
    return v;
  }
  function isOmit(en) { return !en || en === '(omit)' || en === '(none)' || en === 'no subject'; }

  function buildPrompt(v) {
    var type = SLOTS.subject[v.subject].type;
    var P = [], K = [];
    function add(en, kr) { if (!isOmit(en)) { P.push(en); if (kr) K.push(kr); } }

    var genreVal = SLOTS.genre[v.genre];
    add(genreVal.en, genreVal.kr);

    if (type === 'human') {
      var desc = ['gender', 'age', 'race', 'role'].map(function (id) { return SLOTS[id][v[id]]; })
        .filter(function (x) { return !isOmit(x.en); });
      var figuresVal = SLOTS.figures[v.figures];
      var words = desc.map(function (x) { return x.en; }).join(' ');
      P.push(words ? (figuresVal.en + ' of ' + words) : figuresVal.en);
      K.push(figuresVal.kr + (desc.length ? ' · ' + desc.map(function (x) { return x.kr; }).join(' ') : ''));
    } else {
      // GENDER·FIGURES는 인간 분기에만 적용되므로(게이팅), 비인간 분기는 주체 형태 문구만 사용한다.
      var form = type === 'creature' ? 'a living creature' : type === 'machine' ? 'a machine' : 'a structure or phenomenon';
      var fkr = type === 'creature' ? '생물' : type === 'machine' ? '기계' : '구조물·현상';
      P.push(form); K.push(fkr);
    }

    var backdropVal = SLOTS.backdrop[v.backdrop];
    add('in ' + backdropVal.en, backdropVal.kr);
    var propsVal = SLOTS.props[v.props];
    if (!isOmit(propsVal.en)) { P.push('with ' + propsVal.en); K.push(propsVal.kr); }
    var lightingVal = SLOTS.lighting[v.lighting];
    add(lightingVal.en, lightingVal.kr);
    var angleVal = SLOTS.angle[v.angle];
    add(angleVal.en, angleVal.kr);
    ['color', 'scale', 'condition', 'density'].forEach(function (id) {
      var val = SLOTS[id][v[id]];
      add(val.en, val.kr);
    });

    var full = PREFIX_OPTIONS[state.prefixIndex].value + P.join(', ') + SUFFIX;
    return { en: full, neg: NEGATIVE_PROMPT, kr: K.join(' · '), aspect: state.aspect, v: v };
  }

  function generateOutputs() {
    // 결과 출력 창은 항상 이번 스핀(또는 재추첨) 결과로 교체한다 — 이전 스핀 결과는 누적하지 않는다.
    // 출력 개수(count>1) 설정은 이번 한 번의 생성에서 몇 장을 뽑을지에만 관여한다.
    // 카드는 슬롯 값(v)만 저장하고, 텍스트는 renderOutputCard가 매번 buildPrompt(v)로 다시 조립한다.
    // 그래야 접두사·네거티브·화면비를 바꿨을 때 이미 떠 있는 결과에도 즉시 반영된다.
    var outs = [{ v: vals() }];
    for (var k = 1; k < state.count; k++) outs.push({ v: rollAll() });
    state.outputs = outs;
    render();
  }

  // ---- render: marquee ----
  function renderMarquee() {
    return '' +
      '<div class="marquee">' +
        '<div>' +
          '<div class="marquee-overline">Random Prompt</div>' +
          '<div class="marquee-title">SLOT&nbsp;MACHINE</div>' +
          '<div class="marquee-sub">AI 이미지 프롬프트 조합기</div>' +
        '</div>' +
        '<div class="tabs">' +
          '<button class="tab ' + (state.view === 'machine' ? 'tab--active' : '') + '" data-action="tab" data-view="machine">머신</button>' +
          '<button class="tab ' + (state.view === 'log' ? 'tab--active' : '') + '" data-action="tab" data-view="log">로그</button>' +
        '</div>' +
        '<div class="counters">' +
          '<div class="counter"><div class="counter-val counter-val--cyan">' + pad4(state.spins) + '</div><div class="counter-label">SPINS</div></div>' +
          '<div class="counter"><div class="counter-val counter-val--magenta">' + pad4(state.wins) + '</div><div class="counter-label">저장</div></div>' +
          '<div class="counter"><div class="counter-val counter-val--cyan">' + pad2(rateValue()) + '%</div><div class="counter-label">RATE</div></div>' +
        '</div>' +
      '</div>';
  }

  // ---- render: reel cell ----
  function cellState(id) {
    // 회전/착지 연출 중인 셀은 게이팅(비활성) 여부와 무관하게 우선 표시한다.
    // (SUBJECT가 아직 착지 전이라 gateType이 최종값과 다를 수 있어도 연출은 끊기지 않아야 함)
    if (state.spinning[id]) return 'spinning';
    if (state.landed[id]) return 'stopped';
    if (enabledIds().indexOf(id) === -1) return 'disabled';
    if (state.reels[id].locked) return 'locked';
    return 'idle';
  }

  function renderCell(id) {
    var pool = SLOTS[id];
    var r = state.reels[id];
    var value = pool[r.i];
    var cstate = cellState(id);
    var isDisabled = cstate === 'disabled';
    var isLocked = cstate === 'locked';

    var inner = isDisabled
      ? '<div class="cell-off">OFF</div>'
      : '<div class="cell-val">' + escapeHtml(value.en) + '</div><div class="cell-kr">' + escapeHtml(value.kr) + '</div>';

    var neonStyle = '';
    if (cstate === 'spinning') {
      var neon = NEON_PALETTE[Math.floor(Math.random() * NEON_PALETTE.length)];
      neonStyle = ' style="--neon:' + neon + '"';
    }

    return '' +
      '<div class="cell cell--' + cstate + '"' + neonStyle + ' data-cell-id="' + id + '">' +
        (isDisabled ? '<div class="cell-hatch"></div>' : '') +
        '<div class="cell-label">' + LABELS[id] + '</div>' +
        '<div class="cell-value-wrap">' + inner + '</div>' +
        '<div class="cell-controls">' +
          '<button class="cell-lock-btn" data-action="lock" data-id="' + id + '" ' + (isDisabled ? 'disabled' : '') + ' aria-label="잠금">' + (isLocked ? ICONS.lockOn : ICONS.lockOff) + '</button>' +
          '<button class="cell-reroll-btn" data-action="reroll" data-id="' + id + '" ' + (isDisabled || isLocked ? 'disabled' : '') + ' aria-label="재추첨">' + ICONS.reroll + '</button>' +
        '</div>' +
        '<div class="cell-tag">' + TAG_LABEL[cstate] + '</div>' +
      '</div>';
  }

  function renderReelGrid() {
    return '<div class="reelgrid"><div class="reelgrid-inner">' +
      GRID_ORDER.map(renderCell).join('') +
      '</div></div>';
  }

  // ---- render: button row ----
  function renderButtonRow() {
    return '' +
      '<div class="buttonrow">' +
        '<button class="spin-btn ' + (anySpin() ? 'spin-btn--pressed' : '') + '" data-action="spin">' +
          '<span class="spin-btn-inner">' + ICONS.dice +
            '<span class="spin-btn-textwrap"><span class="spin-btn-text">SPIN</span><span class="spin-btn-sub">전체 재추첨</span></span>' +
          '</span>' +
        '</button>' +
        '<button class="collect-btn" data-action="collect">' +
          '<span class="collect-lamps"><span class="lamp"></span><span class="lamp"></span><span class="lamp"></span></span>' +
          '<span class="collect-label">저장</span>' +
          '<span class="collect-sub">COLLECT</span>' +
        '</button>' +
        '<div class="side-btns">' +
          '<button class="side-btn" data-action="unlockAll">전체 잠금 해제</button>' +
          '<button class="side-btn" data-action="clearOutputs">출력 비우기</button>' +
        '</div>' +
      '</div>';
  }

  // ---- render: output column ----
  // 출력 카드 포맷: docs/image-prompt-builder-spec.md §5의 "Settings 요약 + Positive/Negative 분리 블록"
  // 구조를 차용한다. §5의 ENGINE/TYPE 등 새 토글은 도입하지 않고, 기존 슬롯 메타데이터로 Settings 줄을 구성한다.
  function renderOutputCard(o, idx) {
    var v = o.v;
    var built = buildPrompt(v);
    var settings = [
      'GENRE ' + SLOTS.genre[v.genre].en,
      'SUBJECT ' + SLOTS.subject[v.subject].en,
      'LIGHTING ' + SLOTS.lighting[v.lighting].en,
      'ANGLE ' + SLOTS.angle[v.angle].en,
      built.aspect
    ].join('  ·  ');
    return '' +
      '<div class="output-card">' +
        '<div class="output-settings">' + escapeHtml(settings) + '</div>' +
        '<div class="output-block">' +
          '<div class="output-block-label">POSITIVE</div>' +
          '<div class="output-block-text">' + escapeHtml(built.en) + '</div>' +
        '</div>' +
        '<div class="output-block">' +
          '<div class="output-block-label output-block-label--neg">NEGATIVE</div>' +
          '<div class="output-block-text output-block-text--neg">' + escapeHtml(built.neg) + '</div>' +
        '</div>' +
        '<div class="output-card-footer">' +
          '<span class="kr-text">' + escapeHtml(built.kr) + '</span>' +
          '<div class="output-card-actions">' +
            '<button class="copy-btn" data-action="copy" data-idx="' + idx + '">복사</button>' +
            '<button class="card-collect-btn" data-action="collectCard" data-idx="' + idx + '">저장</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function renderOutputCol() {
    var count = state.outputs.length;
    var body = count > 0
      ? '<div class="output-list">' + state.outputs.map(renderOutputCard).join('') + '</div>'
      : '<div class="empty-card"><div class="empty-title">NO RESULT</div><div class="empty-sub">SPIN을 눌러 프롬프트를 뽑으세요</div></div>';
    return '<div><div class="output-header">결과 출력 <span class="muted">· ' + count + '개</span></div>' + body + '</div>';
  }

  // ---- render: controls panel ----
  function renderRatioSlider(labelPhys, labelDir, key, val) {
    return '' +
      '<div class="slider-block">' +
        '<div class="slider-label-row"><span>' + labelPhys + '</span><span class="slider-value" data-slider-value="' + key + '">' + val + ' / ' + (100 - val) + '</span><span>' + labelDir + '</span></div>' +
        '<input type="range" min="0" max="100" value="' + val + '" class="slider" data-action="range" data-format="ratio" data-key="' + key + '">' +
      '</div>';
  }
  function renderPercentSlider(label, key, val) {
    return '' +
      '<div class="slider-block">' +
        '<div class="slider-label-row"><span>' + label + '</span><span class="slider-value" data-slider-value="' + key + '">' + val + '%</span></div>' +
        '<input type="range" min="0" max="100" value="' + val + '" class="slider" data-action="range" data-format="percent" data-key="' + key + '">' +
      '</div>';
  }
  function renderSubjectWeights() {
    var w = state.subjectWeights;
    var fields = [['human', '인간'], ['creature', '생물'], ['machine', '기계'], ['structure', '구조물']];
    return '' +
      '<div class="weights-block">' +
        '<div class="field-label">주체 비율</div>' +
        '<div class="weights-row">' +
          fields.map(function (f) {
            return '<label class="weight-field">' + f[1] +
              '<input type="number" min="0" class="weight-input" data-action="weight" data-key="' + f[0] + '" value="' + w[f[0]] + '"></label>';
          }).join('') +
        '</div>' +
      '</div>';
  }
  function renderSelect(label, key, options, value) {
    return '' +
      '<div class="field">' +
        '<div class="field-label">' + label + '</div>' +
        '<div class="select-wrap">' +
          '<select data-action="select" data-key="' + key + '">' +
            options.map(function (o) {
              return '<option value="' + o + '" ' + (String(o) === String(value) ? 'selected' : '') + '>' + o + '</option>';
            }).join('') +
          '</select>' +
          '<span class="caret">▼</span>' +
        '</div>' +
      '</div>';
  }
  function renderToggle() {
    return '' +
      '<div class="toggle-row">' +
        '<div class="field-label toggle-field-label">종족·장르 충돌 필터</div>' +
        '<button class="toggle-btn" data-action="toggle" data-key="conflict">' +
          '<span class="toggle-track ' + (state.conflict ? 'toggle-track--on' : '') + '"><span class="toggle-knob"></span></span>' +
          '<span class="toggle-text" style="color:' + (state.conflict ? 'var(--val)' : 'var(--kr)') + '">' + (state.conflict ? 'ON' : 'OFF') + '</span>' +
        '</button>' +
      '</div>';
  }
  function renderPrefixChips() {
    return '' +
      '<div class="field">' +
        '<div class="field-label">접두사</div>' +
        '<div class="chip-grid">' +
          PREFIX_OPTIONS.map(function (opt, i) {
            return '<button class="chip ' + (state.prefixIndex === i ? 'chip--active' : '') + '" data-action="prefixChip" data-index="' + i + '">' + escapeHtml(opt.label) + '</button>';
          }).join('') +
        '</div>' +
      '</div>';
  }

  function renderControlsCol() {
    return '' +
      '<div class="controls-panel">' +
        '<div class="controls-header">컨트롤</div>' +
        '<div class="controls-group">' +
          '<div class="controls-group-title">추첨 설정</div>' +
          renderRatioSlider('조명 물리', '연출', 'lightingPhysRatio', state.lightingPhysRatio) +
          renderRatioSlider('앵글 물리', '연출', 'anglePhysRatio', state.anglePhysRatio) +
          renderPercentSlider('종족 인간 비중', 'raceHumanWeight', state.raceHumanWeight) +
          renderSubjectWeights() +
        '</div>' +
        '<div class="controls-group">' +
          '<div class="controls-group-title">출력 설정</div>' +
          '<div class="grid2">' + renderSelect('화면비', 'aspect', ASPECTS, state.aspect) + renderSelect('출력 개수', 'count', COUNTS, state.count) + '</div>' +
          renderToggle() +
        '</div>' +
        '<div class="controls-group">' +
          '<div class="controls-group-title">프롬프트</div>' +
          renderPrefixChips() +
        '</div>' +
      '</div>';
  }

  // ---- render: machine view ----
  function renderMachineView() {
    return '' +
      '<div class="machine-view">' +
        renderReelGrid() +
        renderButtonRow() +
        '<div class="outputcontrols">' + renderOutputCol() + '<div>' + renderControlsCol() + '</div></div>' +
      '</div>';
  }

  // ---- render: log view ----
  function formatTime(ts) {
    var d = new Date(ts);
    function p(n) { return String(n).padStart(2, '0'); }
    return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  }
  // ROLE은 인간 분기에만 실제로 추첨되는 값이라, 생물/기계/구조물 결과에는 표시하지 않는다.
  // FIGURES는 구조물을 제외한 모든 유형에서 의미가 있으므로 대신 보여준다.
  function logChipIds(v) {
    // ROLE·FIGURES는 이제 인간 분기에만 실제로 추첨되는 값이라, 비인간 결과는 BACKDROP을 대신 보여준다.
    var type = SLOTS.subject[v.subject].type;
    return type === 'human' ? ['genre', 'subject', 'role', 'lighting'] : ['genre', 'subject', 'backdrop', 'lighting'];
  }
  function renderLogEntry(e) {
    var chips = logChipIds(e.v).map(function (id) { return SLOTS[id][e.v[id]].en; });
    return '' +
      '<div class="log-entry">' +
        '<div class="log-entry-head"><span class="log-time">' + escapeHtml(formatTime(e.ts)) + '</span><span class="log-aspect">' + escapeHtml(e.aspect) + '</span></div>' +
        '<div class="log-en">' + escapeHtml(e.en) + '</div>' +
        '<div class="log-chips">' + chips.map(function (c) { return '<span class="log-chip">' + escapeHtml(c) + '</span>'; }).join('') + '</div>' +
      '</div>';
  }

  function renderLogCol() {
    var body = state.log.length > 0
      ? '<div class="log-list">' + state.log.map(renderLogEntry).join('') + '</div>'
      : '<div class="empty-card"><div class="empty-title">EMPTY LOG</div><div class="empty-sub">마음에 드는 조합에서 저장을 누르면 여기 쌓입니다</div></div>';
    return '<div><div class="log-header">저장 로그 <span class="muted">· ' + state.log.length + '개</span></div>' + body + '</div>';
  }

  function renderStatsCol() {
    var body;
    if (state.log.length === 0) {
      body = '<div class="stats-empty">데이터 없음</div>';
    } else {
      body = '<div class="stats-list">' + STAT_IDS.map(function (id) {
        // ROLE·FIGURES는 인간 분기에만 실제로 추첨되는 값이므로, human 결과만 집계한다.
        var entries = (id === 'role' || id === 'figures')
          ? state.log.filter(function (e) { return SLOTS.subject[e.v.subject].type === 'human'; })
          : state.log;
        if (!entries.length) {
          return '' +
            '<div>' +
              '<div class="stat-label-row"><span class="stat-label">' + LABELS[id] + '</span><span class="stat-top muted">해당 없음</span></div>' +
              '<div class="stat-bar"><div class="stat-bar-fill" style="width:0%"></div></div>' +
            '</div>';
        }
        var cnt = {};
        entries.forEach(function (e) { cnt[e.v[id]] = (cnt[e.v[id]] || 0) + 1; });
        var bi = 0, bc = 0;
        Object.keys(cnt).forEach(function (k) { if (cnt[k] > bc) { bc = cnt[k]; bi = +k; } });
        var pct = Math.round(bc / entries.length * 100);
        return '' +
          '<div>' +
            '<div class="stat-label-row"><span class="stat-label">' + LABELS[id] + '</span><span class="stat-top">' + escapeHtml(SLOTS[id][bi].en) + ' <span class="stat-pct">' + pct + '%</span></span></div>' +
            '<div class="stat-bar"><div class="stat-bar-fill" style="width:' + pct + '%"></div></div>' +
          '</div>';
      }).join('') + '</div>';
    }
    return '<div class="controls-panel"><div class="stats-header">항목별 적중률</div>' + body + '</div>';
  }

  function renderLogView() {
    return '<div class="logview">' + renderLogCol() + '<div>' + renderStatsCol() + '</div></div>';
  }

  // ---- root render ----
  function render() {
    var app = document.getElementById('app');
    app.innerHTML = '<div class="cabinet">' + renderMarquee() + (state.view === 'machine' ? renderMachineView() : renderLogView()) + '</div>';
  }

  // 스핀 중 플리커/착지/정지-bloom 페이드아웃마다 호출된다. 결과 출력창·컨트롤 등 나머지 영역은
  // 이 시점에 값이 바뀌지 않으므로, 릴 그리드와 SPIN 버튼 눌림 상태만 갱신해 전체 재렌더링으로 인한
  // 결과 카드 DOM 재생성(=진입 애니메이션 재생)을 막는다. 결과는 generateOutputs()의 전체 render()에서만 나타난다.
  function renderReelGridOnly() {
    var inner = document.querySelector('.reelgrid-inner');
    if (inner) inner.innerHTML = GRID_ORDER.map(renderCell).join('');
    var spinBtn = document.querySelector('.spin-btn');
    if (spinBtn) spinBtn.classList.toggle('spin-btn--pressed', anySpin());
  }

  // ---- spin engine ----
  // 회전 연출(플리커·순차 정지)만 담당. §6 규칙 적용·프롬프트 조립은 이후 단계에서 연결한다.
  var spinTimers = {};

  function anySpin() {
    return Object.keys(state.spinning).some(function (id) { return state.spinning[id]; });
  }

  // target: rollAll()/rollSingle()로 스핀 시작 시 미리 확정한 착지값 맵. 플리커는 연출일 뿐 값을 정하지 않는다.
  function spinReels(ids, target) {
    if (!ids.length) { generateOutputs(); return; }
    // 추첨 중에는 결과 출력창을 비워둔다 — 빈 상태 카드는 진입 애니메이션이 없어
    // 스핀 도중 70ms마다 다시 그려져도 모션이 발생하지 않는다. 결과는 스핀이 끝난 뒤에만 나타난다.
    state.outputs = [];
    ids.forEach(function (id) { state.spinning[id] = true; });
    render();
    ids.forEach(function (id, idx) {
      var pool = SLOTS[id];
      spinTimers[id] = setInterval(function () {
        state.reels[id].i = Math.floor(Math.random() * pool.length);
        renderReelGridOnly();
      }, 70);
      var dur = 650 + idx * 150 + Math.random() * 140;
      setTimeout(function () {
        clearInterval(spinTimers[id]);
        delete spinTimers[id];
        state.reels[id].i = target[id];
        if (id === 'subject') state.gateType = subjectType();
        state.spinning[id] = false;
        // SUBJECT는 항상 먼저 착지하므로(GATED_IDS보다 앞선 인덱스), 이 시점의 gateType은
        // 이미 최종값이다. 이번 SPIN에서 인간→비인간으로 바뀌어 게이팅이 꺼진 GENDER/AGE/ROLE/RACE는
        // 착지 값·정지 연출 없이 바로 비활성(OFF)으로 전환한다.
        if (GATED_IDS.indexOf(id) !== -1 && enabledIds().indexOf(id) === -1) {
          renderReelGridOnly();
        } else {
          state.landed[id] = true;
          renderReelGridOnly();
          setTimeout(function () { state.landed[id] = false; renderReelGridOnly(); }, 650);
        }
        if (idx === ids.length - 1) setTimeout(generateOutputs, 90);
      }, dur);
    });
  }

  function spinAll() {
    if (anySpin()) return;
    var target = rollAll();
    state.spins++;
    spinReels(idsToSpin(target), target);
  }

  function rerollOne(id) {
    if (anySpin()) return;
    if (state.reels[id].locked) return;
    if (enabledIds().indexOf(id) === -1) return;
    var target = {};
    target[id] = rollSingle(id);
    spinReels([id], target);
  }

  // ---- events ----
  function toggleLock(id) {
    if (enabledIds().indexOf(id) === -1) return;
    state.reels[id].locked = !state.reels[id].locked;
    render();
  }

  function unlockAll() {
    Object.keys(state.reels).forEach(function (id) { state.reels[id].locked = false; });
    render();
  }
  function clearOutputs() { state.outputs = []; render(); }

  // 저장(collect)은 그 순간의 조립 결과를 스냅샷으로 로그에 고정한다 — 이후 접두사 등을 바꿔도 로그 항목은 바뀌지 않는다.
  function collectEntry(v) {
    var data = buildPrompt(v);
    state.log = [{ ts: Date.now(), en: data.en, neg: data.neg, kr: data.kr, aspect: data.aspect, v: v }].concat(state.log);
    state.wins++;
  }
  function collectTop() {
    var o = state.outputs[0];
    collectEntry(o ? o.v : vals());
    render();
  }
  function collectCard(idx) {
    var o = state.outputs[idx];
    if (!o) return;
    collectEntry(o.v);
    render();
  }
  function copyOutput(idx) {
    var o = state.outputs[idx];
    if (!o) return;
    if (navigator.clipboard) navigator.clipboard.writeText(buildPrompt(o.v).en).catch(function () {});
    showToast('클립보드에 복사되었습니다');
  }

  // 토스트는 #app 바깥의 독립된 요소라, #app을 통째로 다시 그리는 render()의 영향을 받지 않는다.
  var toastTimer = null;
  function showToast(msg) {
    var el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('toast--show'); }, 1800);
  }

  function updateSliderDisplay(input) {
    var key = input.dataset.key;
    var format = input.dataset.format;
    var display = document.querySelector('[data-slider-value="' + key + '"]');
    if (!display) return;
    display.textContent = format === 'ratio'
      ? state[key] + ' / ' + (100 - state[key])
      : state[key] + '%';
  }

  function onClick(e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var action = el.dataset.action;
    if (action === 'tab') { state.view = el.dataset.view; render(); }
    else if (action === 'lock') { toggleLock(el.dataset.id); }
    else if (action === 'spin') { spinAll(); }
    else if (action === 'reroll') { rerollOne(el.dataset.id); }
    else if (action === 'toggle') {
      var key = el.dataset.key;
      state[key] = !state[key];
      render();
    }
    else if (action === 'prefixChip') { state.prefixIndex = +el.dataset.index; render(); }
    else if (action === 'collect') { collectTop(); }
    else if (action === 'collectCard') { collectCard(+el.dataset.idx); }
    else if (action === 'copy') { copyOutput(+el.dataset.idx); }
    else if (action === 'unlockAll') { unlockAll(); }
    else if (action === 'clearOutputs') { clearOutputs(); }
  }

  function onInput(e) {
    var t = e.target;
    if (t.matches('.slider[data-action="range"]')) {
      state[t.dataset.key] = +t.value;
      updateSliderDisplay(t);
    } else if (t.matches('.weight-input')) {
      state.subjectWeights[t.dataset.key] = +t.value || 0;
    }
  }

  function onChange(e) {
    var t = e.target;
    if (t.matches('select[data-action="select"]')) {
      var key = t.dataset.key;
      state[key] = key === 'count' ? +t.value : t.value;
    }
  }

  function attachEvents() {
    var app = document.getElementById('app');
    app.addEventListener('click', onClick);
    app.addEventListener('input', onInput);
    app.addEventListener('change', onChange);
  }

  function init() {
    state = initState();
    attachEvents();
    render();
  }

  init();
})();
