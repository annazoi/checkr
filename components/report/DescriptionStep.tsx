"use client";

import { Textarea } from "@/components/ui/Input";
import { useT } from "@/components/i18n/LocaleProvider";

const MAX_LENGTH = 500;

export function DescriptionStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const t = useT();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">{t("report.tellUsMore")}</h1>
      <p className="mt-1 text-sm text-accent-light">{t("report.onlyShareWhatYouExperienced")}</p>

      <div className="mt-6">
        <label htmlFor="description" className="text-sm font-medium text-text-primary">
          {t("report.yourExperience")}
        </label>
        <Textarea
          id="description"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={t("report.whatDidYouNotice")}
          rows={6}
          className="mt-1.5"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-text-secondary">
          <span>{t("report.dontIncludeNames")}</span>
          <span>
            {value.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
