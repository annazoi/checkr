"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/components/i18n/LocaleProvider";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  const t = useT();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className="relative w-full max-w-lg rounded-t-card border border-border bg-surface p-6 md:rounded-card"
          >
            <div className="mb-4 flex items-center justify-between">
              {title && <h2 className="text-lg font-semibold text-text-primary">{title}</h2>}
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.closeDialog")}
                className="ml-auto flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-all duration-200 hover:rotate-90 hover:text-text-primary active:scale-90"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
