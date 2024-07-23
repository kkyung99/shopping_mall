"use client";

import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";

export default function ProtectedRoute({ children, checkAdmin }) {
  // 로그인한 사용자가 있는지 확인 / 사용자가 어드민 권한이 있는지 확인
  // checkAdmin이 true인 경우에는 로그인과 어드민권한도 가지고 있어야 함
  // 조건에 맞는 경우 전달된 children을 보여줌 아니라면 / 상위 경로로 이동

  const { user, loading } = useAuthContext();
  const router = useRouter();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (isInitialLoad) {
      setIsInitialLoad(false);
    } else if (!user) {
      router.push("/").then(() => alert("권한 없음!"));
    } else if (checkAdmin && !user.isAdmin) {
      router.push("/").then(() => alert("권한 없음!"));
    }
  }, [loading, user, router, checkAdmin, isInitialLoad]);

  if (loading || isInitialLoad) {
    return <LoadingPage />;
  }

  return children;
}
