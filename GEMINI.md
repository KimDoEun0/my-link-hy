# 프로젝트 지침 (Project Guidelines)

## 1. 언어 원칙 (Language Policy) - 필수 준수 사항
- **반드시 한국어(한글) 사용**: 사용자와의 모든 대화, 설명, 질문 및 답변은 **무조건 한국어로 작성**해야 합니다.
- **문서 및 산출물(Artifacts) 작성**:
  - 계획(Plan), 태스크(Tasks), 워크스루(Walkthrough) 문서
  - PRD(제품 요구사항 정의서), 기능 명세서, 와이어프레임 문서, 디자인 문서, 설계 문서, README
  - 위 항목을 포함하여 에이전트가 생성하거나 프로젝트 내에서 관리되는 **모든 문서와 산출물은 반드시 한국어(한글)**로 작성합니다.
- **커밋 메시지 및 코드 주석**: 커밋 메시지와 코드 내 주석, 설명도 한국어 사용을 기본으로 합니다.
- **영문 문서 및 지침 참조 시 주의**: Next.js 규칙이나 외부 라이브러리 가이드가 영어로 제공되더라도, 생성되는 결과물 및 대화는 **항상 한국어로 번역 및 정리하여 전달**합니다.

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
