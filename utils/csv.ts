import { Loan } from '../types';
import { calculateLoanMetrics } from './loanCalculations';

export const generateLoanCSV = (loan: Loan): string => {
  const headers = [
    `Loan Name: ${loan.name}`,
    `Loan Hash: ${loan.hash}`,
    `Lender: ${loan.lenderName || ''}`,
    `Borrower: ${loan.borrowerName || ''}`,
    `Annual Interest Rate (%): ${loan.interestRate}`,
    '', // blank line
    'Date,Description,Amount'
  ];

  const transactions = [];
  // Initial loan amount
  transactions.push([
    loan.startDate,
    'Initial Loan',
    loan.principal.toFixed(2)
  ].join(','));

  // Payments and redraws
  loan.payments.forEach(p => {
    transactions.push([
      p.date,
      p.amount < 0 ? 'Redraw' : 'Payment',
      p.amount.toFixed(2) // This will keep the negative sign for redraws
    ].join(','));
  });
  
  const { remainingBalance, totalInterestAccrued } = calculateLoanMetrics(loan);
  const netPayments = loan.payments.reduce((sum, p) => sum + p.amount, 0);

  const summary = [
    '', // blank line
    'Summary (as of today)',
    `Principal: ${loan.principal.toFixed(2)}`,
    `Total Interest Accrued: ${totalInterestAccrued.toFixed(2)}`,
    `Total Paid / Redrawn (Net): ${netPayments.toFixed(2)}`,
    `Remaining Balance: ${remainingBalance.toFixed(2)}`
  ];

  return [
    ...headers,
    ...transactions,
    ...summary
  ].join('\n');
};

export const parseLoanCSV = (csvString: string): Omit<Loan, 'id'> => {
  const lines = csvString.split('\n').map(l => l.trim());
  
  const loanData: Partial<Omit<Loan, 'id'>> = {
    payments: []
  };

  let inTransactions = false;

  for (const line of lines) {
    if (!line) continue;

    if (line.startsWith('Loan Name:')) {
      loanData.name = line.substring('Loan Name:'.length).trim();
    } else if (line.startsWith('Loan Hash:')) {
      loanData.hash = line.substring('Loan Hash:'.length).trim();
    } else if (line.startsWith('Lender:')) {
      loanData.lenderName = line.substring('Lender:'.length).trim() || undefined;
    } else if (line.startsWith('Borrower:')) {
      loanData.borrowerName = line.substring('Borrower:'.length).trim() || undefined;
    } else if (line.startsWith('Annual Interest Rate (%):')) {
      const rateStr = line.substring('Annual Interest Rate (%):'.length).trim();
      loanData.interestRate = parseFloat(rateStr);
    } else if (line.toLowerCase() === 'date,description,amount') {
      inTransactions = true;
    } else if (line.toLowerCase() === 'summary') {
      inTransactions = false;
    } else if (inTransactions) {
      const parts = line.split(',');
      if (parts.length !== 3) continue;

      const [date, description, amountStr] = parts;
      const amount = parseFloat(amountStr);
      
      if (isNaN(amount)) continue;

      if (description.toLowerCase() === 'initial loan') {
        loanData.principal = amount;
        loanData.startDate = date;
      } else {
        loanData.payments!.push({
          id: crypto.randomUUID(),
          date,
          amount,
        });
      }
    }
  }

  if (!loanData.name || loanData.principal === undefined || loanData.interestRate === undefined || !loanData.startDate) {
    throw new Error('Invalid or incomplete CSV file. Could not find required loan details (Name, Principal, Interest Rate, Start Date).');
  }
  
  loanData.payments!.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return loanData as Omit<Loan, 'id'>;
};
