"use client";

export default function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase().trim();

  let style = "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "menunggu") {
    style = "bg-amber-50 text-amber-800 border-amber-200";
  } else if (normalized === "diproses") {
    style = "bg-blue-50 text-blue-700 border-blue-200";
  } else if (normalized === "selesai" || normalized === "aktif") {
    style = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (normalized === "dibatalkan" || normalized === "tidak aktif") {
    style = "bg-rose-50 text-rose-700 border-rose-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${normalized === "menunggu"
            ? "bg-amber-500"
            : normalized === "diproses"
              ? "bg-blue-500"
              : normalized === "selesai" || normalized === "aktif"
                ? "bg-emerald-500"
                : "bg-rose-500"
          }`}
      />
      {status}
    </span>
  );
}
