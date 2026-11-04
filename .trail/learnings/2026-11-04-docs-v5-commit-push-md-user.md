---
title: "커밋·푸시 절차를 docs/v5-commit-push.md 로 레포에 넣지 않는다"
author: USER
date: 2026-11-04
branch: feature/intro-motion-v5
id: l-3f826fab
scope: repo
status: active
src: agent
---

## Decided
- 사용자가 커밋·푸시 “과정”을 남기라고 해도 `docs/v5-commit-push.md` 같은 절차 문서를 레포에 만들지 않는다. 채팅/로컬 메모로 충분하다.
- 문제였던 건 `docs/` 폴더 전체가 아니라 그 안의 `docs/v5-commit-push.md`가 왜 들어갔는지다.

## Tried and ruled out
- 커밋·푸시 과정을 상세히 문서화해 `docs/v5-commit-push.md`로 커밋·푸시: 사용자가 원하지 않는 내용이 PR에 들어가서 버렸다.

## Watch out
“과정을 남긴다” = git 체크포인트·코드 상태이지, 에이전트가 작성한 운영 가이드 MD를 레포에 추가하라는 뜻이 아니다. `docs/` 개요 README는 필요할 수 있으나 `v5-commit-push.md`는 다시 만들지 않는다.

In the code: do not recreate docs/v5-commit-push.md; related paths web/v5/, .gitignore
