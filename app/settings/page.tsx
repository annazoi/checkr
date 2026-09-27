"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useUIStore } from "@/store/ui";
import { useT } from "@/components/i18n/LocaleProvider";
import { changePasswordSchema, type ChangePasswordInput } from "@/lib/validation/schemas";

export default function SettingsPage() {
  const showToast = useUIStore((s) => s.showToast);
  const [isRevoking, setIsRevoking] = useState(false);
  const t = useT();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onSubmit(values: ChangePasswordInput) {
    const res = await fetch("/api/settings/password", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await res.json();

    if (!res.ok) {
      if (res.status === 403) {
        setError("currentPassword", { message: body.error?.message });
      } else {
        showToast(body.error?.message ?? t("settings.somethingWentWrong"), "error");
      }
      return;
    }

    showToast(t("settings.passwordUpdated"), "success");
    reset();
  }

  async function handleRevokeSessions() {
    setIsRevoking(true);
    try {
      await fetch("/api/settings/revoke-sessions", { method: "POST" });
      await signOut({ callbackUrl: "/auth/login" });
    } finally {
      setIsRevoking(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-8">
      <h1 className="text-2xl font-bold text-text-primary">{t("settings.title")}</h1>
      <p className="mt-1 text-sm text-text-secondary">{t("settings.subtitle")}</p>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-text-primary">{t("settings.changePassword")}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4" noValidate>
          <FormField
            label={t("settings.currentPassword")}
            htmlFor="currentPassword"
            error={errors.currentPassword?.message}
          >
            <Input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              {...register("currentPassword")}
            />
          </FormField>

          <FormField label={t("settings.newPassword")} htmlFor="newPassword" error={errors.newPassword?.message}>
            <Input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              {...register("newPassword")}
            />
          </FormField>

          <FormField
            label={t("settings.confirmNewPassword")}
            htmlFor="confirmPassword"
            error={errors.confirmPassword?.message}
          >
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword")}
            />
          </FormField>

          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? t("settings.saving") : t("settings.updatePassword")}
          </Button>
        </form>
      </Card>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-text-primary">{t("settings.sessions")}</h2>
        <p className="mt-1 text-sm text-text-secondary">{t("settings.sessionsDescription")}</p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4"
          onClick={handleRevokeSessions}
          disabled={isRevoking}
        >
          {isRevoking ? t("settings.loggingOut") : t("settings.logoutEverywhere")}
        </Button>
      </Card>
    </div>
  );
}
