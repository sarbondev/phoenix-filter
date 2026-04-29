import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="ru">
      <body className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900">404</h1>
          <p className="mt-4 text-slate-500">Страница не найдена</p>
          <Link
            href="/ru"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            На главную
          </Link>
        </div>
      </body>
    </html>
  );
}
