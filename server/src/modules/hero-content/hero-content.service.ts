import { HeroContentRepository } from "./hero-content.repository";
import {
  HeroContentResponse,
  toHeroContentResponse,
  IHeroMainCard,
  IHeroSmallCard,
} from "./hero-content.entity";
import { UpdateHeroContentDto } from "./hero-content.schema";
import { emitToAll } from "../../shared/services/socket.service";
import {
  fillEmptyTranslations,
  fillEmptyTranslationsArray,
} from "../../shared/utils/translate.util";

export class HeroContentService {
  constructor(private readonly repo: HeroContentRepository) {}

  async get(): Promise<HeroContentResponse> {
    const doc = await this.repo.getOrCreate();
    return toHeroContentResponse(doc);
  }

  async update(dto: UpdateHeroContentDto): Promise<HeroContentResponse> {
    const normalized: Record<string, unknown> = {};

    if (dto.mainCard) {
      const m = dto.mainCard;
      normalized.mainCard = {
        title: (await fillEmptyTranslations(m.title)) ?? m.title,
        subtitle: (await fillEmptyTranslations(m.subtitle)) ?? m.subtitle,
        features:
          (await fillEmptyTranslationsArray(m.features)) ?? m.features,
        ctaLabel: (await fillEmptyTranslations(m.ctaLabel)) ?? m.ctaLabel,
        ctaHref: m.ctaHref,
        image: m.image,
      } satisfies IHeroMainCard;
    }

    for (const which of ["smallCard1", "smallCard2"] as const) {
      const s = dto[which];
      if (!s) continue;
      normalized[which] = {
        title: (await fillEmptyTranslations(s.title)) ?? s.title,
        subtitle: (await fillEmptyTranslations(s.subtitle)) ?? s.subtitle,
        description:
          (await fillEmptyTranslations(s.description)) ?? s.description,
        ctaLabel: (await fillEmptyTranslations(s.ctaLabel)) ?? s.ctaLabel,
        ctaHref: s.ctaHref,
        image: s.image,
        variant: s.variant,
      } satisfies IHeroSmallCard;
    }

    const doc = await this.repo.update(normalized);
    const response = toHeroContentResponse(doc);
    emitToAll("hero-content:updated", response);
    return response;
  }
}
