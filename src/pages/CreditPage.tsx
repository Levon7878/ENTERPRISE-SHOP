import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CreditCalculator } from '../features/credit/CreditCalculator';
import { CreditApplicationModal } from '../features/credit/CreditApplicationModal';
import { SEOHead } from '../features/seo/SEOHead';
import { FAQSchema } from '../features/seo/schemas/Schemas';
import { mockFAQs } from '../data/faqs';
import { Language } from '../shared/types';

export const CreditPage: React.FC = () => {
  const { lang } = useParams<{ lang?: string }>();
  const { i18n } = useTranslation('credit');
  const currentLang = (lang || i18n.language || 'am') as Language;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loanDetails, setLoanDetails] = useState<any>(null);

  const handleApplyLoan = (details: any) => {
    setLoanDetails({
      ...details,
      bankName: details.bankId === 'ameria' ? 'Ameriabank' : details.bankId === 'acba' ? 'ACBA Bank' : 'Inecobank',
      productName: 'General Consumer Electronics Loan',
    });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-12">
      <SEOHead
        title="Online Credit 0% Calculator - Enterprise Electronics"
        description="Calculate monthly loan payments and apply online with zero down payment through Ameriabank, Inecobank, Evocabank and ACBA."
        canonicalPath="/credit"
      />
      <FAQSchema faqs={mockFAQs} lang={currentLang} />

      <CreditCalculator lang={currentLang} onApplyLoan={handleApplyLoan} />

      <CreditApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        loanDetails={loanDetails}
      />
    </div>
  );
};
