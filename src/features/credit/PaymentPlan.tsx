import React from 'react';
import { useCurrencyStore } from '../../app/store/useCompareStore';

interface PaymentPlanProps {
  amount: number;
  termMonths: number;
  annualRatePct: number;
}

export const PaymentPlan: React.FC<PaymentPlanProps> = ({ amount, termMonths, annualRatePct }) => {
  const { formatPrice } = useCurrencyStore();

  const monthlyRate = annualRatePct / 100 / 12;
  const monthlyPayment =
    monthlyRate > 0
      ? (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
        (Math.pow(1 + monthlyRate, termMonths) - 1)
      : amount / termMonths;

  let remainingBalance = amount;
  const schedule = [];

  for (let month = 1; month <= termMonths; month++) {
    const interest = remainingBalance * monthlyRate;
    const principal = monthlyPayment - interest;
    remainingBalance -= principal;

    schedule.push({
      month,
      payment: monthlyPayment,
      principal,
      interest,
      balance: Math.max(0, remainingBalance),
    });
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
      <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
        <span>Payment Amortization Schedule</span>
        <span className="text-xs font-normal text-slate-500">{termMonths} Months @ {annualRatePct}% APR</span>
      </h4>

      <div className="overflow-x-auto max-h-64 overflow-y-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 border-b border-slate-200">
            <tr>
              <th className="p-3">Month</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Principal</th>
              <th className="p-3">Interest</th>
              <th className="p-3">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schedule.map((row) => (
              <tr key={row.month} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-700">#{row.month}</td>
                <td className="p-3 font-semibold text-slate-900">{formatPrice(row.payment)}</td>
                <td className="p-3 text-emerald-600">{formatPrice(row.principal)}</td>
                <td className="p-3 text-amber-600">{formatPrice(row.interest)}</td>
                <td className="p-3 text-slate-500">{formatPrice(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
