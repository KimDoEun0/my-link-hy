// TanStack Query 키 모음 (uid별로 캐시를 나눠 계정 전환 시 데이터가 섞이지 않게 함)
export const queryKeys = {
  profileSync: (uid: string | null) => ["profileSync", uid] as const, // 로그인 시 users/{uid} 저장
  profile: (uid: string | null) => ["profile", uid] as const, // users/{uid} 프로필
  links: (uid: string | null) => ["links", uid] as const, // users/{uid}/links 링크 목록
};
