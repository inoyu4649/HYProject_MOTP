// ============================================================================
// 예시 Advanced 모드 (C9 Part 9-D-3 갈래 ⑧) — `examples/mods/README.md`가 설명하는 그 표본.
//
// **이 파일은 `import`를 못 쓴다.** 인자 `motp` 하나를 받는 **함수 본문**으로 그대로 실행된다
// (`new Function('motp', src)` — `eval`이 아니다). 실제 모드를 만들 때는 TS로 쓰고 JS 한 장으로
// 번들해서 싣는다(이 프로젝트가 하는 것과 같다).
//
// **부팅 때 딱 한 번 돈다.** 매 프레임 훅도 이벤트 구독도 아직 없다 — 필요가 확인되면 연다.
//
// 이 모드가 하는 일은 넷이고, 넷 다 **눈으로 확인하기 쉬운 것**으로 골랐다:
//   ① 로그 한 줄 — `logs/motp-*.log`에 남는다(모드가 사람에게 말을 거는 유일한 창구다).
//   ② 소지품 하나 — 개발자 모드의 소지품 목록과 도감 분모에 뜬다.
//   ③ 난이도 조율 하나 — **숫자와 불리언만** 건드릴 수 있다(제약 열은 코드에 남는다).
//   ④ 목표 한 줄 + 그 글 — `sample-basic`이 JSON으로 하는 것을 **코드로** 한다.
//
// **JSON으로 되는 일은 JSON으로 하는 게 낫다.** 이 파일이 ④를 굳이 코드로 하는 것은 표본이라
// 그런 것이지, 그렇게 하라는 뜻이 아니다 — Advanced는 ⚠가 붙고 그 회차는 도전과제가 안 선다.
//
// **일부러 깨뜨려 보려면** 아무 데나 `throw new Error('일부러')` 한 줄을 넣는다 — 이 모드만
// 붉게 빠지고 `sample-basic`은 그대로 돈다(정본 ②: 모드 하나가 게임을 못 죽인다).
// ============================================================================

// ① 로그 — 언제나 맨 먼저. 뒤에서 무엇이 잘못돼도 「여기까지는 왔다」가 남는다.
motp.log(`sample-advanced 시작 (게임 ${motp.gameVersion})`)

// ② 소지품 — **제자리에서** 더한다(레지스트리를 새 객체로 갈아 끼우면 이미 임포트한 쪽이 옛
// 참조를 든다 — `motp.items.set`이 그 일을 대신해 준다).
//
// **소지품의 글은 로케일이 아니라 여기 있다**(`data/items.json`이 그렇게 생겼다) — `title`과
// `description`이 3언어를 직접 든다. `icon`은 `ui/ItemIcon.tsx`가 아는 키여야 한다(모르는 키면
// 빈 칸이 된다). `code`는 개발자 모드 툴팁에만 쓰이는 내부 표기다.
motp.items.set('sample-advanced-token', {
  id: 'sample-advanced-token',
  title: {
    ko: '무른 표',
    en: 'Soft Token',
    ja: '軟らかい札',
  },
  description: {
    ko: '코드가 만든 물건. 아무 문도 열지 않는다.',
    en: 'Made by code. It opens nothing.',
    ja: 'コードが作った物。どの扉も開かない。',
  },
  code: 'ITEM_SAMPLE_ADVANCED_TOKEN',
  icon: 'nametag',
})

// ③ 난이도 — 화양(extreme)에서 사감이 조금 더 빠르다. **감사기가 릴리스에서도 돈다**:
// 이 값이 「필연 피격」을 만들면 그 조율값이 통째로 물러나고 이유가 `logs/`에 적힌다.
motp.difficulty.tune({ patrolSpeedScale: { extreme: 1.2 } })

// ④ 목표 한 줄 — 글을 먼저 넣고 줄을 건다(순서가 반대면 그 줄이 잠깐 키 이름으로 보인다).
// 조건은 **선언형**이다: flag / allFlags / anyFlags / not / chapter / scene / item / always.
for (const [lang, text] of [
  ['ko', '(예시 코드 모드) 계단 앞에서 한 번 멈춰 선다'],
  ['en', '(sample advanced mod) Stop once at the foot of the stairs'],
  ['ja', '（見本コードモッド）階段の前で一度立ち止まる'],
]) {
  motp.i18n.addBundle(lang, 'common', { mods: { sampleAdvancedObjective: text } })
}

motp.objectives.patch({
  add: [
    {
      id: 'sample-advanced-extra',
      textKey: 'common:mods.sampleAdvancedObjective',
      sceneId: 'M-4F-corridor',
      after: 'ch2-lobby',
      tier: 'side',
      active: { chapter: 'ch2' },
      done: { flag: 'gapsuNotebookRead' },
    },
  ],
})

motp.log(`sample-advanced 끝 — 소지품 ${motp.items.ids().length}종 · 목표 ${motp.objectives.ids().length}줄`)
