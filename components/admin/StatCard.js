"use client";

export default function StatCard({ title, value, icon: Icon, subtitle }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900 mt-1">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
