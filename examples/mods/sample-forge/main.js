// ============================================================================
// 예시 Forge 모드 (v0.5.0, MODDING.md 13·14절의 표본) — Mixin 급 Inject를 세 갈래로 짚는다:
//   ① 이벤트 버스(`motp.events`, capability `events`)
//   ② Mixin(`motp.mixin`, capability `mixin`)
//   ③ 모드 도전과제(`motp.achievements` — capability 없이도 쓴다, 14절)
//
// **`sample-advanced`와 다르다.** `sample-advanced`는 부팅 때 한 번 도는 갈래(JSON 패치를
// 코드로 흉내 내는 표본)이고, 이 모드는 **회차 내내 사는** 갈래다: 이벤트 핸들러가 씬이
// 바뀔 때마다 불리고, Mixin이 게임의 판정 함수 안에 계속 앉아 있는다.
//
// **일부러 깨뜨려 보려면** 이벤트 핸들러나 Mixin 핸들러 안에 `throw new Error('일부러')`를
// 넣는다 — 그 핸들러만(모드 전체가 아니라) 3번 연속 던진 뒤 조용히 꺼지고, 로그에 남는다
// (13절 — 이벤트·Mixin은 핸들러 단위로 격리된다. `main.js` 최상위에서 던지면 모드 전체가
// 빠진다는 점에서 `sample-advanced`와 같다).
// ============================================================================

motp.log(`sample-forge 시작 (게임 ${motp.gameVersion}, capabilities: ${motp.capabilities.join(', ')})`)

// ---------------------------------------------------------------------------
// ① 이벤트 버스 — 복도(M-4F-corridor)에 들어선 것을 센다.
// 클로저 변수에만 담는다 — **상태 접근(`state` capability) 없이도** 이벤트만으로 할 수 있는
// 일이 무엇인지 보여 주는 것이 이 모드의 요점이다.
// ---------------------------------------------------------------------------
let corridorVisited = false

motp.events.on('scene:enter', ({ scene, cause }) => {
  if (scene !== 'M-4F-corridor') return
  corridorVisited = true
  motp.log(`복도에 들어섰다 (cause=${cause}) — sample-forge의 도전과제 조건을 채웠다`)
})

// `boot:ready`는 회차마다 딱 한 번, 첫 상태가 확정된 직후에 뜬다.
motp.events.on('boot:ready', () => {
  motp.log('첫 상태가 확정됐다 — 이제부터 scene:enter를 듣는다')
})

// ---------------------------------------------------------------------------
// ② Mixin — 힌트 예산에 하나를 더 얹는다. `hintBudgetOf`는 버전 있는 고정 훅 대상이다
// (`mods/hooks.ts`의 `HOOK_NAMES` 11개 중 하나, MODDING.md 13-2절).
// `at: 'return'`이라 원본 값을 받아 고쳐서 돌려준다 — 원본을 대신하는 `replace`와 다르다.
// ---------------------------------------------------------------------------
motp.mixin.inject('hintBudgetOf', {
  at: 'return',
  priority: 0,
  handler(value) {
    return value + 1
  },
})

// ---------------------------------------------------------------------------
// ③ 모드 도전과제 — capability 없이도 쓴다(JSON 패치와 같은 층). 제목 글부터 넣고 나서
// 도전과제를 건다(순서가 반대면 그 줄이 잠깐 키 이름으로 보인다).
// **이 표식은 Vanilla 원장이 아니라 모드팩 원장에 선다**(14-3절) — 이 모드를 끄면
// Vanilla `100.00%`는 그대로고, 이 표식만 안 보인다.
// ---------------------------------------------------------------------------
for (const [lang, text] of [
  ['ko', '무른 복도'],
  ['en', 'Soft Corridor'],
  ['ja', '軟らかい廊下'],
]) {
  motp.i18n.addBundle(lang, 'common', {
    achievements: { 'sample-forge.corridorVisitor': { title: text } },
  })
}

motp.achievements.define({
  id: 'sample-forge.corridorVisitor',
  category: 'hidden',
  icon: 'nametag',
  titleKey: 'common:achievements.sample-forge.corridorVisitor.title',
  // AchievementCtx가 아니라 위 클로저 변수를 그대로 읽는다 — 이벤트가 이미 쌓아 둔 사실을
  // 판정 시점에 다시 계산할 필요가 없다는 것을 보여 준다.
  earned: () => corridorVisited,
})

motp.log(`sample-forge 끝 — 훅 대상 ${motp.mixin.targets().length}개 중 hintBudgetOf 하나 사용, 이벤트 ${motp.events.names().length}종 중 둘 구독`)
