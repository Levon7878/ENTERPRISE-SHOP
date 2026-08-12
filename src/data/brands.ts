import { Brand } from '../shared/types';

export const mockBrands: Brand[] = [
  {
    id: 'apple',
    name: 'Apple',
    slug: 'apple',
    logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80',
    country: 'USA',
    description: {
      am: 'Աշխարհի առաջատար տեխնոլոգիական ընկերությունը, որն արտադրում է iPhone, Mac, iPad և Apple Watch:',
      ru: 'Ведущая мировая технологическая компания, производитель iPhone, Mac, iPad и Apple Watch.',
      en: 'World leading technology company producing iPhone, Mac, iPad, and Apple Watch.',
    },
  },
  {
    id: 'samsung',
    name: 'Samsung',
    slug: 'samsung',
    logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80',
    country: 'South Korea',
    description: {
      am: 'Գլոբալ հսկա սմարթֆոնների, հեռուստացույցների և կենցաղային տեխնիկայի ոլորտում:',
      ru: 'Мировой гигант в производстве смартфонов, телевизоров и бытовой техники.',
      en: 'Global giant in smartphones, TVs, and home appliances.',
    },
  },
  {
    id: 'sony',
    name: 'Sony',
    slug: 'sony',
    logo: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=200&q=80',
    country: 'Japan',
    description: {
      am: 'Ճապոնական լեգենդար բրենդ՝ աուդիո համակարգերի, հեռուստացույցների և PlayStation-ի արտադրող:',
      ru: 'Легендарный японский бренд качественной аудио-видеотехники и игровой консоли PlayStation.',
      en: 'Legendary Japanese brand known for premium audio, OLED TVs, and PlayStation gaming.',
    },
  },
  {
    id: 'asus',
    name: 'ASUS',
    slug: 'asus',
    logo: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80',
    country: 'Taiwan',
    description: {
      am: 'Նոութբուքերի, մայրական պլատաների և ROG խաղային սարքավորումների առաջատար արտադրող:',
      ru: 'Лидер в производстве ноутбуков, материнских плат и игровых систем ROG.',
      en: 'Leader in high-performance laptops, motherboards, and ROG gaming gear.',
    },
  },
  {
    id: 'lg',
    name: 'LG Electronics',
    slug: 'lg',
    logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=200&q=80',
    country: 'South Korea',
    description: {
      am: 'OLED հեռուստացույցների, մոնիտորների և խելացի կենցաղային տեխնիկայի աշխարհի առաջատար:',
      ru: 'Мировой лидер OLED телевизоров, мониторов и умной бытовой техники.',
      en: 'Global innovator in OLED TVs, gaming monitors, and smart appliances.',
    },
  },
  {
    id: 'xiaomi',
    name: 'Xiaomi',
    slug: 'xiaomi',
    logo: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=200&q=80',
    country: 'China',
    description: {
      am: 'Ինովացիոն սմարթֆոնների, խելացի տան և էկոհամակարգային սարքերի արտադրող:',
      ru: 'Инновационные смартфоны, техника для умного дома и гаджеты по доступным ценам.',
      en: 'Innovator in high-tech smartphones, smart home ecosystems, and personal gadgets.',
    },
  },
];
