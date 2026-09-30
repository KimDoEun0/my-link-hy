# [와이어프레임] 마이링크 (MyLink) 메인 화면 명세서

**문서 버전**: v1.0.0  
**작성일**: 2026-09-30  
**화면 대상**: 메인 프로필 페이지 (방문자 퍼블릭 뷰어 - `/` 또는 `/[handle]`)  
**디자인 기준**: 모바일 퍼스트 반응형 (뷰포트 390px ~ 430px 기준, 토스 디자인 시스템 TDS 토큰 적용)  

---

## 1. 텍스트 와이어프레임 (Mobile Viewport Wireframe)

```text
┌────────────────────────────────────────────────────────┐
│                        MyLink                          │
│                                           [ 공유 / 복사 ↗]│ <-- 상단 우측 공유 액션 버튼
│                                                        │
│                      ┌────────┐                        │
│                      │  (👤)  │  <-- 1. 원형 프로필 아바타 (88x88)
│                      └────────┘                        │
│                                                        │
│                    크리에이터 민지  [Creator]            │ <-- 2. 표시 이름 + 역할 뱃지
│          일상과 테크 라이프스타일을 기록합니다 ✨            │ <-- 3. 한 줄 소개(Bio)
│          비즈니스 문의는 아래 링크나 메일로 부탁드려요!       │
│                                                        │
│        [ ▶ ]    [ 📸 ]    [ 🎵 ]    [ 🐙 ]    [ ✉️ ]    │ <-- 4. 소셜 미디어 아이콘 바
│       YouTube   Insta    TikTok    GitHub    Mail      │    (등록된 플랫폼만 가로 정렬)
│                                                        │
│ ────────────────────────────────────────────────────── │
│                                                        │
│  🔥 대표 채널 & 최신 소식                                 │ <-- 5. 섹션 구분 헤더 1
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [▶]  유튜브 채널 바로가기                  [인기]│  │ <-- 6. URL 링크 카드 1
│  │      매주 목요일 저녁 8시 신규 영상 업로드 🎥    ↗│  │    (아이콘 + 제목 + 설명
│  └──────────────────────────────────────────────────┘  │     + 뱃지 + 새창 화살표)
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [📸] 인스타그램 일상 & 스토리                     │  │ <-- URL 링크 카드 2
│  │      실시간 라이프스타일과 비하인드 컷 📸        ↗│  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  🛍️ 진행 중인 공구 & 추천 아이템                         │ <-- 섹션 구분 헤더 2
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [🛍️] 2026 데스크테리어 기획전           [한정 특가]│  │ <-- URL 링크 카드 3
│  │      제가 직접 써보고 검증한 추천 제품 모음 💻   ↗│  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [📝] 올인원 노션 생산성 템플릿 무료 배포           │  │ <-- URL 링크 카드 4
│  │      목표 관리와 루틴을 한눈에 정리하는 템플릿   ↗│  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  💬 협업 & 문의                                         │ <-- 섹션 구분 헤더 3
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ [✉️] 비즈니스 및 광고 협업 제안                   │  │ <-- URL 링크 카드 5
│  │      이메일 또는 제안서 링크로 연락 부탁드립니다 ↗│  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│                                                        │
│                 ⚡ Powered by MyLink                   │ <-- 7. 하단 푸터 브랜딩
│             © 2026 MyLink. All rights reserved.        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 2. 영역별 상세 UI/UX 명세

### 2.1 상단 네비게이션 & 공유 액션
* **위치**: 페이지 우측 상단 고정 또는 상단 여백 우측
* **컴포넌트**: `Share2` (Lucide 아이콘) 원형 버튼 (`w-9 h-9 rounded-full bg-white shadow-sm border border-black/5`)
* **인터랙션**:
  * 모바일: `navigator.share` API 호출로 네이티브 OS 공유 시트(카카오톡, 메시지, 링크 복사 등) 실행
  * 데스크톱 / 비지원 브라우저: 클립보드에 현재 URL 복사 및 하단 "링크가 복사되었습니다!" 토스트(Toast) 2초 노출

### 2.2 프로필 헤더 (Profile Header)
* **원형 아바타 (Avatar)**:
  * 크기: `w-[88px] h-[88px]`
  * 스타일: `rounded-full ring-4 ring-white shadow-md object-cover overflow-hidden`
  * 폴백: 이미지 부재 시 Lucide `User` 기본 아이콘 렌더링
* **표시 이름 & 뱃지**:
  * 타이틀: `text-xl font-bold text-[#191F28]` (토스 그레이 900)
  * 역할 뱃지: `bg-blue-50 text-[#3182F6] text-xs font-semibold px-2 py-0.5 rounded-full`
* **한 줄 소개 (Bio)**:
  * 스타일: `text-sm text-[#4E5968] text-center leading-relaxed whitespace-pre-line`
  * 최대 너비: `max-w-xs` (모바일 가독성 확보)

### 2.3 소셜 미디어 아이콘 바 (Social Media Bar)
* **배치**: 프로필 소개글 바로 아래 가로 중앙 정렬 (`flex items-center justify-center gap-2.5`)
* **아이콘 버튼 사양**:
  * 크기: `w-10 h-10 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center`
  * 호버/터치 효과: `active:scale-90 transition-transform duration-150`
  * 아이콘 규격: `w-5 h-5 text-[#4E5968]`
* **노출 정책**: 사용자가 URL을 등록한 소셜 플랫폼만 동적으로 렌더링

### 2.4 섹션 구분 헤더 (Section Header)
* **스타일**: `text-xs font-semibold text-[#8B95A1] uppercase tracking-wider px-2 pt-4 pb-1 text-left`
* **역할**: 링크 리스트 사이를 시각적으로 분리하여 목적별 링크 탐색 효율 극대화

### 2.5 URL 링크 카드 버튼 (Link Block)
* **카드 컨테이너**:
  * 기본 스타일: `bg-white rounded-2xl p-4 shadow-sm border border-black/5 flex items-center gap-3.5 transition-all`
  * 인터랙션: `hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]`
* **좌측 아이콘 (Thumbnail/Icon)**:
  * 크기: `w-10 h-10 rounded-xl flex items-center justify-center`
  * 플랫폼/카테고리별 테마 배경색 및 아이콘 (예: 유튜브 - 레드 계열, 인스타 - 핑크 계열, 쇼핑 - 오렌지 계열)
* **중앙 텍스트 영역**:
  * 제목: `text-base font-semibold text-[#191F28] line-clamp-1`
  * 부가 설명: `text-xs text-[#6B7684] line-clamp-1 mt-0.5`
* **우측 강조 요소**:
  * 뱃지(선택): `text-[11px] font-bold px-2 py-0.5 rounded-md` (예: `인기`, `특가`)
  * 이동 화살표: `ArrowUpRight` (Lucide) 아이콘 (`w-4 h-4 text-[#B0B8C1]`)
* **동작**: 새 창(`target="_blank" rel="noopener noreferrer"`)으로 외부 URL 이동

### 2.6 하단 푸터 (Footer)
* **스타일**: `pt-8 pb-12 text-center text-xs text-[#8B95A1]`
* **문구**: `⚡ Powered by MyLink` & `© 2026 MyLink. All rights reserved.`

---

## 3. 반응형 뷰포트 레이아웃 규칙

| 뷰포트 | 컨테이너 스타일 | 배경 및 여백 |
| :--- | :--- | :--- |
| **모바일 (< 640px)** | `w-full min-h-screen px-4 py-8` | 단일 화면 전체 렌더링, 양옆 16px 패딩 |
| **태블릿 / PC (>= 640px)** | `max-w-[440px] mx-auto min-h-screen my-8 rounded-[36px] shadow-2xl px-5 py-10 border border-black/5` | 데스크톱 중앙에 모바일 스마트폰 기기 프레임 형태로 미려하게 플로팅 |
