"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/pelanggan/profil");
  }, [router]);

  return null;
}
