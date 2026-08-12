import { FAQItem } from '../shared/types';

export const mockFAQs: FAQItem[] = [
  {
    id: 'faq-1',
    question: {
      am: 'Ինչպե՞ս ձևակերպել ապառիկ գնում կայքում:',
      ru: 'Как оформить покупку в кредит на сайте?',
      en: 'How do I purchase products on credit through the website?',
    },
    answer: {
      am: 'Ընտրեք ցանկալի ապրանքը, սեղմեք "Գնել ապառիկ", ընտրեք նախընտրելի բանկը (Ameriabank, Inecobank, Evocabank, ACBA) և լրացրեք օնլայն հայտը 2 րոպեում:',
      ru: 'Выберите нужный товар, нажмите "Купить в кредит", выберите банк-партнёр (Ameriabank, Inecobank, Evocabank, ACBA) и заполните заявку за 2 минуты.',
      en: 'Select any product, click "Buy on Credit", choose your preferred partner bank (Ameriabank, Inecobank, Evocabank, ACBA), and submit the 2-minute digital form.',
    },
  },
  {
    id: 'faq-2',
    question: {
      am: 'Որքա՞ն է տևում առաքումը Երևանում և մարզերում:',
      ru: 'Сколько времени занимает доставка по Еревану и регионам?',
      en: 'What are the delivery times for Yerevan and other regions?',
    },
    answer: {
      am: 'Երևանում առաքումն իրականացվում է 1-2 օրում (առկա է նաև էքսպրես առաքում 3 ժամում): Մարզերում առաքումը տևում է 2-4 эшխատանքային օր:',
      ru: 'Доставка по Еревану осуществляется за 1-2 дня (доступна экспресс-доставка за 3 часа). В регионы Армении — 2-4 рабочих дня.',
      en: 'Express Yerevan delivery takes 1-2 business days (or 3-hour same-day express). Regional delivery takes 2-4 business days.',
    },
  },
  {
    id: 'faq-3',
    question: {
      am: 'Արդյո՞ք բոլոր ապրանքներն ունեն պաշտոնական երաշխիք:',
      ru: 'Предоставляется ли официальная гарантия на товары?',
      en: 'Do all products come with an official warranty?',
    },
    answer: {
      am: 'Այո, բոլոր ապրանքներն ունեն պաշտոնական արտադրողի երաշխիք 12-ից մինչև 36 ամիս ժամկետով:',
      ru: 'Да, на весь ассортимент предоставляется официальная гарантия производителя сроком от 12 до 36 месяцев.',
      en: 'Yes, 100% of our products come with official manufacturer warranty ranging from 12 to 36 months.',
    },
  },
  {
    id: 'faq-4',
    question: {
      am: 'Ինչպիսի՞ վճարման եղանակներ են գործում:',
      ru: 'Какие способы оплаты поддерживаются?',
      en: 'Which payment methods are accepted?',
    },
    answer: {
      am: 'Մենք ընդունում ենք կանխիկ վճարում առաքիչին, Visa / Mastercard / ArCa քարտեր, IDram / InecoPay փոխանցումներ և օնլայն ապառիկ:',
      ru: 'Мы принимаем оплату наличными курьеру, банковскими картами Visa / Mastercard / ArCa, онлайн-переводы IDram / InecoPay и кредитование.',
      en: 'We accept cash on delivery, Visa / Mastercard / ArCa cards, IDram / InecoPay mobile payments, and online credit financing.',
    },
  },
];
