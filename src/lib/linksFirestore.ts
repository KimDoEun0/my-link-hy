import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firestore";
import type { ContentBlock } from "@/types/mylink";

// 링크 저장 경로: users/anonymous/links
const USER_ID = "anonymous";
const linksCollection = collection(db, "users", USER_ID, "links");

// 저장할 링크 데이터 (id, order는 Firestore 문서 id와 생성 순서로 대체)
export type NewLinkData = Omit<ContentBlock, "id" | "order">;

// Firestore는 undefined 값을 저장할 수 없으므로 제거
function stripUndefined<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([, value]) => value !== undefined)
  ) as Partial<T>;
}

// 링크 추가: users/anonymous/links에 새 문서 생성
export async function addLink(link: NewLinkData): Promise<string> {
  const ref = await addDoc(linksCollection, {
    ...stripUndefined(link),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// 링크 삭제
export async function deleteLink(id: string): Promise<void> {
  await deleteDoc(doc(linksCollection, id));
}
