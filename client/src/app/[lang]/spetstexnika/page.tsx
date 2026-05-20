import type { Locale } from "@/shared/types";
import { SpetstexnikaClient } from "./SpetstexnikaClient";

export default async function SpetstexnikaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <SpetstexnikaClient locale={lang as Locale} />;
}
