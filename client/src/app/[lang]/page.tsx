import type { Locale } from "@/shared/types";
import { DirectionChooser } from "@/widgets/home/DirectionChooser";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <DirectionChooser locale={lang as Locale} />;
}
