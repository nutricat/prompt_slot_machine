/*
 * 슬롯 데이터 원천: docs/slots_v2.md + docs/DECISIONS.md
 * 각 값은 { en, kr } 쌍. 필요한 슬롯에는 태그 필드 추가:
 *   genre.series  — 'sf' | 'fantasy' | 'horror' | null   (충돌 필터용)
 *   race.series   — 'fantasy' | 'sf' | 'neutral'          (충돌 필터용)
 *   lighting.tag  — 'phys' | 'dir'                        (물리/연출 슬라이더용)
 *   angle.tag     — 'phys' | 'dir'                         (물리/연출 슬라이더용)
 *   subject.type  — 'human' | 'creature' | 'machine' | 'structure' (트리거 게이팅용)
 */
(function (global) {
  'use strict';

  function m(en, kr, extra) {
    return Object.assign({ en: en, kr: kr }, extra || {});
  }

  function G(list, series) {
    return list.map(function (x) { return m(x[0], x[1], { series: series }); });
  }

  // ---- 7. 장르 (100) ----
  var GENRE = [].concat(
    G([
      ['cyberpunk', '사이버펑크'], ['solarpunk', '솔라펑크'], ['biopunk', '바이오펑크'],
      ['steampunk', '스팀펑크'], ['dieselpunk', '디젤펑크'], ['atompunk', '아톰펑크'],
      ['clockpunk', '클록펑크'], ['nanopunk', '나노펑크'], ['space opera', '스페이스 오페라'],
      ['hard science fiction', '하드 SF'], ['post-apocalyptic', '포스트 아포칼립스'],
      ['dystopian', '디스토피아'], ['utopian', '유토피아'], ['cosmic horror', '코즈믹 호러'],
      ['cyber noir', '사이버 느와르'], ['transhumanism', '트랜스휴머니즘'],
      ['terraforming', '테라포밍'], ['generation ship', '세대 우주선'],
      ['time travel', '시간 여행'], ['alternate history', '대체 역사']
    ], 'sf'),
    G([
      ['high fantasy', '하이 판타지'], ['low fantasy', '로우 판타지'], ['dark fantasy', '다크 판타지'],
      ['grimdark', '그림다크'], ['urban fantasy', '어반 판타지'], ['fairytale', '동화'],
      ['mythic epic', '신화 서사시'], ['sword and sorcery', '검과 마법'],
      ['magic academy', '마법 학교'], ['animism', '애니미즘'], ['underworld', '저승'],
      ['celestial realm', '천상계'], ['dragon lore', '용 전승'], ['arthurian legend', '아서왕 전설'],
      ['norse mythology', '북유럽 신화'], ['greek mythology', '그리스 신화'],
      ['celtic folklore', '켈트 설화'], ['slavic folklore', '슬라브 설화'],
      ['xianxia', '선협'], ['hindu mythology', '힌두 신화']
    ], 'fantasy'),
    G([
      ['gothic horror', '고딕 호러'], ['body horror', '바디 호러'], ['folk horror', '포크 호러'],
      ['psychological horror', '심리 호러'], ['analog horror', '아날로그 호러'],
      ['liminal space', '리미널 스페이스'], ['creepypasta', '크리피파스타'], ['zombie', '좀비'],
      ['vampire', '뱀파이어'], ['werewolf', '늑대인간'], ['ghost', '유령'],
      ['cult ritual', '컬트 의식'], ['deep sea horror', '심해 호러'], ['space horror', '우주 호러'],
      ['the backrooms', '백룸']
    ], 'horror'),
    G([
      ['ancient egypt', '고대 이집트'], ['ancient rome', '고대 로마'], ['medieval europe', '중세 유럽'],
      ['viking age', '바이킹 시대'], ['renaissance', '르네상스'], ['baroque', '바로크'],
      ['victorian era', '빅토리아 시대'], ['belle epoque', '벨 에포크'], ['art nouveau', '아르누보'],
      ['art deco', '아르데코'], ['jazz age', '재즈 시대'], ['film noir', '필름 느와르'],
      ['cold war', '냉전'], ['1980s retro', '1980년대 레트로'], ['Y2K aesthetic', 'Y2K 감성']
    ], null),
    G([
      ['edo period japan', '에도 시대 일본'], ['korean joseon', '조선'], ['wuxia', '무협'],
      ['mongolian nomad', '몽골 유목'], ['arabian nights', '아라비안 나이트'],
      ['west african', '서아프리카'], ['mayan aztec', '마야·아즈텍'], ['andean incan', '안데스·잉카'],
      ['polynesian', '폴리네시안'], ['aboriginal australian', '호주 원주민'],
      ['inuit arctic', '이누이트 북극'], ['balkan', '발칸'], ['persian', '페르시아'],
      ['tibetan', '티베트'], ['southeast asian tropical', '동남아 열대']
    ], null),
    G([
      ['western', '서부극'], ['spy thriller', '스파이 스릴러'], ['heist', '하이스트'],
      ['courtroom drama', '법정 드라마'], ['sports', '스포츠'], ['slice of life', '일상'],
      ['absurdist comedy', '부조리 코미디'], ['road movie', '로드무비'], ['survival', '생존'],
      ['military', '군사']
    ], null),
    G([
      ['surrealism', '초현실주의'], ['dadaism', '다다이즘'], ['brutalism', '브루탈리즘'],
      ['minimalism', '미니멀리즘'], ['object-oriented', '오브젝트 지향']
    ], null)
  );

  // ---- 8. 배경 (80) ----
  var BACKDROP = [
    ['dense pine forest', '울창한 솔숲'], ['tropical rainforest', '열대우림'],
    ['desert dunes', '사막 사구'], ['rocky canyon', '바위 협곡'], ['mountain ridge', '산등성이'],
    ['tundra plain', '툰드라 평원'], ['wetland swamp', '습지'], ['open grassland', '초원'],
    ['volcanic field', '화산지대'], ['glacier', '빙하'], ['limestone cave', '석회동굴'],
    ['coastal cliff', '해안 절벽'], ['tidal flat', '갯벌'], ['karst peaks', '카르스트 봉우리'],
    ['river delta', '삼각주'], ['base of a waterfall', '폭포 아래'],
    ['middle of a lake', '호수 한가운데'], ['deep ocean floor', '심해저'],
    ['just below the water surface', '수면 바로 아래'], ['foggy bay', '안개 낀 만'],
    ['open field under night sky', '밤하늘 아래 들판'], ['above the cloud layer', '구름층 위'],
    ['asteroid surface', '소행성 표면'], ['low orbit', '저궤도'],
    ['narrow back alley', '좁은 뒷골목'], ['major intersection', '큰 교차로'],
    ['open-air market', '노천 시장'], ['rooftop', '옥상'], ['under a bridge', '다리 밑'],
    ['pedestrian overpass', '육교'], ['public square', '광장'], ['dock', '부두'],
    ['construction site', '공사장'], ['demolition zone', '철거 구역'], ['parking lot', '주차장'],
    ['elevated highway', '고가도로'], ['cemetery', '묘지'], ['city park', '도시 공원'],
    ['stairwell', '계단실'], ['waiting room', '대기실'], ['long corridor', '긴 복도'],
    ['inside an elevator', '엘리베이터 안'], ['underground garage', '지하 주차장'],
    ['warehouse', '창고'], ['library stacks', '서가'], ['auditorium', '강당'],
    ['bathroom', '욕실'], ['kitchen', '주방'], ['attic', '다락'], ['basement', '지하실'],
    ['greenhouse', '온실'], ['laundromat', '빨래방'], ['convenience store at night', '야간 편의점'],
    ['empty office floor', '텅 빈 사무실 층'], ['factory interior', '공장 내부'],
    ['power plant', '발전소'], ['water treatment plant', '정수장'], ['sewer tunnel', '하수 터널'],
    ['subway platform', '지하철 승강장'], ['airport gate', '공항 게이트'],
    ['train carriage', '열차 객실'], ['hospital ward', '병동'], ['laboratory', '실험실'],
    ['control room', '관제실'], ['hangar', '격납고'], ['quarry', '채석장'],
    ['temple interior', '사원 내부'], ['throne room', '왕좌의 방'], ['council chamber', '평의회장'],
    ['prison cell block', '감방동'], ['theater stage', '무대'], ['museum gallery', '미술관 전시실'],
    ['bathhouse', '목욕탕'], ['arena', '투기장'], ['ruins', '폐허'],
    ['border checkpoint', '국경 검문소'], ['remote rest stop', '외딴 휴게소'],
    ['lighthouse', '등대'], ['endless staircase', '끝없는 계단'], ['featureless void', '특징 없는 공허']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 9. 소품 (40) ----
  var PROPS = [
    ['(none)', '없음'], ['a lantern', '등불'], ['candles', '촛불'], ['an open book', '펼친 책'],
    ['a map', '지도'], ['a letter', '편지'], ['a key', '열쇠'], ['a lock', '자물쇠'],
    ['chains', '사슬'], ['rope', '밧줄'], ['a ladder', '사다리'], ['a chair', '의자'],
    ['a table', '탁자'], ['a bed', '침대'], ['a suitcase', '여행가방'],
    ['stacked crates', '쌓인 상자'], ['ceramic jars', '도자기 항아리'], ['glass bottles', '유리병'],
    ['a teacup', '찻잔'], ['prepared food', '차려진 음식'], ['a musical instrument', '악기'],
    ['a clock', '시계'], ['a hand mirror', '손거울'], ['an umbrella', '우산'],
    ['a pair of shoes', '신발 한 켤레'], ['piled clothing', '쌓인 옷'], ['a doll', '인형'],
    ['stacks of paper', '쌓인 종이'], ['hand tools', '수공구'], ['tangled cables', '엉킨 케이블'],
    ['exposed pipes', '드러난 배관'], ['gauges and dials', '계기와 다이얼'], ['screens', '스크린'],
    ['a sign', '표지판'], ['banners', '현수막'], ['potted plants', '화분'], ['bones', '뼈'],
    ['debris', '잔해'], ['a puddle', '웅덩이'], ['drifting smoke', '흩날리는 연기']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 10. 조명 (18) — DECISIONS.md §2로 slots_v2 §10 대체 ----
  var LIGHTING = [
    m('overcast', '흐린 날', { tag: 'phys' }),
    m('direct sunlight', '직사광', { tag: 'phys' }),
    m('backlit', '역광', { tag: 'phys' }),
    m('side lit', '측광', { tag: 'phys' }),
    m('lit from below', '하부광', { tag: 'phys' }),
    m('single light source', '단일 광원', { tag: 'phys' }),
    m('indoor lighting', '실내광', { tag: 'phys' }),
    m('night', '야간', { tag: 'phys' }),
    m('flat lighting', '평면광', { tag: 'phys' }),
    m('golden hour', '골든아워', { tag: 'dir' }),
    m('blue hour', '블루아워', { tag: 'dir' }),
    m('rim light', '림라이트', { tag: 'dir' }),
    m('backlit silhouette', '역광 실루엣', { tag: 'dir' }),
    m('volumetric light', '볼류메트릭', { tag: 'dir' }),
    m('chiaroscuro', '명암대비', { tag: 'dir' }),
    m('bounced light', '반사광', { tag: 'dir' }),
    m('dappled light', '얼룩광', { tag: 'dir' }),
    m('glowing subject', '광원 없이 발광', { tag: 'dir' })
  ];

  // ---- 11. 앵글 (16) — DECISIONS.md §3으로 slots_v2 §11 대체 ----
  var ANGLE = [
    m('front view', '정면', { tag: 'phys' }),
    m('three-quarter view', '3/4 뷰', { tag: 'phys' }),
    m('side profile', '측면', { tag: 'phys' }),
    m('isometric view', '등각', { tag: 'phys' }),
    m('eye-level wide shot', '아이레벨 와이드', { tag: 'phys' }),
    m('high-angle overview', '하이앵글 오버뷰', { tag: 'phys' }),
    m('low-angle shot', '로우앵글', { tag: 'phys' }),
    m('top-down view', '탑다운', { tag: 'phys' }),
    m('dutch angle', '더치 앵글', { tag: 'dir' }),
    m('close-up', '클로즈업', { tag: 'dir' }),
    m('extreme close-up', '익스트림 클로즈업', { tag: 'dir' }),
    m('over-the-shoulder', '오버 더 숄더', { tag: 'dir' }),
    m("worm's-eye view", '웜즈아이', { tag: 'dir' }),
    m("bird's-eye view", '버즈아이', { tag: 'dir' }),
    m('wide-angle distortion', '광각 왜곡', { tag: 'dir' }),
    m('telephoto compression', '망원 압축', { tag: 'dir' })
  ];

  // ---- 0. 트리거 — 주체 유형 (4) ----
  var SUBJECT = [
    m('human', '인간', { type: 'human' }),
    m('living creature', '생물', { type: 'creature' }),
    m('machine', '기계', { type: 'machine' }),
    m('structure / phenomenon', '구조물·현상', { type: 'structure' })
  ];

  // ---- 1. 성별 (7) ----
  var GENDER = [
    ['male', '남성'], ['female', '여성'], ['androgynous', '성별 불명'], ['(omit)', '명시 안 함'],
    ['a group of men', '남성 집단'], ['a group of women', '여성 집단'],
    ['a mixed-gender group', '혼성 집단']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 2. 연령 (6) ----
  var AGE = [
    ['child', '아동'], ['adolescent', '청소년'], ['young adult', '청년'],
    ['middle-aged', '중년'], ['elderly', '노년'], ['(omit)', '명시 안 함']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 3. 역할/직업 (60) ----
  var ROLE = [
    ['blacksmith', '대장장이'], ['carpenter', '목수'], ['potter', '도공'], ['weaver', '직조공'],
    ['farmer', '농부'], ['fisherman', '어부'], ['miner', '광부'], ['lumberjack', '벌목꾼'],
    ['mechanic', '정비공'], ['construction worker', '건설 노동자'], ['cook', '요리사'],
    ['janitor', '청소부'], ['scholar', '학자'], ['scribe', '필경사'], ['librarian', '사서'],
    ['cartographer', '지도제작자'], ['astronomer', '천문 관측자'], ['alchemist', '연금술사'],
    ['inventor', '발명가'], ['teacher', '교사'], ['interpreter', '통역사'],
    ['chronicler', '기록자'], ['physician', '의사'], ['nurse', '간호인'],
    ['apothecary', '약제사'], ['midwife', '산파'], ['undertaker', '장의사'],
    ['veterinarian', '수의사'], ['warrior', '전사'], ['guard', '경비병'],
    ['commander', '지휘관'], ['judge', '판관'], ['bureaucrat', '관리'], ['ruler', '통치자'],
    ['envoy', '사절'], ['spy', '첩자'], ['executioner', '처형인'], ['prisoner', '죄수'],
    ['priest', '사제'], ['shaman', '무녀·샤먼'], ['monk', '수도자'], ['fortune teller', '점술가'],
    ['pilgrim', '순례자'], ['heretic', '이단자'], ['merchant', '상인'], ['smuggler', '밀수업자'],
    ['thief', '도둑'], ['hunter', '사냥꾼'], ['guide', '안내인'], ['messenger', '전령'],
    ['sailor', '뱃사람'], ['driver', '마부·운전수'], ['wandering musician', '유랑 악사'],
    ['jester', '광대'], ['painter', '화가'], ['dancer', '무용수'], ['storyteller', '이야기꾼'],
    ['actor', '배우'], ['athlete', '운동선수'], ['(omit)', '역할 없음']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 4. 종족/변형 (20) ----
  function R(en, kr, series) { return m(en, kr, { series: series }); }
  var RACE = [
    R('human', '인간', 'neutral'),
    R('(omit)', '인간(명시 안 함)', 'neutral'),
    R('elf', '엘프', 'fantasy'),
    R('dark elf', '다크엘프', 'fantasy'),
    R('dwarf', '드워프', 'fantasy'),
    R('orc', '오크', 'fantasy'),
    R('beastfolk', '수인', 'fantasy'),
    R('avian humanoid', '조인', 'fantasy'),
    R('aquatic humanoid', '어인', 'fantasy'),
    R('reptilian humanoid', '파충인', 'fantasy'),
    R('plant humanoid', '식물인', 'fantasy'),
    R('golem', '골렘', 'fantasy'),
    R('undead', '언데드', 'fantasy'),
    R('spectral being', '유령체', 'fantasy'),
    R('cybernetic human', '의체화 인간', 'sf'),
    R('android', '안드로이드', 'sf'),
    R('mutant', '돌연변이', 'sf'),
    R('alien species', '외계종', 'sf'),
    R('masked figure', '가면·은폐', 'neutral'),
    R('faceless', '얼굴 없음', 'neutral')
  ];

  // ---- 6. 인물수·구도 (10) ----
  // solo: 단독 계열 판정용 (DECISIONS §6-2) — 단독 / 단독+관찰자 / 인물 없음
  var FIGURES = [
    m('a lone figure', '단독', { solo: true }),
    m('two figures facing each other', '2인 대치', { solo: false }),
    m('two figures side by side', '2인 동행', { solo: false }),
    m('a group of three', '3인 그룹', { solo: false }),
    m('a small group', '소집단', { solo: false }),
    m('a large crowd', '군중', { solo: false }),
    m('one figure watched by another', '단독+관찰자', { solo: true }),
    m('scattered figures in the distance', '배경에 흩어진 다수', { solo: false }),
    m('one figure in foreground, many behind', '전경 1인+후경 다수', { solo: false }),
    m('no figures', '인물 없음', { solo: true })
  ];

  // ---- 색조/팔레트 (14) — SUBJECT 게이팅과 무관하게 항상 활성 ----
  var COLOR = [
    ['warm tones', '따뜻한 톤'], ['cool tones', '차가운 톤'], ['high saturation', '고채도'],
    ['desaturated', '저채도'], ['monochrome', '흑백'], ['sepia tones', '세피아'],
    ['complementary colors', '보색 대비'], ['limited color palette', '단색조'],
    ['pastel palette', '파스텔 팔레트'], ['dark palette', '어두운 팔레트'],
    ['bold primary colors', '원색 강조'], ['earthy tones', '흙빛 톤'],
    ['metallic tones', '금속성 색조'], ['(omit)', '명시 안 함']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 스케일/거리감 (10) ----
  var SCALE = [
    ['vast and distant', '광활하고 멀리'], ['intimate and close', '친밀하고 가까이'],
    ['towering and overwhelming', '압도적으로 거대'], ['miniature scale', '미니어처처럼 작게'],
    ['subject dwarfed by surroundings', '주체가 배경에 묻힘'],
    ['subject fills the frame', '주체가 화면을 채움'], ['human scale', '인간 척도'],
    ['small in vast emptiness', '광대한 공허 속'], ['extreme close scale', '근접 디테일'],
    ['(omit)', '명시 안 함']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 상태/훼손도 (12) ----
  var CONDITION = [
    ['pristine, newly made', '새것'], ['worn', '낡음'], ['corroded', '부식됨'],
    ['decayed, in ruins', '폐허가 됨'], ['dust-covered', '먼지 쌓임'],
    ['overgrown with moss', '이끼로 뒤덮임'], ['cracked', '금이 감'], ['charred', '불에 탐'],
    ['waterlogged', '물에 잠김'], ['restored', '복원됨'], ['abandoned', '버려짐'],
    ['(omit)', '명시 안 함']
  ].map(function (x) { return m(x[0], x[1]); });

  // ---- 밀도/구성 (10) ----
  var DENSITY = [
    ['cluttered composition', '빽빽하게 채워짐'], ['sparse composition', '여백이 많음'],
    ['dense crowding', '빽빽한 군집'], ['vast empty space', '텅 빈 공간'],
    ['layered depth', '층층이 겹침'], ['symmetrical arrangement', '대칭적 배치'],
    ['chaotic asymmetry', '비대칭적 혼돈'], ['repeating pattern', '반복 패턴'],
    ['centered focal composition', '중심에 집중'], ['(omit)', '명시 안 함']
  ].map(function (x) { return m(x[0], x[1]); });

  global.SLOTS = {
    genre: GENRE,
    backdrop: BACKDROP,
    props: PROPS,
    lighting: LIGHTING,
    angle: ANGLE,
    subject: SUBJECT,
    gender: GENDER,
    age: AGE,
    role: ROLE,
    race: RACE,
    figures: FIGURES,
    color: COLOR,
    scale: SCALE,
    condition: CONDITION,
    density: DENSITY
  };
})(window);
