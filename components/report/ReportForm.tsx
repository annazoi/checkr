"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ReportStepper } from "@/components/report/ReportStepper";
import { GameStep } from "@/components/report/GameStep";
import { CategoryStep } from "@/components/report/CategoryStep";
import { SourceStep } from "@/components/report/SourceStep";
import { DescriptionStep } from "@/components/report/DescriptionStep";
import { EvidenceUpload } from "@/components/report/EvidenceUpload";
import type { ReportType } from "@/types";

const TOTAL_STEPS = 3;

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export function ReportForm({ initialGameSlug }: { initialGameSlug?: string }) {
  const router = useRouter();

  const [gameSlug, setGameSlug] = useState<string | null>(initialGameSlug ?? null);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [domain, setDomain] = useState("");
  const [description, setDescription] = useState("");
  const [gameSourceId, setGameSourceId] = useState<string | null>(null);
  const [evidenceId, setEvidenceId] = useState<string | null>(null);
  const [sourceError, setSourceError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  if (!gameSlug) {
    return <GameStep onSelect={(game) => setGameSlug(game.slug)} />;
  }

  function goTo(next: number, dir: number) {
    setDirection(dir);
    setStep(next);
  }

  async function handleNext() {
    if (step === 1) {
      goTo(2, 1);
      return;
    }

    if (step === 2) {
      setSourceError(undefined);
      setIsBusy(true);
      try {
        const res = await fetch("/api/sources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameSlug, domain }),
        });
        const body = await res.json();
        if (!res.ok) {
          setSourceError(body.error?.message ?? "Couldn't save that source.");
          return;
        }
        setGameSourceId(body.data.gameSourceId);
        goTo(3, 1);
      } finally {
        setIsBusy(false);
      }
      return;
    }

    // step 3: final submit
    setSubmitError(null);
    setIsBusy(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameSourceId,
          reportType,
          description: description.trim() || undefined,
          evidenceId: evidenceId ?? undefined,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setSubmitError(body.error?.message ?? "Something went wrong. Please try again.");
        return;
      }
      router.push(`/report/success?source=${gameSourceId}`);
    } finally {
      setIsBusy(false);
    }
  }

  function handleBack() {
    if (step === 1) {
      setGameSlug(null);
      return;
    }
    goTo(step - 1, -1);
  }

  const canProceed =
    (step === 1 && reportType !== null) ||
    (step === 2 && domain.trim().length >= 3) ||
    step === 3;

  const nextLabel = step === 3 ? "Submit report" : "Next";

  return (
    <div>
      <ReportStepper currentStep={step} totalSteps={TOTAL_STEPS} />

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {step === 1 && <CategoryStep value={reportType} onChange={setReportType} />}
            {step === 2 && <SourceStep value={domain} onChange={setDomain} error={sourceError} />}
            {step === 3 && (
              <div>
                <DescriptionStep value={description} onChange={setDescription} />
                <EvidenceUpload evidenceId={evidenceId} onChange={setEvidenceId} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && <p className="mt-4 text-sm text-status-risk">{submitError}</p>}

      <div className="mt-8 flex items-center justify-between border-t border-border pt-4">
        <Button type="button" variant="ghost" onClick={handleBack} disabled={isBusy}>
          Back
        </Button>
        <Button
          type="button"
          variant="primary"
          trailingIcon={step !== 3}
          onClick={handleNext}
          disabled={!canProceed || isBusy}
        >
          {isBusy ? "Please wait…" : nextLabel}
        </Button>
      </div>
    </div>
  );
}
