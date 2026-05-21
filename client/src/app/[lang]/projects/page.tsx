import { Suspense } from "react";
import type { Locale } from "@/shared/types";
import { ProjectsClient } from "./ProjectsClient";

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <Suspense fallback={null}>
      <ProjectsClient locale={lang as Locale} />
    </Suspense>
  );
}
