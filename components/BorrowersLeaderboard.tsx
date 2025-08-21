import React, { useMemo } from 'react';
import { Loan } from '../types';
import { UsersIcon, InfoIcon, AnalyticsIcon } from './icons';

interface BorrowerLeaderboardProps {
  loans: Loan[];
}

const BorrowersLeaderboard: React.FC<BorrowerLeaderboardProps> = ({ loans }) => {
  const borrowerData = useMemo(() => {
    const borrowers: { [name: string]: number } = {};
    
    loans.forEach(loan => {
      if (loan.borrowerName) {
        if (borrowers[loan.borrowerName]) {
          borrowers[loan.borrowerName]++;
        } else {
          borrowers[loan.borrowerName] = 1;
        }
      }
    });

    return Object.entries(borrowers)
      .map(([name, loanCount]) => ({ name, loanCount }))
      .sort((a, b) => b.loanCount - a.loanCount);
      
  }, [loans]);

  if (borrowerData.length === 0) {
    return null; // Don't render anything if there are no borrowers
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-gray-200 flex items-center gap-3">
        <UsersIcon className="w-6 h-6 text-blue-400" />
        Borrowers Leaderboard
      </h2>
      {borrowerData.length > 0 ? (
        <>
          <ol className="space-y-3 list-decimal list-inside">
            {borrowerData.map((borrower, index) => (
              <li key={borrower.name} className="flex items-center text-gray-300">
                  <span className="text-gray-400 font-semibold mr-3 w-5 text-right">{index + 1}.</span>
                  <a 
                      href={`#/borrower/${encodeURIComponent(borrower.name)}`}
                      className="flex-grow font-medium text-gray-200 hover:text-blue-400 hover:underline truncate"
                      title={borrower.name}
                  >
                      {borrower.name}
                  </a>
                  <span className="ml-auto pl-2 text-sm font-mono bg-gray-700/80 text-gray-400 rounded px-2 py-0.5">
                      {borrower.loanCount} {borrower.loanCount > 1 ? 'loans' : 'loan'}
                  </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-gray-700 my-4"></div>
          <a
            href="#/analytics"
            className="w-full flex justify-center items-center gap-2 py-2.5 px-5 text-sm font-medium text-white bg-blue-600/20 rounded-lg hover:bg-blue-600/40 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-colors duration-200 border border-blue-500/50"
          >
            <AnalyticsIcon className="w-5 h-5" />
            View All Loans & Stats
          </a>
        </>
      ) : (
        <div className="text-center py-4">
            <InfoIcon className="mx-auto h-8 w-8 text-gray-500" />
            <p className="mt-2 text-sm text-gray-400">No borrowers found.</p>
        </div>
      )}
    </div>
  );
};

export default BorrowersLeaderboard;