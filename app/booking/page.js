"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BookingRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pelanggan/booking");
  }, [router]);

  return null;
}
