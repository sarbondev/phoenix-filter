import { SiteSettingsModel } from "./site-settings.schema";
import { ISiteSettings } from "./site-settings.entity";

const DEFAULT_SETTINGS: Partial<ISiteSettings> = {
  brandName: "PRESTIGE",
  brandAccent: "FILTER",
  logo: "",
  consultationCta: {
    uz: "Konsultatsiya oling",
    ru: "Получите консультацию",
    en: "Get a consultation",
    kz: "Кеңес алыңыз",
  },
  consultationSubtitle: {
    uz: "telefon yoki messenjer orqali",
    ru: "по телефону или в мессенджерах",
    en: "by phone or via messengers",
    kz: "телефон немесе мессенджер арқылы",
  },
  phone: "+998 (90) 189-94-26",
  email: "info@gmail.com",
  workingHours: {
    uz: "09:00 - 18:00",
    ru: "09:00 - 18:00",
    en: "09:00 - 18:00",
    kz: "09:00 - 18:00",
  },
  offices: [
    {
      label: {
        uz: "Toshkent ofisi",
        ru: "Офис в Ташкенте",
        en: "Tashkent office",
        kz: "Ташкент кеңсесі",
      },
      address: {
        uz: "Presnenskaya naberejnaya, 12",
        ru: "ул. Пресненская Набережная, д. 12",
        en: "Presnenskaya Naberezhnaya, 12",
        kz: "Пресненская Набережная, 12",
      },
      mapUrl: "",
    },
    {
      label: {
        uz: "Moskva ofisi",
        ru: "Офис в Москве",
        en: "Moscow office",
        kz: "Мәскеу кеңсесі",
      },
      address: {
        uz: "Presnenskaya naberejnaya, 12",
        ru: "ул. Пресненская Набережная, д. 12",
        en: "Presnenskaya Naberezhnaya, 12",
        kz: "Пресненская Набережная, 12",
      },
      mapUrl: "",
    },
  ],
  socials: {
    facebook: "#",
    instagram: "#",
    telegram: "#",
    youtube: "",
    whatsapp: "",
  },
  sections: {
    hero: true,
    about: true,
    brands: true,
    industries: true,
    whyUs: true,
    categories: true,
    products: true,
    ctaBanners: true,
    process: true,
    certificates: true,
    integration: true,
    productRequest: true,
    contactFaq: true,
  },
  copyright: {
    uz: "© 2024 Barcha huquqlar himoyalangan",
    ru: "© 2024 Все права защищены",
    en: "© 2024 All rights reserved",
    kz: "© 2024 Барлық құқықтар қорғалған",
  },
};

export class SiteSettingsRepository {
  /** Singleton — returns the only document, creating it with defaults if missing. */
  async getOrCreate(): Promise<ISiteSettings> {
    let doc = await SiteSettingsModel.findOne().lean<ISiteSettings>();
    if (!doc) {
      const created = await SiteSettingsModel.create(DEFAULT_SETTINGS);
      doc = created.toObject() as ISiteSettings;
    }
    return doc;
  }

  async update(data: Partial<ISiteSettings>): Promise<ISiteSettings> {
    const existing = await SiteSettingsModel.findOne();
    if (!existing) {
      const created = await SiteSettingsModel.create({
        ...DEFAULT_SETTINGS,
        ...data,
      });
      return created.toObject() as ISiteSettings;
    }
    const updated = await SiteSettingsModel.findByIdAndUpdate(
      existing._id,
      { $set: data },
      { new: true },
    ).lean<ISiteSettings>();
    return updated as ISiteSettings;
  }
}
