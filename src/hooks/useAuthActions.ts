"use client";

import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { getDoc } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { getDisplayName, signInWithGoogle, signOutUser, userProfileRef } from "@/lib/auth";

// 로그인 · 로그아웃 처리 공용 훅 (메인 화면 · 개인 페이지 헤더에서 사용)
// - notify: 결과 안내 함수 (토스트)
export function useAuthActions(notify: (message: string) => void) {
  const queryClient = useQueryClient();
  const [signingIn, setSigningIn] = useState(false);

  // Google 로그인 (팝업)
  const login = async () => {
    setSigningIn(true);
    // 팝업을 닫으면 Firebase가 이를 감지하기까지 수 초가 걸리므로,
    // 원래 창으로 포커스가 돌아오면 바로 버튼을 다시 사용할 수 있게 함
    // (로그인에 성공하면 로그인 상태 감지로 화면이 바로 바뀜)
    const handleFocusBack = () => setSigningIn(false);
    const focusTimer = window.setTimeout(
      () => window.addEventListener("focus", handleFocusBack, { once: true }),
      500
    );
    try {
      const signedIn = await signInWithGoogle();
      // 사용자가 수정한 표시 이름(users/{uid})으로 인사, 첫 가입이라 아직 없으면 이메일 앞부분
      const saved = await getDoc(userProfileRef(signedIn.uid)).catch(() => null);
      const name = (saved?.data()?.displayName as string | undefined) || getDisplayName(signedIn);
      notify(`${name}님, 환영해요 👋`);
    } catch (error) {
      const code = error instanceof FirebaseError ? error.code : "";
      // 사용자가 팝업을 닫은 경우는 안내하지 않음
      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return;
      notify(
        code === "auth/popup-blocked"
          ? "팝업이 차단되었어요. 브라우저에서 팝업을 허용해주세요."
          : "로그인에 실패했어요. 잠시 후 다시 시도해주세요."
      );
    } finally {
      window.clearTimeout(focusTimer);
      window.removeEventListener("focus", handleFocusBack);
      setSigningIn(false);
    }
  };

  // 로그아웃: 캐시(프로필 · 링크)를 비워 다음 로그인 때 다시 조회
  const logout = async () => {
    try {
      await signOutUser();
      queryClient.clear();
      notify("로그아웃되었어요");
    } catch {
      notify("로그아웃에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  return { signingIn, login, logout };
}
