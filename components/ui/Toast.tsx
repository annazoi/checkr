"use client";

import { useEffect } from "react";
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useUIStore, type ToastItem } from "@/store/ui";
import { cn } from "@/lib/utils/cn";

const icons = {
  default: InformationCircleIcon,
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
};

const toneClasses = {
  default: "border-border text-text-primary",
  success: "border-status-clear/40 text-status-clear",
  error: "border-status-risk/40 text-status-risk",
};

function ToastRow({ toast }: { toast: ToastItem }) {
  const dismissToast = useUIStore((s) => s.dismissToast);
  const Icon = icons[toast.variant];

  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, dismissToast]);

  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-2 rounded-control border bg-surface px-4 py-3 text-sm shadow-lg",
        toneClasses[toast.variant],
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="text-text-primary">{toast.message}</span>
    </div>
  );
}

export function ToastViewport() {
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto w-full max-w-sm">
          <ToastRow toast={toast} />
        </div>
      ))}
    </div>
  );
}
