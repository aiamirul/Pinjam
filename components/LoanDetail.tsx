import React, { useState } from 'react';
import { Loan } from '../types';
import AddPaymentForm from './AddPaymentForm';
import { formatCurrency, formatDate } from '../utils/currency';
import { ArrowLeftIcon, TrashIcon, ShareIcon, DownloadIcon } from './icons';
import { generateChartData } from '../utils/amortization';
import LoanChart from './LoanChart';
import { generateLoanCSV } from '../utils/csv';
import { calculateLoanMetrics } from '../utils/loanCalculations';

interface LoanDetailProps {
  loan: Loan;
  onAddPayment: (loanId: string, amount: number, date: string) => void;
  onBack: () => void;
  onDeleteLoan: (loanId: string) => void;
}

const LoanDetail: React.FC<LoanDetailProps> = ({ loan, onAddPayment, onBack, onDeleteLoan }) => {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  
  const { 
    totalToBeRepaid, 
    totalPaid, 
    remainingBalance, 
    progress, 
    totalInterestAccrued 
  } = calculateLoanMetrics(loan);
  
  const chartData = generateChartData(loan);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the "${loan.name}" loan? This action cannot be undone.`)) {
      onDeleteLoan(loan.id);
    }
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowCopiedTooltip(true);
      setTimeout(() => setShowCopiedTooltip(false), 2000);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const handleExportCSV = () => {
    const csvContent = generateLoanCSV(loan);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const fileName = `${loan.name.replace(/\s+/g, '_').toLowerCase()}_export.csv`;
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-bold text-gray-100 truncate">{loan.name}</h2>
                <div className="relative">
                  <button
                    onClick={handleShare}
                    className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                    aria-label="Copy share link"
                    title="Copy share link"
                  >
                    <ShareIcon className="w-5 h-5" />
                  </button>
                  {showCopiedTooltip && (
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 border border-gray-600 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                      Link Copied!
                    </div>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-500 font-mono mt-2 truncate" title={loan.hash}>
                Hash: {loan.hash}
              </p>
              <p className="text-sm text-gray-400 mt-1">Loan since: {formatDate(loan.startDate)}</p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-gray-400 mt-2">
                {loan.lenderName && (
                    <p>From: <span className="font-semibold text-gray-300">{loan.lenderName}</span></p>
                )}
                {loan.borrowerName && (
                     <p>To: 
                        <a 
                            href={`#/borrower/${encodeURIComponent(loan.borrowerName)}`} 
                            className="font-semibold text-gray-300 hover:text-blue-400 hover:underline"
                        >
                            {' '}{loan.borrowerName}
                        </a>
                    </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-semibold transition-colors p-2 rounded-md hover:bg-blue-500/10"
                  title="Export Loan as CSV"
                >
                  <DownloadIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Export</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 font-semibold transition-colors p-2 rounded-md hover:bg-red-500/10"
                  title="Delete Loan"
                >
                  <TrashIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
            </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
        <h3 className="text-xl font-bold mb-4 text-gray-200">Summary</h3>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-6">
          <div
            className="bg-gradient-to-r from-blue-500 to-teal-400 h-4 rounded-full text-center text-white text-xs font-bold flex items-center justify-center"
            style={{ width: `${Math.min(100, progress)}%` }}
          >
           {progress > 5 && `${progress.toFixed(1)}%`}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-400">Principal</p>
            <p className="text-2xl font-semibold text-gray-100">{formatCurrency(loan.principal)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Interest Accrued</p>
            <p className="text-2xl font-semibold text-cyan-400">{formatCurrency(totalInterestAccrued)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total to Repay</p>
            <p className="text-2xl font-semibold text-gray-100">{formatCurrency(totalToBeRepaid)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Paid</p>
            <p className="text-2xl font-semibold text-green-400">{formatCurrency(totalPaid)}</p>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm text-gray-400">Remaining</p>
            <p className="text-2xl font-semibold text-yellow-400">{formatCurrency(remainingBalance)}</p>
          </div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
          <h3 className="text-xl font-bold mb-6 text-gray-200">Payment Breakdown</h3>
          <LoanChart data={chartData} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700 h-full">
            <h3 className="text-xl font-bold mb-4 text-gray-200">Payment History</h3>
            <div className="max-h-96 overflow-y-auto pr-2">
              {loan.payments.length > 0 ? (
                <ul className="space-y-3">
                  {[...loan.payments].reverse().map(payment => (
                    <li key={payment.id} className="flex justify-between items-center bg-gray-700/50 p-3 rounded-lg">
                      <div>
                        <span className="font-medium text-gray-300">{formatDate(payment.date)}</span>
                        {payment.amount < 0 && 
                          <span className="ml-2 text-xs font-medium bg-red-600/30 text-red-300 px-2 py-0.5 rounded-full align-middle">
                            Redraw
                          </span>
                        }
                      </div>
                      <span className={`font-semibold ${payment.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatCurrency(payment.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-400 py-8">No payments made yet.</p>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
           <AddPaymentForm onAddPayment={(amount, date) => onAddPayment(loan.id, amount, date)} />
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;
