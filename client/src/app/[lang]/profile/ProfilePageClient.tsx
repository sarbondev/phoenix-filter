"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Shield,
  Edit2,
  Package,
} from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/shared/types";
import type { Dictionary } from "@/shared/i18n/dictionaries/en";
import { useAppSelector } from "@/shared/hooks";

interface Props {
  locale: Locale;
  dict: Dictionary;
}

export function ProfilePageClient({ locale, dict }: Props) {
  const router = useRouter();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (!auth.user) router.replace(`/${locale}/auth?redirect=/${locale}/profile`);
  }, [auth.user, locale, router]);

  if (!auth.user) return null;

  const initials = auth.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const roleLabel =
    auth.user.role === "ADMIN"
      ? dict.profile.roleAdmin
      : auth.user.role === "CALL_MANAGER"
        ? dict.profile.roleCallManager
        : dict.profile.roleClient;

  return (
    <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="border-b border-slate-200 px-6 py-8 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-4">{auth.user.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{roleLabel}</p>
          </div>

          <div className="px-6 py-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              {dict.profile.accountInfo}
            </h3>

            <div className="space-y-4">
              <InfoRow
                icon={<Phone className="h-5 w-5 text-slate-400" />}
                label={dict.auth.phoneNumber}
                value={auth.user.phoneNumber}
              />
              <InfoRow
                icon={<User className="h-5 w-5 text-slate-400" />}
                label={dict.auth.name}
                value={auth.user.name}
              />
              <InfoRow
                icon={<Shield className="h-5 w-5 text-slate-400" />}
                label={dict.profile.accountType}
                value={roleLabel}
              />
            </div>
          </div>

          <div className="border-t border-slate-200 px-6 py-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              {dict.profile.quickActions}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href={`/${locale}/orders`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-colors text-slate-700 hover:text-primary"
              >
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">{dict.checkout.myOrders}</span>
              </Link>

              <Link
                href={`/${locale}/settings`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-slate-700"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-sm font-medium">{dict.settings.title}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-slate-900 font-medium mt-1">{value}</p>
      </div>
    </div>
  );
}
