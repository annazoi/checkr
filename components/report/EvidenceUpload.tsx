"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/Spinner";
import { useT } from "@/components/i18n/LocaleProvider";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function EvidenceUpload({
  evidenceId,
  onChange,
}: {
  evidenceId: string | null;
  onChange: (evidenceId: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useT();

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError(t("report.onlyImagesSupported"));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(t("report.imageTooLarge"));
      return;
    }

    setIsUploading(true);
    try {
      const blob = await upload(`evidence/raw/${crypto.randomUUID()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload/evidence",
      });

      const confirmRes = await fetch("/api/upload/evidence/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: blob.url }),
      });
      const confirmBody = await confirmRes.json();
      if (!confirmRes.ok) throw new Error(confirmBody.error?.message ?? t("report.uploadFailed"));

      setPreviewUrl(URL.createObjectURL(file));
      onChange(confirmBody.data.evidenceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("report.uploadFailed"));
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemove() {
    setPreviewUrl(null);
    onChange(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="text-sm font-medium text-text-primary">{t("report.attachScreenshot")}</p>
      <p className="mt-1 text-xs text-text-secondary">{t("report.dontIncludePersonalInfo")}</p>

      {evidenceId && previewUrl ? (
        <div className="mt-3 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not an optimizable remote asset */}
          <img
            src={previewUrl}
            alt={t("report.attachScreenshot")}
            className="h-16 w-16 rounded-control object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="flex min-h-[44px] items-center gap-1 text-sm font-medium text-status-risk transition-all duration-150 hover:scale-105 active:scale-95"
          >
            <XMarkIcon className="h-4 w-4" aria-hidden="true" />
            {t("report.removeScreenshot")}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-control border border-dashed border-border text-sm font-medium text-text-secondary transition-all duration-200 hover:scale-[1.01] hover:border-white/20 hover:text-text-primary hover:shadow-[0_0_14px_-6px_rgba(139,127,247,0.5)] active:scale-[0.99]"
        >
          {isUploading ? <Spinner size={16} /> : <PhotoIcon className="h-5 w-5" aria-hidden="true" />}
          {isUploading ? t("common.uploading") : t("report.chooseScreenshot")}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {error && <p className="mt-1.5 text-xs text-status-risk">{error}</p>}
    </div>
  );
}
