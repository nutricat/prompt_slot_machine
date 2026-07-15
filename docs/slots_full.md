# 컨셉아트 프롬프트 조합 — 슬롯 전체 정의

버전: v1
용도: 무작위 조합 → 대량 생성 → 선별 → 초안 활용

---

## 슬롯 개요

| # | 슬롯 | 후보 수 | 적용 대상 | 비고 |
|---|---|---|---|---|
| 1 | 주체 유형 | 4 | 전체 | 분기 기준 |
| 2 | 성별 | 7 | 인간·생물 | 조건부 |
| 3 | 연령 | 6 | 인간 | 조건부 |
| 4 | 역할/직업 | 60 | 인간 | 조건부 |
| 5 | 종족/변형 | 20 | 인간 | 조건부 |
| 6 | 인물수·구도 | 10 | 인간·생물 | 조건부 |
| 7 | 장르 | 100 | 전체 | 확정 |
| 8 | 배경 | 80 | 전체 | 확정 |
| 9 | 소품 | 40 | 전체 | 확정 |
| 10 | 조명 | 14 | 전체 | 신규 |
| 11 | 앵글 | 8 | 전체 | 신규 |
| 12 | 매체 | 10 | 전체 | 신규 |

조건부 슬롯의 활성화 규칙은 스크립트에서 처리한다. 여기서는 후보군만 정의한다.

---

## 슬롯 1 — 주체 유형 (4)

| # | 유형 | 활성화되는 슬롯 |
|---|---|---|
| 1 | 인간 | 성별, 연령, 역할, 종족, 인물수 |
| 2 | 생물 | 성별, 인물수 |
| 3 | 기계 | 인물수 |
| 4 | 구조물·현상 | (없음) |

권장 가중치: 인간 40 / 생물 20 / 기계 20 / 구조물·현상 20

---

## 슬롯 2 — 성별 (7)

| # | 값 | 영문 키워드 |
|---|---|---|
| 1 | 남성 | male |
| 2 | 여성 | female |
| 3 | 성별 불명 | androgynous |
| 4 | 명시 안 함 | (omit) |
| 5 | 남성 집단 | a group of men |
| 6 | 여성 집단 | a group of women |
| 7 | 혼성 집단 | a mixed-gender group |

5~7은 슬롯 6(인물수)이 복수일 때만 유효. 단독일 땐 1~4만 추출.

---

## 슬롯 3 — 연령 (6)

| # | 값 | 영문 키워드 |
|---|---|---|
| 1 | 아동 | child |
| 2 | 청소년 | adolescent |
| 3 | 청년 | young adult |
| 4 | 중년 | middle-aged |
| 5 | 노년 | elderly |
| 6 | 명시 안 함 | (omit) |

주의: 아동·청소년은 슬롯 4의 일부 역할(처형인, 첩자 등)과 충돌한다. 스크립트에서 제외 규칙 필요.

---

## 슬롯 4 — 역할/직업 (60)

### 노동·생산 (1–12)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 1 | 대장장이 | blacksmith |
| 2 | 목수 | carpenter |
| 3 | 도공 | potter |
| 4 | 직조공 | weaver |
| 5 | 농부 | farmer |
| 6 | 어부 | fisherman |
| 7 | 광부 | miner |
| 8 | 벌목꾼 | lumberjack |
| 9 | 정비공 | mechanic |
| 10 | 건설 노동자 | construction worker |
| 11 | 요리사 | cook |
| 12 | 청소부 | janitor |

### 지식·기록 (13–22)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 13 | 학자 | scholar |
| 14 | 필경사 | scribe |
| 15 | 사서 | librarian |
| 16 | 지도제작자 | cartographer |
| 17 | 천문 관측자 | astronomer |
| 18 | 연금술사 | alchemist |
| 19 | 발명가 | inventor |
| 20 | 교사 | teacher |
| 21 | 통역사 | interpreter |
| 22 | 기록자 | chronicler |

### 의료·돌봄 (23–28)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 23 | 의사 | physician |
| 24 | 간호인 | nurse |
| 25 | 약제사 | apothecary |
| 26 | 산파 | midwife |
| 27 | 장의사 | undertaker |
| 28 | 수의사 | veterinarian |

### 권력·질서 (29–38)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 29 | 전사 | warrior |
| 30 | 경비병 | guard |
| 31 | 지휘관 | commander |
| 32 | 판관 | judge |
| 33 | 관리 | bureaucrat |
| 34 | 통치자 | ruler |
| 35 | 사절 | envoy |
| 36 | 첩자 | spy |
| 37 | 처형인 | executioner |
| 38 | 죄수 | prisoner |

### 신앙·의례 (39–44)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 39 | 사제 | priest |
| 40 | 무녀/샤먼 | shaman |
| 41 | 수도자 | monk |
| 42 | 점술가 | fortune teller |
| 43 | 순례자 | pilgrim |
| 44 | 이단자 | heretic |

### 이동·거래 (45–52)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 45 | 상인 | merchant |
| 46 | 밀수업자 | smuggler |
| 47 | 도둑 | thief |
| 48 | 사냥꾼 | hunter |
| 49 | 안내인 | guide |
| 50 | 전령 | messenger |
| 51 | 뱃사람 | sailor |
| 52 | 마부/운전수 | driver, coachman |

### 표현·기타 (53–60)

| # | 역할 | 영문 키워드 |
|---|---|---|
| 53 | 유랑 악사 | wandering musician |
| 54 | 광대 | jester |
| 55 | 화가 | painter |
| 56 | 무용수 | dancer |
| 57 | 이야기꾼 | storyteller |
| 58 | 배우 | actor |
| 59 | 운동선수 | athlete |
| 60 | 역할 없음 | (omit) |

---

## 슬롯 5 — 종족/변형 (20)

| # | 종족·변형 | 영문 키워드 | 계열 |
|---|---|---|---|
| 1 | 인간 | human | 중립 |
| 2 | 인간 (명시 안 함) | (omit) | 중립 |
| 3 | 엘프 | elf | 판타지 |
| 4 | 다크엘프 | dark elf | 판타지 |
| 5 | 드워프 | dwarf | 판타지 |
| 6 | 오크 | orc | 판타지 |
| 7 | 수인 (포유류) | beastfolk, anthropomorphic | 판타지 |
| 8 | 조인 | avian humanoid | 판타지 |
| 9 | 어인 | aquatic humanoid | 판타지 |
| 10 | 파충인 | reptilian humanoid | 판타지 |
| 11 | 식물인 | plant humanoid | 판타지 |
| 12 | 석상/골렘 | golem, stone construct | 판타지 |
| 13 | 언데드 | undead | 판타지·호러 |
| 14 | 유령체 | spectral being | 판타지·호러 |
| 15 | 의체화 인간 | cybernetic human | SF |
| 16 | 안드로이드 | android | SF |
| 17 | 돌연변이 | mutant | SF·호러 |
| 18 | 외계종 | alien species | SF |
| 19 | 가면/전신 은폐 | masked, fully shrouded | 중립 |
| 20 | 얼굴 없음 | faceless | 중립·호러 |

계열 태그는 스크립트에서 장르와 충돌 필터를 걸 때 쓴다.
예: 장르가 "냉전"이면 판타지 계열 종족 제외, 또는 그대로 허용(의도적 충돌).

권장: 1·2번(인간)에 가중치를 크게 줘서 60~70%가 인간으로 나오게 한다.

---

## 슬롯 6 — 인물수·구도 (10)

| # | 구성 | 영문 키워드 |
|---|---|---|
| 1 | 단독 | a lone figure |
| 2 | 2인 대치 | two figures facing each other |
| 3 | 2인 동행 | two figures side by side |
| 4 | 3인 그룹 | a group of three |
| 5 | 소집단 (4–6) | a small group |
| 6 | 군중 | a large crowd |
| 7 | 단독 + 관찰자 | one figure watched by another |
| 8 | 배경에 흩어진 다수 | scattered figures in the distance |
| 9 | 전경 1인 + 후경 다수 | one figure in foreground, many behind |
| 10 | 인물 없음 | no figures |

---

## 슬롯 10 — 조명 (14)

| # | 조명 | 영문 키워드 | 성격 |
|---|---|---|---|
| 1 | 흐린 날 확산광 | soft overcast light | 중립 (기준값) |
| 2 | 정오 직사광 | harsh midday sun | 강한 대비 |
| 3 | 골든아워 | golden hour | 따뜻함 |
| 4 | 블루아워 | blue hour | 차가움 |
| 5 | 역광 실루엣 | backlit silhouette | 형태 강조 |
| 6 | 측광 | strong side light | 입체감 |
| 7 | 하부 조명 | uplighting from below | 불안 |
| 8 | 단일 광원 | single light source | 집중 |
| 9 | 촛불/화염 | firelight, candlelight | 흔들림 |
| 10 | 형광등 | fluorescent lighting | 무미건조 |
| 11 | 네온 | neon lighting | 채도 높음 |
| 12 | 달빛 | moonlight | 저채도 |
| 13 | 안개 속 산란광 | diffused light in fog | 깊이감 |
| 14 | 무광원 (평면) | flat ambient light | 정보 전달용 |

컨셉아트 기본값은 1번과 14번. 나머지는 분위기 실험용.

---

## 슬롯 11 — 앵글 (8)

| # | 앵글 | 영문 키워드 | 용도 |
|---|---|---|---|
| 1 | 정면 | front view | 형태 확인 |
| 2 | 3/4 뷰 | three-quarter view | 가장 범용 |
| 3 | 측면 | side profile | 실루엣 |
| 4 | 등각 | isometric view | 구조물·공간 |
| 5 | 아이레벨 와이드 | eye-level wide shot | 맥락 |
| 6 | 하이앵글 오버뷰 | high-angle overview | 배치 파악 |
| 7 | 로우앵글 | low-angle shot | 위압감 |
| 8 | 정수리뷰 (탑다운) | top-down view | 평면 배치 |

7·8은 연출성이 강해 컨셉아트엔 덜 맞지만, 구조물 주체와 붙으면 유효.

---

## 슬롯 12 — 매체 (10)

| # | 매체 | 영문 키워드 | 완성도 |
|---|---|---|---|
| 1 | 컨셉아트 스케치 | concept art sketch | 낮음 |
| 2 | 러프 페인팅 | rough digital painting | 낮음 |
| 3 | 라인아트 | clean line art | 낮음 |
| 4 | 구아슈 습작 | gouache study | 중간 |
| 5 | 수채 습작 | watercolor study | 중간 |
| 6 | 잉크 담채 | ink and wash | 중간 |
| 7 | 마커 렌더링 | marker rendering | 중간 |
| 8 | 디지털 페인팅 | digital painting | 높음 |
| 9 | 매트 페인팅 | matte painting | 높음 |
| 10 | 3D 클레이 렌더 | 3D clay render | 높음 |

초안 목적이면 1~3번 가중치를 높이는 게 비용 면에서 유리.

---

## 조합 규모

인간 분기 기준:
7 × 6 × 60 × 20 × 10 × 100 × 80 × 40 × 14 × 8 × 10 ≈ 3.0 × 10^12

중복 걱정은 없다. 문제는 선별 비용이다.

---

## 스크립트에서 처리할 규칙 (메모)

1. 주체 유형에 따른 슬롯 활성/비활성
2. 인물수가 단독이면 성별 5~7 제외
3. 연령이 아동·청소년이면 역할 31·32·34·36·37 등 제외
4. 종족 계열과 장르 계열 충돌 처리 (허용 / 차단 선택 가능하게)
5. 시드 기록 — 건진 결과의 슬롯 값 역추적용
6. 슬롯별 가중치 설정 가능하게

---

## 프롬프트 조립 순서

```
{매체}, {장르},
{인물수} of {성별} {연령} {종족} {역할},
{주체 (비인간일 경우)},
in {배경}, with {소품},
{조명}, {앵글}
```

빈 슬롯(omit)은 조립 시 제거한다.
