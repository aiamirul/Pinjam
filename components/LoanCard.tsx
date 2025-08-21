import React from 'react';
import { Loan } from '../types';
import { formatCurrency } from '../utils/currency';
import { calculateLoanMetrics } from '../utils/loanCalculations';

interface LoanCardProps {
  loan: Loan;
  onSelectLoan: (loan: Loan) => void;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, onSelectLoan }) => {
  const { remainingBalance, progress } = calculateLoanMetrics(loan);
  
  return (
    <div 
      onClick={() => onSelectLoan(loan)}
      className="bg-gray-700/60 rounded-lg p-5 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-blue-500/20 hover:ring-2 hover:ring-blue-500 hover:-translate-y-1"
    >
      <div className="flex justify-between items-start">
        <div>
            <h3 className="text-xl font-semibold text-gray-100">{loan.name}</h3>
             {(loan.lenderName || loan.borrowerName) && (
                <p className="text-xs text-gray-400 mt-1 truncate">
                    {loan.lenderName && <span>From: <span className="font-medium text-gray-300">{loan.lenderName}</span></span>}
                    {loan.lenderName && loan.borrowerName && <span className="mx-1">|</span>}
                    {loan.borrowerName && 
                        <span>To: 
                            <a 
                                href={`#/borrower/${encodeURIComponent(loan.borrowerName)}`} 
                                onClick={(e) => e.stopPropagation()}
                                className="font-medium text-gray-300 hover:text-blue-400 hover:underline"
                            >
                                {loan.borrowerName}
                            </a>
                        </span>
                    }
                </p>
            )}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            progress >= 100 ? 'bg-green-600/30 text-green-300' : 'bg-yellow-600/30 text-yellow-300'
          }`}>
          {progress >= 100 ? 'Paid Off' : 'Active'}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400">Remaining Balance</p>
        <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          {formatCurrency(remainingBalance)}
        </p>
      </div>
      <div className="mt-4">
        <div className="flex justify-between mb-1 text-sm font-medium text-gray-400">
          <span>Progress</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-2.5">
          <div 
            className="bg-gradient-to-r from-blue-500 to-teal-400 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, progress)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoanCard;
