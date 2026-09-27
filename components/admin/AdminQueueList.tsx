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

const ACTION_LABELS: Record<ModerationAction, string> = {
  approve: "Approve",
  reject: "Reject",
  hide: "Hide",
  escalate: "Escalate",
};

const SECURITY_TYPES = new Set(["malware", "antivirus_warning"]);

export function AdminQueueList({ initialReports }: { initialReports: QueueReport[] }) {
  const [reports, setReports] = useState(initialReports);
  const [activeReport, setActiveReport] = useState<QueueReport | null>(null);
  const [activeAction, setActiveAction] = useState<ModerationAction | null>(null);
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useUIStore((s) => s.showToast);

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
        showToast(body.error?.message ?? "Action failed.", "error");
        return;
      }
      setReports((prev) => prev.filter((r) => r.id !== activeReport.id));
      showToast(`Report ${ACTION_LABELS[activeAction].toLowerCase()}d.`, "success");
      closeModal();
    } finally {
      setIsSubmitting(false);
    }
  }

  if (reports.length === 0) {
    return (
      <Card className="text-center text-sm text-text-secondary">
        The queue is empty. Nothing is waiting for review.
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <Card key={report.id}>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={SECURITY_TYPES.has(report.reportType) ? "risk" : "neutral"}>
              {report.reportType.replace(/_/g, " ")}
            </Badge>
            {report.anomalyDetected && (
              <Badge
                tone="concern"
                icon={<ExclamationTriangleIcon className="h-3.5 w-3.5" aria-hidden="true" />}
              >
                Anomaly flagged
              </Badge>
            )}
            <span className="ml-auto text-xs text-text-secondary">
              {formatRelativeTime(report.createdAt)}
            </span>
          </div>

          <p className="mt-2 text-sm text-text-secondary">
            {report.description || "No description provided."}
          </p>
          <p className="mt-1 text-xs text-text-secondary">Submitted by {report.username}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {(Object.keys(ACTION_LABELS) as ModerationAction[]).map((action) => (
              <Button
                key={action}
                type="button"
                variant={action === "approve" ? "primary" : "secondary"}
                size="md"
                onClick={() => openAction(report, action)}
              >
                {ACTION_LABELS[action]}
              </Button>
            ))}
          </div>
        </Card>
      ))}

      <Modal
        open={activeReport !== null}
        onClose={closeModal}
        title={activeAction ? `${ACTION_LABELS[activeAction]} report` : undefined}
      >
        <div className="space-y-3">
          <div>
            <label htmlFor="reason" className="text-sm font-medium text-text-primary">
              Reason
            </label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="mt-1.5"
              placeholder="Why is this action being taken?"
            />
          </div>
          <div>
            <label htmlFor="notes" className="text-sm font-medium text-text-primary">
              Internal notes (optional)
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
            disabled={reason.trim().length === 0 || isSubmitting}
            onClick={submitAction}
          >
            {isSubmitting ? "Submitting…" : "Confirm"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
