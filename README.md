<!--
  이 파일은 **공개 저장소 `inoyu4649/HYProject_MOTP`의 `README.md`로 올릴 원고**다.
  (이 저장소 — 코드가 있는 비공개 쪽 — 에서는 원고이자 정본이다.)

  **손으로 옮기지 않는다.** `npm run build:public-repo`가 공개 저장소에 올릴 한 벌을
  `dist/public-repo/`에 통째로 조립한다:

      README.md   ← 이 파일        MODDING.md  ← docs/modding/MODDING.md        examples/ ← examples/

  그 스크립트가 함께 보는 것 넷 — 개발 문서 문자열 유출 · 깨진 상대 경로 링크 ·
  예시 모드의 `gameVersion`이 현재 게임 버전과 같은 줄인지 · 아래 `WEB_DEMO_URL`이 아직
  안 채워졌는지(이건 경고만 한다).

  **올리기 전에 손봐야 하는 자리는 `WEB_DEMO_URL` 하나뿐이다**(세 언어 절에 각각 있다).
  버전 숫자와 내려받기 주소는 **일부러 안 적었다** — 릴리스 태그가 `latest` 고정이라
  링크가 버전과 무관하고, 그래서 판을 올려도 이 문서는 낡지 않는다.
-->

<h1 align="center">과거의 추억</h1>
<p align="center">
  <b>Memories of the Past</b> · <b>過去の追憶</b><br>
  <sub>HY Project presents · #A-01</sub>
</p>

---

기록이 지워진 학교를 걸어 들어가, **남은 것만으로 사라진 것을 복원하는** 2D 탐색형 공포 퍼즐
게임입니다. 한국어 · English · 日本語 세 언어를 지원합니다.

> **이 게임의 공포는 놀래키는 데 있지 않습니다.** 정보의 공백, 기록의 모순, 어긋난 기억에서
> 옵니다. 주제는 학교 괴담이 아니라 **기록과 망각**이고, 그래서 죽음의 순간이나 방법은 어느
> 챕터에서도 직접 묘사하지 않습니다 — 애도가 공포보다 먼저입니다.
>
> 다만 **상실 · 애도 · 자책**을 정면으로 다룹니다. 지금 그런 이야기가 버겁다면, 다음에 오셔도
> 게임은 그대로 있습니다.

---

## 플레이

| | |
|---|---|
| **웹 데모 (프롤로그)** | 설치 없이 브라우저에서 바로 — `WEB_DEMO_URL` |
| **PC판 (Windows)** | [**최신 설치본 내려받기**](https://github.com/inoyu4649/HYProject_MOTP/releases/latest) · [릴리스 목록](https://github.com/inoyu4649/HYProject_MOTP/releases) |

- **웹 데모는 프롤로그까지입니다.** 본편은 PC판에서 이어집니다. 데모를 끝내면 그 화면에서 곧장
  내려받기로 이어집니다.
- **PC판은 인터넷이 필요 없습니다.** 설치 후 완전히 오프라인으로 끝까지 진행됩니다 — 정답 확인도,
  버전 조회도 바깥에 묻지 않습니다.
- 내려받기 링크는 **언제나 같은 주소**입니다(`latest` 고정 태그). 새 판이 나와도 링크는 안 바뀝니다.

### 사양 (PC판)

| | |
|---|---|
| 운영체제 | **Windows 10 / 11 (x64)** |
| 화면 | **전체화면 전용** · 1280×720 이상 |
| 그래픽 | WebGPU 또는 WebGL2 — 설정에서 렌더러 API와 GPU를 고를 수 있습니다 |
| 그 외 | Microsoft Edge WebView2 런타임 (Windows 11 기본 포함, 없으면 설치 시 안내) |

설치본이 놓는 것은 **`MOTP.exe` + `res/` + `docs/`** 셋뿐이고, 처음 실행하면 그 옆에
`save/` · `logs/` · `mods/`가 생깁니다. 세이브는 게임 폴더 안 파일이라 통째로 옮기거나 백업할 수
있습니다.

---

## 무엇을 하는 게임인가

**학교 여섯 곳**을 차례로 엽니다 — 교실과 사물함, 서류가 잠든 본관, 인쇄기가 멈춘 특별관, 문이 열두
개인 기숙사, 팔월의 그날이 되풀이되는 강당, 그리고 명부가 있는 지하.

가는 곳마다 하는 일은 같습니다. **남은 물건을 읽고, 어긋난 자리를 찾고, 지워진 것을 되돌려 놓는
것.** 퍼즐의 목적은 '탈출'이 아니라 **'진실의 복원'**이라서, 정답보다 그 정답이 무엇을 되살렸는지가
먼저입니다.

| | |
|---|---|
| 퍼즐 | **40종** — 공간마다 새 규칙, 되풀이되는 방 구조 없음 |
| 무대 | 맵 **162장** |
| 기록 | 열람 가능한 실물 문서 **106종** (문서마다 번역 토글) |
| 도전과제 | **50종** — 기억 · 수집 · 기록 · 자취 · 히든 |
| 엔딩 | **다섯 갈래** + 그 너머의 히든 시나리오 |
| 난이도 | **여섯** — 明記 · 記錄 · 記憶 · 褪色 · 忘却 · 花樣 |
| 언어 | 한국어 · English · 日本語 (UI · 대사 · 문서 전부) |

**난이도는 안내와 손과 표식만 바꿉니다.** 엔딩에 닿는 조건은 한 글자도 달라지지 않고, 어려워질수록
읽고 듣고 안내받는 시간이 깎일 뿐 이야기가 깎이지는 않습니다. 시간 제한은 프롤로그 하나뿐이고,
경과 시간은 세이브에 남아 엔딩 크레딧에서 보여 줍니다.

---

## 모드

PC판은 **모드를 지원합니다.** 게임 폴더의 `mods/`에 폴더를 넣으면 그대로 읽습니다.

그림 · 소리 · 맵 · 글꼴 · 목표 · 대사 · 난이도 · 언어 추가 — 아홉 갈래를 덮거나 더할 수 있고,
게임 안 **「모드」 화면**에서 순서와 On/Off, Safe Mode를 다룹니다. 모드가 게임을 못 띄우면 다음
실행은 자동으로 Safe Mode로 들어갑니다.

- 만드는 법: **[MODDING.md](MODDING.md)** · 바로 쓸 수 있는 예제는 `examples/`
- 모드가 적용된 채 저장된 기록은 목록에서 **남색 바탕 + `MODDED` 배지**로 구분됩니다. 막지는
  않습니다 — 이 표시의 목적은 개조를 봉쇄하는 게 아니라 **정직한 플레이의 기본값을 정하는 것**입니다.

---

## 원작 표기

> 본 게임의 **프롤로그**는 2026 HAFS Festival 「花様年華 : in bloom」에서 동아리 TIMES가 운영한
> 방탈출 〈Nightmare〉를 원작으로 합니다.

프롤로그 한정입니다. Chapter 1부터는 이 게임 고유의 줄거리입니다.

---

## 만든 사람

**이민기 (LEE MINGI · 李民基)** — 2026.07.19 — 2026.09.17

### 생성형 AI 고지

이 게임은 생성형 AI를 사용해 제작했습니다.

- **코드** — Claude (~v0.5.2) · ChatGPT (v0.6.0~)
- **이미지 에셋** — ChatGPT (GPT-Image) · Gemini (Nano Banana)

---

## 라이선스 · 크레딧

설치본의 `docs/` 폴더에 전체 원문이 들어 있고, 게임 안 **크레딧** 화면에서도 같은 목록을 볼 수
있습니다.

- **글꼴 8종** — Onryou (AnkokuKoubou) · HWYWonSerif (화양 원명조, 자체 제작) ·
  NanumYeDangCe (Naver) · Shadows Into Light · Zen Kurenaido · Noto Serif KR · IM Fell English ·
  Shippori Mincho. 전부 재배포 가부를 확인해 번들했습니다(CDN 미사용).
- **오픈소스** — React · PixiJS · i18next · es-hangul · WanaKana · Vite · Tauri 외.

---

## 이 저장소에 대하여

여기는 **배포용 저장소**입니다 — 설치본(릴리스)과 이 안내문이 있습니다. 게임 소스 코드는 별도의
비공개 저장소에서 관리합니다.

버그 제보나 문의는 **[Issues](https://github.com/inoyu4649/HYProject_MOTP/issues)**에 남겨 주세요.
제보할 때 **버전**(타이틀 화면 왼쪽 아래에 적혀 있습니다)과 **`logs/` 폴더의 최신 로그**를 함께
주시면 가장 빠릅니다.

> **Early Access입니다.** 버전이 아직 `0.x`인 것은 배포가 덜 됐다는 뜻이 아니라, **더 얹을 것이
> 남았다는 뜻**입니다. 판이 바뀔 때마다 무엇이 달라졌는지는 릴리스 노트에 적습니다.

---
---

<h2 align="center">English</h2>

**Memories of the Past** is a 2D exploration horror-puzzle game about walking into a school whose
records have been erased, and **restoring what's gone from only what's left.** Korean, English and
Japanese are fully supported.

The horror here isn't in being startled — it comes from gaps in the record, contradictions between
documents, and memories that don't line up. The subject is **record and forgetting**, not a ghost
story, and no chapter ever depicts the moment or method of a death: mourning comes before fear.
It does, however, deal directly with **loss, grief and self-blame.**

**Play** — Browser demo (prologue only): `WEB_DEMO_URL` ·
[**Download for Windows**](https://github.com/inoyu4649/HYProject_MOTP/releases/latest)
(Windows 10/11 x64, fullscreen, **fully offline** — the game never makes a network request.)

**Contents** — 40 puzzles across 162 maps · 106 readable in-world documents (each with a translation
toggle) · 50 achievements · five ending branches plus a hidden scenario · six difficulties.
**Difficulty changes guidance, handling and signposting only** — never the conditions for an ending.
The only time limit in the game is the prologue.

**Mods** are supported on the desktop build: drop a folder into `mods/` and manage load order, on/off
and Safe Mode from inside the game. See **[MODDING.md](MODDING.md)**; ready-made samples live in
`examples/`. Saves made with mods active are marked in the save list, not blocked.

**Credit where it's due** — the **prologue** is based on 〈Nightmare〉, an escape room run by the
TIMES club at the 2026 HAFS Festival "花様年華 : in bloom". Everything from Chapter 1 onward is
original to this game.

**Made by** LEE MINGI (이민기 · 李民基), 2026.07.19 — 2026.09.17. Built with generative AI:
**Claude (~v0.5.2)** and **ChatGPT (v0.6.0~)** for code, **ChatGPT (GPT-Image)** and
**Gemini (Nano Banana)** for image assets.
Font and open-source licenses ship in the `docs/` folder of the installed game and are listed in the
in-game credits.

This repository hosts **releases and this page**; the source lives in a separate private repository.
Bug reports go to [Issues](https://github.com/inoyu4649/HYProject_MOTP/issues) — please include the
version (shown at the bottom-left of the title screen) and the newest file from `logs/`.
The game is in **Early Access**: `0.x` means there's more to add, not that it's unfinished to play.

---
---

<h2 align="center">日本語</h2>

**「過去の追憶」** は、記録が消された学校を歩き、**残されたものだけで失われたものを復元する**
2D探索型ホラーパズルゲームです。韓国語・英語・日本語に対応しています。

このゲームの恐怖は驚かすことにはありません。**記録の空白、文書どうしの矛盾、噛み合わない記憶**から
生まれます。主題は学校の怪談ではなく **「記録と忘却」** であり、死の瞬間や手段はどの章でも直接
描きません — 追悼が恐怖に先立ちます。ただし **喪失・哀悼・自責** は正面から扱います。

**プレイ** — ブラウザ版デモ（プロローグまで）: `WEB_DEMO_URL` ·
[**Windows版をダウンロード**](https://github.com/inoyu4649/HYProject_MOTP/releases/latest)
（Windows 10/11 x64・全画面専用・**完全オフライン**で最後まで進行します。）

**内容** — パズル40種／マップ162枚／閲覧できる作中文書106種（各文書に翻訳切替）／実績50種／
エンディング5分岐と、その先の隠しシナリオ／難易度6段階（明記・記録・記憶・褪色・忘却・花樣）。
**難易度が変えるのは案内と操作と目印だけで、エンディングの条件は一文字も変わりません。**
制限時間があるのはプロローグだけです。

**MOD対応**（PC版）— `mods/` にフォルダを置くだけで読み込みます。読み込み順・ON/OFF・セーフモードは
ゲーム内の「MOD」画面から。作り方は **[MODDING.md](MODDING.md)**、すぐ使えるサンプルは
`examples/` にあります。MOD適用中に保存した記録は一覧で区別されますが、制限はしません。

**原作表記** — 本作の**プロローグ**は、2026 HAFS Festival「花様年華 : in bloom」にて
サークルTIMESが運営した脱出ゲーム〈Nightmare〉を原作としています。Chapter 1以降は本作独自の物語です。

**制作** — <ruby>李民基<rt>イ・ミンギ</rt></ruby>（이민기 · LEE MINGI）、2026.07.19 — 2026.09.17。
生成AIを使用しています： コードは **Claude（~v0.5.2）**・**ChatGPT（v0.6.0~）**、画像アセットは **ChatGPT (GPT-Image)** と
**Gemini (Nano Banana)**。フォント・オープンソースのライセンス原文はインストール後の `docs/`
フォルダ、およびゲーム内のクレジット画面にあります。

このリポジトリは**配布（リリース）用**で、ソースコードは別の非公開リポジトリにあります。
不具合のご報告は [Issues](https://github.com/inoyu4649/HYProject_MOTP/issues) へ —
**バージョン**（タイトル画面の左下）と **`logs/` の最新ログ**を添えていただけると助かります。
本作は **Early Access** です。`0.x` は「まだ足すものが残っている」という意味です。
