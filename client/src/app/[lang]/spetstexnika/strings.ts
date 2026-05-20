import type { Locale } from "@/shared/types";

/**
 * Spetstexnika section copy. Kept inline rather than threaded through the
 * global Dictionary so the section ships as a self-contained unit without
 * touching every locale file at once. Migrate into the dictionary once design
 * is locked.
 */
export const SX = {
  hero: {
    badge: {
      uz: "Spetstexnika filtratsiyasi",
      ru: "Фильтрация для спецтехники",
      en: "Special equipment filtration",
      kz: "Арнайы техника сүзгілері",
    },
    title: {
      uz: "Spetstexnika uchun avtomobil filtratsiyasi",
      ru: "Автомобильная фильтрация для спецтехники",
      en: "Automotive filtration for special equipment",
      kz: "Арнайы техникаға арналған автокөлік сүзгілері",
    },
    subtitle: {
      uz: "Og'ir sharoitda dvigatel, gidrosistema, yoqilg'i va kabinani himoya qiluvchi ishonchli filtrlar.",
      ru: "Надёжные фильтры для защиты двигателей, гидравлических систем, топлива и кабины оператора в тяжёлых условиях эксплуатации.",
      en: "Reliable filters protecting engines, hydraulic systems, fuel and operator cabins in harsh conditions.",
      kz: "Қозғалтқыш, гидравлика, отын мен кабинаны қорғайтын сенімді сүзгілер.",
    },
    ctaPick: {
      uz: "Filtrni tanlash",
      ru: "Подобрать фильтр",
      en: "Find your filter",
      kz: "Сүзгіні таңдау",
    },
    ctaCatalog: {
      uz: "Katalogni yuklab olish",
      ru: "Скачать каталог",
      en: "Download catalog",
      kz: "Каталогты жүктеу",
    },
    ctaConsult: {
      uz: "Konsultatsiya olish",
      ru: "Получить консультацию",
      en: "Get a consultation",
      kz: "Кеңес алу",
    },
  },
  advantages: [
    {
      uz: "Uskuna himoyasi",
      ru: "Защита оборудования",
      en: "Equipment protection",
      kz: "Жабдықты қорғау",
    },
    {
      uz: "Yuqori samaradorlik",
      ru: "Высокая эффективность",
      en: "High efficiency",
      kz: "Жоғары тиімділік",
    },
    {
      uz: "Uzoq xizmat muddati",
      ru: "Долговечность",
      en: "Durability",
      kz: "Ұзақ мерзімділік",
    },
    {
      uz: "Xarajatlarni tejash",
      ru: "Экономия затрат",
      en: "Cost savings",
      kz: "Шығынды үнемдеу",
    },
    {
      uz: "OEM sifati",
      ru: "OEM качество",
      en: "OEM quality",
      kz: "OEM сапасы",
    },
    {
      uz: "Tez yetkazib berish",
      ru: "Быстрая поставка",
      en: "Fast delivery",
      kz: "Жылдам жеткізу",
    },
  ],
  equipment: {
    title: {
      uz: "Texnika turi bo'yicha tanlash",
      ru: "Подбор по типу спецтехники",
      en: "Pick by equipment type",
      kz: "Техника түрі бойынша таңдау",
    },
  },
  categories: {
    title: {
      uz: "Filtr toifalari",
      ru: "Категории фильтров",
      en: "Filter categories",
      kz: "Сүзгі санаттары",
    },
  },
  killer: {
    title: {
      uz: "Filtringizni 30 soniyada toping",
      ru: "Найдите свой фильтр за 30 секунд",
      en: "Find your filter in 30 seconds",
      kz: "Сүзгіңізді 30 секундта табыңыз",
    },
    subtitle: {
      uz: "OEM raqami, analog, o'lcham yoki texnika modeli bo'yicha qidiring",
      ru: "Ищите по OEM номеру, аналогу, размеру или модели техники",
      en: "Search by OEM number, analog, size or equipment model",
      kz: "OEM нөмірі, аналог, өлшем немесе модель бойынша",
    },
    cta: {
      uz: "Ochiq qidiruvga o'tish",
      ru: "Открыть расширенный поиск",
      en: "Open advanced search",
      kz: "Кеңейтілген іздеуді ашу",
    },
    placeholder: {
      uz: "OEM raqam, artikul, brend yoki texnika modeli",
      ru: "OEM номер, артикул, бренд или модель техники",
      en: "OEM number, part number, brand or equipment model",
      kz: "OEM нөмірі, артикул немесе модель",
    },
  },
  application: {
    title: {
      uz: "Filtrlar nimani himoya qiladi",
      ru: "Что защищают фильтры",
      en: "What our filters protect",
      kz: "Сүзгілер не қорғайды",
    },
    cards: [
      {
        title: {
          uz: "Dvigatel himoyasi",
          ru: "Защита двигателя",
          en: "Engine protection",
          kz: "Қозғалтқышты қорғау",
        },
        items: [
          { uz: "havo", ru: "воздух", en: "air", kz: "ауа" },
          { uz: "moy", ru: "масло", en: "oil", kz: "май" },
          { uz: "yoqilg'i", ru: "топливо", en: "fuel", kz: "отын" },
        ],
      },
      {
        title: {
          uz: "Gidrosistema himoyasi",
          ru: "Защита гидросистемы",
          en: "Hydraulic system protection",
          kz: "Гидрожүйені қорғау",
        },
        items: [
          { uz: "nasoslar", ru: "насосы", en: "pumps", kz: "сорғылар" },
          { uz: "gidromotorlar", ru: "гидромоторы", en: "motors", kz: "гидромоторлар" },
          { uz: "klapanlar", ru: "клапаны", en: "valves", kz: "клапандар" },
        ],
      },
      {
        title: {
          uz: "Yoqilg'i tizimi",
          ru: "Защита топливной системы",
          en: "Fuel system protection",
          kz: "Отын жүйесі",
        },
        items: [
          { uz: "forsunkalar", ru: "форсунки", en: "injectors", kz: "форсункалар" },
          { uz: "yuqori bosim nasosi", ru: "насос высокого давления", en: "high-pressure pump", kz: "жоғары қысым сорғысы" },
        ],
      },
      {
        title: {
          uz: "Toza kabina havosi",
          ru: "Чистый воздух в кабине",
          en: "Clean cabin air",
          kz: "Таза кабина ауасы",
        },
        items: [
          { uz: "HVAC", ru: "HVAC", en: "HVAC", kz: "HVAC" },
          { uz: "konditsioner", ru: "кондиционирование", en: "air conditioning", kz: "кондиционерлеу" },
        ],
      },
    ],
  },
  brands: {
    title: {
      uz: "Yetakchi brendlar bilan ishlaymiz",
      ru: "Работаем с лидерами отрасли",
      en: "Working with industry leaders",
      kz: "Жетекші брендтермен жұмыс істейміз",
    },
    list: [
      "Donaldson",
      "Parker",
      "Fleetguard",
      "MANN",
      "HYDAC",
      "WIX",
      "SF Filter",
      "Baldwin",
      "Sakura",
      "Hengst",
    ],
  },
  heavyDuty: {
    title: {
      uz: "Boshqalar to'xtagan joyda biz ishlaymiz",
      ru: "Работаем там, где другие сдаются",
      en: "We perform where others give up",
      kz: "Басқалар бас тартқан жерде біз жұмыс істейміз",
    },
    problems: {
      uz: ["Karyer changi", "Qum", "Yuqori namlik", "Issiqlik", "Tebranish", "Og'ir yuk"],
      ru: ["Карьерная пыль", "Песок", "Высокая влажность", "Жара", "Вибрация", "Тяжёлые нагрузки"],
      en: ["Quarry dust", "Sand", "High humidity", "Heat", "Vibration", "Heavy loads"],
      kz: ["Карьер шаңы", "Құм", "Жоғары ылғал", "Ыстық", "Дірілдеу", "Ауыр жүктеме"],
    },
    solutions: {
      uz: ["Heavy-duty havo filtrlari", "Nanofiber filtrlar", "Radial seal filtrlari", "Kuchaytirilgan gidrofiltrlar"],
      ru: ["Heavy-duty воздушные фильтры", "Нановолоконные фильтры", "Radial seal фильтры", "Усиленные гидрофильтры"],
      en: ["Heavy-duty air filters", "Nanofiber filters", "Radial seal filters", "Reinforced hydraulic filters"],
      kz: ["Heavy-duty ауа сүзгілері", "Нановолокно сүзгілері", "Radial seal", "Күшейтілген гидросүзгі"],
    },
    problemsLabel: { uz: "Muammolar", ru: "Проблемы", en: "Challenges", kz: "Мәселелер" },
    solutionsLabel: { uz: "Yechimlar", ru: "Решения", en: "Solutions", kz: "Шешімдер" },
    cta: {
      uz: "Heavy-duty filtr tanlash",
      ru: "Подобрать heavy-duty фильтр",
      en: "Find a heavy-duty filter",
      kz: "Heavy-duty сүзгіні таңдау",
    },
  },
  footerCta: {
    title: {
      uz: "Kerakli filtrni topa olmadingizmi?",
      ru: "Не нашли нужный фильтр?",
      en: "Couldn't find the right filter?",
      kz: "Қажетті сүзгіні таппадыңыз ба?",
    },
    sendOem: {
      uz: "OEM raqamni yuborish",
      ru: "Отправить OEM номер",
      en: "Send OEM number",
      kz: "OEM нөмірін жіберу",
    },
    whatsapp: { uz: "WhatsApp", ru: "WhatsApp", en: "WhatsApp", kz: "WhatsApp" },
  },
} as const;

export type LocaleString = { uz: string; ru: string; en: string; kz: string };

export const tr = (str: LocaleString | undefined, locale: Locale): string => {
  if (!str) return "";
  return str[locale] ?? str.en;
};
