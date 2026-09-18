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
  "gameVersion": "0.4.x",        // 지원 게임 버전(아래 3절). 안 맞으면 **켜지되 경고**
  "author": "…",
  "description": { "ko": "…" },

  "assets": {                    // 논리 ID로 그림 덮기
    "photo.grad-group-1": "res/user/mine.png"
  },
  "fonts": {                     // 글꼴 갈아 끼우기 (FONTS 레지스트리의 키를 대신한다)
    "nanumYeDangCe": { "file": "fonts/my-hand.woff2", "family": "My Hand" }
  },
  "languages": [ /* 7절 */ ],
  "entry": "main.js"             // Advanced. **이 줄이 있으면 ⚠ + 별도 동의**
}
```

## 3. 지원 게임 버전

한 버전이 아니라 **범위**를 적는다. 모드는 게임보다 오래 살고, 게임이 0.4.1로 올라갈 때마다
멀쩡한 모드가 전부 경고를 달면 사람이 경고를 안 읽게 되기 때문이다.

지금 게임 버전은 **`0.4.1`**이다(타이틀 화면 왼쪽 아래에 적혀 있다).

| 적는 법 | 뜻 |
|---|---|
| `"0.4.0"` | 그 버전 하나 |
| `"0.4.x"` | **0.4 줄 전부** |
| `"0.x"` / `"*"` | 그 위 전부 / 전부 |
| `{ "min": "0.4.0" }` | 그 뒤로 쭉 |
| `{ "min": "0.4.0", "max": "0.9.x" }` | **양끝 포함** |

**안 맞아도 거부하지 않는다** — 켜지고, 로그에 경고 한 줄이 남는다.
어긋나면 그 모드부터 의심하라는 표시일 뿐이다.

## 4. 폴더 구조 — 덮을 수 있는 아홉 갈래

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
  maps/                     ← ③ 맵/타일/개요도 — 파일 이름이 아니라 **JSON 안의 id**가 정본
    M-4F-corridor.json
  fonts/                    ← ④ 글꼴 (mod.json의 fonts가 어느 키를 대신하는지 적는다)
    my-hand.woff2
  locales/                  ← ⑥ 대사·독백, 그리고 모든 글
    ko/ch2.json
  main.js                   ← ⑧ Advanced (8절)
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
- **부팅 때 한 번만 돈다.** 매 프레임 훅도 이벤트 구독도 아직 없다.
- 파일은 `motp` 하나를 인자로 받는 **함수 본문**으로 실행된다:

```js
// main.js
motp.log('안녕하세요')
motp.items.set('my-item', { id: 'my-item', title: { ko: '내 물건' }, description: { ko: '…' } })
motp.difficulty.tune({ patrolSpeedScale: { extreme: 1.6 } })
motp.i18n.addBundle('ko', 'ch2', { objectives: { mine: '내 목표' } })
```

창구: `gameVersion` `modId` `log` `items` `objectives` `difficulty` `audio` `maps` `i18n` `assetUrl`.
**좁게 시작한다** — 넓히는 것은 언제든 되고, 좁히는 것은 남의 모드를 깨뜨린다.

- **처음 켤 때 확인 창이 한 번 뜬다.** 끄고 다시 켜도 다시 안 묻는다.
- **Safe Mode가 가장 먼저 끄는 것**이고, **그 회차는 도전과제도 원장도 안 건드린다.**

## 9. 모드 관리 화면

**설정 → 「모드 관리」**. `mods/`가 비어 있으면 설정에 그 한 줄조차 안 뜬다 — 이 게임은 비어
있는 것을 회색으로 보여 주지 않는다.

거기서 할 수 있는 일:

- **순서 바꾸기**(↑↓)와 **켜기/끄기**. **아래에 있는 모드가 위를 덮는다.**
- **실패한 모드**는 붉게 남고 「자세히」에 이유가 적힌다 — 지워 버리지 않는다.
- **안전 모드**(Safe Mode) · **엄격 모드**(Strict Mode) 토글.
- **「모드 다시 읽기」** — zip 캐시(`mods/.cache/`)를 비우고 게임을 다시 켠다.

> **여기서 바꾼 것은 다시 읽거나 다음 실행부터 적용된다.** 모드는 부팅 때 **한 번만** 읽히고,
> 이미 병합된 데이터를 도중에 되돌리는 길은 없다 — 이 게임은 **되돌릴 수 있는 척하지 않는다.**

**코드를 싣는 모드**(Advanced)는 처음 켤 때 확인 창이 한 번 뜬다. 끄고 다시 켜도 안 묻는다.

## 10. 순서 · 충돌 · 표식

- **목록의 아래가 위를 덮는다.** 새로 넣은 모드는 맨 아래에 붙는다.
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
