// Uzbekistan administrative divisions (14 regions/cities → districts).
// Single canonical Uzbek-Latin spelling so courier addresses stay consistent.
// Localized labels are produced by name field; districts use their official names.

export interface UzRegion {
  name: string;
  districts: string[];
}

export const UZ_REGIONS: UzRegion[] = [
  {
    name: "Toshkent shahri",
    districts: [
      "Bektemir", "Chilonzor", "Mirobod", "Mirzo Ulug'bek", "Olmazor",
      "Sergeli", "Shayxontohur", "Uchtepa", "Yakkasaroy", "Yashnobod",
      "Yunusobod", "Yangi Hayot",
    ],
  },
  {
    name: "Toshkent viloyati",
    districts: [
      "Angren", "Bekobod", "Bo'ka", "Bo'stonliq", "Chinoz", "Chirchiq",
      "Ohangaron", "Olmaliq", "Oqqo'rg'on", "Parkent", "Piskent",
      "Quyichirchiq", "Yangiyo'l", "Yuqorichirchiq", "Zangiota",
    ],
  },
  {
    name: "Andijon viloyati",
    districts: [
      "Andijon", "Asaka", "Baliqchi", "Bo'z", "Buloqboshi", "Izboskan",
      "Jalaquduq", "Marhamat", "Oltinko'l", "Paxtaobod", "Qo'rg'ontepa",
      "Shahrixon", "Ulug'nor", "Xo'jaobod",
    ],
  },
  {
    name: "Buxoro viloyati",
    districts: [
      "Buxoro", "G'ijduvon", "Jondor", "Kogon", "Olot", "Peshku",
      "Qorako'l", "Qorovulbozor", "Romitan", "Shofirkon", "Vobkent",
    ],
  },
  {
    name: "Farg'ona viloyati",
    districts: [
      "Beshariq", "Bog'dod", "Buvayda", "Dang'ara", "Farg'ona",
      "Furqat", "Marg'ilon", "O'zbekiston", "Oltiariq", "Qo'shtepa",
      "Quva", "Quvasoy", "Rishton", "So'x", "Toshloq", "Uchko'prik", "Yozyovon",
    ],
  },
  {
    name: "Jizzax viloyati",
    districts: [
      "Arnasoy", "Baxmal", "Do'stlik", "Forish", "G'allaorol",
      "Jizzax", "Mirzacho'l", "Paxtakor", "Yangiobod", "Zafarobod", "Zarbdor", "Zomin",
    ],
  },
  {
    name: "Xorazm viloyati",
    districts: [
      "Bog'ot", "Gurlan", "Hazorasp", "Khiva", "Qo'shko'pir", "Shovot",
      "Urganch", "Xonqa", "Yangiariq", "Yangibozor",
    ],
  },
  {
    name: "Namangan viloyati",
    districts: [
      "Chortoq", "Chust", "Kosonsoy", "Mingbuloq", "Namangan",
      "Norin", "Pop", "To'raqo'rg'on", "Uchqo'rg'on", "Uychi", "Yangiqo'rg'on",
    ],
  },
  {
    name: "Navoiy viloyati",
    districts: [
      "Konimex", "Karmana", "Navbahor", "Navoiy", "Nurota",
      "Qiziltepa", "Tomdi", "Uchquduq", "Xatirchi", "Zarafshon",
    ],
  },
  {
    name: "Qashqadaryo viloyati",
    districts: [
      "Chiroqchi", "Dehqonobod", "G'uzor", "Qamashi", "Qarshi",
      "Kasbi", "Kitob", "Koson", "Mirishkor", "Muborak", "Nishon",
      "Shahrisabz", "Yakkabog'",
    ],
  },
  {
    name: "Qoraqalpog'iston Respublikasi",
    districts: [
      "Amudaryo", "Beruniy", "Chimboy", "Ellikqal'a", "Kegeyli",
      "Mo'ynoq", "Nukus", "Qonliko'l", "Qo'ng'irot", "Qorao'zak",
      "Shumanay", "Taxiatosh", "Taxtako'pir", "To'rtko'l", "Xo'jayli",
    ],
  },
  {
    name: "Samarqand viloyati",
    districts: [
      "Bulung'ur", "Ishtixon", "Jomboy", "Kattaqo'rg'on", "Narpay",
      "Nurobod", "Oqdaryo", "Pastdarg'om", "Paxtachi", "Payariq",
      "Qo'shrabot", "Samarqand", "Toyloq", "Urgut",
    ],
  },
  {
    name: "Sirdaryo viloyati",
    districts: [
      "Boyovut", "Guliston", "Mirzaobod", "Oqoltin", "Sayxunobod",
      "Sardoba", "Sirdaryo", "Xovos", "Yangiyer",
    ],
  },
  {
    name: "Surxondaryo viloyati",
    districts: [
      "Angor", "Bandixon", "Boysun", "Denov", "Jarqo'rg'on",
      "Muzrabot", "Oltinsoy", "Qiziriq", "Qumqo'rg'on", "Sariosiyo",
      "Sherobod", "Sho'rchi", "Termiz", "Uzun",
    ],
  },
];
