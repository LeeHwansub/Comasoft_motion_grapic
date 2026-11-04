# Comasoft_motion_grapic

COMASOFT 홈페이지 인트로 모션 (시안 COMASOFT4 기준, **5초 / 16:9**).

## 상태

- **완료:** `web/v5/` — 01 IDEA → 05 COMASOFT, light/dark
- v4(`web/`)는 이전 SVG 구현 (참고용)
- 영상·still은 **로컬만** (`web/v5/review/`, `web/export/out/`). git에 넣지 않음

## 미리보기

```bash
open web/v5/index.html
# ?theme=dark  |  ?t=3.4  |  ?from=0&to=5.4
```

## 영상 다시 뽑기

```bash
cd web/export
node capture.mjs --page=v5 --webm=false
node capture.mjs --page=v5 --theme=dark --webm=false
# 결과: out/comasoft-intro-v5-light.mp4 · dark.mp4
```

필요하면 로컬로 복사:

```bash
cp out/comasoft-intro-v5-*.mp4 ../v5/review/
```

옛 커밋에서 꺼내기:

```bash
git show 'f2a68ae:web/v5/review/comasoft-intro-v5-light.mp4' >| web/v5/review/comasoft-intro-v5-light.mp4
```

## 브랜치

- `main` / `dev` — 최신
- 시안 원본: 로컬 `_box/` (gitignore)

기획·작업 기록은 Notion `Comasoft_motion Grapic` 페이지를 본다.
