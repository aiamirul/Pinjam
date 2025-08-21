import React, { useState, useEffect, useMemo } from 'react';
import { Loan, Payment } from './types';
import Header from './components/Header';
import LoanList from './components/LoanList';
import AddLoanForm from './components/AddLoanForm';
import LoanDetail from './components/LoanDetail';
import { parseLoanCSV } from './utils/csv';
import { sha256 } from './utils/crypto';
import BorrowerProfile from './components/BorrowerProfile';
import BorrowersLeaderboard from './components/BorrowersLeaderboard';
import AnalyticsPage from './components/AnalyticsPage';

const getLoanIdFromHash = (hash: string) => {
  const match = hash.match(/^#\/loan\/(.+)$/);
  return match ? match[1] : null;
};

const getBorrowerNameFromHash = (hash: string) => {
  const match = hash.match(/^#\/borrower\/(.+)$/);
  return match ? decodeURIComponent(match[1]) : null;
};

const getShowAnalyticsFromHash = (hash: string) => {
  return hash === '#/analytics';
};


const App: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>(() => {
    try {
      const savedLoans = localStorage.getItem('loans');
      return savedLoans ? JSON.parse(savedLoans) : [];
    } catch (error) {
      console.error("Could not parse loans from localStorage", error);
      return [];
    }
  });
  
  const [hash, setHash] = useState(() => window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  useEffect(() => {
    try {
      localStorage.setItem('loans', JSON.stringify(loans));
    } catch (error) {
      console.error("Could not save loans to localStorage", error);
    }
  }, [loans]);

  const selectedLoanId = getLoanIdFromHash(hash);
  const borrowerName = getBorrowerNameFromHash(hash);
  const showAnalytics = getShowAnalyticsFromHash(hash);

  const selectedLoan = useMemo(() => loans.find(loan => loan.id === selectedLoanId) || null, [loans, selectedLoanId]);
  const borrowerLoans = useMemo(() => borrowerName ? loans.filter(loan => loan.borrowerName === borrowerName) : [], [loans, borrowerName]);
  
  useEffect(() => {
    if (selectedLoanId && !selectedLoan) {
      // If loan ID in URL is not valid (e.g., deleted), redirect to home
      window.location.hash = '#';
    }
     if (borrowerName && borrowerLoans.length === 0) {
      // If borrower name in URL is not valid, redirect to home
      window.location.hash = '#';
    }
  }, [selectedLoanId, selectedLoan, borrowerName, borrowerLoans, loans]);


  const handleAddLoan = async (name: string, principal: number, interestRate: number, startDate: string, lenderName: string, borrowerName: string) => {
    const salt = `${lenderName}-${borrowerName}-${principal}`;
    const hash = await sha256(salt);

    const newLoan: Loan = {
      id: crypto.randomUUID(),
      hash,
      name,
      principal,
      interestRate,
      payments: [],
      startDate,
      lenderName: lenderName || undefined,
      borrowerName: borrowerName || undefined,
    };
    const newLoans = [...loans, newLoan];
    setLoans(newLoans);
  };
  
  const handleAddPayment = (loanId: string, amount: number, date: string) => {
    const newPayment: Payment = {
      id: crypto.randomUUID(),
      amount,
      date,
    };
    
    const updatedLoans = loans.map(loan => {
      if (loan.id === loanId) {
        return { ...loan, payments: [...loan.payments, newPayment] };
      }
      return loan;
    });
    setLoans(updatedLoans);
  };

  const handleSelectLoan = (loan: Loan) => {
    window.location.hash = `#/loan/${loan.id}`;
  };

  const handleBackToList = () => {
    window.location.hash = '#';
  };
  
  const handleDeleteLoan = (loanId: string) => {
    const updatedLoans = loans.filter(loan => loan.id !== loanId);
    setLoans(updatedLoans);
    window.location.hash = '#';
  };
  
  const handleImportLoan = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        alert('Error: Could not read file content.');
        return;
      }
      try {
        const parsedLoanData = parseLoanCSV(text);

        const hash = parsedLoanData.hash || await sha256(`${parsedLoanData.lenderName || ''}-${parsedLoanData.borrowerName || ''}-${parsedLoanData.principal}`);

        const newLoan: Loan = {
          ...parsedLoanData,
          id: crypto.randomUUID(),
          hash,
        };

        setLoans(prevLoans => [...prevLoans, newLoan]);
      } catch (error) {
        if (error instanceof Error) {
            alert(`Error importing loan: ${error.message}`);
        } else {
            alert('An unknown error occurred during import.');
        }
      }
    };
    reader.onerror = () => {
        alert('Error reading the file.');
    };
    reader.readAsText(file);
  };
  
  const renderContent = () => {
    if (showAnalytics) {
      return (
        <AnalyticsPage
          loans={loans}
          onBack={handleBackToList}
          onSelectLoan={handleSelectLoan}
        />
      );
    }

    if (borrowerName && borrowerLoans.length > 0) {
      return (
        <BorrowerProfile
          borrowerName={borrowerName}
          loans={borrowerLoans}
          onSelectLoan={handleSelectLoan}
          onBack={handleBackToList}
        />
      );
    }

    if (selectedLoan) {
      return (
        <LoanDetail 
          loan={selectedLoan} 
          onAddPayment={handleAddPayment} 
          onBack={handleBackToList}
          onDeleteLoan={handleDeleteLoan}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <LoanList loans={loans} onSelectLoan={handleSelectLoan} onImport={handleImportLoan} />
        </div>
        <div className="space-y-8">
          <AddLoanForm onAddLoan={handleAddLoan} />
          <BorrowersLeaderboard loans={loans} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <div className="bg-gradient-to-b from-gray-900 to-slate-800">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;