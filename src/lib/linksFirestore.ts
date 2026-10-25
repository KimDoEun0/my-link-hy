import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type QuerySnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { ContentBlock } from "@/types/mylink";

// 링크 저장 경로: users/{uid}/links (로그인한 유저별로 개인화)
const linksCollection = (uid: string) => collection(db, "users", uid, "links");

// 저장할 링크 데이터 (id, order는 Firestore 문서 id와 생성 순서로 대체)
export type NewLinkData = Omit<ContentBlock, "id" | "order">;

// Firestore는 undefined 값을 저장할 수 없으므로 제거
function stripUndefined<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

// 링크 목록 1회 조회: createdAt 기준 최신순 (실시간 구독 아님)
export async function getLinks(uid: string): Promise<QuerySnapshot> {
  return getDocs(query(linksCollection(uid), orderBy("createdAt", "desc")));
}

// 링크 추가: users/{uid}/links에 새 문서 생성 (title, url, createdAt만 저장)
export async function addLink(uid: string, link: NewLinkData): Promise<string> {
  const ref = await addDoc(linksCollection(uid), {
    ...stripUndefined({ title: link.title, url: link.url }),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// 링크 삭제
export async function deleteLink(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(linksCollection(uid), id));
}

// 링크 수정: users/{uid}/links/{id} 문서의 title, url 갱신 + 수정 시각(updatedAt) 기록
export async function updateLink(
  uid: string,
  id: string,
  data: { title: string; url: string }
): Promise<void> {
  await updateDoc(doc(linksCollection(uid), id), {
    title: data.title,
    url: data.url,
    updatedAt: serverTimestamp(),
  });
}
