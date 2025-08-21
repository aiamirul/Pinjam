import React from 'react';
import { Loan } from '../types';
import { formatCurrency, formatDate } from '../utils/currency';
import { ArrowLeftIcon, DollarSignIcon, DocumentTextIcon, CalendarIcon } from './icons';
import LoanCard from './LoanCard';
import { calculateLoanMetrics } from '../utils/loanCalculations';

interface BorrowerProfileProps {
  borrowerName: string;
  loans: Loan[];
  onSelectLoan: (loan: Loan) => void;
  onBack: () => void;
}

const BorrowerProfile: React.FC<BorrowerProfileProps> = ({ borrowerName, loans, onSelectLoan, onBack }) => {
  const totalOwed = loans.reduce((acc, loan) => {
    return acc + calculateLoanMetrics(loan).remainingBalance;
  }, 0);

  const activeLoansCount = loans.length;

  const mostRecentLoanDate = loans.length > 0 ? loans.reduce((latest, loan) => {
    const loanDate = new Date(loan.startDate);
    return loanDate > new Date(latest) ? loan.startDate : latest;
  }, loans[0].startDate) : new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to All Loans
        </button>
        <h2 className="text-3xl font-bold text-gray-100 truncate">
          {borrowerName}'s Profile
        </h2>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-200">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                <DollarSignIcon className="w-8 h-8 text-yellow-400 mb-2"/>
                <p className="text-sm text-gray-400">Total Amount Owed</p>
                <p className="text-2xl font-semibold text-yellow-400">{formatCurrency(totalOwed)}</p>
            </div>
             <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                <DocumentTextIcon className="w-8 h-8 text-blue-400 mb-2"/>
                <p className="text-sm text-gray-400">Active Loans</p>
                <p className="text-2xl font-semibold text-blue-400">{activeLoansCount}</p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                <CalendarIcon className="w-8 h-8 text-teal-400 mb-2"/>
                <p className="text-sm text-gray-400">Most Recent Loan</p>
                <p className="text-2xl font-semibold text-teal-400">{formatDate(mostRecentLoanDate)}</p>
            </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-200">Loans</h3>
         {loans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loans.map(loan => (
                <LoanCard key={loan.id} loan={loan} onSelectLoan={onSelectLoan} />
            ))}
            </div>
        ) : (
            <p className="text-center text-gray-400 py-8">No loans found for this borrower.</p>
        )}
      </div>
    </div>
  );
};

export default BorrowerProfile;
