import { getFirestore, type Firestore } from "firebase/firestore";
import { app } from "@/lib/firebase";

// Firestore 데이터베이스 인스턴스
export const db: Firestore = getFirestore(app);
