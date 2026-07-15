# 이미지 프롬프트 빌더 — 사양서

## 0. 목적
사용자가 장면 설명만 입력하면, 미리 정의된 토글 선택값을 조합해
Positive / Negative 프롬프트를 분리된 블록으로 출력한다.
자유 텍스트 입력은 "장면 설명" 하나뿐이며, 나머지는 전부 선택지에서 고른다.

---

## 1. 입력 구조

| 항목 | 방식 | 필수 |
|---|---|---|
| 장면 설명 | 자유 입력 (한국어 가능) | 필수 |
| 엔진 | 단일 선택 | 필수 |
| 타입 | 단일 선택 | 필수 |
| 프레이밍 | 단일 선택 | 선택 (기본: none) |
| 카메라 앵글 | 단일 선택 | 선택 (기본: none) |
| 조명 | 다중 선택 | 선택 |
| 연출 효과 | 다중 선택 | 선택 |
| 무드 | 다중 선택 | 선택 |
| 디테일 강도 | 단일 선택 | 기본: standard |
| 네거티브 강도 | 단일 선택 | 기본: standard |

---

## 2. 토글 정의

### 2.1 ENGINE (단일 선택) — 품질 접미사와 네거티브 어휘를 결정

| 값 | 라벨 | 품질 접미사 | 비고 |
|---|---|---|---|
| `generic` | 범용 SD/SDXL | `masterpiece, best quality, amazing quality, very aesthetic, highres, absurdres` | 기본값 |
| `nai` | NovelAI | `best quality, amazing quality, very aesthetic, highres` | masterpiece 제외 |
| `noob` | NoobAI / Illustrious | `masterpiece, best quality, very awa, very aesthetic, newest, absurdres, highres` | 연도 태그 포함 |
| `pony` | Pony 계열 | `score_9, score_8_up, score_7_up, masterpiece, best quality, highres` | score 태그 필수 |
| `photo` | 실사 / Flux | `photorealistic, 8k, UHD, high resolution, sharp focus, film grain` | 자연어 캡션 권장 |
| `mj` | Midjourney | (품질 태그 없음) | 네거티브를 `--no`로 변환 |

### 2.2 TYPE (단일 선택) — 화풍. 배타적이므로 반드시 하나만

| 값 | 삽입 태그 | 자동 네거티브 |
|---|---|---|
| `illustration` | `illustration` | `photo, 3d, realistic, cgi` |
| `anime` | `anime art style, anime screencap` | `photo, 3d, realistic, western comics` |
| `manga` | `shonen manga, monochrome, screentone` | `colored, photo, 3d` |
| `semi_real` | `semi realistic, manga realistic` | `flat color, cartoon` |
| `realistic` | `photorealistic, realistic` | `anime, cartoon, illustration, 3d render, painting, doll, plastic skin` |
| `watercolor` | `watercolor, traditional media` | `3d, cgi, digital art, photo` |
| `oil` | `oil painting, canvas, brush` | `3d, cgi, digital art, photo` |
| `sumie` | `sumi-e, monochrome, ink` | `colored, 3d, photo` |
| `ukiyoe` | `ukiyo-e, traditional media` | `3d, photo, western art` |
| `pixel` | `pixel art` | `smooth, blurry, photo, 3d, antialiasing` |
| `flat` | `flat color, ligne claire` | `realistic, photorealistic, 3d, gradient` |
| `western` | `american comics, graphic novel, high contrast` | `anime, photo, 3d` |
| `disney` | `disney, cartoon, 3d` | `anime, photo, realistic` |
| `art_deco` | `art deco, poster` | `photo, 3d` |
| `art_nouveau` | `art nouveau, intricate details` | `photo, 3d` |
| `cyberpunk` | `cyberpunk, neon lights` | `medieval, pastoral` |
| `dark_fantasy` | `dark fantasy, gothic fantasy` | `bright, cheerful, pastel` |
| `steampunk` | `steampunk, brass, gears` | `modern, futuristic` |
| `sketch` | `sketch, unfinished, graphite` | `flat color, 3d, photo, finished` |

> `realistic` 계열 타입 선택 시 ENGINE이 `photo`가 아니면 경고를 출력한다.

### 2.3 FRAMING (단일 선택)

| 값 | 태그 |
|---|---|
| `none` | — |
| `close_up` | `close-up` |
| `portrait` | `portrait, upper body` |
| `upper_body` | `upper body` |
| `cowboy` | `cowboy shot` |
| `lower_body` | `lower body` |
| `full_body` | `full body` |
| `wide` | `wide shot` |

### 2.4 ANGLE (단일 선택)

| 값 | 태그 |
|---|---|
| `none` | — |
| `eye_level` | `from front, eye level` |
| `from_above` | `from above, high-angle` |
| `from_below` | `from below, low-angle` |
| `from_behind` | `from behind` |
| `from_side` | `from side, profile` |
| `dutch` | `dutch angle, dynamic angle` |
| `overhead` | `from directly above, overhead shot` |

### 2.5 LIGHTING (다중 선택)

| 값 | 태그 |
|---|---|
| `sidelight` | `sidelighting` |
| `backlight` | `backlighting, rim light` |
| `chiaroscuro` | `chiaroscuro, high contrast` |
| `soft` | `soft lighting, diffused light` |
| `golden` | `golden hour, warm lighting` |
| `night` | `night, moonlight` |
| `neon` | `neon lights` |
| `light_rays` | `light rays, god rays` |
| `cinematic` | `cinematic lighting` |

### 2.6 EFFECT (다중 선택)

| 값 | 태그 |
|---|---|
| `bokeh` | `bokeh, depth of field` |
| `motion_blur` | `motion blur` |
| `speed_lines` | `speed lines` |
| `particles` | `light particle, floating particles` |
| `fire` | `fire, flame` |
| `spark` | `spark, lightning` |
| `magic` | `magical effect, glowing` |
| `glossy` | `glossy, lustrous skin` |
| `dynamic_pose` | `dynamic pose, action` |

### 2.7 MOOD (다중 선택)

| 값 | 태그 |
|---|---|
| `serene` | `serene, calm atmosphere` |
| `tense` | `tense, ominous atmosphere` |
| `melancholic` | `melancholic, muted colors` |
| `epic` | `epic, grand scale` |
| `cozy` | `cozy, warm atmosphere` |
| `eerie` | `eerie, unsettling` |
| `vivid` | `high saturation, vivid colors` |

### 2.8 DETAIL (단일 선택)

| 값 | 태그 | 설명 |
|---|---|---|
| `minimal` | — | 품질 접미사만. 화풍 개성 최대 보존 |
| `standard` | `highly detailed, sharp focus` | 기본값 |
| `high` | `highly detailed, intricate details, finely detailed, sharp focus, detailed background` | |
| `max` | `highly detailed, intricate details, finely detailed, hyper detail, sharp focus, detailed background, beautiful detailed eyes` | 개성 저하 위험 |

### 2.9 NEGATIVE_LEVEL (단일 선택)

| 값 | 설명 |
|---|---|
| `off` | 네거티브 없음 |
| `light` | 품질 계층만 |
| `standard` | 품질 + 해부학 + 워터마크 (기본값) |
| `strict` | standard + 구도/중복 오류까지 |

---

## 3. 네거티브 계층 정의

```
[L1_QUALITY]        worst quality, bad quality, normal quality, lowres, jpeg artifacts, blurry
[L1_QUALITY_NAI]    lowres, bad quality, worst quality, displeasing, very displeasing, jpeg artifacts
[L1_QUALITY_NOOB]   worst quality, bad quality, displeasing, very displeasing, lowres, jpeg artifacts, oldest, early, abstract
[L1_QUALITY_PHOTO]  worst quality, low quality, blurry, overexposed, underexposed

[L2_ANATOMY]        bad anatomy, bad hands, missing fingers, extra digits, fewer digits, extra limbs, deformed, mutated, malformed limbs, fused fingers

[L3_ARTIFACT]       watermark, signature, username, text, artist name, logo, dated, scan artifacts

[L4_STRICT]         cropped, out of frame, duplicate, multiple views, split screen, border, frame, jpeg noise, chromatic aberration
```

조합 규칙:
- `off` → 없음
- `light` → L1 (ENGINE별 변형 사용)
- `standard` → L1 + L2 + L3 + TYPE 자동 네거티브
- `strict` → L1 + L2 + L3 + L4 + TYPE 자동 네거티브

중복 태그는 최종 출력 전 제거한다.

---

## 4. 토큰 순서 (Positive 조립 순서)

```
1. TYPE 태그
2. 주제 / 피사체        ← 장면 설명에서 추출
3. 동작 / 포즈          ← 장면 설명에서 추출
4. 의상 / 외형          ← 장면 설명에서 추출
5. 배경 / 장소          ← 장면 설명에서 추출
6. FRAMING
7. ANGLE
8. LIGHTING
9. EFFECT
10. MOOD
11. DETAIL
12. ENGINE 품질 접미사
```

- 앞쪽 토큰일수록 가중치가 높다는 전제로 고정한다.
- ENGINE이 `pony`인 경우 score 태그를 **맨 앞**으로 이동한다.
- ENGINE이 `photo` 또는 `mj`인 경우 2~5번을 태그 나열 대신 **자연어 문장**으로 작성한다.
- 장면 설명이 한국어여도 출력 태그는 영어로 변환한다.

---

## 5. 출력 포맷

### 5.1 기본 (generic / nai / noob / pony)

````
## Settings
engine: noob | type: illustration | framing: wide | angle: from_above
lighting: chiaroscuro | detail: high | negative: standard

## Positive
```
illustration, a machine, a small group of people, in a council chamber,
potted plants, wide shot, from above, high-angle, chiaroscuro, high contrast,
highly detailed, intricate details, finely detailed, sharp focus,
detailed background, masterpiece, best quality, very awa, very aesthetic,
newest, absurdres, highres
```

## Negative
```
worst quality, bad quality, displeasing, very displeasing, lowres,
jpeg artifacts, oldest, early, abstract, bad anatomy, bad hands,
missing fingers, extra digits, deformed, mutated, watermark, signature,
username, text, artist name, logo, photo, 3d, realistic, cgi
```

## Notes
- (충돌 경고나 조정 제안이 있을 때만 출력)
````

### 5.2 Midjourney

````
## Positive
```
An illustration of a machine addressing a small group in a council chamber,
potted plants along the walls, dramatic chiaroscuro lighting, high-angle wide shot
--no photo, 3d, realistic, watermark, text, signature, bad anatomy
--ar 16:9 --style raw
```
````

### 5.3 네거티브 미지원 엔진
Negative 블록 대신 다음을 출력한다.
```
## Negative
이 엔진은 네거티브 프롬프트를 지원하지 않습니다.
대신 Positive에 반대 속성을 명시했습니다: (내용)
```

---

## 6. 동작 규칙

1. **Positive와 Negative를 절대 한 문자열로 합치지 않는다.** 별도 블록으로 출력한다.
2. 사용자가 토글을 지정하지 않으면 기본값(`generic` / `illustration` / `none` / `standard`)으로 진행하되, 사용한 기본값을 Settings에 표시한다.
3. TYPE과 ENGINE이 충돌하면(예: `realistic` + `nai`) 진행하되 Notes에 경고한다.
4. LIGHTING·EFFECT·MOOD는 합쳐서 최대 5개까지만 반영한다. 초과 시 앞 5개를 쓰고 Notes에 알린다.
5. 가중치 문법(`(tag:1.2)`)은 사용자가 명시적으로 요청할 때만 붙인다.
6. 출력 후 "변경할 토글이 있으면 말씀해 주세요"로 마무리하고, 재요청 시 기존 선택을 유지한 채 해당 항목만 교체한다.
7. 장면 설명이 모호하면 임의로 상상해 채우지 말고, 부족한 항목을 1개 질문으로 확인한다.

---

## 7. 사용자 호출 예시

```
장면: 회의실에 있는 기계와 소수의 사람들
engine: noob
type: illustration
framing: wide
angle: from_above
lighting: chiaroscuro
detail: high
```

또는 축약:
```
회의실의 기계와 사람들 / noob / illustration / wide / from_above / chiaroscuro
```
