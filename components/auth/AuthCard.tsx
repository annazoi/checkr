import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthCard({ eyebrow, title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-6 py-16">
      <div className="mb-6 flex flex-col items-center text-center">
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
        </span>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-light">
          {eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
      </div>

      <Card className="p-6">{children}</Card>

      {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
    </div>
  );
}
