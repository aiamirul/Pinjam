
import React from 'react';
import { PiggyBankIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center space-x-4">
        <PiggyBankIcon className="h-10 w-10 text-blue-400" />
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Loan Tracker
        </h1>
      </div>
    </header>
  );
};

export default Header;
