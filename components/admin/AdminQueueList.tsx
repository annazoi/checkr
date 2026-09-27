"use client";

import { useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { formatRelativeTime } from "@/lib/utils/format-relative-time";
import { useUIStore } from "@/store/ui";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

type QueueReport = {
  id: string;
  gameSourceId: string;
  reportType: string;
  description: string | null;
  status: string;
  anomalyDetected: boolean | null;
  createdAt: string;
  username: string;
};

type ModerationAction = "approve" | "reject" | "hide" | "escalate";

const ACTIONS: ModerationAction[] = ["approve", "reject", "hide", "escalate"];

const SECURITY_TYPES = new Set(["malware", "antivirus_warning"]);

export function AdminQueueList({ initialReports }: { initialReports: QueueReport[] }) {
  const [reports, setReports] = useState(initialReports);
  const [activeReport, setActiveReport] = useState<QueueReport | null>(null);
  const [activeAction, setActiveAction] = useState<ModerationAction | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useUIStore((s) => s.showToast);
  const t = useT();
  const { dictionary } = useLocale();

  function openAction(report: QueueReport, action: ModerationAction) {
    setActiveReport(report);
    setActiveAction(action);
    setReason("");
    setNotes("");
  }

  function closeModal() {
    setActiveReport(null);
    setActiveAction(null);
  }

  async function submitAction() {
    if (!activeReport || !activeAction || reason.trim().length === 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportId: activeReport.id,
          action: activeAction,
          reason: reason.trim(),
          notes: notes.trim() || undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        showToast(body.error?.message ?? t("admin.actionFailed"), "error");
        return;
      }
      setReports((prev) => prev.filter((r) => r.id !== activeReport.id));
      showToast(
        t("admin.reportActionToast", { action: dictionary.admin.actionsPast[activeAction] }),
        "success",
      );
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (reports.length === 0) {
    return <Card className="text-center text-sm text-text-secondary">{t("admin.queueEmpty")}</Card>;
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card key={report.id}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={SECURITY_TYPES.has(report.reportType) ? "risk" : "neutral"}>
              {dictionary.reportTypes[report.reportType as keyof typeof dictionary.reportTypes] ?? report.reportType}
            </Badge>
            {report.anomalyDetected && (
              <Badge
                tone="concern"
                icon={<ExclamationTriangleIcon className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                {t("admin.anomalyFlagged")}
              </Badge>
            )}
            <span className="ml-auto text-xs text-text-secondary">
              {formatRelativeTime(report.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-sm text-text-secondary">
            {report.description || t("admin.noDescriptionProvided")}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {t("admin.submittedBy", { username: report.username })}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {ACTIONS.map((action) => (
              <Button
                key={action}
                type="button"
                variant={action === "approve" ? "primary" : "secondary"}
                size="md"
                onClick={() => openAction(report, action)}
              >
                {dictionary.admin.actions[action]}
              </Button>
            ))}
          </div>
        </Card>
      ))}

      <Modal
        open={activeReport !== null}
        onClose={closeModal}
        title={activeAction ? t("admin.reportActionTitle", { action: dictionary.admin.actions[activeAction] }) : undefined}
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="reason" className="text-sm font-medium text-text-primary">
              {t("admin.reason")}
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="mt-1.5"
              placeholder={t("admin.whyIsThisAction")}
            />
          </div>
          <div>
            <label htmlFor="notes" className="text-sm font-medium text-text-primary">
              {t("admin.internalNotesOptional")}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1.5"
            />
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full"
            disabled={reason.trim().length === 0}
            isLoading={isSubmitting}
            onClick={submitAction}
          >
            {isSubmitting ? t("admin.submitting") : t("admin.confirm")}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
