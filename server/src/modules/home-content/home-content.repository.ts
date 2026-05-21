import { HomeContentModel } from "./home-content.schema";
import { IHomeContent } from "./home-content.entity";

const tf = (ru: string, en: string, uz: string, kz: string) => ({
  ru,
  en,
  uz,
  kz,
});

const DEFAULT_HOME: Partial<IHomeContent> = {
  about: {
    body: tf(
      "Мы — команда профессионалов, создающая эффективные решения для бизнеса. Уже более 10 лет мы помогаем клиентам достигать целей и уверенно двигаться вперёд.",
      "We are a team of professionals creating effective business solutions. For over 10 years we have been helping clients achieve their goals.",
      "Biz — biznes uchun samarali yechimlar yaratuvchi mutaxassislar jamoasimiz. 10 yildan beri mijozlarga maqsadlariga erishishda yordam beramiz.",
      "Біз — тиімді бизнес шешімдерін жасайтын кәсіпқойлар тобымыз.",
    ),
    image: "",
    features: [
      {
        icon: "ShieldCheck",
        title: tf("О нас", "About us", "Biz haqimizda", "Біз туралы"),
        desc: tf(
          "Мы любим то, что делаем, и делаем это хорошо.",
          "We love what we do and do it well.",
          "Biz qilayotgan ishimizni sevamiz.",
          "Жасайтын ісімізді жақсы көреміз.",
        ),
      },
      {
        icon: "Award",
        title: tf(
          "Наша миссия",
          "Our mission",
          "Bizning vazifa",
          "Біздің миссия",
        ),
        desc: tf(
          "Помогаем клиентам достигать большего.",
          "We help clients achieve more.",
          "Mijozlarga ko'proq erishishda yordam.",
          "Клиенттерге көбірек қол жеткізуге.",
        ),
      },
      {
        icon: "Users2",
        title: tf(
          "Наши ценности",
          "Our values",
          "Bizning qadriyatlar",
          "Біздің құндылықтар",
        ),
        desc: tf(
          "Качество, честность и забота.",
          "Quality, honesty and care.",
          "Sifat, halollik va g'amxo'rlik.",
          "Сапа, адалдық және қамқорлық.",
        ),
      },
    ],
  },
  whyUs: {
    title: tf(
      "Почему выбирают нашу компанию",
      "Why customers choose our company",
      "Nega mijozlar bizni tanlaydi",
      "Неге клиенттер бізді таңдайды",
    ),
    features: [
      {
        icon: "ShieldCheck",
        title: tf(
          "Надёжные поставщики",
          "Reliable supply",
          "Ishonchli yetkazib beruvchilar",
          "Сенімді жеткізушілер",
        ),
        desc: tf(
          "Стабильные поставки в срок.",
          "Stable deliveries on time.",
          "O'z vaqtida barqaror yetkazib berish.",
          "Уақытында тұрақты жеткізу.",
        ),
      },
      {
        icon: "Zap",
        title: tf("Быстрая реакция", "Fast response", "Tezkor javob", "Жылдам жауап"),
        desc: tf(
          "Отвечаем в течение часов.",
          "We answer within hours.",
          "Soatlar ichida javob.",
          "Сағаттар ішінде жауап.",
        ),
      },
      {
        icon: "HeartHandshake",
        title: tf(
          "Клиентоориентированность",
          "Client-focused",
          "Mijozga yo'naltirilganlik",
          "Клиентке бағдарлану",
        ),
        desc: tf(
          "Индивидуальные решения.",
          "Custom solutions.",
          "Individual yechimlar.",
          "Жеке шешімдер.",
        ),
      },
      {
        icon: "TrendingUp",
        title: tf(
          "Повышаем эффективность",
          "We boost efficiency",
          "Samaradorlikni oshiramiz",
          "Тиімділікті арттырамыз",
        ),
        desc: tf(
          "Премиальная фильтрация.",
          "Premium filtration.",
          "Premium filtrlash.",
          "Премиум сүзу.",
        ),
      },
    ],
  },
  process: {
    title: tf(
      "Подход к клиентам и реализация проектов",
      "Approach to clients and project execution",
      "Mijozlarga yondashuv va loyihalarni amalga oshirish",
      "Клиенттерге көзқарас",
    ),
    steps: [
      {
        number: "01",
        icon: "ClipboardList",
        title: tf(
          "Консультация и анализ",
          "Consultation & analysis",
          "Konsultatsiya va tahlil",
          "Кеңес беру және талдау",
        ),
        desc: tf(
          "Изучаем потребности клиента.",
          "We study client's needs.",
          "Mijoz ehtiyojlarini o'rganamiz.",
          "Клиенттің қажеттіліктерін зерттейміз.",
        ),
      },
      {
        number: "02",
        icon: "Wrench",
        title: tf(
          "Техническое решение",
          "Technical solution",
          "Texnik yechim",
          "Техникалық шешім",
        ),
        desc: tf(
          "Разрабатываем индивидуальный проект.",
          "We develop individual project.",
          "Individual loyiha ishlab chiqamiz.",
          "Жеке жоба әзірлейміз.",
        ),
      },
      {
        number: "03",
        icon: "Factory",
        title: tf(
          "Производство",
          "Production",
          "Ishlab chiqarish",
          "Өндіріс",
        ),
        desc: tf(
          "Премиальные материалы.",
          "Premium materials.",
          "Premium materiallar.",
          "Премиум материалдар.",
        ),
      },
      {
        number: "04",
        icon: "CheckCircle2",
        title: tf(
          "Доставка и монтаж",
          "Delivery & installation",
          "Yetkazib berish va montaj",
          "Жеткізу және монтаж",
        ),
        desc: tf(
          "Сертифицированные специалисты.",
          "Certified specialists.",
          "Sertifikatlangan mutaxassislar.",
          "Сертификатталған мамандар.",
        ),
      },
    ],
  },
  integration: {
    title: tf(
      "Глубоко интегрирован с остальной частью вашей технологической инфраструктуры",
      "Deeply integrated with the rest of your technology infrastructure",
      "Texnologik infratuzilmangizning qolgan qismi bilan chuqur integratsiya",
      "Технологиялық инфрақұрылыммен терең интеграция",
    ),
    body: tf(
      "Более 100 интеграций с Shopify, Klaviyo, Yotpo и другими.",
      "More than 100 integrations with Shopify, Klaviyo, Yotpo.",
      "Shopify, Klaviyo va boshqalar bilan 100 dan ortiq integratsiyalar.",
      "Shopify, Klaviyo және басқалармен 100-ден астам интеграция.",
    ),
    tiles: [
      tf(
        "Отправляйте видеоинструкции внутри Intercom.",
        "Send video instructions inside Intercom.",
        "Intercom ichida video ko'rsatmalari.",
        "Intercom ішінде бейне нұсқаулықтар.",
      ),
      tf(
        "Добавьте интерактивный компонент на сайт.",
        "Add interactive component to your site.",
        "Saytga interaktiv komponent qo'shing.",
        "Сайтқа интерактивті компонент.",
      ),
      tf(
        "Подключите к Shopify.",
        "Connect to Shopify.",
        "Shopify'ga ulang.",
        "Shopify-ға қосыңыз.",
      ),
      tf(
        "Pop-up формат.",
        "Pop-up format.",
        "Pop-up format.",
        "Pop-up формат.",
      ),
      tf(
        "Создавайте лиды.",
        "Generate leads.",
        "Lidlar yarating.",
        "Лидтер жасаңыз.",
      ),
      tf(
        "Автоматизация.",
        "Automation.",
        "Avtomatlashtirish.",
        "Автоматтандыру.",
      ),
      tf(
        "Аналитика.",
        "Analytics.",
        "Analitika.",
        "Аналитика.",
      ),
      tf(
        "Email рассылки.",
        "Email campaigns.",
        "Email kampaniyalar.",
        "Email науқандар.",
      ),
      tf(
        "Zapier интеграция.",
        "Zapier integration.",
        "Zapier integratsiya.",
        "Zapier интеграциясы.",
      ),
    ],
  },
  ctaBanners: {
    left: {
      title: tf(
        "Каркасы для рукавных фильтров:",
        "Filter housings:",
        "Yenglik filtrlar uchun karkaslar:",
        "Жеңсүзгілерге арналған қаңқалар:",
      ),
      subtitle: tf(
        "виды, материалы и подбор",
        "types, materials and selection",
        "turlari, materiallari va tanlash",
        "түрлері, материалдары және таңдау",
      ),
      points: [
        tf("Корпус", "Body", "Korpus", "Корпус"),
        tf(
          "Входной и выходной патрубок",
          "Inlet/outlet pipes",
          "Kirish va chiqish quvurlari",
          "Кіріс және шығыс құбырлары",
        ),
        tf(
          "Монтажные элементы",
          "Mounting elements",
          "Montaj elementlari",
          "Монтаждық элементтер",
        ),
      ],
      ctaLabel: tf("Каталог товаров", "View catalog", "Katalogni ko'rish", "Каталог"),
      ctaHref: "/products",
      variant: "blue-ink",
    },
    right: {
      title: tf(
        "Воздушный фильтр очищает воздух,",
        "Air filter cleans the air",
        "Havo filtri havoni tozalaydi",
        "Ауа сүзгісі ауаны тазалайды",
      ),
      subtitle: tf(
        "предотвращая описанные ситуации",
        "preventing described situations",
        "tasvirlangan vaziyatlarning oldini oladi",
        "сипатталған жағдайлардың алдын алады",
      ),
      points: [
        tf(
          "Цилиндрические и панельные варианты",
          "Cylindrical and panel options",
          "Silindrik va panelli variantlar",
          "Цилиндрлік және панельді нұсқалар",
        ),
        tf(
          "Популярные материалы",
          "Popular materials",
          "Mashhur materiallar",
          "Танымал материалдар",
        ),
        tf(
          "Сертифицировано",
          "Certified",
          "Sertifikatlangan",
          "Сертификатталған",
        ),
      ],
      ctaLabel: tf("Каталог", "Catalog", "Katalog", "Каталог"),
      ctaHref: "/products",
      variant: "ink",
    },
  },
  pages: {
    about: {
      title: tf(
        "О компании",
        "About the company",
        "Kompaniya haqida",
        "Компания туралы",
      ),
      subtitle: tf(
        "PHOENIX PRIME ENGINEERING — инжиниринговая компания по проектированию, производству и поставке систем промышленной фильтрации и газоочистки.",
        "PHOENIX PRIME ENGINEERING is an engineering company designing, manufacturing and supplying industrial filtration and gas-cleaning systems.",
        "PHOENIX PRIME ENGINEERING — sanoat filtratsiyasi va gaz tozalash tizimlarini loyihalash, ishlab chiqarish va ta'minlash bo'yicha injiniring kompaniyasi.",
        "PHOENIX PRIME ENGINEERING — өнеркәсіптік сүзу жүйелерін жобалайтын инжиниринг компаниясы.",
      ),
      intro: tf(
        "Уже более 10 лет мы обеспечиваем предприятиям различных отраслей чистый воздух и соответствие экологическим нормам. Собственный инженерный отдел подходит индивидуально к каждому проекту.",
        "For over 10 years we have provided enterprises with clean air and environmental compliance. Our in-house engineering team approaches each project individually.",
        "Biz 10 yildan ortiq vaqt davomida turli sanoat tarmoqlari korxonalariga toza havo va ekologik me'yorlarga muvofiqlikni ta'minlaymiz. O'z muhandislik bo'limimiz har bir loyihaga individual yondashadi.",
        "10 жылдан астам уақыт бойы кәсіпорындарға таза ауа қамтамасыз етеміз.",
      ),
      image: "https://picsum.photos/seed/pf101/1600/700",
      stats: [
        { value: "250+", label: tf("Проектов", "Projects", "Loyiha", "Жоба") },
        { value: "100+", label: tf("Клиентов", "Clients", "Mijoz", "Клиент") },
        { value: "10+", label: tf("Лет опыта", "Years", "Yil tajriba", "Жыл") },
        { value: "6", label: tf("Стран", "Countries", "Davlat", "Ел") },
      ],
    },
    services: {
      title: tf(
        "Сервис и обслуживание",
        "Service & maintenance",
        "Servis va xizmat ko'rsatish",
        "Сервис және қызмет",
      ),
      subtitle: tf(
        "Мы обеспечиваем полный жизненный цикл поддержки вашего оборудования — от подбора и монтажа до регулярного обслуживания и модернизации.",
        "We support the full lifecycle of your equipment — from selection and installation to regular maintenance and modernization.",
        "Uskunangizning to'liq hayot tsiklini qo'llab-quvvatlaymiz — tanlash va montajdan tortib muntazam xizmat va modernizatsiyagacha.",
        "Жабдықтың толық өмірлік циклін қолдаймыз.",
      ),
      intro: tf("", "", "", ""),
      image: "https://picsum.photos/seed/pf410/1600/500",
      stats: [],
    },
    engineering: {
      title: tf(
        "Инжиниринговые решения",
        "Engineering solutions",
        "Injiniring yechimlari",
        "Инжинирингтік шешімдер",
      ),
      subtitle: tf(
        "Полный комплекс инжиниринговых услуг — от анализа задачи и проектирования до поставки оборудования, монтажа и ввода в эксплуатацию систем газоочистки, аспирации и вентиляции.",
        "A full range of engineering services — from analysis and design to equipment supply, installation and commissioning.",
        "Vazifa tahlilidan tortib uskuna yetkazib berish, montaj va ishga tushirishgacha — to'liq injiniring xizmatlari majmuasi.",
        "Толық инжиниринг қызметтері — талдаудан жабдықты жеткізу мен іске қосуға дейін.",
      ),
      intro: tf("", "", "", ""),
      image: "https://picsum.photos/seed/pf411/1600/500",
      stats: [],
    },
    projects: {
      title: tf(
        "Наши проекты",
        "Our projects",
        "Bizning loyihalar",
        "Біздің жобалар",
      ),
      subtitle: tf(
        "Мы реализуем проекты любой сложности — от индивидуальных систем аспирации до крупных промышленных комплексов под ключ.",
        "We deliver projects of any complexity — from custom aspiration systems to large turnkey industrial complexes.",
        "Individual aspiratsiya tizimlaridan tortib yirik sanoat majmualarigacha — har qanday murakkablikdagi loyihalarni amalga oshiramiz.",
        "Кез келген күрделіктегі жобаларды іске асырамыз.",
      ),
      intro: tf("", "", "", ""),
      image: "https://picsum.photos/seed/pf412/1600/500",
      stats: [
        {
          value: "250+",
          label: tf(
            "Реализованных проектов",
            "Completed projects",
            "Amalga oshirilgan loyiha",
            "Жобалар",
          ),
        },
        {
          value: "15+",
          label: tf(
            "Отраслей промышленности",
            "Industries",
            "Sanoat tarmog'i",
            "Салалар",
          ),
        },
        {
          value: "6",
          label: tf("Стран присутствия", "Countries", "Mavjud davlatlar", "Елдер"),
        },
        {
          value: "100%",
          label: tf(
            "Соответствие экологическим нормам",
            "Eco compliance",
            "Ekologik me'yorlarga muvofiqlik",
            "Экологиялық сәйкестік",
          ),
        },
      ],
    },
    industries: {
      title: tf(
        "Отраслевые решения",
        "Industry solutions",
        "Tarmoq yechimlari",
        "Салалық шешімдер",
      ),
      subtitle: tf(
        "Профессиональные решения по фильтрации и очистке воздуха для различных отраслей промышленности. Подберите оптимальное оборудование под ваши задачи.",
        "Professional air filtration and cleaning solutions for various industries.",
        "Turli sanoat tarmoqlari uchun havoni filtrlash va tozalash bo'yicha professional yechimlar. Vazifangizga optimal uskunani tanlang.",
        "Әртүрлі салаларға арналған кәсіби шешімдер.",
      ),
      intro: tf("", "", "", ""),
      image: "https://picsum.photos/seed/pf413/1600/500",
      stats: [],
    },
  },
};

export class HomeContentRepository {
  async getOrCreate(): Promise<IHomeContent> {
    let doc = await HomeContentModel.findOne().lean<IHomeContent>();
    if (!doc) {
      const created = await HomeContentModel.create(DEFAULT_HOME);
      doc = created.toObject() as IHomeContent;
    }
    // Backfill any top-level section missing on older documents (e.g. `pages`
    // added after the doc was first created) so the storefront/editor always
    // receive a complete shape. Stored values win; defaults only fill gaps.
    return { ...DEFAULT_HOME, ...doc } as IHomeContent;
  }

  async update(data: Partial<IHomeContent>): Promise<IHomeContent> {
    const existing = await HomeContentModel.findOne();
    if (!existing) {
      const created = await HomeContentModel.create({
        ...DEFAULT_HOME,
        ...data,
      });
      return created.toObject() as IHomeContent;
    }
    const updated = await HomeContentModel.findByIdAndUpdate(
      existing._id,
      { $set: data },
      { new: true },
    ).lean<IHomeContent>();
    return updated as IHomeContent;
  }
}
