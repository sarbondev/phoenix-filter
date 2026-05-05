import Link from "next/link";
import { Compass } from "lucide-react";
import "./globals.css";

export default function NotFound() {
  return (
    <html lang="ru">
      <body className="bg-surface text-slate-900">
        <main className="flex min-h-screen items-center justify-center px-4 py-16">
          <div className="mx-auto flex w-full max-w-md flex-col items-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-soft text-brand">
              <Compass className="h-9 w-9" />
            </div>
            <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-brand">
              404
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Страница не найдена
            </h1>
            <p className="mt-3 max-w-sm text-sm text-slate-500">
              Возможно, страница была перемещена или удалена. Проверьте адрес
              или вернитесь на главную.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/ru"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand px-6 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-hover active:translate-y-px"
              >
                На главную
              </Link>
              <Link
                href="/ru/products"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border-strong bg-white px-6 text-sm font-semibold text-slate-700 transition-colors hover:border-brand hover:text-brand"
              >
                Каталог
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
