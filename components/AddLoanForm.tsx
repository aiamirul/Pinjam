import React, { useState } from 'react';
import { PlusIcon } from './icons';

interface AddLoanFormProps {
  onAddLoan: (name: string, principal: number, interestRate: number, startDate: string, lenderName: string, borrowerName: string) => void;
}

const AddLoanForm: React.FC<AddLoanFormProps> = ({ onAddLoan }) => {
  const [name, setName] = useState('');
  const [lenderName, setLenderName] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !principal || !interestRate || !startDate) {
      setError('Loan name, principal, interest, and start date are required.');
      return;
    }
    const principalNum = parseFloat(principal);
    const interestRateNum = parseFloat(interestRate);

    if (isNaN(principalNum) || isNaN(interestRateNum) || principalNum <= 0 || interestRateNum < 0) {
      setError('Please enter valid positive numbers for amount and interest rate.');
      return;
    }

    onAddLoan(name, principalNum, interestRateNum, startDate, lenderName, borrowerName);
    setName('');
    setLenderName('');
    setBorrowerName('');
    setPrincipal('');
    setInterestRate('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setError('');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700 sticky top-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-200">Add New Loan</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-400">Loan Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Car Loan"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lenderName" className="block text-sm font-medium text-gray-400">Lender Name <span className="text-gray-500">(Optional)</span></label>
              <input
                type="text"
                id="lenderName"
                value={lenderName}
                onChange={(e) => setLenderName(e.target.value)}
                placeholder="e.g., Bank of America"
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
              />
            </div>
            <div>
              <label htmlFor="borrowerName" className="block text-sm font-medium text-gray-400">Borrower Name <span className="text-gray-500">(Optional)</span></label>
              <input
                type="text"
                id="borrowerName"
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="e.g., John Doe"
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
              />
            </div>
        </div>
        <div>
          <label htmlFor="principal" className="block text-sm font-medium text-gray-400">Principal Amount ($)</label>
          <input
            type="number"
            id="principal"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="e.g., 20000"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-400">Annual Interest (%)</label>
              <input
                type="number"
                id="interestRate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g., 5.5"
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-400">Start Date</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
              />
            </div>
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2.5 px-5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          Add Loan
        </button>
      </form>
    </div>
  );
};

export default AddLoanForm;