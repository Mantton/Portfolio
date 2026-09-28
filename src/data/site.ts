export type ImageCredit = {
  author: string;
  license: string;
  href: string;
};

export type RegionLanguage = {
  key: string;
  greeting: string;
  intro: string;
  name: string;
  city: string;
  timeZone: string;
  offset: number;
  imageSrc: string;
  credit: ImageCredit;
  // Portrait-oriented variants used on narrow (mobile) viewports.
  imageSrcMobile: string;
  creditMobile: ImageCredit;
};

export const site = {
  brand: 'Mantton',
  legalName: 'Shedrach Uzoukwu',
  location: 'Toronto, Canada',
  email: 'hello@mantton.com',
  githubUrl: 'https://github.com/Mantton',
  xUrl: 'https://twitter.com/ceresmir',
};

export const regionLanguages: RegionLanguage[] = [
  {
    key: 'en',
    greeting: 'Hello',
    intro: "I'm",
    name: 'Mantton',
    city: 'Toronto',
    timeZone: 'America/Toronto',
    offset: -5,
    imageSrc: '/regions/en-toronto.jpg',
    credit: {
      author: 'Jchmrt',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Sunset_Toronto_Skyline_Panorama_Crop_from_Snake_Island.jpg',
    },
    imageSrcMobile: '/regions/en-toronto-portrait.jpg',
    creditMobile: {
      author: 'Wladyslaw',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Toronto_-_ON_-_CN_Tower_-_Antennenspitze.jpg',
    },
  },
  {
    key: 'es',
    greeting: 'Hola',
    intro: 'Soy',
    name: 'Mantton',
    city: 'Madrid',
    timeZone: 'Europe/Madrid',
    offset: 1,
    imageSrc: '/regions/es-madrid.jpg',
    credit: {
      author: 'Jorge Franganillo',
      license: 'CC BY 2.0',
      href: 'https://commons.wikimedia.org/wiki/File:Madrid_Plaza_Mayor_(48733706273).jpg',
    },
    imageSrcMobile: '/regions/es-madrid-portrait.jpg',
    creditMobile: {
      author: 'Carlos Delgado',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Felipe_III_-_Plaza_Mayor_de_Madrid_-_01.jpg',
    },
  },
  {
    key: 'fr',
    greeting: 'Bonjour',
    intro: 'Je suis',
    name: 'Mantton',
    city: 'Paris',
    timeZone: 'Europe/Paris',
    offset: 1,
    imageSrc: '/regions/fr-paris.jpg',
    credit: {
      author: 'Hteink.min',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Louvre_Pyramid.jpg',
    },
    imageSrcMobile: '/regions/fr-paris-portrait.jpg',
    creditMobile: {
      author: 'Tristan Nitot',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Tour_eiffel_at_sunrise_from_the_trocadero.jpg',
    },
  },
  {
    key: 'ja',
    greeting: 'こんにちは',
    intro: '私は',
    name: 'マントン',
    city: 'Tokyo',
    timeZone: 'Asia/Tokyo',
    offset: 9,
    imageSrc: '/regions/ja-tokyo.jpg',
    credit: {
      author: 'Suicasmo',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:View_of_Mount_Fuji_from_Ōwakudani_20211202.jpg',
    },
    imageSrcMobile: '/regions/ja-tokyo-portrait.jpg',
    creditMobile: {
      author: 'Jakub Hałun',
      license: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Tokyo_Tower,_Tokyo,_20240821_1724_5273.jpg',
    },
  },
  {
    key: 'pt',
    greeting: 'Olá',
    intro: 'Eu sou',
    name: 'Mantton',
    city: 'Lisbon',
    timeZone: 'Europe/Lisbon',
    offset: 0,
    imageSrc: '/regions/pt-lisbon.jpg',
    credit: {
      author: 'Berthold Werner',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Lisbon_Torre_de_Belém_BW_2018-10-03_16-33-21.jpg',
    },
    imageSrcMobile: '/regions/pt-lisbon-portrait.jpg',
    creditMobile: {
      author: 'Berthold Werner',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Lisbon_Torre_de_Belém_BW_2018-10-03_16-35-17.jpg',
    },
  },
  {
    key: 'it',
    greeting: 'Ciao',
    intro: 'Sono',
    name: 'Mantton',
    city: 'Rome',
    timeZone: 'Europe/Rome',
    offset: 1,
    imageSrc: '/regions/it-rome.jpg',
    credit: {
      author: 'FeaturedPics',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Colosseo_2020.jpg',
    },
    imageSrcMobile: '/regions/it-rome-portrait.jpg',
    creditMobile: {
      author: 'Jebulon',
      license: 'CC0',
      href: 'https://commons.wikimedia.org/wiki/File:Colosseum_largeur_Rome_Italy.jpg',
    },
  },
  {
    key: 'de',
    greeting: 'Hallo',
    intro: 'Ich bin',
    name: 'Mantton',
    city: 'Berlin',
    timeZone: 'Europe/Berlin',
    offset: 1,
    imageSrc: '/regions/de-berlin.jpg',
    credit: {
      author: 'Thomas Wolf (www.foto-tw.de)',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Brandenburger_Tor_abends.jpg',
    },
    imageSrcMobile: '/regions/de-berlin-portrait.jpg',
    creditMobile: {
      author: 'Ank Kumar',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Brandenburg_Tor(Gate),_Berlin_(Ank_Kumar)_06.jpg',
    },
  },
  {
    key: 'zh',
    greeting: '你好',
    intro: '我是',
    name: '曼顿',
    city: 'Beijing',
    timeZone: 'Asia/Shanghai',
    offset: 8,
    imageSrc: '/regions/zh-beijing.jpg',
    credit: {
      author: 'Severin.stalder',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:The_Great_Wall_of_China_at_Jinshanling-edit.jpg',
    },
    imageSrcMobile: '/regions/zh-beijing-portrait.jpg',
    creditMobile: {
      author: 'Ermell',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Peking_Great_Wall-20071019-RM-115527.jpg',
    },
  },
  {
    key: 'ru',
    greeting: 'Привет',
    intro: 'Я',
    name: 'Мантон',
    city: 'Moscow',
    timeZone: 'Europe/Moscow',
    offset: 3,
    imageSrc: '/regions/ru-moscow.jpg',
    credit: {
      author: 'mos.ru',
      license: 'CC BY 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Kremlin_and_Red_Square.1.jpg',
    },
    imageSrcMobile: '/regions/ru-moscow-portrait.jpg',
    creditMobile: {
      author: 'A.Savin',
      license: 'CC BY-SA 3.0',
      href: 'https://commons.wikimedia.org/wiki/File:Basil-cathedral-morning.jpg',
    },
  },
  {
    key: 'ko',
    greeting: '안녕하세요',
    intro: '저는',
    name: '맨튼',
    city: 'Seoul',
    timeZone: 'Asia/Seoul',
    offset: 9,
    imageSrc: '/regions/ko-seoul.jpg',
    credit: {
      author: 'Seoul Tourism Archive',
      license: 'KOGL Type 1',
      href: 'https://commons.wikimedia.org/wiki/File:광화문_월대.jpg',
    },
    imageSrcMobile: '/regions/ko-seoul-portrait.jpg',
    creditMobile: {
      author: 'Frank Schulenburg',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Royal_Guard_at_Gwanghwamun_Gate,_Gyeongbokgung,_Seoul.jpg',
    },
  },
  {
    key: 'ar',
    greeting: 'مرحبا',
    intro: 'أنا',
    name: 'مانتون',
    city: 'Mecca',
    timeZone: 'Asia/Riyadh',
    offset: 3,
    imageSrc: '/regions/ar-mecca.jpg',
    credit: {
      author: 'RifqiAndika',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Makkah_Ramadhan_1447_H_Tahun_2026.jpg',
    },
    imageSrcMobile: '/regions/ar-mecca-portrait.jpg',
    creditMobile: {
      author: 'Saudi Press Agency',
      license: 'CC BY-SA 4.0',
      href: "https://commons.wikimedia.org/wiki/File:Perfuming_the_walls_of_the_Holy_Kaaba_in_preparation_for_this_year's_Hajj_1446_AH_(2025).jpg",
    },
  },
  {
    key: 'hi',
    greeting: 'नमस्ते',
    intro: 'मैं',
    name: 'मेन्टन',
    city: 'Agra',
    timeZone: 'Asia/Kolkata',
    offset: 5.5,
    imageSrc: '/regions/hi-agra.jpg',
    credit: {
      author: 'Yann (edited by Jim Carter)',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Taj_Mahal_(Edited).jpeg',
    },
    imageSrcMobile: '/regions/hi-agra-portrait.jpg',
    creditMobile: {
      author: 'Diego Delso',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:El_Taj_Mahal-Agra_India0009.JPG',
    },
  },
  {
    key: 'ig',
    greeting: 'Ndewo',
    intro: 'Abụ m',
    name: 'Mantton',
    city: 'Lagos',
    timeZone: 'Africa/Lagos',
    offset: 1,
    imageSrc: '/regions/ig-lagos.jpg',
    credit: {
      author: 'S.aderogba',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Lekki-link-bridge--full-view2.jpg',
    },
    imageSrcMobile: '/regions/ig-lagos-portrait.jpg',
    creditMobile: {
      author: 'Beendy234',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:City_Hall,_Lagos_Island,_Lagos,_Nigeria.jpg',
    },
  },
  {
    key: 'la',
    greeting: 'Salve',
    intro: 'Ego sum',
    name: 'Mantton',
    city: 'Roma',
    timeZone: 'Europe/Rome',
    offset: 1,
    imageSrc: '/regions/la-roma.jpg',
    credit: {
      author: 'Encyclopædia Britannica',
      license: '© Britannica',
      href: 'https://cdn.britannica.com/17/193717-050-030D75E3/Julius-Caesar-statue-Rome-Italy.jpg',
    },
    imageSrcMobile: '/regions/la-roma-portrait.jpg',
    creditMobile: {
      author: 'Leomudde',
      license: 'CC BY-SA 4.0',
      href: 'https://commons.wikimedia.org/wiki/File:Julius_Caesar_Via_dei_Fori_Imperiali_2.jpg',
    },
  },
];
