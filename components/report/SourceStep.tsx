import { Input } from "@/components/ui/Input";

export function SourceStep({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Which source was it?</h1>
      <p className="mt-1 text-sm text-accent-light">Enter the site or store you visited.</p>

      <div className="mt-6">
        <label htmlFor="source-domain" className="text-sm font-medium text-text-primary">
          Website or store
        </label>
        <Input
          id="source-domain"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="example-site.com"
          className="mt-1.5"
          autoFocus
        />
        {error ? (
          <p className="mt-1.5 text-xs text-status-risk">{error}</p>
        ) : (
          <p className="mt-1.5 text-xs text-text-secondary">
            Don&apos;t include any passwords or personal details.
          </p>
        )}
      </div>
    </div>
  );
}
