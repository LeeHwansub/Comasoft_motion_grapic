# v5 커밋·푸시 과정

이 문서는 `feature/intro-motion-v5`를 remote에 남기는 **실제 진행 절차**다.
코드만 올리는 게 아니라, looktest·전체 intro 영상·스냅샷 규칙까지 같이 남긴다.

## 1. 브랜치와 목적

| 항목 | 값 |
|------|-----|
| 브랜치 | `feature/intro-motion-v5` |
| 기준 | `main` / `dev`에는 직접 커밋하지 않음 |
| 원격 | `origin` → `https://github.com/LeeHwansub/Comasoft_motion_grapic.git` |
| 목적 | COMASOFT4 시안 기반 intro v5 (01→05 풀 타임라인) + review 산출물 보존 |

## 2. 남기는 것 / 남기지 않는 것

| 경로 | 역할 | git |
|------|------|-----|
| `web/v5/` | v5 소스 (`intro.js`, CSS, HTML, 로고) | 추적 |
| `web/v5/review/` | looktest·전체 intro mp4, 비교 PNG | 추적 |
| `web/export/history/` | `out/` 스냅샷 (덮어쓰기 방지) | 추적 |
| `web/export/out/` | 캡처 scratch | **gitignore** |
| `_box/` | 시안 원본 | gitignore |

캡처 후 남기려면:

```bash
cd web/export
node capture.mjs --still=0.5,1.5,2.5,3.5,4.8   # 필요 시
node snapshot.mjs --label=v5-<설명>
git add history/YYYY-MM-DD-v5-<설명>
```

## 3. 이번 체크포인트에 포함된 내용

1. **이전 커밋 `9824749`**  
   - export history 체계 (`snapshot.mjs`, `history/2026-11-04-v4-out/`)  
   - v5 초기 코드 + looktest 영상들  
   - trail learnings (겹침 clip, out=scratch)

2. **이번 커밋 (풀 0~5s v5)**  
   - `web/v5/intro.js` / `intro.css`: 01 IDEA · 02 AI 타임라인·잔상·가이드 라인 추가, 기본 재생 `from=0`  
   - `web/v5/review/comasoft-intro-v5-light.mp4` / `…-dark.mp4`: 전체 intro 결과물  
   - 이 과정 문서 (`docs/v5-commit-push.md`)

## 4. 커밋 전 확인 명령

```bash
git status -sb
git diff --stat HEAD
git log --oneline -5
# 비밀값·.env 없는지 확인 (이 레포는 해당 없음)
```

## 5. 커밋

```bash
git add web/v5 docs/v5-commit-push.md docs/README.md
git commit -m "$(cat <<'EOF'
v5 풀 타임라인(01–05)과 review 영상, 커밋·푸시 과정을 남긴다.

01·02 씬과 전체 intro light/dark mp4를 추가하고, 이후에도 같은 방식으로
체크포인트·푸시할 수 있도록 절차를 docs에 고정한다.
EOF
)"
```

메시지 규칙: 이유 중심, 한글 제목/본문, 파일·기술명은 원문.

## 6. 푸시

브랜치에 upstream이 없으면:

```bash
git push -u origin HEAD
```

이미 tracking 중이면:

```bash
git push
```

`main`/`dev`에 force push 하지 않는다. 이 브랜치는 feature이므로 `-u origin HEAD`만 사용.

## 7. 푸시 후

```bash
git status -sb
git log --oneline origin/feature/intro-motion-v5 -3
```

PR은 별도 승인 후에만 만든다. 대상 브랜치는 보통 `dev`.

## 8. 다음에 이어서 할 때

1. `feature/intro-motion-v5` 체크아웃  
2. `web/v5/index.html`로 재생·수정  
3. looktest나 still이 의미 있으면 `review/` 또는 `export/history/`에 추가  
4. 위 4→5→6 반복 (미커밋으로 오래 두지 않기)
