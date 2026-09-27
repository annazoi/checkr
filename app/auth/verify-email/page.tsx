import Link from "next/link";
import { EnvelopeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { buttonClasses } from "@/components/ui/Button";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const isError = searchParams.status === "expired" || searchParams.status === "invalid";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <span
        className={
          isError
            ? "mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-status-risk/15"
            : "mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent/15"
        }
      >
        {isError ? (
          <ExclamationCircleIcon className="h-8 w-8 text-status-risk" aria-hidden="true" />
        ) : (
          <EnvelopeIcon className="h-8 w-8 text-accent-light" aria-hidden="true" />
        )}
      </span>

      {isError ? (
        <>
          <h1 className="text-2xl font-bold text-text-primary">That link didn&apos;t work.</h1>
          <p className="mt-2 text-sm text-text-secondary">
            {searchParams.status === "expired"
              ? "This verification link has expired or was already used."
              : "This verification link isn't valid."}
          </p>
          <Link href="/auth/register" className={`${buttonClasses({ variant: "primary" })} mt-8`}>
            Create an account
          </Link>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-text-primary">Check your inbox.</h1>
          <p className="mt-2 text-sm text-text-secondary">
            We sent you a link to verify your email address. Click it to activate your account.
          </p>
          <Link href="/" className={`${buttonClasses({ variant: "secondary" })} mt-8`}>
            Back to home
          </Link>
        </>
      )}
    </div>
  );
}
