"use client";

import Image from "next/image";
import { getImageUrl } from "@/shared/lib/utils";

/**
 * Decorative banner strip placed at the top of a marketing page's header card.
 * The image is CMS-managed (HomeContent `pages.<page>.image`); the page title
 * and subtitle render below it as normal text, so contrast is never an issue.
 */
export function PageHeroImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  if (!image) return null;
  return (
    <div
      className={`relative mb-5 h-40 lg:h-52 overflow-hidden rounded-lg bg-[var(--color-surface)] ${className}`}
    >
      <Image
        src={getImageUrl(image)}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
