---
quick_id: 260819-hld
status: in_progress
description: Implement production holding mode and deploy
---

# Production holding mode and deployment

## Task 1: Add a constrained holding-mode runtime contract

- Add an explicit production-only environment flag.
- Permit an unapproved production estate only when leads, analytics, crawling, and review access are disabled.
- Preserve the existing fail-closed behavior when holding mode is absent.
- Add configuration tests for accepted and rejected combinations.

## Task 2: Document the temporary operating mode

- Add the flag to the environment example and deployment documentation.
- State that governed content remains withheld and integrations remain disabled.

## Task 3: Verify and deploy

- Run lint, type checking, tests, and both ordinary and holding-mode production builds.
- Commit atomically, push `main`, configure isolated Production environment values, deploy, and verify the public URL.

