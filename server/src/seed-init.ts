import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { UserModel } from "./modules/users/user.schema";
import { DirectionModel } from "./modules/directions/direction.schema";
import { CategoryModel } from "./modules/categories/category.schema";
import { EquipmentTypeModel } from "./modules/equipment-types/equipment-type.schema";
import { ProductModel } from "./modules/products/product.schema";
import { logger } from "./shared/utils/logger";

const tf = (uz: string, ru: string, en: string, kz: string) => ({ uz, ru, en, kz });

dotenv.config();

const ADMIN_PHONE = process.env.SEED_ADMIN_PHONE ?? "+998901234567";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "AdminPass123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Administrator";

/* ─────────────────────────────────────────────────────────────────────────────
   Static taxonomy — kept hand-written rather than translated by Gemini so that
   seeded categories/equipment have predictable IDs and slugs across runs.
   ──────────────────────────────────────────────────────────────────────────── */

const DIRECTIONS = [
  {
    slug: "spetstexnika",
    sortOrder: 1,
    name: {
      uz: "Spetstexnika uchun avtomobil filtratsiyasi",
      ru: "Автомобильная фильтрация для спецтехники",
      en: "Automotive filtration for special equipment",
      kz: "Арнайы техникаға арналған автокөлік сүзгілері",
    },
    description: {
      uz: "Spetstexnika, yuk mashinalari, qurilish, qishloq xo'jaligi va yo'l texnikasi uchun filtrlar.",
      ru: "Фильтры для спецтехники, грузовых автомобилей, строительной, сельскохозяйственной и дорожной техники.",
      en: "Filters for special, heavy, construction, agricultural and road equipment.",
      kz: "Арнайы, ауыр, құрылыс және ауыл шаруашылығы техникасына арналған сүзгілер.",
    },
  },
  {
    slug: "industrial",
    sortOrder: 2,
    name: {
      uz: "Sanoat filtratsiyasi va gaz tozalash",
      ru: "Промышленная фильтрация и газоочистка",
      en: "Industrial filtration and gas cleaning",
      kz: "Өнеркәсіптік сүзу және газ тазалау",
    },
    description: {
      uz: "Turli sanoat tarmoqlari korxonalari uchun sanoat filtratsiya va gaz tozalash tizimlari.",
      ru: "Промышленные системы фильтрации и газоочистки для предприятий различных отраслей промышленности.",
      en: "Industrial filtration and gas-cleaning systems for enterprises across industries.",
      kz: "Әртүрлі салалардағы кәсіпорындарға арналған өнеркәсіптік сүзу және газ тазалау жүйелері.",
    },
  },
];

const INDUSTRIAL_CATEGORIES = [
  {
    slug: "bag-filters",
    sortOrder: 1,
    name: { uz: "Yengli filtrlar", ru: "Рукавные фильтры", en: "Bag filters", kz: "Жеңді сүзгілер" },
    description: {
      uz: "Havo va gazni changdan yuqori samarali tozalash, 99,9% gacha.",
      ru: "Эффективная очистка воздуха и газов от пыли до 99,9%.",
      en: "High-efficiency air and gas dust filtration up to 99.9%.",
      kz: "Ауа мен газды шаңнан тазалау, 99,9% дейін.",
    },
  },
  {
    slug: "cartridge-filters",
    sortOrder: 2,
    name: { uz: "Kartrij filtrlari", ru: "Картриджные фильтры", en: "Cartridge filters", kz: "Картридж сүзгілері" },
    description: {
      uz: "Aspiratsiya va ventilyatsiya tizimlarida havoni tozalash. Ixcham va samarali.",
      ru: "Очистка воздуха в системах аспирации и вентиляции. Компактные и эффективные.",
      en: "Air filtration in aspiration and ventilation systems. Compact and efficient.",
      kz: "Аспирация және желдету жүйелерінде ауаны тазалау.",
    },
  },
  {
    slug: "scrubbers",
    sortOrder: 3,
    name: { uz: "Skrubberlar", ru: "Скрубберы", en: "Scrubbers", kz: "Скрубберлер" },
    description: {
      uz: "Gaz oqimini chang, kislotali gazlar va zararli aralashmalardan tozalash.",
      ru: "Очистка газовых потоков от пыли, кислотных газов и вредных примесей.",
      en: "Cleaning gas streams from dust, acid gases and harmful impurities.",
      kz: "Газ ағынын шаң мен қышқыл газдардан тазалау.",
    },
  },
  {
    slug: "electrostatic-filters",
    sortOrder: 4,
    name: { uz: "Elektrostatik filtrlar", ru: "Электростатические фильтры", en: "Electrostatic filters", kz: "Электростатикалық сүзгілер" },
    description: {
      uz: "Maydadispers zarralar, tutun va moy aerozollarini samarali yo'qotish.",
      ru: "Эффективное удаление мелкодисперсных частиц, дыма и масляных аэрозолей.",
      en: "Effective removal of fine particles, smoke and oil aerosols.",
      kz: "Ұсақ бөлшектерді, түтін мен май аэрозольдерін жою.",
    },
  },
  {
    slug: "cyclones",
    sortOrder: 5,
    name: { uz: "Siklonlar", ru: "Циклоны", en: "Cyclones", kz: "Циклондар" },
    description: {
      uz: "Havo va gazlarni yirik dispersli changdan dastlabki tozalash.",
      ru: "Предварительная очистка воздуха и газов от крупнодисперсной пыли.",
      en: "Pre-cleaning of air and gases from coarse dust.",
      kz: "Ауа мен газды ірі шаңнан алдын ала тазалау.",
    },
  },
  {
    slug: "aspiration-systems",
    sortOrder: 6,
    name: { uz: "Aspiratsiya tizimlari", ru: "Аспирационные системы", en: "Aspiration systems", kz: "Аспирация жүйелері" },
    description: {
      uz: "Chang, tutun va aerozollarni hosil bo'lish zonasidan to'g'ridan-to'g'ri yo'qotish.",
      ru: "Удаление пыли, дыма и аэрозолей непосредственно из зоны образования.",
      en: "Removing dust, smoke and aerosols directly at the source.",
      kz: "Шаң мен түтінді пайда болу аймағынан жою.",
    },
  },
  {
    slug: "process-filters",
    sortOrder: 7,
    name: {
      uz: "Texnologiya va uskunalar filtrlari",
      ru: "Фильтры для технологий и оборудования",
      en: "Process and equipment filters",
      kz: "Технология және жабдық сүзгілері",
    },
    description: {
      uz: "Turli texnologik jarayonlarda filtrlash va havoni tozalash uchun kompleks yechimlar.",
      ru: "Комплексные решения для фильтрации и очистки воздуха в различных технологических процессах.",
      en: "Complete filtration and air-cleaning solutions for various processes.",
      kz: "Әртүрлі технологиялық процестерге арналған сүзу шешімдері.",
    },
  },
];

const SPETSTEXNIKA_CATEGORIES = [
  {
    slug: "air-filters",
    sortOrder: 1,
    name: {
      uz: "Havo filtrlari",
      ru: "Воздушные фильтры",
      en: "Air filters",
      kz: "Ауа сүзгілері",
    },
    description: {
      uz: "Dvigatel uchun havoni changdan tozalash",
      ru: "Очистка воздуха для двигателя от пыли и грязи",
      en: "Engine air intake filtration",
      kz: "Двигатель ауасын тазалау",
    },
  },
  {
    slug: "oil-filters",
    sortOrder: 2,
    name: {
      uz: "Moy filtrlari",
      ru: "Масляные фильтры",
      en: "Oil filters",
      kz: "Май сүзгілері",
    },
    description: {
      uz: "Moyni metall zarralar va iflosliklardan tozalash",
      ru: "Очистка масла от металлических частиц и загрязнений",
      en: "Engine oil filtration",
      kz: "Майды тазалау",
    },
  },
  {
    slug: "fuel-filters",
    sortOrder: 3,
    name: {
      uz: "Yoqilg'i filtrlari",
      ru: "Топливные фильтры",
      en: "Fuel filters",
      kz: "Отын сүзгілері",
    },
    description: {
      uz: "Yoqilg'idan suv va iflosliklarni ajratish",
      ru: "Очистка топлива от воды и загрязнений",
      en: "Diesel and fuel water-separator filtration",
      kz: "Отынды тазалау",
    },
  },
  {
    slug: "hydraulic-filters",
    sortOrder: 4,
    name: {
      uz: "Gidravlik filtrlar",
      ru: "Гидравлические фильтры",
      en: "Hydraulic filters",
      kz: "Гидравликалық сүзгілер",
    },
    description: {
      uz: "Gidrosistemani metall qirindi va abraziivdan himoya qilish",
      ru: "Защита гидросистемы от стружки и абразива",
      en: "Hydraulic system protection",
      kz: "Гидравликалық жүйені қорғау",
    },
  },
  {
    slug: "cabin-filters",
    sortOrder: 5,
    name: {
      uz: "Kabina filtrlari",
      ru: "Фильтры кабины",
      en: "Cabin filters",
      kz: "Кабина сүзгілері",
    },
    description: {
      uz: "Operator kabinasi havosini tozalash",
      ru: "Очистка воздуха кабины оператора",
      en: "Operator cabin air filtration",
      kz: "Оператор кабинасының ауасын тазалау",
    },
  },
  {
    slug: "adblue-filters",
    sortOrder: 6,
    name: {
      uz: "AdBlue filtrlari",
      ru: "AdBlue фильтры",
      en: "AdBlue filters",
      kz: "AdBlue сүзгілері",
    },
    description: {
      uz: "SCR tizimi uchun mochevina tozalagich",
      ru: "Фильтр для системы SCR (мочевина)",
      en: "SCR/urea system filtration",
      kz: "SCR жүйесіне арналған сүзгі",
    },
  },
  {
    slug: "coolant-filters",
    sortOrder: 7,
    name: {
      uz: "Sovutish suyuqligi filtrlari",
      ru: "Фильтры охлаждающей жидкости",
      en: "Coolant filters",
      kz: "Салқындатқыш сүзгілер",
    },
    description: {
      uz: "Sovutgich suyuqligini tozalash va korroziyadan himoya",
      ru: "Очистка охлаждающей жидкости и защита от коррозии",
      en: "Coolant filtration and corrosion protection",
      kz: "Салқындатқыш сұйықтықты сүзу",
    },
  },
  {
    slug: "ventilation-filters",
    sortOrder: 8,
    name: {
      uz: "Ventilyatsiya filtrlari",
      ru: "Вентиляционные фильтры",
      en: "Ventilation filters",
      kz: "Желдету сүзгілері",
    },
    description: {
      uz: "Ventilyatsiya va HVAC tizimlari uchun filtrlar (G3/G4/HEPA)",
      ru: "Фильтры для систем вентиляции и HVAC (G3/G4/HEPA)",
      en: "Ventilation/HVAC filters (G3/G4/HEPA)",
      kz: "Желдету жүйелеріне арналған сүзгілер",
    },
  },
  {
    slug: "filter-kits",
    sortOrder: 9,
    name: {
      uz: "Filtr to'plamlari",
      ru: "Комплекты фильтров",
      en: "Filter kits",
      kz: "Сүзгі жинақтары",
    },
    description: {
      uz: "Texnik xizmat uchun to'liq filtr to'plami",
      ru: "Полный комплект фильтров для ТО",
      en: "Complete filter kits for service",
      kz: "Қызмет көрсетуге арналған сүзгі жинақтары",
    },
  },
];

const EQUIPMENT_TYPES = [
  {
    slug: "excavators",
    sortOrder: 1,
    machineBrands: ["CAT", "KOMATSU", "HITACHI", "VOLVO", "HYUNDAI", "JCB"],
    name: { uz: "Ekskavatorlar", ru: "Экскаваторы", en: "Excavators", kz: "Экскаваторлар" },
  },
  {
    slug: "loaders",
    sortOrder: 2,
    machineBrands: ["CAT", "KOMATSU", "JCB", "SDLG", "XCMG", "VOLVO"],
    name: { uz: "Pogruzchiklar", ru: "Погрузчики", en: "Loaders", kz: "Тиегіштер" },
  },
  {
    slug: "bulldozers",
    sortOrder: 3,
    machineBrands: ["CAT", "KOMATSU", "SHANTUI"],
    name: { uz: "Buldozerlar", ru: "Бульдозеры", en: "Bulldozers", kz: "Бульдозерлер" },
  },
  {
    slug: "dump-trucks",
    sortOrder: 4,
    machineBrands: ["HOWO", "SHACMAN", "VOLVO", "MAN", "MERCEDES"],
    name: { uz: "Samosvallar", ru: "Самосвалы", en: "Dump trucks", kz: "Өздігінен түсіргіштер" },
  },
  {
    slug: "graders",
    sortOrder: 5,
    machineBrands: ["CAT", "KOMATSU", "XCMG"],
    name: { uz: "Greyderlar", ru: "Грейдеры", en: "Graders", kz: "Грейдерлер" },
  },
  {
    slug: "rollers",
    sortOrder: 6,
    machineBrands: ["HAMM", "BOMAG", "DYNAPAC", "XCMG"],
    name: { uz: "Kataklar", ru: "Катки", en: "Rollers", kz: "Тегістегіштер" },
  },
  {
    slug: "cranes",
    sortOrder: 7,
    machineBrands: ["LIEBHERR", "XCMG", "ZOOMLION", "TADANO"],
    name: { uz: "Kranlar", ru: "Краны", en: "Cranes", kz: "Крандар" },
  },
  {
    slug: "concrete-mixers",
    sortOrder: 8,
    machineBrands: ["HOWO", "SHACMAN", "MERCEDES"],
    name: {
      uz: "Beton aralashtirgichlar",
      ru: "Бетоносмесители",
      en: "Concrete mixers",
      kz: "Бетон араластырғыштары",
    },
  },
  {
    slug: "road-equipment",
    sortOrder: 9,
    machineBrands: ["XCMG", "SANY", "ZOOMLION"],
    name: { uz: "Yo'l texnikasi", ru: "Дорожная техника", en: "Road equipment", kz: "Жол техникасы" },
  },
  {
    slug: "agricultural",
    sortOrder: 10,
    machineBrands: ["JOHN_DEERE", "CASE", "NEW_HOLLAND", "MTZ", "CLAAS"],
    name: { uz: "Selxoz texnikasi", ru: "Сельхозтехника", en: "Agricultural", kz: "Ауыл шаруашылығы" },
  },
  {
    slug: "municipal",
    sortOrder: 11,
    machineBrands: ["MAZ", "KAMAZ"],
    name: {
      uz: "Kommunal texnika",
      ru: "Коммунальная техника",
      en: "Municipal equipment",
      kz: "Коммуналдық техника",
    },
  },
  {
    slug: "generators",
    sortOrder: 12,
    machineBrands: ["CUMMINS", "PERKINS", "CATERPILLAR", "VOLVO_PENTA"],
    name: { uz: "Generatorlar", ru: "Генераторы", en: "Generators", kz: "Генераторлар" },
  },
];

interface SampleProduct {
  categorySlug: string;
  name: ReturnType<typeof tf>;
  description: ReturnType<typeof tf>;
  slug: string;
  sku: string;
  price: number;
  priceOnRequest?: boolean;
  oem?: string;
  oemNumbers?: string[];
  crossReferences?: { partNumber: string; manufacturer: string }[];
  applications?: { machineBrand: string; model?: string; engine?: string; year?: string }[];
  application?: string;
  vehicleBrand?: string;
  material?: string;
  dimensions?: Record<string, number | string>;
  stockStatus?: "in_stock" | "under_order";
  isFeatured?: boolean;
}

const SAMPLE_PRODUCTS: SampleProduct[] = [
  /* ── Spetstexnika — with cross-references (killer feature) ──────────────── */
  {
    categorySlug: "oil-filters",
    name: tf("Moy filtri Donaldson P551808", "Масляный фильтр Donaldson P551808", "Oil filter Donaldson P551808", "Май сүзгісі Donaldson P551808"),
    description: tf(
      "CAT, Komatsu va generatorlar uchun yuqori sifatli spin-on moy filtri.",
      "Высококачественный навинчиваемый масляный фильтр для CAT, Komatsu и генераторов.",
      "High-quality spin-on oil filter for CAT, Komatsu and generators.",
      "CAT, Komatsu және генераторларға арналған сапалы май сүзгісі.",
    ),
    slug: "donaldson-p551808",
    sku: "FS-OIL-P551808",
    price: 0,
    priceOnRequest: true,
    oem: "1R-1808",
    oemNumbers: ["CAT 1R-1808", "Caterpillar 1R1808"],
    crossReferences: [
      { partNumber: "LF691A", manufacturer: "Fleetguard" },
      { partNumber: "B99", manufacturer: "Baldwin" },
      { partNumber: "51791", manufacturer: "WIX" },
    ],
    applications: [
      { machineBrand: "CAT", model: "320D", engine: "C6.4", year: "2007-2014" },
      { machineBrand: "KOMATSU", model: "PC200", engine: "SAA6D107", year: "2010-2018" },
    ],
    application: "CAT 320D, Komatsu PC200, generatorlar",
    vehicleBrand: "CAT",
    material: "Steel case",
    dimensions: { height: 260, outerDiameter: 118, threadSize: "1-1/8-16", gasketOuterDiameter: 110, gasketInnerDiameter: 98 },
    stockStatus: "in_stock",
    isFeatured: true,
  },
  {
    categorySlug: "oil-filters",
    name: tf("Moy filtri Fleetguard LF691A", "Масляный фильтр Fleetguard LF691A", "Oil filter Fleetguard LF691A", "Май сүзгісі Fleetguard LF691A"),
    description: tf("Og'ir texnika dvigatellari uchun ishonchli moy filtri.", "Надежный масляный фильтр для двигателей тяжелой техники.", "Reliable oil filter for heavy-equipment engines.", "Ауыр техника қозғалтқыштарына арналған сүзгі."),
    slug: "fleetguard-lf691a",
    sku: "FS-OIL-LF691A",
    price: 0,
    priceOnRequest: true,
    oem: "LF691A",
    oemNumbers: ["Fleetguard LF691A"],
    crossReferences: [
      { partNumber: "P551808", manufacturer: "Donaldson" },
      { partNumber: "W11102/36", manufacturer: "MANN" },
    ],
    applications: [{ machineBrand: "CUMMINS", model: "6BT", engine: "5.9", year: "2005-2015" }],
    vehicleBrand: "CUMMINS",
    stockStatus: "in_stock",
  },
  {
    categorySlug: "air-filters",
    name: tf("Havo filtri Donaldson P181054", "Воздушный фильтр Donaldson P181054", "Air filter Donaldson P181054", "Ауа сүзгісі Donaldson P181054"),
    description: tf("Ekskavator va pogruzchiklar uchun primary havo filtri.", "Первичный воздушный фильтр для экскаваторов и погрузчиков.", "Primary air filter for excavators and loaders.", "Экскаваторларға арналған бастапқы ауа сүзгісі."),
    slug: "donaldson-p181054",
    sku: "FS-AIR-P181054",
    price: 0,
    priceOnRequest: true,
    oem: "P181054",
    oemNumbers: ["Donaldson P181054"],
    crossReferences: [
      { partNumber: "AF4747", manufacturer: "Fleetguard" },
      { partNumber: "C311094", manufacturer: "MANN" },
    ],
    applications: [{ machineBrand: "HITACHI", model: "ZX330", year: "2008-2016" }],
    vehicleBrand: "HITACHI",
    dimensions: { height: 450, outerDiameter: 320, innerDiameter: 180 },
    stockStatus: "in_stock",
    isFeatured: true,
  },
  {
    categorySlug: "fuel-filters",
    name: tf("Yoqilg'i filtri Fleetguard FF5320", "Топливный фильтр Fleetguard FF5320", "Fuel filter Fleetguard FF5320", "Отын сүзгісі Fleetguard FF5320"),
    description: tf("Dizel dvigatellar uchun yoqilg'i filtri, suvni ajratish bilan.", "Топливный фильтр для дизельных двигателей с отделением воды.", "Diesel fuel filter with water separation.", "Дизель қозғалтқыштарына арналған отын сүзгісі."),
    slug: "fleetguard-ff5320",
    sku: "FS-FUEL-FF5320",
    price: 0,
    priceOnRequest: true,
    oem: "FF5320",
    oemNumbers: ["Fleetguard FF5320"],
    crossReferences: [
      { partNumber: "P550440", manufacturer: "Donaldson" },
      { partNumber: "WK940/33", manufacturer: "MANN" },
    ],
    applications: [{ machineBrand: "VOLVO", model: "EC210", engine: "D6", year: "2006-2014" }],
    vehicleBrand: "VOLVO",
    stockStatus: "under_order",
  },
  {
    categorySlug: "hydraulic-filters",
    name: tf("Gidravlik filtr HYDAC 0160 R", "Гидравлический фильтр HYDAC 0160 R", "Hydraulic filter HYDAC 0160 R", "Гидравликалық сүзгі HYDAC 0160 R"),
    description: tf("Gidrosistemani himoya qiluvchi qaytuvchi liniya filtri.", "Фильтр обратной линии для защиты гидросистемы.", "Return-line filter protecting the hydraulic system.", "Гидрожүйені қорғайтын сүзгі."),
    slug: "hydac-0160-r",
    sku: "FS-HYD-0160R",
    price: 0,
    priceOnRequest: true,
    oem: "0160R010BN4HC",
    oemNumbers: ["HYDAC 0160 R 010 BN4HC"],
    crossReferences: [{ partNumber: "HF6177", manufacturer: "Fleetguard" }],
    applications: [{ machineBrand: "JCB", model: "JS220", year: "2009-2017" }],
    vehicleBrand: "JCB",
    stockStatus: "in_stock",
  },
  /* ── Industrial — engineered equipment, price on request ───────────────── */
  {
    categorySlug: "scrubbers",
    name: tf("Venturi-skrubber PS-3000", "Скруббер Вентури PS-3000", "Venturi scrubber PS-3000", "Вентури скруббері PS-3000"),
    description: tf(
      "3 000 m³/soat unumdorlikdagi venturi-skrubber, maydadispers chang va gazlarni tozalash uchun.",
      "Скруббер Вентури производительностью 3 000 м³/ч для очистки мелкодисперсной пыли и газов.",
      "Venturi scrubber with 3,000 m³/h capacity for fine dust and gas cleaning.",
      "3 000 м³/сағ өнімділікті Вентури скруббері.",
    ),
    slug: "venturi-scrubber-ps-3000",
    sku: "FS-SCR-PS3000",
    price: 0,
    priceOnRequest: true,
    material: "AISI 304 / FRP",
    dimensions: { height: 4300, outerDiameter: 1200 },
    stockStatus: "under_order",
    isFeatured: true,
  },
  {
    categorySlug: "scrubbers",
    name: tf("Nasadkali skrubber PS-5000", "Насадочный скруббер PS-5000", "Packed scrubber PS-5000", "Толтырмалы скруббер PS-5000"),
    description: tf("Kislotali gazlarni neytrallash uchun nasadkali skrubber, 5 000 m³/soat.", "Насадочный скруббер для нейтрализации кислотных газов, 5 000 м³/ч.", "Packed scrubber for acid-gas neutralization, 5,000 m³/h.", "Қышқыл газдарды бейтараптауға арналған скруббер."),
    slug: "packed-scrubber-ps-5000",
    sku: "FS-SCR-PS5000",
    price: 0,
    priceOnRequest: true,
    material: "PP / PVC",
    dimensions: { height: 5000, outerDiameter: 1400 },
    stockStatus: "under_order",
  },
  {
    categorySlug: "bag-filters",
    name: tf("Yengli filtr FRKI-120", "Рукавный фильтр FRKI-120", "Bag filter FRKI-120", "Жеңді сүзгі FRKI-120"),
    description: tf("Impulsli regeneratsiyali yengli filtr, 12 000 m³/soat.", "Рукавный фильтр с импульсной регенерацией, 12 000 м³/ч.", "Pulse-jet bag filter, 12,000 m³/h.", "Импульстік регенерациялы жеңді сүзгі."),
    slug: "bag-filter-frki-120",
    sku: "FS-BAG-FRKI120",
    price: 0,
    priceOnRequest: true,
    material: "Polyester / PTFE",
    dimensions: { height: 6200, outerDiameter: 2000 },
    stockStatus: "under_order",
    isFeatured: true,
  },
  {
    categorySlug: "cyclones",
    name: tf("Siklon TsN-15-650", "Циклон ЦН-15-650", "Cyclone CN-15-650", "Циклон ЦН-15-650"),
    description: tf("Standart siklon, yirik changdan dastlabki tozalash uchun.", "Стандартный циклон для предварительной очистки от крупной пыли.", "Standard cyclone for coarse-dust pre-cleaning.", "Ірі шаңнан тазалауға арналған стандартты циклон."),
    slug: "cyclone-cn-15-650",
    sku: "FS-CYC-CN15650",
    price: 0,
    priceOnRequest: true,
    material: "Carbon steel St3",
    dimensions: { height: 3200, outerDiameter: 650 },
    stockStatus: "in_stock",
  },
  {
    categorySlug: "cartridge-filters",
    name: tf("Kartrij filtr PCF-8K", "Картриджный фильтр PCF-8K", "Cartridge filter PCF-8K", "Картридж сүзгісі PCF-8K"),
    description: tf("Aspiratsiya tizimlari uchun kartrij filtr, 8 000 m³/soat.", "Картриджный фильтр для систем аспирации, 8 000 м³/ч.", "Cartridge filter for aspiration systems, 8,000 m³/h.", "Аспирация жүйелеріне арналған картридж сүзгісі."),
    slug: "cartridge-filter-pcf-8k",
    sku: "FS-CRT-PCF8K",
    price: 0,
    priceOnRequest: true,
    material: "Cellulose / Nanofiber",
    dimensions: { height: 2700, outerDiameter: 1100 },
    stockStatus: "under_order",
  },
  {
    categorySlug: "electrostatic-filters",
    name: tf("Elektrostatik filtr ESP-10K", "Электростатический фильтр ESP-10K", "Electrostatic filter ESP-10K", "Электростатикалық сүзгі ESP-10K"),
    description: tf("Tutun va moy aerozollarini yo'qotish uchun ESP, 10 000 m³/soat.", "ЭФ для удаления дыма и масляных аэрозолей, 10 000 м³/ч.", "ESP for smoke and oil-aerosol removal, 10,000 m³/h.", "Түтін мен май аэрозольдерін жоюға арналған ЭФ."),
    slug: "electrostatic-filter-esp-10k",
    sku: "FS-ESP-10K",
    price: 0,
    priceOnRequest: true,
    material: "AISI 304",
    stockStatus: "under_order",
  },
];

async function run() {
  if (env.NODE_ENV === "production") {
    console.error(
      "\n❌ Refusing to run seed in production — this command drops the database.\n",
    );
    process.exit(1);
  }

  await connectDatabase();
  try {
    const dbName = mongoose.connection.db?.databaseName;
    logger.warn({ db: dbName }, "Dropping database");
    await mongoose.connection.dropDatabase();
    logger.info({ db: dbName }, "Database dropped");

    // 1) Admin user
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const admin = await UserModel.create({
      phoneNumber: ADMIN_PHONE,
      password: hashed,
      name: ADMIN_NAME,
      role: "ADMIN",
    });

    // 2) Directions
    const directions = await DirectionModel.insertMany(DIRECTIONS);
    const directionBySlug = new Map(
      directions.map((d) => [d.slug, String(d._id)]),
    );

    // 3) Categories under "spetstexnika"
    const spetstexnikaId = directionBySlug.get("spetstexnika");
    if (!spetstexnikaId) throw new Error("spetstexnika direction not seeded");
    const spetsCats = await CategoryModel.insertMany(
      SPETSTEXNIKA_CATEGORIES.map((c) => ({
        ...c,
        direction: spetstexnikaId,
        isActive: true,
      })),
    );

    // 3b) Categories under "industrial"
    const industrialId = directionBySlug.get("industrial");
    if (!industrialId) throw new Error("industrial direction not seeded");
    const industrialCats = await CategoryModel.insertMany(
      INDUSTRIAL_CATEGORIES.map((c) => ({
        ...c,
        direction: industrialId,
        isActive: true,
      })),
    );

    const categoryBySlug = new Map<string, string>(
      [...spetsCats, ...industrialCats].map((c) => [c.slug, String(c._id)]),
    );

    // 4) Equipment types (12)
    await EquipmentTypeModel.insertMany(
      EQUIPMENT_TYPES.map((et) => ({ ...et, isActive: true })),
    );

    // 5) Sample products
    const productDocs = SAMPLE_PRODUCTS.map((p) => {
      const categoryId = categoryBySlug.get(p.categorySlug);
      if (!categoryId) throw new Error(`category '${p.categorySlug}' not found`);
      const { categorySlug, ...rest } = p;
      void categorySlug;
      return {
        ...rest,
        category: categoryId,
        images: [],
        specifications: [],
        stock: rest.stockStatus === "in_stock" ? 10 : 0,
        isActive: true,
        isFeatured: rest.isFeatured ?? false,
        oemNumbers: rest.oemNumbers ?? [],
        crossReferences: rest.crossReferences ?? [],
        applications: rest.applications ?? [],
        priceOnRequest: rest.priceOnRequest ?? false,
        stockStatus: rest.stockStatus ?? "in_stock",
      };
    });
    await ProductModel.insertMany(productDocs);

    console.log("\n========== DATABASE RESET ==========");
    console.log(`DB:            ${dbName}`);
    console.log(`Admin phone:   ${admin.phoneNumber}`);
    console.log(`Admin pass:    ${ADMIN_PASSWORD}`);
    console.log(`Directions:    ${directions.length}`);
    console.log(`Categories:    ${SPETSTEXNIKA_CATEGORIES.length} spetstexnika + ${INDUSTRIAL_CATEGORIES.length} industrial`);
    console.log(`Equipment:     ${EQUIPMENT_TYPES.length} types`);
    console.log(`Products:      ${SAMPLE_PRODUCTS.length} samples`);
    console.log("====================================\n");
  } finally {
    await disconnectDatabase();
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ error: message }, "Seed failed");
    console.error("\nError:", message);
    process.exit(1);
  });
