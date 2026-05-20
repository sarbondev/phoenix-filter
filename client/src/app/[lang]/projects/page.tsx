import type { Locale } from "@/shared/types";
import { ProjectsClient } from "./ProjectsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <ProjectsClient locale={lang as Locale} />;
}
