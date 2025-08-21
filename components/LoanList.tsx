import React, { useRef, useState } from 'react';
import { Loan } from '../types';
import LoanCard from './LoanCard';
import { InfoIcon, UploadIcon, SearchIcon } from './icons';

interface LoanListProps {
  loans: Loan[];
  onSelectLoan: (loan: Loan) => void;
  onImport: (file: File) => void;
}

const LoanList: React.FC<LoanListProps> = ({ loans, onSelectLoan, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset file input value to allow importing the same file again
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const filteredLoans = loans.filter(loan => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      loan.name.toLowerCase().includes(query) ||
      (loan.borrowerName && loan.borrowerName.toLowerCase().includes(query)) ||
      (loan.lenderName && loan.lenderName.toLowerCase().includes(query))
    );
  });
  
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-200">My Loans</h2>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={handleImportClick}
            className="flex items-center gap-2 py-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-800 transition-colors duration-200"
          >
            <UploadIcon className="w-5 h-5" />
            Import Loan
          </button>
        </div>
      </div>

      {loans.length > 0 && (
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            name="search"
            id="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full bg-gray-700/80 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 pl-10 text-white"
            placeholder="Search by loan, borrower, or lender..."
          />
        </div>
      )}

      {loans.length === 0 ? (
        <div className="text-center py-10 px-6 bg-gray-800 rounded-lg border-2 border-dashed border-gray-700">
          <InfoIcon className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-300">No loans yet</h3>
          <p className="mt-1 text-sm text-gray-400">Get started by adding a new loan or importing one.</p>
        </div>
      ) : filteredLoans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLoans.map(loan => (
            <LoanCard key={loan.id} loan={loan} onSelectLoan={onSelectLoan} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10 px-6 bg-gray-800 rounded-lg">
          <SearchIcon className="mx-auto h-12 w-12 text-gray-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-300">No Matching Loans</h3>
          <p className="mt-1 text-sm text-gray-400">Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default LoanList;