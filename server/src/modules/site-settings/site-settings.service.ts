import { SiteSettingsRepository } from "./site-settings.repository";
import {
  SiteSettingsResponse,
  toSiteSettingsResponse,
  IOffice,
} from "./site-settings.entity";
import { UpdateSiteSettingsDto } from "./site-settings.schema";
import { emitToAll } from "../../shared/services/socket.service";
import { fillEmptyTranslations } from "../../shared/utils/translate.util";

export class SiteSettingsService {
  constructor(private readonly repo: SiteSettingsRepository) {}

  async get(): Promise<SiteSettingsResponse> {
    const doc = await this.repo.getOrCreate();
    return toSiteSettingsResponse(doc);
  }

  async update(dto: UpdateSiteSettingsDto): Promise<SiteSettingsResponse> {
    // Auto-translate any partially-filled translated fields.
    const normalized: Record<string, unknown> = { ...dto };

    if (dto.consultationCta) {
      normalized.consultationCta = await fillEmptyTranslations(dto.consultationCta);
    }
    if (dto.consultationSubtitle) {
      normalized.consultationSubtitle = await fillEmptyTranslations(
        dto.consultationSubtitle,
      );
    }
    if (dto.workingHours) {
      normalized.workingHours = await fillEmptyTranslations(dto.workingHours);
    }
    if (dto.copyright) {
      normalized.copyright = await fillEmptyTranslations(dto.copyright);
    }
    if (dto.offices) {
      normalized.offices = (await Promise.all(
        dto.offices.map(async (o) => ({
          label: (await fillEmptyTranslations(o.label)) ?? o.label,
          address: (await fillEmptyTranslations(o.address)) ?? o.address,
          mapUrl: o.mapUrl ?? "",
        })),
      )) as IOffice[];
    }

    const doc = await this.repo.update(normalized);
    const response = toSiteSettingsResponse(doc);
    emitToAll("site-settings:updated", response);
    return response;
  }
}
