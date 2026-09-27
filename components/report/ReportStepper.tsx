import { CheckIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils/cn";

export function ReportStepper({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent-light">
          Share an experience
        </p>
        <p className="text-xs text-text-secondary">
          Step {currentStep} of {totalSteps}
        </p>
      </div>
      <div className="mt-3 flex items-center">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const stepNumber = i + 1;
          const done = stepNumber < currentStep;
          const active = stepNumber === currentStep;
          return (
            <div key={stepNumber} className="flex flex-1 items-center last:flex-none">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  done || active ? "bg-accent text-white" : "bg-elevated text-text-secondary",
                )}
              >
                {done ? <CheckIcon className="h-4 w-4" aria-hidden="true" /> : stepNumber}
              </span>
              {stepNumber < totalSteps && (
                <span className={cn("mx-2 h-px flex-1", done ? "bg-accent" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
