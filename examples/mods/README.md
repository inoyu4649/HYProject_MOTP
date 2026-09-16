# 예시 모드

만드는 법은 **[`MODDING.md`](../../MODDING.md)**가 적는다(공개 저장소 기준 경로다). 여기 둘은 **갈래마다 하나씩 짚어 보는 표본**이라,
그대로 복사해서 고치는 것이 가장 빠른 시작이다.

## 쓰는 법

`MOTP.exe` 옆에 `mods/` 폴더를 만들고 이 폴더들을 통째로 복사한다:

```
MOTP.exe
res/
mods/
  sample-basic/
  sample-advanced/
```

**`mods/`는 게임이 만들어 주지 않는다** — 직접 만든다. 기준은 언제나 **exe 옆**이다.

## sample-basic — 코드를 안 싣는 모드

| 건드리는 것 | 파일 | 확인하는 법 |
|---|---|---|
| 난이도 조율 | `data/difficulty.json` | 記錄에서 암실이 5컷에 끝난다 / 忘却에서 난롯가가 다시 길을 말한다 |
| 효과음 음량 | `data/sfx.json` | UI 클릭이 더 크게 들린다 |
| 목표 한 줄 | `data/objectives.json` | Ch2 로비 뒤에 곁가지 한 줄이 늘어난다 |
| 글 | `locales/ko/common.json` | 그 목표 줄의 글이 여기서 온다 |

**전부 「더하기」와 「값 바꾸기」뿐이라 ⚠가 안 붙는다** — 즉 이 모드만 켠 회차에서는
**도전과제가 그대로 선다**. 타이틀 왼쪽 아래 줄은 `1 Mod`.

## sample-advanced — 코드를 싣는 모드

`main.js` 한 장. **처음 켤 때 확인 창이 한 번 뜨고**, 켜진 회차는 **언제나 ⚠**이며
**도전과제가 안 선다**. Safe Mode가 가장 먼저 끄는 것이기도 하다.
타이틀 왼쪽 아래 줄은 `2 Mods ⚠`.

## 일부러 깨뜨려 보기

**깨진 모드가 켜져 있어도 나머지는 그대로 돌아야 한다** — 그게 이 계통의 약속이고,
아래 넷으로 직접 확인할 수 있다.

- `sample-basic/data/difficulty.json`의 중괄호를 하나 지운다 → 그 모드만 붉게 빠지고
  `sample-advanced`는 그대로 돈다.
- `sample-advanced/main.js` 맨 위에 `throw new Error('일부러')`를 넣는다 → 같은 결과.
- `sample-basic`을 통째로 복사해 `sample-basic-2`로 두면(id가 같다) **둘 다 안 켜진다.**
- `difficulty.json`에 `{"chaseSpawnAheadScale": {"extreme": 0.05}}`를 넣으면 감사기가
  「필연 피격」을 잡아 **그 조율값이 통째로 물러난다** — 이유는 `logs/`에 남는다.

무슨 일이 있었는지는 전부 `logs/motp-*.log`에 적힌다.
