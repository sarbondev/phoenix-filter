"use client";

import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Shield,
  Edit2,
  Package,
  Settings,
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

  if (!auth.user) {
    router.push(`/${locale}/auth`);
    return null;
  }

  const initials = auth.user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {/* Avatar Section */}
          <div className="border-b border-slate-200 px-6 py-8 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-4xl font-bold text-white shadow-lg">
              {initials}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mt-4">
              {auth.user.name}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {auth.user.role === "ADMIN"
                ? "Administrator"
                : auth.user.role === "CALL_MANAGER"
                  ? "Call Manager"
                  : "Customer"}
            </p>
          </div>

          {/* Info Section */}
          <div className="px-6 py-8">
            <h3 className="text-sm font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Account Information
            </h3>

            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                <Phone className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {dict.auth.phoneNumber}
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {auth.user.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Full Name */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                <User className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    {dict.auth.name}
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {auth.user.name}
                  </p>
                </div>
              </div>

              {/* Account Type */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                <Shield className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Account Type
                  </p>
                  <p className="text-slate-900 font-medium mt-1">
                    {auth.user.role === "ADMIN"
                      ? "Administrator"
                      : auth.user.role === "CALL_MANAGER"
                        ? "Call Manager"
                        : "Customer"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="border-t border-slate-200 px-6 py-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href={`/${locale}/orders`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/20 transition-colors text-slate-700 hover:text-primary"
              >
                <Package className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {dict.checkout.myOrders}
                </span>
              </Link>

              <Link
                href={`/${locale}/settings`}
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-slate-700"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {dict.settings.title}
                </span>
              </Link>

              <button className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors text-slate-700">
                <Settings className="h-4 w-4" />
                <span className="text-sm font-medium">Help</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            {dict.auth.loginRequired &&
              "Need to manage your account? Visit Settings to update your information."}
          </p>
        </div>
      </div>
    </main>
  );
}
