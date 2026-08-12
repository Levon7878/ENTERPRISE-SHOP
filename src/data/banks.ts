import { BankPartner } from '../shared/types';

export const mockBanks: BankPartner[] = [
  {
    id: 'ameria',
    name: 'Ameriabank',
    logo: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=200&q=80',
    minRate: 14.5,
    maxTermMonths: 36,
    minDownPaymentPct: 0,
    approvalSpeedMinutes: 5,
    features: [
      { am: 'Առցանց հաստատում ID-ով', ru: 'Онлайн одобрение по ID', en: 'Online approval via ID' },
      { am: 'Մինչև 36 ամիս', ru: 'Срок до 36 месяцев', en: 'Up to 36 months' },
      { am: 'Առանց թաքնված միջնորդավճարների', ru: 'Без скрытых комиссий', en: 'No hidden fees' },
    ],
  },
  {
    id: 'acba',
    name: 'ACBA Bank',
    logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80',
    minRate: 15.0,
    maxTermMonths: 36,
    minDownPaymentPct: 10,
    approvalSpeedMinutes: 10,
    features: [
      { am: 'Նվազագույն կանխավճար 10%', ru: 'Мин. взнос 10%', en: 'Min. 10% down payment' },
      { am: 'Մինչև 36 ամիս ժամկետ', ru: 'Срок до 36 месяцев', en: 'Up to 36 months term' },
    ],
  },
  {
    id: 'ineco',
    name: 'Inecobank',
    logo: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&w=200&q=80',
    minRate: 13.9,
    maxTermMonths: 24,
    minDownPaymentPct: 0,
    approvalSpeedMinutes: 3,
    features: [
      { am: 'Արագ հաստատում 3 րոպեում', ru: 'Одобрение за 3 минуты', en: 'Approval in 3 minutes' },
      { am: 'Մինչև 24 ամիս', ru: 'Срок до 24 месяцев', en: 'Up to 24 months' },
    ],
  },
  {
    id: 'evoca',
    name: 'Evocabank',
    logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80',
    minRate: 14.0,
    maxTermMonths: 36,
    minDownPaymentPct: 0,
    approvalSpeedMinutes: 5,
    features: [
      { am: '100% առցանց ձևակերպում', ru: '100% онлайн оформление', en: '100% online application' },
      { am: 'Ճկուն վճարման գրաֆիկ', ru: 'Гибкий график выплат', en: 'Flexible repayment plan' },
    ],
  },
];
