import { HomeContentRepository } from "./home-content.repository";
import {
  HomeContentResponse,
  toHomeContentResponse,
  IIconFeature,
  IProcessStep,
  ICTABanner,
} from "./home-content.entity";
import { UpdateHomeContentDto } from "./home-content.schema";
import { emitToAll } from "../../shared/services/socket.service";
import {
  fillEmptyTranslations,
  fillEmptyTranslationsArray,
} from "../../shared/utils/translate.util";
import { TranslatedField } from "../../shared/types/common.types";

async function fillFeature(f: {
  icon: string;
  title: TranslatedField;
  desc: TranslatedField;
}): Promise<IIconFeature> {
  return {
    icon: f.icon,
    title: (await fillEmptyTranslations(f.title)) ?? f.title,
    desc: (await fillEmptyTranslations(f.desc)) ?? f.desc,
  };
}

async function fillStep(s: {
  number: string;
  icon: string;
  title: TranslatedField;
  desc: TranslatedField;
}): Promise<IProcessStep> {
  return {
    number: s.number,
    icon: s.icon,
    title: (await fillEmptyTranslations(s.title)) ?? s.title,
    desc: (await fillEmptyTranslations(s.desc)) ?? s.desc,
  };
}

async function fillCTA(c: {
  title: TranslatedField;
  subtitle: TranslatedField;
  points: TranslatedField[];
  ctaLabel: TranslatedField;
  ctaHref: string;
  variant: "blue-ink" | "ink";
}): Promise<ICTABanner> {
  return {
    title: (await fillEmptyTranslations(c.title)) ?? c.title,
    subtitle: (await fillEmptyTranslations(c.subtitle)) ?? c.subtitle,
    points: (await fillEmptyTranslationsArray(c.points)) ?? c.points,
    ctaLabel: (await fillEmptyTranslations(c.ctaLabel)) ?? c.ctaLabel,
    ctaHref: c.ctaHref,
    variant: c.variant,
  };
}

export class HomeContentService {
  constructor(private readonly repo: HomeContentRepository) {}

  async get(): Promise<HomeContentResponse> {
    const doc = await this.repo.getOrCreate();
    return toHomeContentResponse(doc);
  }

  async update(dto: UpdateHomeContentDto): Promise<HomeContentResponse> {
    const normalized: Record<string, unknown> = {};

    if (dto.about) {
      normalized.about = {
        body: (await fillEmptyTranslations(dto.about.body)) ?? dto.about.body,
        image: dto.about.image,
        features: await Promise.all(dto.about.features.map(fillFeature)),
      };
    }
    if (dto.whyUs) {
      normalized.whyUs = {
        title:
          (await fillEmptyTranslations(dto.whyUs.title)) ?? dto.whyUs.title,
        features: await Promise.all(dto.whyUs.features.map(fillFeature)),
      };
    }
    if (dto.process) {
      normalized.process = {
        title:
          (await fillEmptyTranslations(dto.process.title)) ?? dto.process.title,
        steps: await Promise.all(dto.process.steps.map(fillStep)),
      };
    }
    if (dto.integration) {
      normalized.integration = {
        title:
          (await fillEmptyTranslations(dto.integration.title)) ??
          dto.integration.title,
        body:
          (await fillEmptyTranslations(dto.integration.body)) ??
          dto.integration.body,
        tiles:
          (await fillEmptyTranslationsArray(dto.integration.tiles)) ??
          dto.integration.tiles,
      };
    }
    if (dto.ctaBanners) {
      normalized.ctaBanners = {
        left: await fillCTA(dto.ctaBanners.left),
        right: await fillCTA(dto.ctaBanners.right),
      };
    }

    const doc = await this.repo.update(normalized);
    const response = toHomeContentResponse(doc);
    emitToAll("home-content:updated", response);
    return response;
  }
}
