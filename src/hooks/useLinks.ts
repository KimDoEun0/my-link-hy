"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addLink, deleteLink, getLinks, updateLink, type NewLinkData } from "@/lib/linksFirestore";
import type { ContentBlock } from "@/types/mylink";
import { queryKeys } from "./queryKeys";

const requireUid = (uid: string | null) => {
  if (!uid) throw new Error("로그인이 필요해요");
  return uid;
};

// 링크 목록 조회: users/{uid}/links, createdAt 최신순 (TanStack Query, 실시간 구독 없음)
export function useLinks(uid: string | null) {
  return useQuery({
    queryKey: queryKeys.links(uid),
    queryFn: async (): Promise<ContentBlock[]> => {
      const snapshot = await getLinks(requireUid(uid));
      // 서버에 연결하지 못하면 getDocs는 오류 대신 캐시 결과를 반환하므로 오류로 처리
      if (snapshot.metadata.fromCache) throw new Error("서버에 연결하지 못해 링크를 불러오지 못했어요.");
      return snapshot.docs.map((doc, index) => ({
        id: doc.id,
        type: "link",
        title: doc.data().title ?? "",
        url: doc.data().url,
        iconName: "Favicon", // 저장된 링크는 Google 파비콘으로 표시
        isVisible: true,
        order: index,
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
        { ...link, id, order: -1 },
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
