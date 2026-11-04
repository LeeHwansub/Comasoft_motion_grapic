---
title: "영상·still은 git에 넣지 않고 로컬에만 둔다"
author: USER
date: 2026-11-04
branch: feature/intro-motion-v5
id: l-ecdd619b
scope: repo
status: active
replaces: l-d18ca7a5
src: agent
---

## Decided
- `*.mp4` / `*.webm`, `web/v5/review/`, `web/export/history/*`(README 제외), `web/export/out/`은 gitignore. 레포에는 코드만 둔다.
- 과정 문서는 채팅·로컬로 두고, PR에 `docs/v5-commit-push.md` 같은 절차 문서를 넣지 않는다.

## Tried and ruled out
- `web/export/history/`와 `web/v5/review/`에 영상·still을 커밋해 과정을 남기기: PR이 바이너리로 비대해지고 리뷰가 불가능해져서 버렸다.

## Watch out
이미 푸시된 커밋에 바이너리가 남아 있으면 새 커밋에서 `git rm --cached`로 추적만 끊는다. 히스토리에서 완전히 지우려면 force push가 필요하니 별도 승인 후에만 한다.

In the code: `.gitignore`, `web/export/history/README.md`, `web/export/snapshot.mjs`, `web/v5/review/`
