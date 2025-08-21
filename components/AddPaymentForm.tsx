
import React, { useState } from 'react';
import { CreditCardIcon } from './icons';

interface AddPaymentFormProps {
  onAddPayment: (amount: number, date: string) => void;
}

const AddPaymentForm: React.FC<AddPaymentFormProps> = ({ onAddPayment }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date) {
      setError('Amount and date are required.');
      return;
    }
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum === 0) {
      setError('Please enter a valid, non-zero amount.');
      return;
    }
    onAddPayment(amountNum, date);
    setAmount('');
    setError('');
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-gray-700 sticky top-8">
      <h3 className="text-xl font-bold mb-4 text-gray-200">Add Transaction</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-400">Amount ($)</label>
          <p className="text-xs text-gray-500 mt-1">Enter a negative value for a loan redraw.</p>
          <input
            type="number"
            id="payment-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500 or -200"
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="payment-date" className="block text-sm font-medium text-gray-400">Date</label>
          <input
            type="date"
            id="payment-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 text-white"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2.5 px-5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-800 transition-colors duration-200"
        >
          <CreditCardIcon className="w-5 h-5"/>
          Record Transaction
        </button>
      </form>
    </div>
  );
};

export default AddPaymentForm;