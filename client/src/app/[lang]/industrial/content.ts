import type { Locale } from "@/shared/types";

export type LS = Record<Locale, string>;

export interface CategoryType {
  title: LS;
  desc: LS;
}

export interface CategoryContent {
  pills: LS[];
  principle: LS; // "Принцип работы" paragraph
  advantages: LS[];
  applications: LS[];
  types: CategoryType[];
  materials: LS[];
}

const ls = (uz: string, ru: string, en: string, kz: string): LS => ({ uz, ru, en, kz });

/* ── Generic industrial defaults (used when a category has no bespoke copy) ── */
const DEFAULT_CONTENT: CategoryContent = {
  pills: [
    ls("Yuqori tozalash samaradorligi", "Высокая эффективность очистки", "High cleaning efficiency", "Жоғары тазалау тиімділігі"),
    ls("Keng ish diapazoni", "Широкий диапазон производительности", "Wide performance range", "Кең өнімділік ауқымы"),
    ls("Ishonchli konstruksiya", "Надежная конструкция", "Reliable construction", "Сенімді құрылым"),
    ls("Energiya tejamkorligi", "Энергоэффективность", "Energy efficiency", "Энергия үнемдеу"),
    ls("Individual yechim", "Индивидуальные решения", "Custom solutions", "Жеке шешімдер"),
  ],
  principle: ls(
    "Uskuna ifloslangan havo yoki gaz oqimini qabul qiladi, undagi chang va zararli aralashmalarni ushlab qoladi, so'ng tozalangan oqimni atmosferaga chiqaradi.",
    "Оборудование принимает загрязненный поток воздуха или газа, улавливает пыль и вредные примеси, после чего очищенный поток выводится в атмосферу.",
    "The unit takes in a contaminated air or gas stream, captures dust and harmful impurities, then releases the cleaned stream to the atmosphere.",
    "Жабдық ластанған ауа немесе газ ағынын қабылдап, шаң мен зиянды қоспаларды ұстайды, содан кейін тазаланған ағынды атмосфераға шығарады.",
  ),
  advantages: [
    ls("Chang va zararli gazlarni samarali yo'qotish", "Эффективное удаление пыли и вредных газов", "Effective removal of dust and harmful gases", "Шаң мен зиянды газдарды тиімді жою"),
    ls("Past aerodinamik qarshilik", "Низкое аэродинамическое сопротивление", "Low aerodynamic resistance", "Төмен аэродинамикалық кедергі"),
    ls("Foydalanish va xizmat ko'rsatish qulayligi", "Простота эксплуатации и обслуживания", "Easy operation and maintenance", "Пайдалану мен қызмет көрсету ыңғайлылығы"),
    ls("Uzoq xizmat muddati", "Длительный срок службы", "Long service life", "Ұзақ қызмет мерзімі"),
    ls("Ekologik talablarga muvofiqlik", "Соответствие экологическим требованиям", "Compliance with environmental standards", "Экологиялық талаптарға сәйкестік"),
  ],
  applications: [
    ls("Kimyo sanoati", "Химическая промышленность", "Chemical industry", "Химия өнеркәсібі"),
    ls("Metallurgiya va quyma ishlab chiqarish", "Металлургия и литейное производство", "Metallurgy and foundries", "Металлургия және құю өндірісі"),
    ls("Energetika va IES", "Энергетика и ТЭЦ", "Power and CHP plants", "Энергетика және ЖЭО"),
    ls("Sement va qurilish sanoati", "Цементная и строительная промышленность", "Cement and construction", "Цемент және құрылыс өнеркәсібі"),
    ls("Yog'ochni qayta ishlash", "Деревообрабатывающая промышленность", "Woodworking industry", "Ағаш өңдеу өнеркәсібі"),
    ls("Chiqindilarni qayta ishlash", "Утилизация отходов и переработка", "Waste recycling", "Қалдықтарды қайта өңдеу"),
  ],
  types: [],
  materials: [
    ls("Polipropilen (PP)", "Полипропилен (PP)", "Polypropylene (PP)", "Полипропилен (PP)"),
    ls("Zanglamaydigan po'lat (AISI 304/316)", "Нержавеющая сталь (AISI 304/316)", "Stainless steel (AISI 304/316)", "Тот баспайтын болат (AISI 304/316)"),
    ls("Uglerodli po'lat", "Углеродистая сталь", "Carbon steel", "Көміртекті болат"),
    ls("Loyiha talablariga ko'ra ijro", "Исполнение под требования проекта", "Built to project requirements", "Жоба талаптарына сай орындау"),
  ],
};

/* ── Scrubbers — fully authored, matches the design 1:1 ────────────────────── */
const SCRUBBERS: CategoryContent = {
  pills: [
    ls("99,9% gacha tozalash", "Высокая эффективность очистки до 99,9%", "Cleaning efficiency up to 99.9%", "99,9% дейін тазалау"),
    ls("Keng ish diapazoni", "Широкий диапазон производительности", "Wide performance range", "Кең өнімділік ауқымы"),
    ls("Korroziyabardosh ijro", "Коррозионностойкое исполнение", "Corrosion-resistant build", "Коррозияға төзімді"),
    ls("Energiya tejamkorligi", "Энергопотребление", "Energy efficiency", "Энергия үнемдеу"),
    ls("Individual yechim", "Индивидуальные решения под задачи клиента", "Custom solutions", "Жеке шешімдер"),
  ],
  principle: ls(
    "Ifloslangan gaz oqimi skrubberga kiradi va u yerda suyuqlik bilan kontaktga kirishadi. Chang zarralari va zararli aralashmalar yutiladi yoki neytrallanadi va oqimdan chiqariladi.",
    "Загрязненный газовый поток поступает в скруббер, где происходит контакт с жидкостью. Частицы пыли и вредные примеси поглощаются или нейтрализуются и удаляются из потока.",
    "The contaminated gas stream enters the scrubber where it contacts the liquid. Dust particles and harmful impurities are absorbed or neutralized and removed from the flow.",
    "Ластанған газ ағыны скрубберге түсіп, сұйықтықпен жанасады. Шаң бөлшектері мен зиянды қоспалар сіңіріледі немесе бейтараптандырылады.",
  ),
  advantages: DEFAULT_CONTENT.advantages,
  applications: DEFAULT_CONTENT.applications,
  types: [
    {
      title: ls("Venturi-skrubberlar", "Вентури-скрубберы", "Venturi scrubbers", "Вентури скрубберлері"),
      desc: ls(
        "Maydadispers chang va gazlarni yuqori samarali tozalash. Murakkab sharoitlar uchun mos.",
        "Высокая эффективность очистки мелкодисперсной пыли и газов. Подходит для сложных условий.",
        "High-efficiency cleaning of fine dust and gases. Suitable for demanding conditions.",
        "Ұсақ шаң мен газдарды жоғары тиімділікпен тазалау.",
      ),
    },
    {
      title: ls("Nasadkali skrubberlar", "Насадочные скрубберы", "Packed scrubbers", "Толтырмалы скрубберлер"),
      desc: ls(
        "Gazlar va bug'larni universal tozalash. Gazlarni neytrallashda samarali.",
        "Универсальные скрубберы для газов и паров. Эффективны при нейтрализации газов.",
        "Universal scrubbers for gases and vapors. Effective at gas neutralization.",
        "Газдар мен булар үшін әмбебап скрубберлер.",
      ),
    },
    {
      title: ls("Ko'pikli skrubberlar", "Пенные скрубберы", "Foam scrubbers", "Көбікті скрубберлер"),
      desc: ls(
        "Chang va tumanni yo'qotishda iqtisodiy yechim. Past qarshilikli.",
        "Экономичное решение для удаления пыли и тумана. С низким сопротивлением.",
        "Economical solution for dust and mist removal. Low resistance.",
        "Шаң мен тұманды жоюдың үнемді шешімі.",
      ),
    },
    {
      title: ls("Quruq skrubberlar", "Сухие скрубберы (полусухие)", "Dry scrubbers", "Құрғақ скрубберлер"),
      desc: ls(
        "Quruq reagentlar va changni ushlash uchun minimal suyuqlik ishlatadi.",
        "Используют минимум жидкости, подходят для улавливания сухих реагентов и пыли.",
        "Use minimal liquid, suited for capturing dry reagents and dust.",
        "Минималды сұйықтық қолданады.",
      ),
    },
    {
      title: ls("Gibrid skrubberlar", "Гибридные скрубберы", "Hybrid scrubbers", "Гибридті скрубберлер"),
      desc: ls(
        "Murakkab texnologik vazifalar uchun kombinatsiyalangan yechim.",
        "Комбинирование решения для сложных технологических задач.",
        "Combined solution for complex process tasks.",
        "Күрделі технологиялық тапсырмаларға арналған шешім.",
      ),
    },
  ],
  materials: [
    ls("Polipropilen (PP)", "Полипропилен (PP)", "Polypropylene (PP)", "Полипропилен (PP)"),
    ls("PVX (PVC)", "ПВХ (PVC)", "PVC", "ПВХ (PVC)"),
    ls("Zanglamaydigan po'lat (AISI 304/316)", "Нержавеющая сталь (AISI 304/316)", "Stainless steel (AISI 304/316)", "Тот баспайтын болат (AISI 304/316)"),
    ls("Futerovka (FRP, rezina, PTFE)", "Футеровка (FRP, резина, ПТФЭ)", "Lining (FRP, rubber, PTFE)", "Футеровка (FRP, резина, ПТФЭ)"),
    ls("Maxsus qotishmalar — buyurtma asosida", "Специальные сплавы — под заказ", "Special alloys — made to order", "Арнайы қорытпалар — тапсырыс бойынша"),
  ],
};

/* ── Bag filters (Рукавные фильтры) ────────────────────────────────────────── */
const BAG_FILTERS: CategoryContent = {
  pills: [
    ls("99,9% gacha samaradorlik", "Эффективность до 99,9%", "Efficiency up to 99.9%", "99,9% дейін тиімділік"),
    ls("250°C gacha ishlash harorati", "Рабочая температура до 250°C", "Operating temp up to 250°C", "250°C дейін жұмыс температурасы"),
    ls("Yuqori unumdorlik", "Высокая производительность", "High capacity", "Жоғары өнімділік"),
    ls("Filtrlovchi materiallar keng tanlovi", "Широкий выбор фильтровальных материалов", "Wide choice of filter media", "Сүзгі материалдарының кең таңдауы"),
    ls("Individual loyihalash", "Индивидуальное проектирование", "Custom engineering", "Жеке жобалау"),
  ],
  principle: ls(
    "Changlangan havo korpusga kiradi, filtrlovchi yenglar yuzasida chang ushlanadi, tozalangan havo esa tashqariga chiqariladi. Yenglar siqilgan havo impulsi bilan davriy ravishda tozalanadi.",
    "Запыленный воздух поступает в корпус, пыль задерживается на поверхности фильтровальных рукавов, а очищенный воздух выводится наружу. Рукава периодически очищаются импульсом сжатого воздуха.",
    "Dusty air enters the housing, dust is captured on the filter bag surface, and cleaned air is discharged. The bags are cleaned periodically by a pulse of compressed air.",
    "Шаңды ауа корпусқа кіреді, шаң жеңдер бетінде ұсталады, тазаланған ауа шығарылады.",
  ),
  advantages: DEFAULT_CONTENT.advantages,
  applications: DEFAULT_CONTENT.applications,
  types: [
    {
      title: ls("Impulsli tozalash (siqilgan havo)", "Импульсная очистка (сжатый воздух)", "Pulse-jet cleaning", "Импульстік тазалау"),
      desc: ls("Eng keng tarqalgan va samarali tozalash usuli. Yuqori samaradorlikni ta'minlaydi.", "Наиболее распространенный и эффективный способ очистки. Обеспечивает высокую степень очистки.", "The most common and effective cleaning method. Ensures high efficiency.", "Ең тиімді тазалау әдісі."),
    },
    {
      title: ls("Skreper (mexanik) tozalash", "Шаберная (механическая) очистка", "Mechanical (shaker) cleaning", "Механикалық тазалау"),
      desc: ls("Mexanik silkitish yordamida tozalash, kichik tizimlar uchun mos.", "Очистка с помощью механического встряхивания, подходит для небольших установок.", "Cleaning by mechanical shaking, suited for smaller systems.", "Механикалық шайқау арқылы тазалау."),
    },
    {
      title: ls("Teskari havo oqimi", "Обратный поток воздуха", "Reverse air flow", "Кері ауа ағыны"),
      desc: ls("Yumshoq tozalash, nozik filtrlovchi materiallar uchun.", "Мягкая очистка, подходит для деликатных фильтровальных материалов.", "Gentle cleaning for delicate filter media.", "Жұмсақ тазалау."),
    },
    {
      title: ls("Kombinatsiyalangan tizim", "Комбинированная система", "Combined system", "Аралас жүйе"),
      desc: ls("Murakkab sharoitlar uchun bir nechta usulning birikmasi.", "Сочетание нескольких методов для сложных условий.", "A combination of methods for demanding conditions.", "Күрделі жағдайларға арналған тіркесім."),
    },
  ],
  materials: [
    ls("Poliester (PE) — 130°C gacha", "Полиэстер (PE) — до 130°C", "Polyester (PE) — up to 130°C", "Полиэстер (PE) — 130°C дейін"),
    ls("Polipropilen (PP) — 90°C gacha", "Полипропилен (PP) — до 90°C", "Polypropylene (PP) — up to 90°C", "Полипропилен (PP) — 90°C дейін"),
    ls("Aramid (Nomex) — 200°C gacha", "Арамид (Nomex) — до 200°C", "Aramid (Nomex) — up to 200°C", "Арамид (Nomex) — 200°C дейін"),
    ls("PTFE (Teflon) — kimyoviy chidamli", "PTFE (Тефлон) — химически стойкий", "PTFE (Teflon) — chemically resistant", "PTFE (Тефлон) — химиялық төзімді"),
    ls("PPS — 190°C gacha, agressiv muhit", "PPS — до 190°C, агрессивные среды", "PPS — up to 190°C, aggressive media", "PPS — 190°C дейін"),
    ls("Shisha tola — 260°C gacha", "Стекловолокно — до 260°C", "Fiberglass — up to 260°C", "Шыны талшық — 260°C дейін"),
  ],
};

/* ── Cartridge filters (Картриджные фильтры) ───────────────────────────────── */
const CARTRIDGE_FILTERS: CategoryContent = {
  pills: [
    ls("99,9% gacha samaradorlik", "Высокая эффективность до 99,9%", "Efficiency up to 99.9%", "99,9% дейін тиімділік"),
    ls("Ixcham o'lcham", "Компактные размеры", "Compact size", "Ықшам өлшем"),
    ls("Kartrijni oson almashtirish", "Простая замена картриджей", "Easy cartridge replacement", "Картриджді оңай ауыстыру"),
    ls("Past qarshilik", "Низкое сопротивление", "Low resistance", "Төмен кедергі"),
    ls("Uzoq xizmat va ishonchlilik", "Долговечность и надежность", "Durability & reliability", "Ұзақ мерзімділік"),
  ],
  principle: ls(
    "Changlangan havo kirish patrubkasidan kelib, kartrijlar orqali o'tadi. Chang gofrlangan filtrlovchi material yuzasida ushlanadi, tozalangan havo chiqariladi.",
    "Запыленный воздух поступает через входной патрубок и проходит через картриджи. Пыль задерживается на поверхности гофрированного фильтрующего материала, а очищенный воздух выводится.",
    "Dusty air enters through the inlet and passes through the cartridges. Dust is captured on the pleated filter media surface, and cleaned air is discharged.",
    "Шаңды ауа картридждер арқылы өтеді, шаң гофрленген материалда ұсталады.",
  ),
  advantages: DEFAULT_CONTENT.advantages,
  applications: DEFAULT_CONTENT.applications,
  types: [
    {
      title: ls("Vertikal ijro", "Вертикальное исполнение", "Vertical design", "Тік орындау"),
      desc: ls("Ko'pchilik sanoat vazifalari uchun standart yechim.", "Стандартное решение для большинства промышленных задач.", "Standard solution for most industrial tasks.", "Көптеген тапсырмаларға стандартты шешім."),
    },
    {
      title: ls("Gorizontal ijro", "Горизонтальное исполнение", "Horizontal design", "Көлденең орындау"),
      desc: ls("Cheklangan balandlikdagi joylarda montaj qulayligi.", "Удобство монтажа при ограниченной высоте.", "Easy installation where height is limited.", "Биіктігі шектеулі жерлерде ыңғайлы."),
    },
    {
      title: ls("Bunkerli va chiqaruvchi", "С бункером и выгрузкой", "With hopper and discharge", "Бункермен"),
      desc: ls("Katta hajmdagi changni avtomatik chiqarish uchun.", "Для автоматического удаления пыли при большом объеме.", "For automatic dust removal at high volumes.", "Шаңды автоматты шығаруға арналған."),
    },
    {
      title: ls("Ventilyatorli (avtonom)", "С вентилятором (автономный)", "With fan (standalone)", "Желдеткішпен"),
      desc: ls("Aspiratsiya tizimi uchun ixcham tugal yechim.", "Компактное готовое решение для системы аспирации.", "Compact turnkey solution for an aspiration system.", "Аспирация жүйесіне арналған ықшам шешім."),
    },
  ],
  materials: [
    ls("Sellyuloza — universal", "Целлюлоза — универсальная", "Cellulose — universal", "Целлюлоза — әмбебап"),
    ls("Polyester — namlikka chidamli", "Полиэстер — влагостойкий", "Polyester — moisture-resistant", "Полиэстер — ылғалға төзімді"),
    ls("Nanovolokno — yuqori samaradorlik", "Нановолокно — высокая эффективность", "Nanofiber — high efficiency", "Нановолокно — жоғары тиімділік"),
    ls("PTFE membrana — agressiv chang", "PTFE мембрана — агрессивная пыль", "PTFE membrane — aggressive dust", "PTFE мембрана"),
    ls("Antistatik ijro (ATEX)", "Антистатическое исполнение (ATEX)", "Antistatic build (ATEX)", "Антистатикалық орындау (ATEX)"),
  ],
};

/* ── Electrostatic filters (Электростатические фильтры) ────────────────────── */
const ELECTROSTATIC: CategoryContent = {
  pills: [
    ls("99,5% gacha samaradorlik", "Высокая эффективность до 99,5%", "Efficiency up to 99.5%", "99,5% дейін тиімділік"),
    ls("Past aerodinamik qarshilik", "Низкое аэродинамическое сопротивление", "Low aerodynamic resistance", "Төмен аэродинамикалық кедергі"),
    ls("Yuqori haroratda ishlash", "Работа при высоких температурах", "High-temperature operation", "Жоғары температурада жұмыс"),
    ls("Ishonchli konstruksiya", "Надежная конструкция и долговечность", "Reliable and durable", "Сенімді құрылым"),
    ls("Avtomatik tozalash tizimi", "Автоматическая система очистки", "Automatic cleaning system", "Автоматты тазалау жүйесі"),
  ],
  principle: ls(
    "Zarralar yuqori kuchlanish maydonida zaryadlanadi va qarama-qarshi zaryadli plastinalarga o'tiradi. Bu maydadispers chang, tutun va moy aerozollarini samarali yo'qotadi.",
    "Частицы заряжаются в поле высокого напряжения и осаждаются на пластинах с противоположным зарядом. Это эффективно удаляет мелкодисперсную пыль, дым и масляные аэрозоли.",
    "Particles are charged in a high-voltage field and deposit on oppositely-charged plates. This effectively removes fine dust, smoke and oil aerosols.",
    "Бөлшектер жоғары кернеу өрісінде зарядталып, пластиналарға қонады.",
  ),
  advantages: DEFAULT_CONTENT.advantages,
  applications: [
    ls("Oshxona va restoranlar", "Кухни, рестораны, кафе", "Kitchens and restaurants", "Асханалар мен мейрамханалар"),
    ls("Grill, mangal, tutun zonalari", "Грили, мангалы, вытяжные зоны", "Grills and exhaust zones", "Гриль, мангал аймақтары"),
    ls("Oziq-ovqat sanoati", "Пищевая промышленность", "Food industry", "Тамақ өнеркәсібі"),
    ls("Payvand va plazma kesish", "Сварочные и плазменные участки", "Welding and plasma areas", "Дәнекерлеу учаскелері"),
    ls("Lazer kesish va gravировка", "Лазерная резка и гравировка", "Laser cutting and engraving", "Лазерлік кесу"),
    ls("Bo'yoq kameralari", "Покрасочные камеры", "Paint booths", "Бояу камералары"),
  ],
  types: [
    {
      title: ls("Ixcham ESP (oshxonalar uchun)", "Компактные ЭФ (для кухонь)", "Compact ESP (for kitchens)", "Ықшам ЭФ (асханаларға)"),
      desc: ls("Restoran, kafe va kichik ishlab chiqarish uchun. 1 000–10 000 m³/h.", "Для ресторанов, кафе и небольших производств. 1 000–10 000 м³/ч.", "For restaurants, cafes and small production. 1,000–10,000 m³/h.", "Мейрамханалар мен шағын өндіріске."),
    },
    {
      title: ls("Sanoat ESP 30 000 m³/h gacha", "Промышленные ЭФ до 30 000 м³/ч", "Industrial ESP up to 30,000 m³/h", "Өнеркәсіптік ЭФ 30 000 м³/сағ дейін"),
      desc: ls("Yirik ishlab chiqarish va sex uchun yuqori unumdorlik.", "Высокая производительность для крупных производств и цехов.", "High capacity for large production and workshops.", "Ірі өндіріске жоғары өнімділік."),
    },
    {
      title: ls("Ko'mir filtri bilan (hidga qarshi)", "С угольным фильтром (от запахов)", "With carbon filter (odor control)", "Көмір сүзгісімен"),
      desc: ls("Hidlarni yo'qotish uchun qo'shimcha bosqich.", "Дополнительная ступень для устранения запахов.", "Additional stage for odor elimination.", "Иістерді жоюға қосымша саты."),
    },
  ],
  materials: [
    ls("Zanglamaydigan po'lat (AISI 304)", "Нержавеющая сталь (AISI 304)", "Stainless steel (AISI 304)", "Тот баспайтын болат (AISI 304)"),
    ls("Alyuminiy ionizatsiya plastinalari", "Алюминиевые пластины ионизации", "Aluminum ionization plates", "Алюминий пластиналар"),
    ls("Avtomatik yuvish tizimi (opsiya)", "Система автоматической мойки (опция)", "Auto-wash system (option)", "Автоматты жуу жүйесі"),
  ],
};

/* ── Cyclones (Циклоны) ────────────────────────────────────────────────────── */
const CYCLONES: CategoryContent = {
  pills: [
    ls("90% gacha tozalash", "Высокая эффективность очистки", "Cleaning up to 90%", "90% дейін тазалау"),
    ls("Oddiy va ishonchli konstruksiya", "Простая конструкция и надежность", "Simple, reliable design", "Қарапайым әрі сенімді"),
    ls("Past xizmat xarajatlari", "Низкие эксплуатационные затраты", "Low operating costs", "Төмен пайдалану шығыны"),
    ls("Yuqori haroratda ishlash", "Работа при высоких температурах", "High-temperature operation", "Жоғары температурада жұмыс"),
    ls("Harakatlanuvchi qismsiz", "Без движущихся частей", "No moving parts", "Қозғалмалы бөлшексіз"),
  ],
  principle: ls(
    "Changlangan havo silindrsimon korpusga urinma bo'ylab kiradi va aylanma harakat hosil qiladi. Markazdan qochma kuch ta'sirida yirik zarralar devorga uriladi va bunkerga tushadi.",
    "Запыленный воздух подается по касательной в цилиндрический корпус и закручивается. Под действием центробежной силы крупные частицы отбрасываются к стенке и оседают в бункер.",
    "Dusty air enters tangentially into the cylindrical body and swirls. Centrifugal force throws coarse particles to the wall and into the hopper.",
    "Шаңды ауа цилиндрлік корпусқа жанама беріліп, айналады.",
  ),
  advantages: [
    ls("Yirik changdan samarali tozalash", "Эффективная очистка крупной пыли", "Effective coarse-dust cleaning", "Ірі шаңды тиімді тазалау"),
    ls("Keyingi uskunani himoya qilish", "Защита последующего оборудования", "Protects downstream equipment", "Кейінгі жабдықты қорғау"),
    ls("Eskirish va abraziivga chidamlilik", "Устойчивость к износу и абразиву", "Wear and abrasion resistance", "Тозуға төзімділік"),
    ls("Yuqori haroratda ishlash imkoni", "Возможность работы при высоких температурах", "High-temperature capability", "Жоғары температурада жұмыс"),
    ls("Past xizmat xarajatlari", "Низкие эксплуатационные затраты", "Low operating costs", "Төмен шығын"),
    ls("Ixcham o'lcham, yuqori unumdorlik", "Компактные размеры при высокой производительности", "Compact with high capacity", "Ықшам, жоғары өнімді"),
  ],
  applications: [
    ls("Yog'ochni qayta ishlash", "Деревообработка", "Woodworking", "Ағаш өңдеу"),
    ls("Oziq-ovqat sanoati", "Пищевая промышленность", "Food industry", "Тамақ өнеркәсібі"),
    ls("Sement sanoati", "Цементная промышленность", "Cement industry", "Цемент өнеркәсібі"),
    ls("Metallurgiya va quyma", "Металлургия и литейное производство", "Metallurgy and foundries", "Металлургия"),
    ls("Don tozalash", "Зернопереработка", "Grain processing", "Дән өңдеу"),
    ls("Mineral materiallar va karyerlar", "Минеральные материалы и карьеры", "Minerals and quarries", "Минералды материалдар"),
  ],
  types: [
    {
      title: ls("TsN-15M — standart siklon", "ЦН-15М — стандартный циклон", "CN-15M — standard cyclone", "ЦН-15М — стандартты циклон"),
      desc: ls("Universal yechim, ko'pchilik vazifalar uchun.", "Универсальное решение для большинства задач.", "Universal solution for most tasks.", "Әмбебап шешім."),
    },
    {
      title: ls("TsN-24/UTs — yuqori samaradorlik", "ЦН-24/УЦ — высокоэффективный", "CN-24 — high-efficiency", "ЦН-24/УЦ — жоғары тиімді"),
      desc: ls("Maydaroq zarralarni tozalashda samaradorligi yuqori.", "Повышенная эффективность по более мелкой пыли.", "Higher efficiency on finer dust.", "Ұсақ шаңға тиімдірек."),
    },
    {
      title: ls("TsN-OP — o'qli berish bilan", "ЦН-ОП — с осевой подачей", "CN-OP — with axial inlet", "ЦН-ОП — осьтік берумен"),
      desc: ls("Katta hajm va yuqori changlanish uchun mo'ljallangan.", "Предназначен для больших объемов и высокой запыленности.", "Designed for high volumes and dust loads.", "Үлкен көлемге арналған."),
    },
  ],
  materials: [
    ls("Uglerodli po'lat (St3/St20)", "Углеродистая сталь (Ст3/Ст20)", "Carbon steel (St3/St20)", "Көміртекті болат"),
    ls("Zanglamaydigan po'lat (AISI 304/316)", "Нержавеющая сталь (AISI 304/316)", "Stainless steel (AISI 304/316)", "Тот баспайтын болат"),
    ls("Eskirishbardosh ijro (Hardox, AR)", "Износостойкое исполнение (Hardox, AR)", "Wear-resistant build (Hardox, AR)", "Тозуға төзімді орындау"),
    ls("Yuqori haroratli ijro (500°C gacha)", "Высокотемпературное исполнение (до 500°C)", "High-temp build (up to 500°C)", "Жоғары температуралы орындау"),
  ],
};

/* ── Aspiration systems (Аспирационные системы) ────────────────────────────── */
const ASPIRATION: CategoryContent = {
  pills: [
    ls("Manbada changni yo'qotish", "Удаление загрязнений у источника", "Removal at the source", "Көзден ластануды жою"),
    ls("Mehnat sharoitini yaxshilash", "Улучшение условий труда", "Better working conditions", "Еңбек жағдайын жақсарту"),
    ls("Modulli va kengaytiriladigan", "Модульная и расширяемая", "Modular and expandable", "Модульді әрі кеңейтілетін"),
    ls("Past shovqin darajasi", "Низкий уровень шума", "Low noise level", "Төмен шу деңгейі"),
    ls("Energiya tejamkorligi", "Энергоэффективность", "Energy efficiency", "Энергия үнемдеу"),
  ],
  principle: ls(
    "Ifloslangan havo ish zonasidan mahalliy so'rg'ichlar (zontlar) orqali olinadi, havo o'tkazgichlar bo'ylab tozalash uskunasiga uzatiladi va tozalangandan so'ng atmosferaga chiqariladi.",
    "Загрязненный воздух удаляется из рабочей зоны через местные отсосы (зонты), по системе воздуховодов транспортируется к оборудованию очистки и после очистки выбрасывается в атмосферу.",
    "Contaminated air is captured at the work zone via local hoods, transported through ducts to the cleaning unit, and discharged to atmosphere after cleaning.",
    "Ластанған ауа жұмыс аймағынан жергілікті сорғыштар арқылы алынады.",
  ),
  advantages: DEFAULT_CONTENT.advantages,
  applications: [
    ls("Payvand postlari va sexlar", "Сварочные посты и цеха", "Welding stations and shops", "Дәнекерлеу учаскелері"),
    ls("Metallni qayta ishlash", "Металлообработка", "Metalworking", "Металл өңдеу"),
    ls("Yog'ochni qayta ishlash", "Деревообработка", "Woodworking", "Ағаш өңдеу"),
    ls("Oziq-ovqat ishlab chiqarish", "Пищевое производство", "Food production", "Тамақ өндірісі"),
    ls("Kimyo va farmatsevtika", "Химия и фармацевтика", "Chemical and pharma", "Химия және фармацевтика"),
    ls("Bo'yoq va qoplama uchastkalari", "Покрасочные и участки нанесения покрытий", "Painting and coating areas", "Бояу учаскелері"),
  ],
  types: [
    {
      title: ls("Mahalliy so'rg'ichlar (zontlar)", "Местные отсосы (зонты)", "Local hoods", "Жергілікті сорғыштар"),
      desc: ls("Ifloslanishni hosil bo'lish joyida to'g'ridan-to'g'ri ushlaydi.", "Улавливают загрязнение непосредственно в месте образования.", "Capture contamination right at the source.", "Ластануды пайда болған жерде ұстайды."),
    },
    {
      title: ls("Umumalmashinuv tizimlari", "Общеобменные системы", "General ventilation systems", "Жалпы алмасу жүйелері"),
      desc: ls("Butun xona havosini almashtirish va tozalash.", "Замена и очистка воздуха во всем помещении.", "Replace and clean air across the whole room.", "Бүкіл бөлме ауасын тазалау."),
    },
    {
      title: ls("Kombinatsiyalangan tizimlar", "Комбинированные системы", "Combined systems", "Аралас жүйелер"),
      desc: ls("Mahalliy va umumalmashinuv tizimlarining birikmasi.", "Сочетание местных отсосов и общеобменной вентиляции.", "Combination of local and general ventilation.", "Жергілікті және жалпы жүйелердің тіркесімі."),
    },
  ],
  materials: [
    ls("Tsinklangan po'lat — standart", "Оцинкованная сталь — стандарт", "Galvanized steel — standard", "Мырышталған болат — стандарт"),
    ls("Zanglamaydigan po'lat — agressiv muhit", "Нержавеющая сталь — агрессивные среды", "Stainless steel — aggressive media", "Тот баспайтын болат"),
    ls("Qora po'lat — yuqori harorat", "Черная сталь — высокие температуры", "Black steel — high temperatures", "Қара болат — жоғары температура"),
    ls("Polipropilen (PP) — kimyoviy muhit", "Полипропилен (PP) — химические среды", "Polypropylene (PP) — chemical media", "Полипропилен (PP)"),
  ],
};

/* ── Process & equipment filters (Фильтры для технологий и оборудования) ────── */
const PROCESS_FILTERS: CategoryContent = {
  pills: [
    ls("Yuqori samaradorlik", "Высокая эффективность", "High efficiency", "Жоғары тиімділік"),
    ls("Keng assortiment", "Широкий ассортимент", "Wide range", "Кең ассортимент"),
    ls("Individual yechimlar", "Индивидуальные решения", "Custom solutions", "Жеке шешімдер"),
    ls("Sifat va ishonchlilik", "Качество и надежность", "Quality and reliability", "Сапа мен сенімділік"),
    ls("Standartlarga muvofiqlik", "Соответствие стандартам", "Standards compliance", "Стандарттарға сәйкестік"),
  ],
  principle: ls(
    "Texnologik jarayonlarda havo, suyuqlik yoki gazni filtrlash uchun kompleks yechimlar — uskunani himoya qilish, mahsulot sifatini va ekologik me'yorlarga muvofiqlikni ta'minlash.",
    "Комплексные решения для фильтрации воздуха, жидкостей или газа в технологических процессах — защита оборудования, обеспечение качества продукции и соответствия экологическим нормам.",
    "Complete solutions for filtering air, liquids or gases in processes — protecting equipment, ensuring product quality and environmental compliance.",
    "Технологиялық процестерде сүзу үшін кешенді шешімдер.",
  ),
  advantages: DEFAULT_CONTENT.advantages,
  applications: DEFAULT_CONTENT.applications,
  types: [
    {
      title: ls("Havo filtrlari", "Воздушные фильтры", "Air filters", "Ауа сүзгілері"),
      desc: ls("Ventilyatsiya va texnologik tizimlar uchun panelli, karmanli, HEPA.", "Панельные, карманные, HEPA для вентиляции и технологических систем.", "Panel, pocket and HEPA for ventilation and process systems.", "Панельді, қалталы, HEPA."),
    },
    {
      title: ls("Suyuqlik filtrlari", "Жидкостные фильтры", "Liquid filters", "Сұйықтық сүзгілері"),
      desc: ls("Uskunani himoya qilish uchun suyuqliklarni filtrlash.", "Фильтрация жидкостей для защиты оборудования.", "Liquid filtration to protect equipment.", "Жабдықты қорғауға арналған сүзу."),
    },
    {
      title: ls("Maxsus jarayon filtrlari", "Фильтры спецпроцессов", "Special-process filters", "Арнайы процесс сүзгілері"),
      desc: ls("Agressiv muhit va yuqori talablar uchun yechimlar.", "Решения для агрессивных сред и высоких требований.", "Solutions for aggressive media and high demands.", "Агрессивті орталарға арналған шешімдер."),
    },
    {
      title: ls("Ehtiyot qismlar va materiallar", "Запчасти и расходные материалы", "Spare parts & consumables", "Қосалқы бөлшектер"),
      desc: ls("Filtrlovchi elementlar va komplektlovchi qismlar.", "Фильтрующие элементы и комплектующие.", "Filter elements and components.", "Сүзгі элементтері мен жинақтаушылар."),
    },
  ],
  materials: DEFAULT_CONTENT.materials,
};

const CONTENT: Record<string, CategoryContent> = {
  scrubbers: SCRUBBERS,
  "bag-filters": BAG_FILTERS,
  "cartridge-filters": CARTRIDGE_FILTERS,
  "electrostatic-filters": ELECTROSTATIC,
  cyclones: CYCLONES,
  "aspiration-systems": ASPIRATION,
  "process-filters": PROCESS_FILTERS,
};

export function getCategoryContent(slug: string): CategoryContent {
  return CONTENT[slug] ?? DEFAULT_CONTENT;
}

/* ── Shared tab labels & bottom feature row ────────────────────────────────── */
export const TAB_LABELS = {
  overview: ls("Umumiy ko'rinish", "Обзор", "Overview", "Шолу"),
  principle: ls("Ishlash prinsipi", "Принцип работы", "How it works", "Жұмыс принципі"),
  types: ls("Turlari", "Типы", "Types", "Түрлері"),
  materials: ls("Materiallar va ijro", "Материалы и исполнение", "Materials & build", "Материалдар"),
  options: ls("Opsiya va aksessuarlar", "Опции и аксессуары", "Options & accessories", "Опциялар"),
  specs: ls("Texnik xarakteristikalar", "Технические характеристики", "Technical specs", "Техникалық сипаттамалар"),
  docs: ls("Hujjatlar", "Документация", "Documentation", "Құжаттама"),
};

export const SECTION_LABELS = {
  principle: ls("ISHLASH PRINSIPI", "ПРИНЦИП РАБОТЫ", "HOW IT WORKS", "ЖҰМЫС ПРИНЦИПІ"),
  advantages: ls("ASOSIY AFZALLIKLAR", "ОСНОВНЫЕ ПРЕИМУЩЕСТВА", "KEY ADVANTAGES", "НЕГІЗГІ АРТЫҚШЫЛЫҚТАР"),
  applications: ls("QO'LLANILISHI", "ПРИМЕНЕНИЕ", "APPLICATIONS", "ҚОЛДАНЫЛУЫ"),
  types: ls("TURLARI", "ТИПЫ", "TYPES", "ТҮРЛЕРІ"),
  materials: ls("MATERIALLAR VA IJRO", "МАТЕРИАЛЫ И ИСПОЛНЕНИЕ", "MATERIALS & BUILD", "МАТЕРИАЛДАР ЖӘНЕ ОРЫНДАУ"),
  consult: ls("Konsultatsiya olish", "Получить консультацию", "Get a consultation", "Кеңес алу"),
  catalogHome: ls("Bosh", "Главная", "Home", "Басты"),
  catalogProducts: ls("Filtratsion uskunalar", "Фильтрационное оборудование", "Filtration equipment", "Сүзу жабдығы"),
  products: ls("MODELLAR VA YECHIMLAR", "МОДЕЛИ И РЕШЕНИЯ", "MODELS & SOLUTIONS", "МОДЕЛЬДЕР МЕН ШЕШІМДЕР"),
  productsEmpty: ls(
    "Bu toifa bo'yicha modellar so'rov asosida tayyorlanadi — TZ yuboring.",
    "Модели по этой категории подбираются под запрос — отправьте ТЗ.",
    "Models for this category are configured on request — send a brief.",
    "Бұл санат бойынша модельдер сұраныс бойынша дайындалады.",
  ),
  sectionInProgress: ls("bo'lim tayyorlanmoqda", "раздел в подготовке", "section in progress", "бөлім дайындалуда"),
  ctaNotSure: ls(
    "Vazifangizga nima mosligiga ishonchingiz komilmi?",
    "Не уверены, что подходит для ваших задач?",
    "Not sure what fits your needs?",
    "Тапсырмаңызға не сәйкес келетініне сенімді емессіз бе?",
  ),
};
