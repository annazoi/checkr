"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthCard } from "@/components/auth/AuthCard";
import { DiscordButton } from "@/components/auth/DiscordButton";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { loginSchema, type LoginInput } from "@/lib/validation/schemas";
import { useT } from "@/components/i18n/LocaleProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formError, setFormError] = useState<string | null>(null);
  const t = useT();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginInput) {
    setFormError(null);

    const result = await signIn("credentials", {
      ...values,
      redirect: false,
    });

    if (result?.error) {
      setFormError(t("auth.invalidCredentials"));
      return;
    }

    router.push(searchParams.get("callbackUrl") ?? "/");
    router.refresh();
  }

  return (
    <AuthCard
      eyebrow={t("auth.welcomeBack")}
      title={t("auth.logInToCheckr")}
      footer={
        <>
          {t("auth.newHere")}{" "}
          <Link href="/auth/register" className="font-medium text-accent-light">
            {t("auth.createAccount")}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={t("auth.email")} htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder={t("auth.emailPlaceholder")}
            {...register("email")}
          />
        </FormField>

        <FormField label={t("auth.password")} htmlFor="password" error={errors.password?.message}>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder={t("auth.passwordPlaceholder")}
            {...register("password")}
          />
        </FormField>

        {formError && <p className="text-sm text-status-risk">{formError}</p>}

        <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? t("auth.loggingIn") : t("auth.logIn")}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-text-secondary">
        <span className="h-px flex-1 bg-border" />
        {t("common.or")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <DiscordButton callbackUrl={searchParams.get("callbackUrl") ?? "/"} />
    </AuthCard>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
