# [구현 계획] Google 소셜 로그인 및 마이페이지 개인화

**문서 버전**: v1.1.0
**작성일**: 2026-10-25
**대상 화면**: `/`, `/mypage` (동일 화면)
**관련 문서**: [wireframe.md](./wireframe.md), [PRD.md](./PRD.md)

---

## 1. 목표

- 헤더에 **Google 소셜 로그인**을 추가하고, 로그인한 사용자별로 링크 데이터를 분리(개인화)한다.
- 로그인하지 않은 사용자에게는 **"Development in One Link" 소개 랜딩 페이지**와 로그인 후 사용할 수 있다는 안내를 보여준다.
- 로그인한 사용자에게는 **마이페이지**(유저 정보 + 링크 CRUD)를 보여준다.
- `useUser` 커스텀 훅으로 로그인 상태와 Firestore 프로필(`users/{uid}`)을 **실시간 동기화**한다.
- 모든 UI 컴포넌트는 프로젝트 표준인 **Base UI(`@base-ui/react`) 기반 shadcn 컴포넌트**를 사용한다.

## 2. 범위

| 포함 | 제외 |
| :--- | :--- |
| Google 팝업 로그인 / 로그아웃 | 이메일·비밀번호 등 다른 로그인 방식 |
| 로그인 상태별 화면(랜딩 / 마이페이지) | 공개 프로필 페이지(`/[handle]`) |
| `users/{uid}` 유저 정보 저장·표시 | 프로필 편집(이름·소개 수정) |
| `users/{uid}/links` 링크 CRUD | 기존 `users/anonymous/links` 데이터 이전 |
| | Firestore 보안 규칙 배포(콘솔에서 별도 진행) |

## 3. 화면 구성

### 3.1 헤더 (와이어프레임 2.1 기준: 가운데 로고 + 우측 액션)

```text
┌──────────────────────────────────────────────┐
│                   MyLink        [G Google로 로그인] │  ← 로그아웃 상태
│                   MyLink        (사진) [로그아웃]   │  ← 로그인 상태
└──────────────────────────────────────────────┘
```

- 첫 로그인 상태 확인 중에는 우측에 스켈레톤을 표시한다.
- 로그인 진행 중에는 버튼에 스피너를 표시하고 중복 클릭을 막는다.

### 3.2 로그아웃 상태 — 랜딩 페이지 ("Development in One Link")

- 배지 "개발자를 위한 멀티링크", 큰 제목 **"Development in One Link"** ("One Link" 강조색)
- 소개 문구: "흩어져 있는 개발 활동을 하나의 링크로. 나만의 마이페이지에서 모든 링크를 관리하세요."
- 미리보기: GitHub · 개발 블로그 · 포트폴리오 예시 카드 (실제 링크 아님)
- 기능 안내 3줄 (한 곳에 모으기 / 추가·수정·삭제 / 내 계정에만 저장)
- 큰 버튼 **"Google로 계속하기"**
- 🔒 안내: "Google 계정으로 로그인한 뒤 마이페이지를 사용할 수 있어요."
- 링크 추가 버튼과 링크 목록은 숨긴다. (다른 사람 데이터 노출 방지)

### 3.3 로그인 상태 — 마이페이지

- 프로필: 사진, **마이페이지** 배지, 이름, 이메일, 가입일·최근 로그인 (`users/{uid}` 문서 값, 실시간 반영)
- "새로운 링크 추가하기" 버튼 + 링크 목록 (수정·삭제 포함, 기존 CRUD 그대로)

## 4. 데이터 구조 (Firestore)

```text
users/{uid}                     ← 유저 정보 (로그인할 때마다 갱신)
  uid, email, photoURL
  displayName   (이메일 앞부분, 예: hong@gmail.com → hong)
  createdAt     (첫 로그인 시각, 이후 유지)
  lastLoginAt   (로그인할 때마다 갱신)

users/{uid}/links/{linkId}      ← 링크 (유저별 개인화)
  title, url, createdAt
  updatedAt     (수정 시에만 기록)
```

- **프로필(`users/{uid}`)**: `useUser` 훅에서 `onSnapshot`으로 **실시간 동기화**한다.
- **링크(`users/{uid}/links`)**: 실시간 구독 없이 **로그인 시 `getDocs` 1회 조회 + 변경 후 로컬 상태 갱신**(갱신형)으로 한다.
- 정렬: `createdAt` 내림차순(최신순).

## 5. 변경 파일

| 구분 | 파일 | 내용 |
| :--- | :--- | :--- |
| 신규 | `src/lib/auth.ts` | `getAuth`, `GoogleAuthProvider` 팝업 로그인·로그아웃, `saveUserProfile`(users/{uid} 저장), `userProfileRef` |
| 신규 | `src/hooks/useUser.ts` | **`useUser` 커스텀 훅**: `onAuthStateChanged` + `users/{uid}` `onSnapshot` 실시간 구독 (`user`, `profile`, `loading`) |
| 신규 | `src/components/auth/Header.tsx` | **Header**: 로고 + 로그인/로그아웃 + 유저 아바타 |
| 신규 | `src/components/auth/GoogleLoginButton.tsx` | Google 로고 + 로그인 버튼 (Base UI `Button` 기반) |
| 신규 | `src/components/auth/Landing.tsx` | 비로그인 랜딩 페이지 ("Development in One Link") |
| 수정 | `src/lib/linksFirestore.ts` | 경로 `users/anonymous/links` → `users/{uid}/links`, 모든 함수에 `uid` 인자 추가, `getLinks` 추가 |
| 수정 | `src/app/page.tsx` | `user` 상태에 따른 조건부 렌더링(랜딩/마이페이지), 유저별 링크 로드, 로그인·로그아웃 처리 |

## 6. Base UI 사용 원칙

- 버튼은 `src/components/ui/button.tsx`(Base UI `Button` 래퍼)를 사용한다. 일반 `<button>`을 새로 만들지 않는다.
  - Google 로그인 버튼: `variant="outline"` + Google 브랜드 색상(흰 배경, 회색 테두리)
  - 로그아웃 버튼: `variant="ghost"`, `size="sm"`
- 아바타는 `src/components/ui/avatar.tsx`(Base UI `Avatar`)를 사용한다. Google 프로필 사진은 `referrerPolicy="no-referrer"`로 불러온다.
- 다이얼로그(링크 추가·삭제 확인)는 기존 Base UI `Dialog`를 그대로 사용한다.
- Radix UI는 사용하지 않는다.

## 7. 구현 단계

1. Firebase 콘솔에서 Google 로그인 제공자 사용 설정, 승인된 도메인에 `localhost` 확인
2. `auth.ts`, `useUser.ts` 작성 (로그인·로그아웃, 로그인 상태 구독, 프로필 저장 및 실시간 동기화)
3. `linksFirestore.ts`를 `users/{uid}/links` 경로로 변경
4. 헤더, 로그인 버튼, 랜딩 안내 컴포넌트 작성 (Base UI 컴포넌트 사용)
5. `page.tsx`에서 로그인 상태별 화면 분기 및 유저별 데이터 로드
6. 예외 처리
   - 팝업을 닫은 경우(`auth/popup-closed-by-user`)는 안내하지 않음
   - 팝업 차단(`auth/popup-blocked`) 시 허용 안내 토스트
   - 팝업을 닫은 뒤 원래 창으로 포커스가 돌아오면 로딩 상태를 바로 해제 (Firebase 감지 지연 약 9초 보완)
   - 계정 전환 시 이전 계정 데이터가 섞이지 않도록 uid별로 데이터 보관

## 8. 검증 계획

| 구분 | 확인 항목 |
| :--- | :--- |
| 로그인 | 메인 진입 → "Development in One Link" 랜딩 페이지와 "Google로 계속하기" 버튼 표시 |
| | 버튼 클릭 → Google 로그인 팝업 → 로그인 성공 |
| | 로그인 후 마이페이지 화면 전환 |
| | Firestore에서 프로필을 바꾸면 새로고침 없이 화면에 반영 (실시간 동기화) |
| | Firestore `users/{uid}`에 유저 데이터 생성, 화면 값과 일치 |
| 링크 CRUD | 링크 추가 → 화면 즉시 반영, `users/{uid}/links`에 저장 |
| | 링크 수정·삭제 정상 동작 |
| 로그아웃 | 헤더 로그아웃 → 랜딩 페이지 복귀, 링크 목록 숨김 |
| | 재로그인 시 이전 링크 리스트 그대로 표시, `lastLoginAt`만 갱신 |
| Base UI | 로그인·로그아웃 버튼이 Base UI `Button`(`data-slot="button"`)으로 렌더링 |
| 공통 | 런타임 오류 없음, TypeScript 검사 통과 |

## 9. 위험 요소 및 후속 작업

- **보안 규칙**: 현재 Firestore가 테스트 모드라 로그인 없이도 읽기·쓰기가 가능하다. 개인화를 보장하려면 콘솔에서 아래 규칙으로 바꾼다.
  ```text
  match /users/{uid}/{document=**} {
    allow read, write: if request.auth != null && request.auth.uid == uid;
  }
  ```
- **기존 데이터**: `users/anonymous/links`의 링크는 더 이상 화면에 표시되지 않는다. 필요하면 로그인 계정으로 이전한다.
- **배포**: 배포 도메인을 Firebase 인증의 승인된 도메인에 추가해야 팝업 로그인이 동작한다.
