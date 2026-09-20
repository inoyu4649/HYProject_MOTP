# 「과거의 추억」 모드 만들기

> 이 문서는 **모드를 만드는 사람**을 위한 것이다. 예시 모드 둘은 `examples/mods/`에 있고,
> 그대로 복사해서 고치는 것이 가장 빠른 시작이다.
>
> **모드는 다운로드판(PC판)에만 있다.** 웹 데모에는 로더 코드가 아예 안 들어간다.

## 0. 한 줄 요약

> **모드는 「무엇을 대신 읽을지」만 정한다. 무엇을 할지는 안 정한다.**

## 1. 어디에 두는가

`MOTP.exe` 옆에 `mods/` 폴더를 **직접 만들고** 그 안에 넣는다. 두 가지 모양을 다 받는다:

```
MOTP.exe
res/
mods/
  my-mod/            ← 폴더 그대로 (만드는 동안 편하다)
    mod.json
  someone-else.zip   ← 압축 그대로 (받는 사람에게 편하다)
```

`mods/`가 없으면 **없는 채로 게임이 성립한다.** 게임이 그 폴더를 만들지 않는다.

zip은 처음 켤 때 `mods/.cache/`에 한 번 풀리고, 같은 zip이면 다시 안 푼다.
`.cache/`는 **지워도 되는 폴더**다.

## 2. `mod.json`

```jsonc
{
  "id": "kr.example.my-mod",     // 필수. 영문/숫자/. _ - 만. **겹치면 양쪽 다 안 켜진다**
  "name": { "ko": "내 모드", "en": "My Mod", "ja": "私のモッド" },  // 또는 문자열 하나
  "version": "1.0.0",            // 필수
  "gameVersion": "0.5.x",        // 지원 게임 버전(아래 3절). 안 맞으면 **켜지되 경고**
  "author": "…",
  "description": { "ko": "…" },

  "assets": {                    // 논리 ID로 그림 덮기
    "photo.grad-group-1": "res/user/mine.png"
  },
  "fonts": {                     // 글꼴 갈아 끼우기 (FONTS 레지스트리의 키를 대신한다)
    "nanumYeDangCe": { "file": "fonts/my-hand.woff2", "family": "My Hand" }
  },
  "languages": [ /* 7절 */ ],
  "entry": "main.js",            // Advanced. **이 줄이 있으면 ⚠ + 별도 동의**
  "capabilities": ["events", "mixin"]   // Advanced가 쓸 창구(13절). 안 적은 창구는 부르면 던진다
}
```

## 3. 지원 게임 버전

한 버전이 아니라 **범위**를 적는다. 모드는 게임보다 오래 살고, 게임이 0.5.0으로 올라갈 때마다
멀쩡한 모드가 전부 경고를 달면 사람이 경고를 안 읽게 되기 때문이다.

지금 게임 버전은 **`0.5.2`**이다(타이틀 화면 왼쪽 아래에 적혀 있다).

| 적는 법 | 뜻 |
|---|---|
| `"0.5.0"` | 그 버전 하나 |
| `"0.5.x"` | **0.5 줄 전부** |
| `"0.x"` / `"*"` | 그 위 전부 / 전부 |
| `{ "min": "0.5.0" }` | 그 뒤로 쭉 |
| `{ "min": "0.5.0", "max": "0.9.x" }` | **양끝 포함** |

**안 맞아도 거부하지 않는다** — 켜지고, 로그에 경고 한 줄이 남는다.
어긋나면 그 모드부터 의심하라는 표시일 뿐이다.

## 4. 폴더 구조 — 덮을 수 있는 열한 갈래

```
my-mod/
  mod.json
  res/                      ← ① 그림  ② 소리   원본 res/와 **같은 구조, 같은 경로**
    audio/bgm/dorm.ogg
    user/HYHS_88th_grad_group1.png
  data/                     ← JSON 레지스트리 패치(깊은 병합)
    items.json              ← 소지품
    bgm.json                ← ② 선곡·음량        sfx.json ← ② 효과음 음량
    objectives.json         ← ⑤ 목표 (6절)
    difficulty.json         ← ⑦ 난이도 조율 (5절)
    achievements.json       ← 도전과제 (14절, v0.5.0)
    flags.json               ← 플래그 (14절, v0.5.0)
  maps/                     ← ③ 맵/타일/개요도 — 파일 이름이 아니라 **JSON 안의 id**가 정본
    M-4F-corridor.json
  fonts/                    ← ④ 글꼴 (mod.json의 fonts가 어느 키를 대신하는지 적는다)
    my-hand.woff2
  locales/                  ← ⑥ 대사·독백, 그리고 모든 글
    ko/ch2.json
  main.js                   ← ⑧ Advanced (8·13절)
```

**깊은 병합이고 배열은 통째 교체다.** `items.json`에서 `title.ko` 하나만 고쳐도
`title.en`·`ja`는 그대로 남는다. 다만 `descriptionWhen` 같은 **배열은 통째로** 바뀐다
(부분 병합하면 순서가 정의되지 않는다).

**`$`로 시작하는 최상위 키는 못 건드린다** — `bgm.json`의 `$readme`에 BGM 규칙 설명 전체가
적혀 있고, 덮이면 다음 사람이 읽을 글이 사라진다.

**개요도·미니맵은 맵에서 파생한다** — 맵을 덮으면 셋이 함께 바뀐다. 따로 손댈 것이 없다.
**새 타일 그림**(절차적 드로잉)은 Advanced이지만, legend로 **있는 타일을 다시 배치**하는
것은 JSON만으로 된다.

## 5. `data/difficulty.json` — 난이도 조율

**숫자와 불리언만 내려온다.** 여섯이라는 개수·해금 사다리·엔딩 조건은 코드에 남는다
(일곱째 난이도를 만드는 것은 Advanced다).

```jsonc
{
  "patrolSpeedScale": { "extreme": 1.8 },
  "fogLimit": { "normal": 5 },
  "fireplaceHints": { "superHard": true },
  "chasePulse": { "extreme": { "spikeMult": 1.12 } }   // 빠뜨린 칸은 원본에서 메운다
}
```

조율할 수 있는 축: `prologueSeconds` `hintBudget` `pressWindowScale` `patrolSpeedScale`
`fogLimit` `shaftMarginScale` `chaseDelayMs` `chaseSpawnAheadScale` `callIntervalScale`
`stageHintsEverywhere` `fireplaceHints` `darkroomBathPenalty` `darkroomRewinds` `chasePulse`.

> **감사기가 당신의 값에도 돈다.** Ch2 추격을 「필연 피격」으로 만들거나 암실을 통과 불가능하게
> 만드는 값을 넣으면 **그 조율값이 통째로 물러나고** `logs/`에 이유가 적힌다.
> 릴리스 빌드에서도 돈다.

## 6. `data/objectives.json` — 목표

목표의 **조건**은 대부분 플래그 하나지만 전부는 아니라, **선언형으로 표현되는 것까지만**
JSON으로 내려온다. 그 너머는 Advanced다.

```jsonc
{
  "patch":  { "ch1-seatChart": { "textKey": "ch1:objectives.mySeatChart" } },
  "remove": ["ch2-showcase"],
  "add": [{
    "id": "my-extra", "textKey": "ch2:objectives.mine", "sceneId": "M-4F-corridor",
    "after": "ch2-lobby", "tier": "side",
    "active": { "chapter": "ch2" },
    "done":   { "flag": "gapsuNotebookRead" }
  }]
}
```

- 고칠 수 있는 칸: `textKey` `sceneId` `targetRect` `tier`. **조건은 못 고친다.**
- 조건: `{flag}` `{allFlags}` `{anyFlags}` `{not}` `{chapter}` `{scene}` `{item}` `{always}`.
- 판정은 **첫 미완료 항목**이라 **자리가 곧 순서**다(`after`로 자리를 정한다).

## 7. 언어 추가

있는 셋(ko/en/ja)을 **덮는 것이 아니라 늘리는 것**이다. `mod.json`에 선언하고
`locales/<id>/*.json`에 글을 싣는다.

```jsonc
"languages": [{
  "id": "zh",
  "name": "中文",               // 피커가 이것을 먼저 쓴다. 번역 대상이 아니다
  "fallback": "ko",             // 빠진 키가 떨어질 자리
  "fonts": { "scare": "onryou", "hand": "my-zh-hand", "ui": "my-zh-serif" },
  "ruby": true,                 // {{furigana:base|reading}} 토큰을 이 언어에서도 그린다
  "ime": "none",                // none | hangul | kana
  "codes": { "memory": { "roster": "041" } }   // 언어마다 갈리는 정답
}]
```

**반드시 읽을 것 넷:**

1. **글꼴을 함께 선언한다.** 안 하면 한국어 명조로 그려져 **없는 글자가 두부가 된다.**
   `fonts`의 값은 `mod.json`의 `fonts`에 등록한 키(또는 기본 글꼴 키)다.
   세 변수(`scare`/`hand`/`ui`)를 대신하는 것이지 새 변수를 만들지 않는다.
2. **`codes`를 빠뜨리면 퍼즐이 거짓말을 한다.** 명단 퍼즐(P-02)은 **세는 방식 자체가 언어마다
   달라** 답이 ko 055 / en 033 / ja 087로 갈린다. 안 적으면 새 언어가 조용히 ko의 055를 받고,
   그 언어의 세는 방식으로는 **틀린 답**을 정답이라고 말한다. 오류도 안 난다.
3. **빠진 키는 폴백으로 떨어진다.** 키가 2278개를 넘어 다 채우기 어렵다 — 그래서 폴백 사슬이
   있다(`선언한 fallback` → `ko`).
4. **모드를 지우면 저절로 ko로 돌아온다.** 저장돼 있던 언어 id가 목록에서 사라지는 순간
   되돌아가므로, 지운 뒤에 화면이 비는 일이 없다.

## 8. Advanced — 코드를 싣는 모드

**정직하게 적어 둔다: 「모드는 게임을 못 죽인다」는 Advanced에서는 보장이 아니라 노력 목표다.**
남의 코드를 실행하는 순간 그것은 약속할 수 없는 것이 된다.

- **`main.js` 한 장.** `import` 문은 못 쓴다 — **TS로 쓰고 JS 한 장으로 번들해서** 싣는다
  (이 프로젝트가 하는 것과 같다).
- **부팅 때 한 번은 여전히 있다** — `main.js`의 최상위 실행은 그대로 한 번뿐이다. **하지만
  v0.5.0부터는 그 한 번이 끝이 아니다** — `motp.events.on(...)`으로 등록한 핸들러는 **회차
  내내** 불린다(13절). "매 프레임 훅도 이벤트 구독도 안 만든다"는 0.4.x까지의 이야기였고,
  이제는 사실이 아니다.
- 파일은 `motp` 하나를 인자로 받는 **함수 본문**으로 실행된다:

```js
// main.js
motp.log('안녕하세요')
motp.items.set('my-item', { id: 'my-item', title: { ko: '내 물건' }, description: { ko: '…' } })
motp.difficulty.tune({ patrolSpeedScale: { extreme: 1.6 } })
motp.i18n.addBundle('ko', 'ch2', { objectives: { mine: '내 목표' } })

// v0.5.0 — capabilities에 적은 것만 쓸 수 있다(아래).
motp.events.on('scene:enter', ({ scene }) => motp.log(`들어섰다: ${scene}`))
```

창구: `gameVersion` `modId` `log` `items` `objectives` `difficulty` `audio` `maps` `i18n`
`assetUrl` `achievements` `flags`(위 여덟과 뒤 둘은 capability 없이 늘 열려 있다) —
그리고 **v0.5.0부터**: `events` `mixin` `game` `internal`(13절 — `capabilities`에 적어야 열린다).

- **처음 켤 때 확인 창이 한 번 뜬다.** 끄고 다시 켜도 다시 안 묻는다. **`capabilities`가
  늘어나면**(모드를 갱신하며 새 창구를 요구하게 되면) **그만큼만 다시 묻는다** — 이미 동의한
  것은 다시 안 묻는다.
- **Safe Mode가 가장 먼저 끄는 것**이고, **그 회차는 Vanilla 도전과제도 Vanilla 원장도 안
  건드린다**(모드가 스스로 더한 도전과제는 다른 얘기다 — 14절).

## 9. 모드 관리 화면

**설정 → 「모드 관리」**. `mods/`가 비어 있으면 설정에 그 한 줄조차 안 뜬다 — 이 게임은 비어
있는 것을 회색으로 보여 주지 않는다.

거기서 할 수 있는 일:

- **순서 바꾸기**(↑↓)와 **켜기/끄기**. **위에 있는 모드가 아래를 덮는다**(v0.5.0에서 뒤집혔다 — 0.4.x까지는 반대였다).
- **실패한 모드**는 붉게 남고 「자세히」에 이유가 적힌다 — 지워 버리지 않는다.
- **안전 모드**(Safe Mode) · **엄격 모드**(Strict Mode) 토글.
- **「모드 다시 읽기」** — zip 캐시(`mods/.cache/`)를 비우고 게임을 다시 켠다.

> **여기서 바꾼 것은 다시 읽거나 다음 실행부터 적용된다.** 모드는 부팅 때 **한 번만** 읽히고,
> 이미 병합된 데이터를 도중에 되돌리는 길은 없다 — 이 게임은 **되돌릴 수 있는 척하지 않는다.**

**코드를 싣는 모드**(Advanced)는 처음 켤 때 확인 창이 한 번 뜬다. 끄고 다시 켜도 안 묻는다.

## 10. 순서 · 충돌 · 표식

- **목록의 위가 아래를 덮는다.** 새로 넣은 모드는 **맨 위**에 붙는다. (v0.5.0에서 뒤집혔다 —
  0.4.x까지는 반대였다. 올릴 때 저장된 순서를 게임이 **한 번** 뒤집어 옮긴다 — 화면의 순서는
  달라 보이지만 어느 모드가 이기는지는 그대로다.)
- **모드 id가 겹치면 둘 다 안 켠다.** 먼저 것을 살리면 폴더 이름 순서가 정본이 되어 사람이
  못 읽는다.
- **⚠ = 기존 것을 덮어썼거나 코드를 실었다.** ⚠가 하나라도 켜져 있으면 **그 회차는
  도전과제가 안 선다.** **더하기만 하는 모드는 선다** — 곡 하나 바꾼 모드로 원장이 얼어붙으면
  모딩할 이유가 사라지기 때문이다.
- **엔딩 조건은 Vanilla의 것이 정본이다.** 앞의 일곱 갈래는 거기 손이 안 닿고, Advanced는
  닿을 수 있다. **게임은 그것을 막지 않는다 — 대신 그 회차의 완결본에 그렇게 적는다.**
  막는 대신 적는 것이 이 게임이 플레이어의 기록을 다뤄 온 방식이다.

## 11. Strict Mode — 모드팩을 만든다면

**기본값은 꺼짐이다.** 켜면 **모드 하나라도 실패했을 때 게임이 아예 안 뜬다** — 무엇이 왜
실패했는지 오류 화면이 적고 거기서 끝난다.

평소에는 실패한 모드가 **조용히 빠지고 나머지는 그대로 돈다**. 플레이어에게는 그게
맞다 — 모드 하나 때문에 게임을 못 켜는 것보다 낫다. 하지만 **모드팩을 만드는 사람에게는
정확히 반대다**: 조용히 빠진 모드 하나를 모르고 배포하는 것이 가장 나쁜 결과다.
그래서 그 사람은 「덜 관대한 쪽」을 고를 수 있어야 한다.

| 거부하는 것 | 거부하지 않는 것 |
|---|---|
| `mod.json`이 없거나 문법이 깨졌다 | **게임 버전이 안 맞는다**(그건 경고다) |
| 모드 id가 없거나 쓸 수 없는 문자가 있다 | Advanced 모드가 **아직 동의를 안 받았다**(아직 아무 일도 안 일어났다) |
| **모드 id가 겹친다** | 모드가 목록에서 **꺼져 있다** |
| `data/*.json`·`maps/*.json`·`locales/**`가 깨졌다 | |
| `difficulty.json`이 **난이도 감사를 통과 못 했다** | |
| **`main.js`가 던졌다** | |
| `capabilities`에 **모르는 이름이 있다**(v0.5.0 — mod.json 자체가 거부된다) | 선언 안 한 창구를 불러 **던졌다**(그 모드만 빠진다 — Strict Mode 거부와는 다른 자리) |

**Safe Mode가 켜져 있으면 Strict Mode는 판정하지 않는다.** Safe Mode는 「전부 끄고 일단
들어가자」는 구제 수단이라, 거기서까지 거부하면 아무 데도 못 가게 된다.

> **주의**: 거부된 부팅은 「끝까지 못 간 부팅」으로 세어진다. 그래서 **세 번 연속 거부되면
> 게임이 스스로 Safe Mode로 뜬다** — 그건 사고가 아니라 구제 경로다(그 상태로 들어가 모드를
> 고치고 Safe Mode를 끄면 된다).

## 12. 무언가 안 될 때

`logs/motp-YYYYMMDD-HHMMSS.log`를 본다. 한 줄에 **발생 시각 · 모드 ID · 모드 버전 ·
게임 버전 · 충돌 대상 · 오류 내용**이 적힌다. **게임은 이 폴더를 안 읽으므로 지워도 된다.**

Rust 쪽에서 벌어진 일은 `logs/rust-panic.log`에 따로 쌓인다. 오류 화면의 **「자세히 보기」는
그 둘을 이어 붙여** 한 덩어리로 보여 주므로, 개발자에게 보낼 때는 거기서 **「복사」** 한 번이면 된다.

부팅이 **세 번 연속** 끝까지 못 가면 게임이 스스로 **Safe Mode**(전부 끔)로 뜬다.

## 13. `events` · `mixin` · `game` · `internal` — 자세히

이 넷은 전부 `capabilities`에 이름을 적어야 열린다(8절). **선언 안 하고 부르면 그 자리에서
던진다** — 조용한 무동작이 아니라 「왜 빠졌는지 말하는 실패」다.

### 13-1. `motp.events` — 게임 안에서 벌어지는 일을 듣는다

```js
const handle = motp.events.on('scene:enter', ({ scene, from, cause }) => {
  motp.log(`들어섰다: ${scene} (전: ${from ?? '없음'}, ${cause})`)
})
handle.off()   // 구독을 끊는다
motp.events.names()   // 지금 게임이 내는 이벤트 이름 전부
```

- **동기 호출, 등록한 순서대로 돈다.** Advanced 모드 자체는 목록의 **역순**으로 실행되므로
  (10절 — 위가 아래를 덮는다), 여러 모드가 같은 이벤트를 구독하면 **목록에서 위에 있는 모드의
  핸들러가 나중에** 불린다.
- **핸들러마다 try/catch.** 던지면 그 핸들러만 `logs/`에 남고 게임은 계속 돈다. **같은 자리에서
  3번 연속** 던지면 그 핸들러를 아예 끈다(지우지는 않는다 — 로그에 횟수가 계속 보인다).
- **재진입 상한이 있다**(8단). 핸들러 안에서 `motp.game.dispatch(...)`를 불러 상태가 바뀌면
  새 이벤트가 또 나갈 수 있는데, 그 사슬이 너무 깊어지면 이번 호출을 거부하고 로그 한 줄만
  남긴다 — 모드 하나가 프레임을 통째로 잠그는 것을 막는 안전판이지, 무한루프 자체를 막지는
  않는다(핸들러가 스스로 느리면 여전히 게임이 버벅인다).
- `cause`는 `'play' | 'load' | 'init'`이다. **세이브를 불러온 직후**에는 마흔 개의 플래그가
  한꺼번에 `flag:set`으로 나갈 수 있는데, 그게 「자연스러운 진행」이 아니라 「불러오기」라는
  것을 `cause: 'load'`로 구분한다. `init`은 부팅 직후 첫 상태 확정(`boot:ready` 직전)이다.

**이벤트 이름 전부**(괄호 안은 payload 요지):

| 이름 | 언제 | payload |
|---|---|---|
| `boot:modsLoaded` | 모드 로더가 끝났다 | `{ count, safeMode }` |
| `boot:ready` | 첫 게임 상태가 확정됐다 | `{}` |
| `scene:enter` / `scene:leave` | 씬이 바뀌었다 | `{ scene, from/to, cause }` |
| `chapter:start` | 챕터가 시작됐다 | `{ chapter, scene, cause }` |
| `flag:set` | 플래그 값이 바뀌었다 | `{ flag, value, prev, cause }` |
| `item:grant` / `item:lose` | 소지품이 늘거나 줄었다 | `{ item, cause }` |
| `document:grant` / `document:lose` | 문서를 얻거나 잃었다 | `{ doc, cause }` |
| `stage:solve` | 퍼즐을 풀었다 | `{ stageKey, unlocksFlags }` |
| `objective:change` | HUD 목표가 바뀌었다 | `{ id, prev }` |
| `achievement:earn` | 도전과제를 얻었다 | `{ id, ledger: 'vanilla'\|'pack' }` |
| `ending:resolve` | 엔딩이 정해졌다 | `{ ending }` |
| `save:write` | 세이브를 적었다(오토 포함) | `{ slotId, auto }` |
| `save:load` | 세이브를 불러왔다 | `{ slotId }` |
| `run:finish` | 회차가 끝났다 | `{ ending, runNo }` |
| `tick` | 매 프레임(구독자가 있을 때만 실제로 쏜다) | `{ deltaMS, scene }` |

> `tick`을 구독하는 순간부터 **매 프레임 비용**이 진짜로 생긴다. 나머지 이벤트는 다 「어떤 일이
> 일어났을 때만」이라 상시 비용이 없다.

### 13-2. `motp.mixin` — 게임의 판정 함수 안으로 끼어든다

`mixin` 대상은 **버전 있는 고정 목록**이다 — `internal`과 정반대로, 여기 적힌 이름은
`mods.gameVersion`이 맞는 한 계속 있다고 믿어도 된다.

```js
motp.mixin.inject('resolveEnding', {
  at: 'return',
  priority: 10,
  handler(value, args) {
    if (motp.game.state()?.flags.myModFlag) return 'myModEnding'
    return value   // undefined를 돌려줘도 원래 값을 그대로 쓴다
  },
})
motp.mixin.targets()   // 지금 걸 수 있는 대상 전부
```

**대상 목록(11개)**: `resolveEnding` · `nextObjective` · `currentObjective` ·
`earnedAchievements` · `resolveBgmTrackId` · `prologueSecondsOf` · `hintBudgetOf` ·
`objectiveTiers` · `achievementsEnabled` · `sceneBuilding` · `getItem`

**`at`은 셋, 규약이 다르다:**

| `at` | 언제 도는가 | handler 모양 | 순서 |
|---|---|---|---|
| `'head'` | 원본 함수 **전에** | `(args) => { args?, value?, cancel? } \| undefined` | **우선순위 내림차순**(큰 것 먼저) |
| `'return'` | 원본(또는 `replace`) **후에** | `(value, args) => 새value \| undefined` | **우선순위 오름차순**(큰 것이 마지막에 써서 이긴다) |
| `'replace'` | 원본을 **대신한다** | `(...args) => 새값` | **최고 우선순위 하나만** 이긴다 — 진 쪽은 `logs/`에 경고 |

- `head`에서 `{ cancel: true, value }`를 돌려주면 원본(과 이후 `head`)을 건너뛰고 그 `value`가
  곧장 `return` 훅들로 넘어간다.
- `head`에서 `{ args: [...] }`를 돌려주면 다음 `head`·원본이 보는 인자가 그걸로 바뀐다.
- `replace`가 둘 이상이면 **우선순위가 가장 높은 것만** 돌고 나머지는 로그만 남긴다 — 두 모드가
  같은 함수를 통째로 대신하려 드는 유일한 진짜 충돌 자리라서, 조용히 섞지 않고 크게 말한다.
- `return` 훅의 실행 순서(오름차순)는 **「위가 아래를 덮는다」와 같은 뜻**이다: 우선순위가 가장
  높은 모드가 가장 마지막에 값을 쓰므로 최종 결정권을 가진다.
- 핸들러가 던지면(8절과 같은 정책) 그 Mixin만 3진 아웃으로 꺼지고 원본 동작으로 되돌아간다.
- **`inject`는 모듈이 아직 안 실렸어도 안전하다.** 대상 이름이 아직 게임 코드 안에서 안 도는
  상태여도 대기열에 쌓였다가, 그 함수가 실제로 정의되는 순간 자동으로 연결된다.

### 13-3. `motp.game` — 상태를 읽고 바꾼다

```js
const state = motp.game.state()   // React가 아직 안 떴으면 null
motp.game.setFlag('myModFlag', true)         // motp.game.dispatch의 편의 래퍼
motp.game.dispatch({ type: 'ADD_ITEM', item: 'my-item' })
```

- `state()`가 돌려주는 객체는 **얕은 사본 + 동결**이다. 제자리에서 고치려 들면 조용히
  실패하거나(non-strict) 던진다(strict) — **상태를 바꾸는 유일한 길은 `dispatch`뿐**이다.
- Advanced는 React가 뜨기 전에 도므로, 그 순간 `state()`는 **거짓 상태를 지어내지 않고 `null`을
  돌려준다.** `dispatch()`는 그 시점이면 상한 64개짜리 큐에 쌓였다가 게임이 뜨는 순간 흘러간다
  (넘치면 버리고 경고).
- **`dispatch`는 세이브를 상하게 할 수 있다.** 이 창구에는 검증이 얕다 — 모르는 액션 타입을
  DEV 콘솔에 경고만 하고 그대로 리듀서의 `default: return state`로 흘려보낸다. 무엇을 보내는지
  스스로 책임진다.

### 13-4. `motp.internal` — 아무 약속도 없다

```js
const { getItem } = await motp.internal.module('data/items')
motp.internal.list()   // 지금 열려 있는 내부 모듈 경로 전부
```

- **버전 표기가 없다.** 위 세 창구와 달리 이 목록의 모듈은 게임이 올라갈 때마다 이름이 바뀌거나
  사라질 수 있고, **그것이 이 창구의 정상 동작이다.**
- 비동기다(`await`가 필요하다) — 그래야 부팅마다 스무 개 모듈을 전부 미리 기다리지 않는다.
- 이 창구를 한 번이라도 부르면 그때마다 `logs/`에 경고 한 줄이 남는다 — 「이 회차는 아무 약속도
  없는 층에 손을 댔다」는 사실이 조용히 묻히지 않게 한다.
- **정말로 이 창구가 필요하기 전에 13-2(`mixin`)를 먼저 볼 것.** 거의 모든 「판정을 바꾸고
  싶다」는 요구는 고정된 훅 대상으로 충분하다. `internal`은 그 11개 밖의 것 — 예를 들어 맵 렌더
  파이프라인 자체를 바꾸는 것 — 에만 쓴다.

### 13-5. 능력 승격과 재동의

모드를 갱신하며 `capabilities`에 새 이름을 더하면, 이미 동의했던 사람에게도 **그 늘어난
부분만** 다시 확인 창이 뜬다(9절). 예를 들어 `["events"]`로 동의를 받은 모드가 다음 버전에서
`["events","internal"]`을 요구하면, 창에는 `internal` 하나만 「새로 요구합니다」로 뜬다.

## 14. 모드 도전과제 · 모드팩 원장

모드는 **자기 도전과제를 만들 수 있다.** capability 선언 없이도 쓰는 창구다(`achievements`도
`flags`도 8절의 여덟 창구와 같은 대우 — 데이터 패치와 같은 층이라서다).

### 14-1. 선언형 — `data/achievements.json`

```json
{
  "add": [
    { "id": "myMod.firstBlood", "category": "hidden", "icon": "star",
      "titleKey": "achievements.myMod.firstBlood.title",
      "earned": { "flag": "sawTheThing" } }
  ],
  "patch": { "archivePerfect": { "icon": "star2" } },
  "remove": []
}
```

- `earned`는 `objectives.json`의 조건 문법과 **같은 어휘**를 쓴다(`flag`·`allFlags`·`anyFlags`·
  `not`·`chapter`·`scene`·`item`·`document`) — 여기에 도전과제 전용 셋이 **더해진다**:
  `ending`(그 엔딩으로 끝났다) · `clearsAtLeast`(회차를 그만큼 클리어했다) ·
  `achievement`(다른 도전과제를 이미 얻었다). 이 셋을 `objectives.json`에 쓰면 명확한 오류로
  거부된다 — 두 파일의 어휘가 섞이면 「이 조건이 왜 여기 있지」를 사람이 못 읽는다.
- `add`가 **바닐라 id와 겹치면 오류**다(`add가 아니라 patch입니다`) — 새로 더하는 것과 있는
  것을 고치는 것은 다른 동사다.
- 아이콘 이름을 모르면(`AchievementIcon.tsx`) 기본 아이콘으로 곱게 떨어진다.

### 14-2. Advanced — `motp.achievements`

```js
motp.achievements.define({
  id: 'myMod.firstBlood',
  category: 'hidden',
  icon: 'star',
  titleKey: 'achievements.myMod.firstBlood.title',
  earned: (ctx) => ctx.flags.sawTheThing === true,
})
motp.achievements.patch('archivePerfect', { icon: 'star2' })
motp.achievements.remove('someId')
motp.achievements.ids()       // 지금 살아 있는 도전과제 id 전부(바닐라 + 모드)
motp.achievements.packKey()   // 지금 켜진 모드 조합의 모드팩 키(§14-3)
```

`earned`에 **함수**를 직접 줄 수 있다는 것이 JSON 경로와의 차이다 — Advanced만의 특권이다.
판정자가 던지면(다른 모든 모드 콜백과 같은 정책) 3연속 실패 뒤 그 도전과제는 영영 안 선 채로
남고, 다른 도전과제·바닐라 판정에는 번지지 않는다.

### 14-3. 왜 「모드팩」인가 — 원장의 키 설계

**바닐라 도전과제와 모드 도전과제는 서로 다른 원장에 선다.** `profile.achievements[]`(바닐라)는
모드가 무엇을 하든 **절대 안 움직인다** — 모드를 지운 뒤 다시 켜면 바닐라 `100.00%`가 그대로
있다는 뜻이다. 모드가 더한 표식은 **모드팩 키**로 인덱싱된 별도 원장에 선다.

```ts
// data/mods.ts
modPackKey(stamps)     // "pack:1a2b3c4d" 형태 — 켜진 모드 id 집합의 해시. 없으면 null
modPackLabel(stamps)   // 사람이 읽을 이름표: "ModA, ModB 외 2개"
```

**키는 id만 본다 — 버전도 순서도 안 본다.** 이건 사용자가 명시로 정한 설계다:

- **버전을 안 보는 이유** — 모드 하나가 오타를 고쳐 `0.1.0`에서 `0.1.1`로 올라가는 순간 그
  조합의 원장이 「남」이 되면, 사람에게는 「그 모드팩」이 여전히 「이 모드들」인데 게임만
  「다른 조합」이라고 우기는 꼴이 된다. 세이브 안의 `ModStamp`는 회차마다 정확한 버전을 여전히
  들고 있다(5절) — 원장 키만 버전을 안 볼 뿐, 「그때 정확히 어느 버전이었나」는 세이브에서
  사라지지 않는다.
- **순서를 안 보는 이유** — 순서 하나(10절의 위/아래)를 바꿨다고 원장을 새로 파면, 사람이
  자기 모드 순서를 못 만지는 것과 마찬가지가 된다. 정렬해서 해시를 낸다.
- **이 설계의 한계** — 반대로 말하면, 완전히 다른 두 모드 조합이 **같은 id 집합**이면 (예:
  단순히 순서만 다르거나 둘 다 패치 버전만 다르면) **같은 원장을 공유한다.** 「그 조합이 실제로
  같은 게임을 만드는가」까지는 이 키가 보장하지 않는다 — 모드 제작자가 patch 버전에서 도전과제
  조건 자체를 바꾸면, 옛 표식이 새 조건 기준으로도 「얻은 것」으로 남는다.

### 14-4. 저장 — `save/profile.ts`의 별도 칸

```ts
ProfileRecord.packAchievements?: Record<string, string[]>              // packKey → 얻은 id[]
ProfileRecord.packLabels?:       Record<string, { label, mods, lastSeenAt }>
```

- **`PROFILE_VERSION`을 안 올렸다.** 이 두 칸은 v1 스키마에 선택 필드로 얹혀 있다 — 옛 빌드가
  이 파일을 다시 써도 `achievements[]`(바닐라)는 절대 안 다친다. 모드팩 표만 그 실행에서는
  안 보일 뿐이다.
- **팩 64개 상한.** 그 이상 쌓이면 가장 오래 안 본 것부터(`lastSeenAt`) 지운다 — 이 게임이
  **무언가를 잊는 유일한 자리**다. 바닐라 기록·세이브·도감은 절대 안 잊는다(정본 ②·⑦).
  팩당 표식도 512개 상한이다.
- 모드팩을 다시 켜면(같은 id 집합으로 돌아오면) **그 원장이 그대로 다시 보인다** — 지운 것이
  아니라 「지금 안 보이는 것」뿐이었던 조합이라면.

### 14-5. 판정 두 벌 — `earnedAchievements` / `earnedPackAchievements`

```ts
earnedAchievements(ctx)                              // 바닐라만. VANILLA_ACHIEVEMENTS 위에서
earnedPackAchievements(ctx, packKey, packLedger)      // 살아 있는 ACHIEVEMENTS 전체 위에서
```

- 바닐라 판정은 **⚠(도전과제를 잠그는 경고)의 영향을 그대로 받는다**(10절) — 지금까지와 같다.
- **모드팩 판정은 ⚠와 무관하게 선다**(사용자 결정, 2026-09-18). 난이도는 여전히 본다 —
  明記·記錄에서는 도전과제가 안 선다는 규칙(10절)이 막는 것은 「이 회차가 표식을 남길 자격이
  있는가」이고, 그건 모드의 사정이 아니라 난이도의 사정이라서다.
- **「나만 빼고 전부」(`archivePerfect`)의 분모가 원장마다 다르다.** 바닐라 창은 항상
  `VANILLA_ACHIEVEMENTS`를 분모로 쓰고, 모드팩 창은 그 순간 살아 있는 전체 `ACHIEVEMENTS`
  (바닐라 + 모드가 더한 것)를 분모로 쓴다 — 모드팩이 도전과제를 열 개 더하면 **그 모드팩의**
  100%만 그만큼 어려워지고, 바닐라 100%는 안 움직인다.

### 14-6. 화면 — 도전과제 창의 원장 전환기

모드팩이 있을 때만(= `currentPackKey()`가 `null`이 아닐 때만) 도전과제 창 분류 탭 위에
`[ 기본 ] [ 모드팩 · A, B 외 2개 ]` 전환기가 뜬다. 「기본」은 지금까지와 완전히 같고, 「모드팩」은
그 조합 전용 진척도를 자기 원장에서 보여 준다 — 두 진척도는 서로를 못 보므로, 한쪽이
100.00%여도 다른 쪽 숫자에 아무 영향이 없다.
