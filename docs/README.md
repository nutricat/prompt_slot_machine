# Handoff: AI Prompt Slot Machine (컨셉아트 프롬프트 조합기)

## Overview
A web tool that randomly combines 11 slot categories into an English image-generation prompt.
The result is displayed as a copyable prompt string (+ negative prompt + Korean gloss), which the
user pastes into an external image generator. Users can **lock** slots they like and re-spin the
rest, **collect (건짐)** favorite combinations into a log, and inspect per-category hit-rate stats.

Visual concept: a modern (post-2000s) electronic casino slot-machine cabinet — large screen,
multi-payline grid, big gel buttons (no physical lever), reel-spin light bloom, and locked-reel
highlighting. **Neon direction**: dark ground with high-chroma magenta/cyan accents.

## About the Design Files
The file in this bundle (`Slot Machine.dc.html`) is a **design reference created in HTML** — a
working prototype showing the intended look and behavior. It is **not production code to copy
directly**. The task is to **recreate this design in the target codebase's existing environment**
(React, Vue, Svelte, etc.) using its established patterns, state management, and component library.
If no environment exists yet, pick the most appropriate framework and implement there.

Note: the prototype is authored as a "Design Component" — a class with a `renderVals()` method that
returns values consumed by an HTML template with `{{ }}` holes and `<sc-for>`/`<sc-if>` control
flow. Treat this purely as a reference for logic and layout; reimplement idiomatically.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, states, and interactions are all
specified. Recreate the UI pixel-closely using the codebase's own libraries. All slot data is real
(from `slots_v2.md`) and should be carried over verbatim.

---

## Layout

Single centered cabinet, `max-width: 1240px`, padding `22px`, `border-radius: 22px`,
`border-top: 3px solid` magenta, dark gradient background. Three stacked regions:

1. **Marquee (header row)** — flex, space-between:
   - Left: overline "RANDOM PROMPT", title "SLOT MACHINE", Korean subtitle "AI 이미지 프롬프트 조합기".
   - Center: view toggle — two buttons `머신` (machine) / `로그` (log).
   - Right: three 7-segment counter tiles — SPINS, 건짐 (wins), RATE (%).

2. **Machine view** (`머신`):
   - **Reel grid** — `display:grid; grid-template-columns:repeat(5,1fr); gap:9px`, inside an inset
     panel. 5 columns × 3 rows = 15 cells: 11 reels + 4 blank filler cells.
     - Row 1: GENRE · BACKDROP · PROPS · LIGHTING · ANGLE
     - Row 2: SUBJECT · GENDER · AGE · ROLE · RACE
     - Row 3: FIGURES · (4 blanks)
     - Each reel cell `aspect-ratio: 3 / 3.1`.
   - **Button row** — flex: big gel **SPIN** button (flex:1), **건짐 (COLLECT)** button (172px),
     and a stacked pair of small buttons (전체 잠금 해제 / 출력 비우기).
   - **Output + controls** — `grid-template-columns: 1.55fr 1fr`:
     - Left: result output list (stacks newest-first).
     - Right: controls panel.

3. **Log view** (`로그`) — `grid-template-columns: 1fr 340px`:
   - Left: collected-combination log list.
   - Right: per-category hit-rate stat bars.

---

## Components

### 1. Reel cell
Vertical flex: category label (top) → value block (center) → lock/reroll button row (bottom).
A small status tag sits absolutely top-right. Value = English (primary, `Archivo Narrow` 600,
~13–17px, `clamp(12px,1.45vw,17px)`) with Korean gloss beneath (`Noto Sans KR` 400, ~9px, muted).
English value uses `text-wrap: pretty` to handle length variance ("elf" → "one figure in
foreground, many behind"). Each cell has a **lock toggle** (left) and **individual reroll** (right).

Five states:
| State | 한글 tag | Border | Effect |
|---|---|---|---|
| idle 대기 | 대기 | `--edge` (#2c2242) | inset shadow only |
| spinning 회전중 | 회전중 | `--acc` (#22e0ff) | value `filter:blur(1.3px); opacity:.85`, outer glow |
| stopped 정지 | 정지 | `--acc` | value → `--win` with bloom `0 0 24px 2px var(--winglow)` (transient ~650ms) |
| locked 잠김 | 잠김 (chip) | `--lock` (#22e0ff) | `lockpulse` keyframe (glow breathes 1.8s), filled lock icon |
| disabled 비활성 | 비활성 | rgba(255,255,255,.05) | background `--dis`, 45° hatch overlay, content replaced by centered "OFF" |

### 2. SPIN button (main, gel)
Flex:1, `border-radius:15px`, radial-gradient face
`radial-gradient(130% 95% at 50% 8%, var(--gelHi), var(--gel) 48%, var(--gelLo) 100%)`,
convex highlight + hard bottom edge:
`box-shadow: 0 7px 0 var(--gelLo), 0 15px 22px rgba(0,0,0,.5), inset 0 3px 6px rgba(255,255,255,.5), inset 0 -7px 14px rgba(0,0,0,.35)`.
Contains a dice icon + "SPIN" (Oswald 700 24px) + "전체 재추첨". On spin: press-down transform
(`translateY(3px)`, reduced bottom edge) and dimmed while any reel is spinning.

### 3. 건짐 (COLLECT) button
172px, magenta border, dark face, `box-shadow: 0 0 18px var(--winglow)`. Three blinking lamp dots
(`lamp` keyframe, staggered .33s), "건짐" (Oswald 700 18px, `--win`, bloom) + "COLLECT" sub-label.
Casino win-indicator feel.

### 4. Result output card
Black inset card, `border-radius:10px`, `glowin` entry animation. Full English prompt (`Archivo
Narrow` 500 13px), per-card **복사 (copy)** button (label → "복사됨" for 1.2s) and a **건짐** button.
Divider → `NEG` label (magenta) + negative prompt (muted). Footer: Korean gloss (left) + aspect
chip (right, e.g. "16:9"). Empty state: dashed card "NO RESULT / SPIN을 눌러 프롬프트를 뽑으세요".

### 5. Controls panel
- **Slider** — 물리/연출 비율 (physical/staging ratio), 0–100, gel thumb; label shows `{phys} / {dir}`.
- **Dropdowns** — 화면비 (10 aspects: 16:9, 9:16, 1:1, 4:3, 3:2, 21:9, 2:3, 3:4, 5:4, 4:5) and
  출력 개수 (1, 2, 3, 4, 6). Custom caret, native `<select>` restyled.
- **Toggle** — 종족·장르 충돌 필터 (conflict filter), pill switch, glows cyan when ON.
- **Text inputs** — 접두사 (prefix) and 접미사 (suffix), black inset fields.

### 6. 7-segment counters
Black tiles, `DSEG7-Classic Bold` font (from `dseg` npm, loaded via `@font-face`). SPINS (cyan,
zero-padded 4), 건짐/wins (magenta, 4), RATE (cyan, `NN%`, clamped 0–100).

### 7. Log view
- Entry cards: DSEG7 timestamp (HH:MM:SS) + aspect chip, full prompt, and value chips
  (genre / subject / role / lighting).
- Stat panel: for GENRE, BACKDROP, LIGHTING, ANGLE, ROLE, FIGURES — the most-frequent value in the
  log + its % as a gradient bar (magenta→cyan). Empty state: "EMPTY LOG".

---

## Interactions & Behavior

- **SPIN (전체 재추첨)**: spins all *enabled, unlocked* reels. Reels stop left→right, staggered
  (~650ms + index×150ms + jitter). Each reel flickers value every 70ms while spinning, lands on a
  random index, flashes the "stopped/bloom" state ~650ms, then generates output(s).
- **Per-cell reroll**: spins only that reel (ignored if locked or disabled).
- **Lock toggle**: locked reels are excluded from SPIN and reroll; shown with pulsing highlight.
- **전체 잠금 해제 / 출력 비우기**: clear all locks / clear the output list.
- **건짐 (collect)**: pushes the current top output (or per-card output) into the log and increments
  wins. RATE = `min(100, round(wins/spins*100))`.
- **View toggle**: 머신 ↔ 로그.
- Output list capped at 40; log unbounded (newest first).

### SUBJECT trigger gating (critical)
The SUBJECT reel value gates the four row-2 cells. It is a **branch condition, not part of the
prompt string phrasing for humans** (see assembly).
| SUBJECT type | GENDER | AGE | ROLE | RACE |
|---|---|---|---|---|
| human 인간 | ✅ | ✅ | ✅ | ✅ |
| living creature 생물 | ✅ | ❌ | ❌ | ❌ |
| machine 기계 | ❌ | ❌ | ❌ | ❌ |
| structure / phenomenon 구조물·현상 | ❌ | ❌ | ❌ | ❌ |
Disabled cells render the "OFF" disabled state and are skipped by spin/reroll/lock.

### Prompt assembly (§14 grammar)
Fixed prefix `concept art sketch, rough digital painting, ` and suffix `, muted palette` come from
the editable prefix/suffix fields.

- **Human branch**:
  `{prefix}{genre}, {count} of {gender} {age} {race} {role}, in {backdrop}, with {props}, {lighting}, {angle}{suffix}`
- **Non-human branch** (creature/machine/structure):
  `{prefix}{genre}, [{gender} ]{subjectForm}[, {count}], in {backdrop}, with {props}, {lighting}, {angle}{suffix}`
  where `subjectForm` = "a living creature" / "a machine" / "a structure or phenomenon". Gender is
  prepended only for creature; count is appended for creature & machine (not structure).

Removal rules: any value equal to `(omit)`, `(none)`, or `no subject` is dropped; `with {props}` is
omitted when props = `(none)`. **The aspect ratio is NOT written into the prompt string** — it only
shows as a UI chip on the output card.

### Conflict filter (종족·장르 충돌 필터, ON by default)
Applies to the **human** branch only (race is human-only). Each genre carries a series tag
(`sf` / `fantasy` / `horror` / null) and each race a series tag (`fantasy` / `sf` / `neutral`).
When ON and there is a clash — `genre.series === 'sf' && race.series === 'fantasy'`, or
`genre.series === 'fantasy' && race.series === 'sf'` — race is reset to index 0 (`human`).
When OFF, intentional clashes (e.g. 냉전 + 엘프) are allowed.

### Initial display values
Each reel initializes to **the longest English value in its pool** (layout stress-test). This makes
SUBJECT start on "structure / phenomenon", so all four gated cells start in the OFF state.

---

## State Management
- `view`: 'machine' | 'log'
- `reels`: per-slot `{ i: valueIndex, locked: boolean }`
- `spinning`: per-slot boolean; `landed`: per-slot boolean (transient bloom)
- `outputs`: array of `{ en, neg, kr, aspect, v }` (v = the value-index map, for re-collection/seed)
- `log`: array of collected outputs `{ ts, en, neg, kr, aspect, v }`
- `spins`, `wins` counters
- `physRatio` (0–100), `aspect` (string), `count` (int), `conflict` (bool), `prefix`, `suffix`
- `copied`: key of the output whose copy was just clicked (for the 1.2s "복사됨" flash)

Spin uses per-reel `setInterval` (70ms) cleared by per-reel `setTimeout`; clear all on unmount.

---

## Design Tokens

Colors (Neon direction):
```
--bg:        #070610   page ground (radial gradient #120e22 → #050409)
--cab:       linear-gradient(180deg,#100d1c,#0a0814)  cabinet
--surface:   #0a0812   inset panels
--cell:      linear-gradient(180deg,#15101f,#0c0913)  reel face
--edge:      #2c2242   borders
--label:     #7de3ff   category labels
--val:       #eef2ff   primary value text
--kr:        #6f6a92   Korean gloss / muted
--acc:       #22e0ff   cyan accent
--acc2:      #ff2d95   magenta accent
--lock:      #22e0ff   locked highlight
--lockglow:  rgba(34,224,255,.55)
--dis:       #0d0b14   disabled/control ground
--distext:   #3f3b52   disabled text
--win:       #ff8fd0   win/collect highlight
--winglow:   rgba(255,45,149,.6)
--seg:       #22e0ff   7-seg display
--gelHi:#ff9fd0  --gel:#ff2d95  --gelLo:#a3005a  --gelText:#fff0f7  (gel button)
```
Radii: cells/cards 9–10px, panels 12–14px, cabinet 22px, buttons 15px, chips 4–6px.
Spacing: grid gap 9px; panel padding 13–16px; cabinet padding 22px.

Typography:
- **Archivo Narrow** (400–700) — reel English values, prompt text, dropdown values, inputs.
- **Oswald** (400–700) — labels (uppercase, wide `letter-spacing` .14–.4em), button text, tags.
- **Noto Sans KR** (400–700) — Korean gloss/captions (smaller, weaker than English).
- **DSEG7-Classic Bold** — all numeric counters/timestamps. Loaded via
  `@font-face` from `https://cdn.jsdelivr.net/npm/dseg@0.46.0/fonts/DSEG7-Classic/DSEG7Classic-Bold.woff2`.

Keyframes: `lockpulse` (locked glow), `lamp` (collect lamps), `glowin` (output entry),
reel-spin handled in JS via interval (not CSS).

## Assets
No image assets. Icons (lock, reroll ↻, dice) are inline SVG. Fonts from Google Fonts (Archivo
Narrow, Oswald, Noto Sans KR) + `dseg` npm for the 7-segment face.

## Slot Data
All 11 pools are embedded in the prototype's constructor and mirror `slots_v2.md` verbatim:
GENRE (100, each tagged sf/fantasy/horror/null for the conflict filter), BACKDROP (80), PROPS (40,
incl. `(none)`), LIGHTING (9), ANGLE (8), SUBJECT (4, typed), GENDER (7), AGE (6), ROLE (60),
RACE (20, each tagged fantasy/sf/neutral), FIGURES/count (10). Carry these over exactly; each value
is an `{ en, kr }` pair (+ series/type tag where noted).

## Screenshots
- `screenshots/01-machine-view.png` — initial machine view (reels at longest values; SUBJECT=structure so the 4 gated cells show OFF).
- `screenshots/02-human-and-output.png` — human subject (all 4 cells active), gel SPIN + 건짐 buttons, output cards, controls panel.
- `screenshots/03-log-view.png` — 건짐 log entries + per-category hit-rate stat bars.

## Files
- `Slot Machine.dc.html` — the full hifi prototype (logic + template) in this bundle.
- `slots_v2.md` — original slot definitions (source of truth for all values & the §14 grammar).
