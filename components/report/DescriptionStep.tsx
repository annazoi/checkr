import { Textarea } from "@/components/ui/Input";

const MAX_LENGTH = 500;

export function DescriptionStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Tell us a little more</h1>
      <p className="mt-1 text-sm text-accent-light">Only share what you personally experienced.</p>

      <div className="mt-6">
        <label htmlFor="description" className="text-sm font-medium text-text-primary">
          Your experience
        </label>
        <Textarea
          id="description"
          value={value}
          onChange={(e) => onChange(e.target.value.slice(0, MAX_LENGTH))}
          placeholder="What did you notice?"
          rows={6}
          className="mt-1.5"
        />
        <div className="mt-1.5 flex items-center justify-between text-xs text-text-secondary">
          <span>Please don&apos;t include names, accounts, or payment details.</span>
          <span>
            {value.length}/{MAX_LENGTH}
          </span>
        </div>
      </div>
    </div>
  );
}
