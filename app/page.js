"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs text-center max-w-sm w-full space-y-4">
        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mx-auto">
          <Wrench className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-900">Booking Teknisi Lokal</h2>
          <p className="text-xs text-slate-500 mt-1">Mengalihkan ke Dashboard Admin...</p>
        </div>
        <Link
          href="/admin"
          className="inline-block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors"
        >
          Buka Dashboard Admin
        </Link>
      </div>
    </div>
  );
}
