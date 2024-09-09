"use client";

import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";
import { useEffect, useState } from "react";
import LoadingPage from "./LoadingPage";

export default function ProtectedRoute({ children, checkAdmin }) {
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
