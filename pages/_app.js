import { AuthContextProvider } from "../src/context/AuthContext";
import AppLayout from "../src/components/Layout/AppLayout";
import "../styles/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import LoadingPage from "../src/components/LoadingPage";

export default function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const start = () => setLoading(true);
    const end = () => setLoading(false);

    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", end);
    router.events.on("routeChangeError", end);

    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", end);
      router.events.off("routeChangeError", end);
    };
  }, [router]);

  return loading ? (
    <LoadingPage />
  ) : (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}
