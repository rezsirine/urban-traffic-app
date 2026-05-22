"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import styles from "./layout.module.css";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const isAuthPage = ["/login", "/register", "/reset-password"].includes(pathname);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    setHasToken(!!token);

    if (!token && !isAuthPage) {
      router.push("/login");
      return;
    }

    if (userStr && !isAuthPage) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'OPERATOR' && pathname === '/') {
          router.push('/incidents');
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [isAuthPage, router, pathname]);

  if (isAuthPage) return <>{children}</>;
  if (!isClient) return null;

  if (!hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Header />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}