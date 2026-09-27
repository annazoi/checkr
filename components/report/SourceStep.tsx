import { Input } from "@/components/ui/Input";
import { useT } from "@/components/i18n/LocaleProvider";

export function SourceStep({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const t = useT();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">{t("report.whichSource")}</h1>
      <p className="mt-1 text-sm text-accent-light">{t("report.enterSiteOrStore")}</p>

      <div className="mt-6">
        <label htmlFor="source-domain" className="text-sm font-medium text-text-primary">
          {t("report.websiteOrStore")}
        </label>
        <Input
          id="source-domain"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t("report.domainPlaceholder")}
          className="mt-1.5"
          autoFocus
        />
        {error ? (
          <p className="mt-1.5 text-xs text-status-risk">{error}</p>
        ) : (
          <p className="mt-1.5 text-xs text-text-secondary">{t("report.dontIncludePasswords")}</p>
        )}
      </div>
    </div>
  );
}
