"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success", title = null) => {
    const id = Date.now() + Math.random().toString(36).slice(2, 7);
    setToasts((prev) => [...prev, { id, message, type, title }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getToastConfig = (type) => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          borderClass: "border-emerald-200 bg-emerald-50/95 text-emerald-950",
          iconClass: "text-emerald-600 bg-emerald-100",
          titleDefault: "Berhasil!",
        };
      case "error":
        return {
          icon: AlertCircle,
          borderClass: "border-rose-200 bg-rose-50/95 text-rose-950",
          iconClass: "text-rose-600 bg-rose-100",
          titleDefault: "Gagal!",
        };
      case "warning":
        return {
          icon: AlertTriangle,
          borderClass: "border-amber-200 bg-amber-50/95 text-amber-950",
          iconClass: "text-amber-600 bg-amber-100",
          titleDefault: "Peringatan",
        };
      case "info":
      default:
        return {
          icon: Info,
          borderClass: "border-blue-200 bg-blue-50/95 text-blue-950",
          iconClass: "text-blue-600 bg-blue-100",
          titleDefault: "Informasi",
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        className="fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const config = getToastConfig(toast.type);
          const IconComponent = config.icon;

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-xl border shadow-lg backdrop-blur-md flex items-start gap-3 transition-all duration-300 transform translate-y-0 opacity-100 ${config.borderClass}`}
              role="alert"
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.iconClass}`}
              >
                <IconComponent className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-bold text-xs leading-none">
                  {toast.title || config.titleDefault}
                </p>
                <p className="text-xs mt-1 text-slate-700 leading-relaxed break-words">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 p-1 -mr-1 rounded-md transition-colors"
                aria-label="Tutup notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (message) => {
        if (typeof window !== "undefined") {
          window.alert(message);
        }
      },
    };
  }
  return context;
}
