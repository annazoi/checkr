"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { registerSchema, type RegisterInput } from "@/lib/validation/schemas";

export default function RegisterPage() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(null);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();

    if (!res.ok) {
      if (res.status === 409) {
        const field = body.error?.message?.includes("email") ? "email" : "username";
        setError(field, { message: body.error.message });
        return;
      }
      setFormError(body.error?.message ?? "Something went wrong. Please try again.");
      return;
    }

    router.push("/auth/verify-email");
  }

  return (
    <AuthCard
      eyebrow="Join the community"
      title="Create your account"
      subtitle="Share what you've seen and help other players spot the pattern."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-accent-light">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label="Username" htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            autoComplete="username"
            placeholder="PixelScout"
            {...register("username")}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            {...register("password")}
          />
        </FormField>

        <div className="flex items-start gap-3 pt-1">
          <input
            id="ageConfirmed"
            type="checkbox"
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-border bg-surface accent-accent"
            {...register("ageConfirmed")}
          />
          <label htmlFor="ageConfirmed" className="text-sm text-text-secondary">
            I confirm that I am at least 13 years old.
          </label>
        </div>
        {errors.ageConfirmed && (
          <p className="text-xs text-status-risk">{errors.ageConfirmed.message}</p>
        )}

        {formError && <p className="text-sm text-status-risk">{formError}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </AuthCard>
  );
}
