---
title: "Export out은 scratch, 과정은 history와 커밋으로 남긴다"
author: USER
date: 2026-11-04
branch: feature/intro-motion-v5
id: l-d18ca7a5
scope: repo
status: active
src: agent
touches:
  - web/index.html
  - web/motion.js
  - web/style.css
---

## Decided
- `web/export/out/`은 캡처마다 덮어쓰는 scratch로 `.gitignore`에 둔다.
- 남길 still/영상은 `web/export/snapshot.mjs`로 `web/export/history/YYYY-MM-DD-<label>/`에 복사한 뒤 커밋한다.
- v5 looktest는 `web/v5/review/`에 두고 그 폴더를 커밋한다.

## Tried and ruled out
- `web/export/out/`을 git 추적: 최신만 덮어써져서 과정 비교가 안 된다.

## Watch out
미커밋 WIP를 `git restore`하면 복구되지 않는다. 의미 있는 단계마다 커밋하거나 history 스냅샷을 남긴다.

In the code: web/export/capture.mjs, web/export/snapshot.mjs, web/export/history/README.md, .gitignore, web/v5/review/
