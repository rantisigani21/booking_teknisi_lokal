"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RiwayatRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pelanggan/riwayat-booking");
  }, [router]);

  return null;
}
