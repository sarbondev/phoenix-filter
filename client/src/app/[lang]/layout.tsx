import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isValidLocale } from "@/shared/i18n";
import type { Locale } from "@/shared/types";
import StoreProvider from "@/providers/StoreProvider";
import { Header } from "@/widgets/header/Header";
import { Navbar } from "@/widgets/navbar/Navbar";
import { Footer } from "@/widgets/footer/Footer";
import { MobileBottomNav } from "@/widgets/navbar/MobileBottomNav";
import { ToastContainer } from "@/features/toast/Toast";
import { ProgressBar } from "@/features/progress-bar/ProgressBar";
import {
  EditModeProvider,
  EditModeToggle,
  InlineEditPanel,
} from "@/features/inline-editor";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    en: "Prestige filter - Premium Filter Solutions",
    ru: "Prestige filter - Премиальные системы фильтрации",
    uz: "Prestige filter - Premium filtr tizimlari",
    kz: "Prestige filter - Премиум сүзгі жүйелері",
  };
  return {
    title: {
      default: titles[lang] || titles.ru,
      template: "%s | FilterSystem",
    },
    description: "Industrial and household filtration solutions",
  };
}

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ru" }, { lang: "uz" }, { lang: "kz" }];
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isValidLocale(lang)) notFound();

  const locale = lang as Locale;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className="antialiased">
        <StoreProvider>
          <EditModeProvider>
            <ProgressBar />
            <div className="sticky top-0 z-50">
              <Header locale={locale} dict={dict} />
              <Navbar locale={locale} dict={dict} />
            </div>
            <main className="min-h-screen pb-20 lg:pb-0">{children}</main>
            <Footer locale={locale} dict={dict} />
            <MobileBottomNav locale={locale} dict={dict} />
            <ToastContainer />
            <EditModeToggle />
            <InlineEditPanel />
          </EditModeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
