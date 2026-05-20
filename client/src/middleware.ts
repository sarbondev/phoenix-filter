import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['uz', 'ru', 'en', 'kz'];
const defaultLocale = 'ru';

function getLocale(): string {
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return;
  }

  // Check if pathname already has locale
  const hasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (hasLocale) return;

  // Redirect to locale-prefixed path
  const locale = getLocale();
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico).*)'],
};
