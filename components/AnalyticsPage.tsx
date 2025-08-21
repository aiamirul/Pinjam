import React, { useMemo } from 'react';
import { Loan } from '../types';
import { formatCurrency } from '../utils/currency';
import { ArrowLeftIcon, DollarSignIcon, DocumentTextIcon, CreditCardIcon, CheckCircleIcon } from './icons';
import LoanCard from './LoanCard';
import { calculateLoanMetrics } from '../utils/loanCalculations';

interface AnalyticsPageProps {
  loans: Loan[];
  onSelectLoan: (loan: Loan) => void;
  onBack: () => void;
}

const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ loans, onSelectLoan, onBack }) => {
    const stats = useMemo(() => {
        let totalPrincipal = 0;
        let totalPaid = 0;
        let totalOwed = 0;
        let paidOffCount = 0;

        loans.forEach(loan => {
            const { remainingBalance, totalPaid: currentTotalPaid } = calculateLoanMetrics(loan);

            totalPrincipal += loan.principal;
            totalPaid += currentTotalPaid;
            totalOwed += remainingBalance;
            
            if (remainingBalance <= 0 && loan.principal > 0) {
                paidOffCount++;
            }
        });
        
        return { totalPrincipal, totalPaid, totalOwed, totalLoans: loans.length, paidOffCount };
    }, [loans]);

    return (
        <div className="space-y-8">
            <div>
                <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold mb-4 transition-colors"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back to Dashboard
                </button>
                <h2 className="text-3xl font-bold text-gray-100 truncate">
                    Global Loan Analytics
                </h2>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-200">Overall Summary</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                        <DocumentTextIcon className="w-8 h-8 text-blue-400 mb-2"/>
                        <p className="text-sm text-gray-400">Total Principal</p>
                        <p className="text-2xl font-semibold text-blue-400">{formatCurrency(stats.totalPrincipal)}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                        <CreditCardIcon className="w-8 h-8 text-green-400 mb-2"/>
                        <p className="text-sm text-gray-400">Total Paid</p>
                        <p className="text-2xl font-semibold text-green-400">{formatCurrency(stats.totalPaid)}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                        <DollarSignIcon className="w-8 h-8 text-yellow-400 mb-2"/>
                        <p className="text-sm text-gray-400">Total Owed</p>
                        <p className="text-2xl font-semibold text-yellow-400">{formatCurrency(stats.totalOwed)}</p>
                    </div>
                    <div className="bg-gray-700/50 p-4 rounded-lg flex items-center justify-center flex-col">
                        <CheckCircleIcon className="w-8 h-8 text-teal-400 mb-2"/>
                        <p className="text-sm text-gray-400">Loans Paid Off</p>
                        <p className="text-2xl font-semibold text-teal-400">{stats.paidOffCount}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-xl font-bold mb-4 text-gray-200">All Loans ({stats.totalLoans})</h3>
                {loans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loans.map(loan => (
                            <LoanCard key={loan.id} loan={loan} onSelectLoan={onSelectLoan} />
                        ))}
                    </div>
                ) : (
                     <p className="text-center text-gray-400 py-8">No loans found.</p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsPage;
