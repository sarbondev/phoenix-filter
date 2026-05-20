import type { Locale } from "@/shared/types";

export const FS = {
  page: {
    title: {
      uz: "OEM, analog va o'lcham bo'yicha filtr qidirish",
      ru: "Поиск и подбор фильтров по OEM, аналогам и размерам",
      en: "Filter search by OEM, analog and size",
      kz: "OEM, аналог пен өлшем бойынша іздеу",
    },
    subtitle: {
      uz: "OEM raqami, analog, o'lcham yoki texnika modeli bo'yicha qidiring. Aniq topilmasa, parametrlar asosida sifatli analog tavsiya qilamiz.",
      ru: "Найдите фильтр по OEM номеру, аналогу, размеру или модели техники. Если точного нет, подберём качественный аналог по параметрам.",
      en: "Search by OEM number, analog, size or equipment. If no exact match, we'll suggest a quality analog by parameters.",
      kz: "OEM, аналог немесе өлшем бойынша іздеңіз. Дәл сәйкестік болмаса, біз сапалы аналог ұсынамыз.",
    },
  },
  tabs: {
    oem: { uz: "OEM bo'yicha", ru: "По OEM", en: "By OEM", kz: "OEM бойынша" },
    analog: { uz: "Analog", ru: "По аналогу", en: "By analog", kz: "Аналог" },
    size: { uz: "O'lcham", ru: "По размеру", en: "By size", kz: "Өлшем" },
    machine: { uz: "Texnika", ru: "По технике", en: "By equipment", kz: "Техника" },
    photo: { uz: "Foto", ru: "По фото", en: "By photo", kz: "Фото" },
  },
  fields: {
    oemPlaceholder: {
      uz: "Masalan: CAT 1R-1808, Fleetguard FF5320",
      ru: "Например: CAT 1R-1808, Fleetguard FF5320",
      en: "Example: CAT 1R-1808, Fleetguard FF5320",
      kz: "Мысалы: CAT 1R-1808, Fleetguard FF5320",
    },
    analogPlaceholder: {
      uz: "Donaldson P551808, MANN W 1170, ...",
      ru: "Donaldson P551808, MANN W 1170, ...",
      en: "Donaldson P551808, MANN W 1170, ...",
      kz: "Donaldson P551808, MANN W 1170, ...",
    },
    manufacturer: {
      uz: "Ishlab chiqaruvchi (ixtiyoriy)",
      ru: "Производитель (необязательно)",
      en: "Manufacturer (optional)",
      kz: "Өндіруші (міндетті емес)",
    },
    height: { uz: "Balandlik, mm", ru: "Высота, мм", en: "Height, mm", kz: "Биіктік, мм" },
    outerDiameter: {
      uz: "Tashqi diametr, mm",
      ru: "Наружный диаметр, мм",
      en: "Outer diameter, mm",
      kz: "Сыртқы диаметр, мм",
    },
    innerDiameter: {
      uz: "Ichki diametr, mm",
      ru: "Внутренний диаметр, мм",
      en: "Inner diameter, mm",
      kz: "Ішкі диаметр, мм",
    },
    threadSize: {
      uz: "Rezba",
      ru: "Резьба",
      en: "Thread",
      kz: "Резьба",
    },
    tolerance: {
      uz: "Dopusk ±, mm",
      ru: "Допуск ±, мм",
      en: "Tolerance ±, mm",
      kz: "Допуск ±, мм",
    },
    machineBrand: {
      uz: "Texnika brendi",
      ru: "Бренд техники",
      en: "Equipment brand",
      kz: "Техника бренді",
    },
    model: { uz: "Model", ru: "Модель", en: "Model", kz: "Модель" },
    engine: { uz: "Dvigatel", ru: "Двигатель", en: "Engine", kz: "Қозғалтқыш" },
    year: { uz: "Ishlab chiqarilgan yil", ru: "Год выпуска", en: "Year", kz: "Шыққан жылы" },
    phone: { uz: "Telefon raqami", ru: "Телефон", en: "Phone", kz: "Телефон" },
    name: { uz: "Ismingiz", ru: "Имя", en: "Name", kz: "Аты" },
    note: { uz: "Izoh", ru: "Комментарий", en: "Comment", kz: "Түсініктеме" },
  },
  buttons: {
    find: { uz: "Topish", ru: "Найти", en: "Search", kz: "Іздеу" },
    send: { uz: "Yuborish", ru: "Отправить", en: "Send", kz: "Жіберу" },
    upload: {
      uz: "Filtr rasmini yuklang",
      ru: "Загрузите фото фильтра",
      en: "Upload filter photo",
      kz: "Сүзгі фотосуретін жүктеу",
    },
  },
  photo: {
    note: {
      uz: "Rasm yuklang, menejer CRM orqali tekshiradi va analog tavsiya qiladi.",
      ru: "Клиент загружает фото фильтра, менеджер CRM проверит и подберёт аналог.",
      en: "Upload a photo, our manager will review it in CRM and suggest an analog.",
      kz: "Сүзгінің фотосын жүктеңіз, менеджер CRM арқылы тексереді.",
    },
    success: {
      uz: "So'rovingiz qabul qilindi. Menejer 30 daqiqa ichida bog'lanadi.",
      ru: "Заявка принята. Менеджер свяжется в течение 30 минут.",
      en: "Request accepted. A manager will contact you within 30 minutes.",
      kz: "Сұрау қабылданды. Менеджер 30 минут ішінде хабарласады.",
    },
  },
  priceOnRequest: {
    uz: "So'rov bo'yicha",
    ru: "По запросу",
    en: "On request",
    kz: "Сұраныс бойынша",
  },
  results: {
    countLabel: {
      uz: "natija",
      ru: "результатов",
      en: "results",
      kz: "нәтиже",
    },
    empty: {
      uz: "Aniq mos kelmadi. Filtr rasmini yuborib ko'ring — biz analog tanlab beramiz.",
      ru: "Точного совпадения нет. Отправьте фото фильтра — подберём аналог.",
      en: "No exact match. Send a photo and we'll find an analog for you.",
      kz: "Дәл сәйкестік табылмады. Фото жіберіңіз.",
    },
    initial: {
      uz: "Yuqoridagi formani to'ldiring va qidirish tugmasini bosing.",
      ru: "Заполните форму выше и нажмите «Найти».",
      en: "Fill the form above and press Search.",
      kz: "Жоғарыдағы пішінді толтырыңыз.",
    },
  },
} as const;

type LS = { uz: string; ru: string; en: string; kz: string };
export const trFs = (s: LS, locale: Locale) => s[locale] ?? s.en;
