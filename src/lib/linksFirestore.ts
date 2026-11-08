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
  increment,
  writeBatch,
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

// 링크 추가: users/{uid}/links에 새 문서 생성 (title, url, createdAt, updatedAt, clickCount: 0 저장)
// updatedAt은 마지막 수정 시각으로, 만들 때는 createdAt과 같은 시각
export async function addLink(uid: string, link: NewLinkData): Promise<string> {
  const ref = await addDoc(linksCollection(uid), {
    ...stripUndefined({ title: link.title, url: link.url }),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    clickCount: 0,
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

// 링크 클릭 수 1 증가: users/{uid}/links/{linkId}의 clickCount
// increment(1)로 서버에서 원자적으로 더해 동시에 여러 번 눌러도 누락되지 않음
export async function incrementLinkClick(uid: string, linkId: string): Promise<void> {
  await updateDoc(doc(linksCollection(uid), linkId), { clickCount: increment(1) });
}

// 예전에 만든 링크에 빠진 필드 채우기 (본인 마이페이지에서만 호출, 빠진 문서가 없으면 쓰지 않음)
// - clickCount 없음 → 0
// - updatedAt 없음 → createdAt (한 번도 수정하지 않은 링크)
export async function backfillLinkFields(uid: string, snapshot: QuerySnapshot): Promise<void> {
  const batch = writeBatch(db);
  let count = 0;
  for (const d of snapshot.docs) {
    const data = d.data();
    const patch: Record<string, unknown> = {};
    if (data.clickCount === undefined) patch.clickCount = 0;
    if (data.updatedAt === undefined) patch.updatedAt = data.createdAt ?? serverTimestamp();
    if (Object.keys(patch).length === 0) continue;
    batch.update(doc(linksCollection(uid), d.id), patch);
    count++;
  }
  if (count > 0) await batch.commit();
}
