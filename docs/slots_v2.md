# 컨셉아트 프롬프트 조합 — 슬롯 정의 최종본

버전: v2
용도: 무작위 조합 → 대량 생성 → 선별 → 초안 활용
변경: 매체 슬롯 삭제 / 조명 단순화(14→9) / 주체유형을 슬롯에서 트리거로 재배치

---

# 0. 트리거 — 주체 유형

슬롯이 아니다. 프롬프트 문자열에 들어가지 않는다.
어떤 슬롯을 켤지 정하는 분기 조건이다.

| 유형 | 켜지는 슬롯 |
|---|---|
| 인간 | 성별, 연령, 역할, 종족, 인물수 |
| 생물 | 성별, 인물수, 비인간 주체 |
| 기계 | 인물수, 비인간 주체 |
| 구조물·현상 | 비인간 주체 |

권장 가중치: 인간 40 / 생물 20 / 기계 20 / 구조물·현상 20

---

# 슬롯 개요

| # | 슬롯 | 후보 수 | 적용 대상 |
|---|---|---|---|
| 1 | 성별 | 7 | 인간·생물 |
| 2 | 연령 | 6 | 인간 |
| 3 | 역할/직업 | 60 | 인간 |
| 4 | 종족/변형 | 20 | 인간 |
| 5 | 비인간 주체 | 40 | 생물·기계·구조물 |
| 6 | 인물수·구도 | 10 | 인간·생물·기계 |
| 7 | 장르 | 100 | 전체 |
| 8 | 배경 | 80 | 전체 |
| 9 | 소품 | 40 | 전체 |
| 10 | 조명 | 9 | 전체 |
| 11 | 앵글 | 8 | 전체 |

매체는 슬롯이 아니라 고정값으로 처리한다. (→ 12절 참조)

---

# 1. 성별 (7)

| # | 값 | 영문 키워드 |
|---|---|---|
| 1 | 남성 | male |
| 2 | 여성 | female |
| 3 | 성별 불명 | androgynous |
| 4 | 명시 안 함 | (omit) |
| 5 | 남성 집단 | a group of men |
| 6 | 여성 집단 | a group of women |
| 7 | 혼성 집단 | a mixed-gender group |

5~7은 슬롯 6이 복수일 때만 유효.

---

# 2. 연령 (6)

| # | 값 | 영문 키워드 |
|---|---|---|
| 1 | 아동 | child |
| 2 | 청소년 | adolescent |
| 3 | 청년 | young adult |
| 4 | 중년 | middle-aged |
| 5 | 노년 | elderly |
| 6 | 명시 안 함 | (omit) |

---

# 3. 역할/직업 (60)

## 노동·생산 (1–12)
| # | 역할 | 영문 |
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

## 지식·기록 (13–22)
| # | 역할 | 영문 |
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

## 의료·돌봄 (23–28)
| # | 역할 | 영문 |
|---|---|---|
| 23 | 의사 | physician |
| 24 | 간호인 | nurse |
| 25 | 약제사 | apothecary |
| 26 | 산파 | midwife |
| 27 | 장의사 | undertaker |
| 28 | 수의사 | veterinarian |

## 권력·질서 (29–38)
| # | 역할 | 영문 |
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

## 신앙·의례 (39–44)
| # | 역할 | 영문 |
|---|---|---|
| 39 | 사제 | priest |
| 40 | 무녀/샤먼 | shaman |
| 41 | 수도자 | monk |
| 42 | 점술가 | fortune teller |
| 43 | 순례자 | pilgrim |
| 44 | 이단자 | heretic |

## 이동·거래 (45–52)
| # | 역할 | 영문 |
|---|---|---|
| 45 | 상인 | merchant |
| 46 | 밀수업자 | smuggler |
| 47 | 도둑 | thief |
| 48 | 사냥꾼 | hunter |
| 49 | 안내인 | guide |
| 50 | 전령 | messenger |
| 51 | 뱃사람 | sailor |
| 52 | 마부/운전수 | driver |

## 표현·기타 (53–60)
| # | 역할 | 영문 |
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

# 4. 종족/변형 (20)

| # | 종족 | 영문 | 계열 |
|---|---|---|---|
| 1 | 인간 | human | 중립 |
| 2 | 인간 (명시 안 함) | (omit) | 중립 |
| 3 | 엘프 | elf | 판타지 |
| 4 | 다크엘프 | dark elf | 판타지 |
| 5 | 드워프 | dwarf | 판타지 |
| 6 | 오크 | orc | 판타지 |
| 7 | 수인 | beastfolk | 판타지 |
| 8 | 조인 | avian humanoid | 판타지 |
| 9 | 어인 | aquatic humanoid | 판타지 |
| 10 | 파충인 | reptilian humanoid | 판타지 |
| 11 | 식물인 | plant humanoid | 판타지 |
| 12 | 골렘 | golem | 판타지 |
| 13 | 언데드 | undead | 판타지·호러 |
| 14 | 유령체 | spectral being | 판타지·호러 |
| 15 | 의체화 인간 | cybernetic human | SF |
| 16 | 안드로이드 | android | SF |
| 17 | 돌연변이 | mutant | SF·호러 |
| 18 | 외계종 | alien species | SF |
| 19 | 가면/은폐 | masked figure | 중립 |
| 20 | 얼굴 없음 | faceless | 중립·호러 |

권장: 1·2번에 가중치를 크게 줘 60~70%가 인간이 되게 한다.
계열 태그는 장르 충돌 필터용. 필터를 끄면 의도적 충돌(냉전 + 엘프)이 발생한다.

---

# 5. 비인간 주체 (40)

트리거가 생물·기계·구조물일 때 활성.

## 생물 (1–14)
| # | 주체 | 영문 |
|---|---|---|
| 1 | 대형 포식자 | a large predator |
| 2 | 초식 거수 | a massive herbivore |
| 3 | 새 떼 | a flock of birds |
| 4 | 거대 곤충 | a giant insect |
| 5 | 해양 생물 | a sea creature |
| 6 | 파충류 | a reptile |
| 7 | 유제류 | a hoofed animal |
| 8 | 고양잇과 | a feline |
| 9 | 개과 | a canine |
| 10 | 식물성 생명체 | a plant-like creature |
| 11 | 균류 군집 | a fungal colony |
| 12 | 무정형 생물 | an amorphous creature |
| 13 | 날개 달린 짐승 | a winged beast |
| 14 | 알/고치 | an egg, a cocoon |

## 기계 (15–26)
| # | 주체 | 영문 |
|---|---|---|
| 15 | 인간형 로봇 | a humanoid robot |
| 16 | 사족 보행 기계 | a quadruped machine |
| 17 | 소형 드론 | a small drone |
| 18 | 대형 작업 기계 | heavy industrial machinery |
| 19 | 지상 탈것 | a ground vehicle |
| 20 | 비행 탈것 | a flying vehicle |
| 21 | 수상 탈것 | a watercraft |
| 22 | 버려진 기계 | an abandoned machine |
| 23 | 자동인형 | an automaton |
| 24 | 거대 구조 기계 | a colossal machine structure |
| 25 | 통신 장치 | a communication device |
| 26 | 무기 | a weapon |

## 구조물·현상 (27–40)
| # | 주체 | 영문 |
|---|---|---|
| 27 | 문/관문 | a gate |
| 28 | 탑 | a tower |
| 29 | 계단 | a staircase |
| 30 | 다리 | a bridge |
| 31 | 기념비 | a monument |
| 32 | 제단 | an altar |
| 33 | 폐허가 된 건물 | a ruined building |
| 34 | 거대 조각상 | a colossal statue |
| 35 | 빛의 현상 | a phenomenon of light |
| 36 | 균열 | a fissure |
| 37 | 부유하는 덩어리 | a floating mass |
| 38 | 그림자 존재 | a presence made of shadow |
| 39 | 거울/반사면 | a mirror surface |
| 40 | 주체 없음 | no subject |

---

# 6. 인물수·구도 (10)

| # | 구성 | 영문 |
|---|---|---|
| 1 | 단독 | a lone figure |
| 2 | 2인 대치 | two figures facing each other |
| 3 | 2인 동행 | two figures side by side |
| 4 | 3인 그룹 | a group of three |
| 5 | 소집단 | a small group |
| 6 | 군중 | a large crowd |
| 7 | 단독 + 관찰자 | one figure watched by another |
| 8 | 배경에 흩어진 다수 | scattered figures in the distance |
| 9 | 전경 1인 + 후경 다수 | one figure in foreground, many behind |
| 10 | 인물 없음 | no figures |

---

# 7. 장르 (100)

## SF (1–20)
cyberpunk / solarpunk / biopunk / steampunk / dieselpunk / atompunk / clockpunk / nanopunk / space opera / hard science fiction / post-apocalyptic / dystopian / utopian / cosmic horror / cyber noir / transhumanism / terraforming / generation ship / time travel / alternate history

## 판타지 (21–40)
high fantasy / low fantasy / dark fantasy / grimdark / urban fantasy / fairytale / mythic epic / sword and sorcery / magic academy / animism / underworld / celestial realm / dragon lore / arthurian legend / norse mythology / greek mythology / celtic folklore / slavic folklore / xianxia / hindu mythology

## 호러 (41–55)
gothic horror / body horror / folk horror / psychological horror / analog horror / liminal space / creepypasta / zombie / vampire / werewolf / ghost / cult ritual / deep sea horror / space horror / the backrooms

## 역사·시대 (56–70)
ancient egypt / ancient rome / medieval europe / viking age / renaissance / baroque / victorian era / belle epoque / art nouveau / art deco / jazz age / film noir / cold war / 1980s retro / Y2K aesthetic

## 지역·문화 (71–85)
edo period japan / korean joseon / wuxia / mongolian nomad / arabian nights / west african / mayan aztec / andean incan / polynesian / aboriginal australian / inuit arctic / balkan / persian / tibetan / southeast asian tropical

## 장르 형식 (86–95)
western / spy thriller / heist / courtroom drama / sports / slice of life / absurdist comedy / road movie / survival / military

## 실험·추상 (96–100)
surrealism / dadaism / brutalism / minimalism / object-oriented

각 항목의 상세 설명은 별도 파일 `genre_100.md` 참조.

---

# 8. 배경 (80)

## 자연 — 지형 (1–14)
dense pine forest / tropical rainforest / desert dunes / rocky canyon / mountain ridge / tundra plain / wetland swamp / open grassland / volcanic field / glacier / limestone cave / coastal cliff / tidal flat / karst peaks

## 자연 — 수계·천체 (15–24)
river delta / base of a waterfall / middle of a lake / deep ocean floor / just below the water surface / foggy bay / open field under night sky / above the cloud layer / asteroid surface / low orbit

## 도시 — 야외 (25–38)
narrow back alley / major intersection / open-air market / rooftop / under a bridge / pedestrian overpass / public square / dock / construction site / demolition zone / parking lot / elevated highway / cemetery / city park

## 도시 — 실내 (39–54)
stairwell / waiting room / long corridor / inside an elevator / underground garage / warehouse / library stacks / auditorium / bathroom / kitchen / attic / basement / greenhouse / laundromat / convenience store at night / empty office floor

## 기능 공간 (55–66)
factory interior / power plant / water treatment plant / sewer tunnel / subway platform / airport gate / train carriage / hospital ward / laboratory / control room / hangar / quarry

## 의례·권위 공간 (67–74)
temple interior / throne room / council chamber / prison cell block / theater stage / museum gallery / bathhouse / arena

## 경계·이행 공간 (75–80)
ruins / border checkpoint / remote rest stop / lighthouse / endless staircase / featureless void

---

# 9. 소품 (40)

(none) / a lantern / candles / an open book / a map / a letter / a key / a lock / chains / rope / a ladder / a chair / a table / a bed / a suitcase / stacked crates / ceramic jars / glass bottles / a teacup / prepared food / a musical instrument / a clock / a hand mirror / an umbrella / a pair of shoes / piled clothing / a doll / stacks of paper / hand tools / tangled cables / exposed pipes / gauges and dials / screens / a sign / banners / potted plants / bones / debris / a puddle / drifting smoke

---

# 10. 조명 (9)

| # | 조명 | 영문 |
|---|---|---|
| 1 | 흐린 날 | overcast |
| 2 | 직사광 | direct sunlight |
| 3 | 역광 | backlit |
| 4 | 측광 | side lit |
| 5 | 하부광 | lit from below |
| 6 | 단일 광원 | single light source |
| 7 | 실내광 | indoor lighting |
| 8 | 야간 | night |
| 9 | 평면광 | flat lighting |

전부 물리적 사실만 서술한다. 분위기는 장르 슬롯이 담당한다.

---

# 11. 앵글 (8)

| # | 앵글 | 영문 |
|---|---|---|
| 1 | 정면 | front view |
| 2 | 3/4 뷰 | three-quarter view |
| 3 | 측면 | side profile |
| 4 | 등각 | isometric view |
| 5 | 아이레벨 와이드 | eye-level wide shot |
| 6 | 하이앵글 오버뷰 | high-angle overview |
| 7 | 로우앵글 | low-angle shot |
| 8 | 탑다운 | top-down view |

---

# 12. 매체 — 고정값

슬롯 아님. 모든 프롬프트에 동일하게 붙인다.

```
concept art sketch, rough digital painting, muted palette
```

이유: 초안이 목적이므로 완성도를 변수로 둘 이유가 없다.
장르 슬롯이 이미 화풍을 함축하고 있어 매체를 슬롯으로 두면 충돌한다.

---

# 13. 조합 규모

인간 분기 기준:
7 × 6 × 60 × 20 × 10 × 100 × 80 × 40 × 9 × 8 ≈ 1.9 × 10^12

---

# 14. 프롬프트 조립 순서

```
concept art sketch, rough digital painting,
{장르},
{인물수} of {성별} {연령} {종족} {역할},
in {배경}, with {소품},
{조명}, {앵글},
muted palette
```

비인간 분기:
```
concept art sketch, rough digital painting,
{장르},
{비인간 주체}, {인물수},
in {배경}, with {소품},
{조명}, {앵글},
muted palette
```

`(omit)` 값은 조립 시 제거한다.

---

# 15. 스크립트 처리 규칙 (메모)

1. 트리거(주체 유형)에 따른 슬롯 활성/비활성
2. 인물수가 단독이면 성별 5~7 제외
3. 연령이 아동·청소년이면 역할 31·32·34·36·37 제외
4. 종족 계열 ↔ 장르 계열 충돌 필터 (on/off 선택 가능)
5. 시드 기록 — 건진 결과의 슬롯 값 역추적용
6. 슬롯별 가중치 설정 가능하게
7. 장르별 적중률 로그 — 2회차 후보군 갱신용
