import { HeroContentModel } from "./hero-content.schema";
import { IHeroContent } from "./hero-content.entity";

const DEFAULT_HERO: Partial<IHeroContent> = {
  mainCard: {
    title: {
      uz: "Moysizlovchi filtrlar",
      ru: "Масляные фильтры",
      en: "Oil filters",
      kz: "Май сүзгілері",
    },
    subtitle: {
      uz: "Universal filtratsiya texnologiyalari",
      ru: "Универсальные технологии фильтрации",
      en: "Universal filtration technologies",
      kz: "Әмбебап сүзу технологиялары",
    },
    features: [
      {
        uz: "Nominal filtratsiya nozikligi",
        ru: "Номинальная тонкость фильтрации",
        en: "Nominal filtration fineness",
        kz: "Номиналды сүзу жұқалығы",
      },
      {
        uz: "Tavsiya etilgan oxirgi farqi",
        ru: "Рекомендуемый конечный перепад",
        en: "Recommended final pressure drop",
        kz: "Ұсынылатын соңғы айырма",
      },
      {
        uz: "Ish bosimi",
        ru: "Рабочее давление",
        en: "Working pressure",
        kz: "Жұмыс қысымы",
      },
      {
        uz: "Namlikka chidamlilik",
        ru: "Влагостойкость",
        en: "Moisture resistance",
        kz: "Ылғалға төзімділік",
      },
    ],
    ctaLabel: {
      uz: "Katalogni ko'rish",
      ru: "Смотреть каталог",
      en: "View catalog",
      kz: "Каталогты көру",
    },
    ctaHref: "/products",
    image: "",
  },
  smallCard1: {
    title: {
      uz: "Havo filtrlari",
      ru: "Воздушные фильтры",
      en: "Air filters",
      kz: "Ауа сүзгілері",
    },
    subtitle: { uz: "WIX", ru: "WIX", en: "WIX", kz: "WIX" },
    description: {
      uz: "Samarali havo filtri havodagi barcha ifloslanishlarni tutadi",
      ru: "Эффективный воздушный фильтр улавливает все загрязнения воздуха",
      en: "Effective air filter captures all air contaminants",
      kz: "Тиімді ауа сүзгісі ауадағы барлық ластануларды ұстайды",
    },
    ctaLabel: {
      uz: "Katalog",
      ru: "В каталог",
      en: "View catalog",
      kz: "Каталог",
    },
    ctaHref: "/products",
    image: "",
    variant: "blue",
  },
  smallCard2: {
    title: {
      uz: "Moy filtrlari",
      ru: "Масляные фильтры",
      en: "Oil filters",
      kz: "Май сүзгілері",
    },
    subtitle: {
      uz: "Raf filter",
      ru: "Raf filter",
      en: "Raf filter",
      kz: "Raf filter",
    },
    description: {
      uz: "Yuqori darajadagi tozalash va uzoq xizmat muddati",
      ru: "Высокая степень очистки и долгий срок службы",
      en: "High purification degree and long service life",
      kz: "Жоғары тазарту дәрежесі және ұзақ қызмет ету мерзімі",
    },
    ctaLabel: {
      uz: "Katalog",
      ru: "В каталог",
      en: "View catalog",
      kz: "Каталог",
    },
    ctaHref: "/products",
    image: "",
    variant: "ink",
  },
};

export class HeroContentRepository {
  async getOrCreate(): Promise<IHeroContent> {
    let doc = await HeroContentModel.findOne().lean<IHeroContent>();
    if (!doc) {
      const created = await HeroContentModel.create(DEFAULT_HERO);
      doc = created.toObject() as IHeroContent;
    }
    return doc;
  }

  async update(data: Partial<IHeroContent>): Promise<IHeroContent> {
    const existing = await HeroContentModel.findOne();
    if (!existing) {
      const created = await HeroContentModel.create({
        ...DEFAULT_HERO,
        ...data,
      });
      return created.toObject() as IHeroContent;
    }
    const updated = await HeroContentModel.findByIdAndUpdate(
      existing._id,
      { $set: data },
      { new: true },
    ).lean<IHeroContent>();
    return updated as IHeroContent;
  }
}
