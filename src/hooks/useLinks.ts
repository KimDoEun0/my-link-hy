"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLink, backfillLinkFields, deleteLink, getLinks, incrementLinkClick, updateLink, type NewLinkData } from "@/lib/linksFirestore";
import type { ContentBlock } from "@/types/mylink";
import { queryKeys } from "./queryKeys";

const requireUid = (uid: string | null) => {
  if (!uid) throw new Error("로그인이 필요해요");
  return uid;
};

// 링크 목록 조회: users/{uid}/links, createdAt 최신순 (TanStack Query, 실시간 구독 없음)
// - owner: 본인 링크를 볼 때(마이페이지) true → 예전 링크에 빠진 clickCount · updatedAt을 채움
export function useLinks(uid: string | null, { owner = false }: { owner?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.links(uid),
    queryFn: async (): Promise<ContentBlock[]> => {
      const snapshot = await getLinks(requireUid(uid));
      // 서버에 연결하지 못하면 getDocs는 오류 대신 캐시 결과를 반환하므로 오류로 처리
      if (snapshot.metadata.fromCache) throw new Error("서버에 연결하지 못해 링크를 불러오지 못했어요.");
      // 빠진 필드 채우기는 실패해도 목록 표시에는 영향 없음
      if (owner) await backfillLinkFields(requireUid(uid), snapshot).catch(() => {});
      return snapshot.docs.map((doc, index) => ({
        id: doc.id,
        type: "link",
        title: doc.data().title ?? "",
        url: doc.data().url,
        iconName: "Favicon", // 저장된 링크는 Google 파비콘으로 표시
        isVisible: true,
        order: index,
        clickCount: doc.data().clickCount ?? 0,
      }));
    },
    enabled: !!uid,
  });
}

// 링크 추가 → 성공하면 캐시 맨 앞에 추가 (다시 조회하지 않음)
export function useAddLink(uid: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (link: NewLinkData) => ({ id: await addLink(requireUid(uid), link), link }),
    onSuccess: ({ id, link }) => {
      queryClient.setQueryData<ContentBlock[]>(queryKeys.links(uid), (prev = []) => [
        { ...link, id, order: -1, clickCount: 0 },
        ...prev,
      ]);
    },
  });
}

// 링크 수정 → 성공하면 캐시의 해당 링크만 변경
export function useUpdateLink(uid: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title: string; url: string } }) => {
      await updateLink(requireUid(uid), id, data);
      return { id, data };
    },
    onSuccess: ({ id, data }) => {
      queryClient.setQueryData<ContentBlock[]>(queryKeys.links(uid), (prev = []) =>
        prev.map((b) => (b.id === id ? { ...b, ...data } : b))
      );
    },
  });
}

// 링크 삭제 → 성공하면 캐시에서 제거
export function useDeleteLink(uid: string | null) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteLink(requireUid(uid), id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<ContentBlock[]>(queryKeys.links(uid), (prev = []) => prev.filter((b) => b.id !== id));
    },
  });
}

// 같은 링크는 브라우저 세션(탭)마다 1번만 집계 → Firestore 쓰기 횟수(비용)를 줄임
const countedKey = (linkId: string) => `mylink:clicked:${linkId}`;
function markCounted(linkId: string): boolean {
  try {
    if (sessionStorage.getItem(countedKey(linkId))) return false; // 이미 집계함
    sessionStorage.setItem(countedKey(linkId), "1");
  } catch {
    // 저장소를 쓸 수 없으면(시크릿 모드 제한 등) 그냥 집계
  }
  return true;
}

// 링크 클릭 수 저장 (공개 페이지 방문자 클릭용)
// - 링크 이동(새 탭)은 저장을 기다리지 않고 바로 진행 (비동기, 실패해도 이동에 영향 없음)
// - 캐시의 클릭 수도 바로 1 올리고, 실패하면 되돌림
export function useLinkClickMutation(uid: string | null) {
  const queryClient = useQueryClient();
  const key = queryKeys.links(uid);
  const bump = (linkId: string, by: number) =>
    queryClient.setQueryData<ContentBlock[]>(key, (prev) =>
      prev?.map((b) => (b.id === linkId ? { ...b, clickCount: (b.clickCount ?? 0) + by } : b))
    );
  const mutation = useMutation({
    mutationFn: (linkId: string) => incrementLinkClick(requireUid(uid), linkId),
    onMutate: (linkId) => bump(linkId, 1),
    onError: (_error, linkId) => bump(linkId, -1),
  });
  return {
    ...mutation,
    // 세션에서 처음 누른 링크만 집계
    recordClick: (linkId: string) => {
      if (markCounted(linkId)) mutation.mutate(linkId);
    },
  };
}
