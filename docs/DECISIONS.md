# DECISIONS.md

이 파일은 **최종 결정사항**이다.
`README.md`, `design-ref.html`, `slots_v2.md`와 충돌하면 **이 파일이 우선한다.**

배경: `README.md`와 `design-ref.html`은 Claude Design이 만든 산출물이며,
그 시점 이후 확정된 결정이 반영돼 있지 않다. 아래가 그 차이다.

---

## 0. 요약 — README와 달라지는 것

| 항목 | README/프로토타입 | 최종 결정 |
|---|---|---|
| 방향 | 컨셉아트 | **일러스트** |
| 접두사 | `concept art sketch, rough digital painting, ` | `illustration, ` |
| 접미사 | `, muted palette` | `, highly detailed, sharp focus` |
| 조명 | 9개 (물리만) | **18개 (물리 9 + 연출 9)** |
| 앵글 | 8개 (물리만) | **16개 (물리 8 + 연출 8)** |
| 물리/연출 슬라이더 | 1개 (데이터 없음, 미동작) | **2개 (조명용·앵글용 각각), 실동작** |
| 부정 프롬프트 | `masterpiece, best quality` 계열 잔재 | 아래 §4 값으로 교체 |
| 로그 저장 | 미정 | **세션 한정 (localStorage 사용 안 함)** |
| 규칙 2·3 | 미구현 | **구현** |
| 가중치 | 상수 | **UI에서 조절 가능** |

나머지(색·타이포·컴포넌트·레이아웃·인터랙션)는 README를 그대로 따른다.

---

## 1. 방향 — 일러스트

이 도구는 **일러스트** 프롬프트를 뽑는다. 컨셉아트가 아니다.

차이가 실제로 영향을 주는 지점:
- 조명은 형태를 보이게 하는 도구가 아니라 **연출 도구**다 → 연출 계열 후보 추가
- 앵글은 대상이 잘 보이는 각도가 아니라 **극적인 각도**도 포함 → 연출 계열 후보 추가
- 매체 접두/접미사가 러프·초안 지향에서 **완성도 지향**으로 바뀜

README 및 프로토타입에 남아 있는 "concept art" 표기는 전부 무시한다.

---

## 2. 조명 슬롯 — 18개로 교체

`slots_v2.md` §10을 아래로 대체한다. 각 값에 `tag` 필드를 추가한다.

```json
[
  { "en": "overcast",             "kr": "흐린 날",       "tag": "phys" },
  { "en": "direct sunlight",      "kr": "직사광",        "tag": "phys" },
  { "en": "backlit",              "kr": "역광",          "tag": "phys" },
  { "en": "side lit",             "kr": "측광",          "tag": "phys" },
  { "en": "lit from below",       "kr": "하부광",        "tag": "phys" },
  { "en": "single light source",  "kr": "단일 광원",     "tag": "phys" },
  { "en": "indoor lighting",      "kr": "실내광",        "tag": "phys" },
  { "en": "night",                "kr": "야간",          "tag": "phys" },
  { "en": "flat lighting",        "kr": "평면광",        "tag": "phys" },
  { "en": "golden hour",          "kr": "골든아워",      "tag": "dir" },
  { "en": "blue hour",            "kr": "블루아워",      "tag": "dir" },
  { "en": "rim light",            "kr": "림라이트",      "tag": "dir" },
  { "en": "backlit silhouette",   "kr": "역광 실루엣",   "tag": "dir" },
  { "en": "volumetric light",     "kr": "볼류메트릭",    "tag": "dir" },
  { "en": "chiaroscuro",          "kr": "명암대비",      "tag": "dir" },
  { "en": "bounced light",        "kr": "반사광",        "tag": "dir" },
  { "en": "dappled light",        "kr": "얼룩광",        "tag": "dir" },
  { "en": "glowing subject",      "kr": "광원 없이 발광", "tag": "dir" }
]
```

---

## 3. 앵글 슬롯 — 16개로 교체

`slots_v2.md` §11을 아래로 대체한다.

```json
[
  { "en": "front view",              "kr": "정면",           "tag": "phys" },
  { "en": "three-quarter view",      "kr": "3/4 뷰",         "tag": "phys" },
  { "en": "side profile",            "kr": "측면",           "tag": "phys" },
  { "en": "isometric view",          "kr": "등각",           "tag": "phys" },
  { "en": "eye-level wide shot",     "kr": "아이레벨 와이드", "tag": "phys" },
  { "en": "high-angle overview",     "kr": "하이앵글 오버뷰", "tag": "phys" },
  { "en": "low-angle shot",          "kr": "로우앵글",       "tag": "phys" },
  { "en": "top-down view",           "kr": "탑다운",         "tag": "phys" },
  { "en": "dutch angle",             "kr": "더치 앵글",      "tag": "dir" },
  { "en": "close-up",                "kr": "클로즈업",       "tag": "dir" },
  { "en": "extreme close-up",        "kr": "익스트림 클로즈업","tag": "dir" },
  { "en": "over-the-shoulder",       "kr": "오버 더 숄더",   "tag": "dir" },
  { "en": "worm's-eye view",         "kr": "웜즈아이",       "tag": "dir" },
  { "en": "bird's-eye view",         "kr": "버즈아이",       "tag": "dir" },
  { "en": "wide-angle distortion",   "kr": "광각 왜곡",      "tag": "dir" },
  { "en": "telephoto compression",   "kr": "망원 압축",      "tag": "dir" }
]
```

---

## 4. 접두사 / 접미사 / 부정 프롬프트

편집 가능한 텍스트 필드의 **기본값**이다. 편집값은 세션 한정으로 유지한다(§7).

```
접두사(prefix):  "illustration, "
접미사(suffix):  ", highly detailed, sharp focus"
```

부정 프롬프트 — 편집 필드 없음, 고정 출력:
```
lowres, blurry, jpeg artifacts, watermark, text, signature, extra limbs, deformed hands, bad anatomy
```

`masterpiece, best quality` 계열은 사용하지 않는다. SD 1.5 시절 관습이며 현행 모델에서
효과가 없거나 역효과다. README/프로토타입에 남아 있다면 제거한다.

---

## 5. 물리/연출 슬라이더 — 2개, 실동작

README는 슬라이더 1개를 UI에만 두고 로직에 연결하지 않았다. 이를 바꾼다.

**슬라이더는 2개다.**
- `조명 물리/연출` — 0~100
- `앵글 물리/연출` — 0~100

각각 기본값 50. 라벨 표기는 README와 동일하게 `{phys} / {dir}` 형식.

**동작:**
값이 `N`이면 해당 슬롯 추첨 시 `phys` 태그에서 뽑을 확률이 `N%`, `dir`에서 뽑을 확률이 `(100-N)%`다.
계열이 정해진 뒤 그 계열 안에서 균등 추첨한다.

```
pickLighting(ratio):
  series = random() * 100 < ratio ? 'phys' : 'dir'
  pool = LIGHTING.filter(v => v.tag === series)
  return pool[randInt(pool.length)]
```

앵글도 동일. 0이면 연출만, 100이면 물리만 나온다.

컨트롤 패널 레이아웃은 슬라이더 2개를 수용하도록 조정한다. 스타일은 README의 gel thumb 유지.

---

## 6. 추첨 규칙 — 전부 구현

`slots_v2.md` §15의 규칙을 모두 적용한다.

### 6-1. 트리거 게이팅 (README와 동일, 재확인)

SUBJECT 릴 값이 행2의 4개 셀을 제어한다.

| SUBJECT | GENDER | AGE | ROLE | RACE |
|---|---|---|---|---|
| human 인간 | ON | ON | ON | ON |
| living creature 생물 | ON | OFF | OFF | OFF |
| machine 기계 | OFF | OFF | OFF | OFF |
| structure / phenomenon 구조물·현상 | OFF | OFF | OFF | OFF |

비활성 셀은 README의 disabled 상태("OFF", 45° 해치)로 렌더하고 스핀/재추첨/잠금에서 제외한다.

### 6-2. 성별 집단 제외 규칙 (신규 구현)

FIGURES(인물수)가 **단독 계열**이면 GENDER에서 집단 값(index 4·5·6 — `a group of men`,
`a group of women`, `a mixed-gender group`)을 제외한다.

단독 계열로 판정하는 FIGURES 값:
- `a lone figure` (단독)
- `one figure watched by another` (단독 + 관찰자)
- `no figures` (인물 없음)

판정 순서: FIGURES를 먼저 확정한 뒤 GENDER를 추첨한다.
이미 확정된 GENDER가 규칙에 걸리면 `(omit)`(index 3)으로 리셋한다.
(RACE 충돌 필터가 index 0으로 리셋하는 것과 동일한 패턴)

### 6-3. 연령↔역할 충돌 규칙 (신규 구현)

AGE가 `child`(index 0) 또는 `adolescent`(index 1)이면 아래 ROLE을 제외한다.

| ROLE index | en |
|---|---|
| 30 | commander |
| 31 | judge |
| 33 | ruler |
| 35 | spy |
| 36 | executioner |

판정 순서: AGE를 먼저 확정한 뒤 ROLE을 추첨한다.
이미 확정된 ROLE이 규칙에 걸리면 ROLE을 `(omit)`(index 59)로 리셋한다.

### 6-4. 종족↔장르 충돌 필터 (README와 동일, 재확인)

토글 ON이 기본값. 인간 분기에만 적용.
`genre.series === 'sf' && race.series === 'fantasy'` 또는 그 역이면 RACE를 index 0(`human`)으로 리셋.
OFF면 의도적 충돌 허용.

### 6-5. 규칙 적용 순서

개별 재추첨(reroll) 시에도 규칙이 유지되어야 한다. 확정 순서:

```
1. SUBJECT   → 게이팅 결정
2. FIGURES   → 6-2의 선행 조건
3. AGE       → 6-3의 선행 조건
4. GENDER    → 6-2 적용
5. ROLE      → 6-3 적용
6. RACE      → 6-4 적용
7. 나머지 (GENRE, BACKDROP, PROPS, LIGHTING, ANGLE)
```

잠긴(locked) 릴은 재추첨되지 않으므로, 잠긴 값이 규칙을 위반하는 상태가 생길 수 있다.
**이 경우 규칙보다 잠금이 우선한다.** 잠금은 사용자의 명시적 의도다.

---

## 7. 영속성 — 세션 한정

`localStorage` / `sessionStorage`를 **사용하지 않는다.**

- 로그(건짐 기록), 통계, 카운터(spins/wins), 접두·접미사 편집값, 슬라이더·토글 설정
- 전부 메모리에만 유지. 새로고침 시 초기화된다.

이유: 도구의 사용 패턴이 "한 세션 돌리고 결과 복사해서 나감"이며,
슬롯 후보군 갱신은 회차 단위로 수동 진행한다.

(README의 "log unbounded" 유지 — 세션 내에서는 무제한)

---

## 8. 가중치 — UI 조절 가능

README에 없는 신규 컨트롤이다. 컨트롤 패널에 추가한다.

### 8-1. 트리거 가중치 (SUBJECT 추첨 비율)

4개 값의 비율을 조절한다. 기본값:

| SUBJECT | 기본 가중치 |
|---|---|
| human 인간 | 40 |
| living creature 생물 | 20 |
| machine 기계 | 20 |
| structure / phenomenon 구조물·현상 | 20 |

UI: 슬라이더 4개 또는 숫자 입력 4개. 합이 100이 아니어도 상대 비율로 정규화한다.
(합계 강제보다 이쪽이 조작이 쉽다)

### 8-2. 종족 인간 비중

RACE 슬롯에서 `human`(index 0) + `(omit)`(index 1)이 뽑힐 확률.
기본값 **65%**. 나머지 35%가 index 2~19에 균등 분배된다.

UI: 슬라이더 1개, 0~100.

### 8-3. 컨트롤 패널 정리

추가되는 컨트롤이 많아 패널이 길어진다. 아래 그룹으로 묶는다.

```
[추첨 설정]
  조명 물리/연출     ─────●─────  50 / 50
  앵글 물리/연출     ─────●─────  50 / 50
  종족 인간 비중     ───────●───  65%
  주체 비율          인간 40 / 생물 20 / 기계 20 / 구조물 20

[출력 설정]
  화면비             [16:9  ▾]
  출력 개수          [1     ▾]
  종족·장르 충돌 필터  [ ON ]

[프롬프트]
  접두사             [illustration, ]
  접미사             [, highly detailed, sharp focus]
```

그룹 구분선 스타일은 README의 output card divider를 재사용한다.

---

## 9. 프롬프트 조립 — 변경 없음

README §"Prompt assembly"를 그대로 따른다. 접두/접미사 값만 §4로 바뀐다.

**인간 분기:**
```
{prefix}{genre}, {figures} of {gender} {age} {race} {role}, in {backdrop}, with {props}, {lighting}, {angle}{suffix}
```

**비인간 분기:**
```
{prefix}{genre}, [{gender} ]{subjectForm}[, {figures}], in {backdrop}, with {props}, {lighting}, {angle}{suffix}
```

- `subjectForm` = `a living creature` / `a machine` / `a structure or phenomenon`
- gender는 creature일 때만 앞에 붙음
- figures는 creature·machine에만 붙음 (structure 제외)
- `(omit)` / `(none)` / `no subject` 값은 제거
- props가 `(none)`이면 `with {props}` 절 전체 제거
- **화면비는 프롬프트 문자열에 넣지 않는다.** 출력 카드의 UI 칩으로만 표시

---

## 10. 카운터 — RATE 범위

README에 명시돼 있으나 프로토타입에서 400%가 표시된 사례가 있다. 재확인:

```
RATE = min(100, round(wins / spins * 100))
```

spins가 0이면 0%를 표시한다. 0으로 나누지 않는다.

---

## 11. 릴 초기값

README와 동일. 각 릴은 **해당 풀에서 가장 긴 영문 값**으로 초기화한다.
레이아웃 스트레스 테스트 목적이다.

조명·앵글이 확장됐으므로 초기값이 바뀐다:
- LIGHTING → `backlit silhouette` (또는 확장 후 최장값)
- ANGLE → `wide-angle distortion` (또는 확장 후 최장값)

SUBJECT는 `structure / phenomenon`이 최장이므로 게이팅된 4개 셀이 OFF 상태로 시작한다.
이 상태가 첫 화면이다.

---

## 12. 기술 스택

- **바닐라 HTML / CSS / JS**, 단일 페이지
- 빌드 도구 없음. `index.html`을 브라우저로 열면 동작
- 슬롯 데이터는 `slots.json`으로 분리
- 폰트는 README 지정대로 CDN 로드 (Archivo Narrow, Oswald, Noto Sans KR, DSEG7)
- 프레임워크 없음

`design-ref.html`은 Claude Design이 만든 참조물이다.
로직과 레이아웃의 참고 자료이며 **그대로 복사하지 않는다.**
(Design Component 형식 — `renderVals()` + `{{ }}` 템플릿 + `<sc-for>` — 은 이 프로젝트와 무관하다)

---

## 13. 파일 구조

```
prompt-slot-machine/
├── index.html
├── style.css
├── app.js
├── slots.json
└── docs/          ← 참조용, 배포에 불필요
```

---

## 14. 작업 순서

각 단계 완료 후 멈추고 확인받는다.

1. `slots_v2.md` + 본 문서를 근거로 `slots.json` 생성
   — 11개 슬롯, `{en, kr}` 쌍, 태그 필드(genre.series / race.series / lighting.tag / angle.tag / subject.type)
2. 정적 UI 구현 — README의 디자인 토큰·컴포넌트·상태 그대로
3. 스핀 / 잠금 / 개별 재추첨 로직
4. 프롬프트 조립 + §6 규칙 전체
5. 로그 뷰 + 통계
6. §8 가중치 컨트롤

---

## 15. 미해결 / 추후

아래는 이번 범위가 아니다. 구현하지 않는다.

- 힉스필드 등 이미지 생성 API 직접 연동
- 프롬프트 대량 배치 출력 (CSV 등)
- 슬롯 후보군 화면 내 편집
- 로그 영속화 및 회차 간 적중률 누적
- 시드 기반 조합 재현
