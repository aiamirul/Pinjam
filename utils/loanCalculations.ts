import { Loan } from '../types';

export interface LoanMetrics {
    remainingBalance: number;
    totalInterestAccrued: number;
    totalToBeRepaid: number;
    totalPaid: number;
    progress: number;
}

/**
 * Calculates the current state of a loan by applying simple daily interest on the outstanding balance.
 * It processes transactions chronologically to update the balance.
 * @param loan The loan object.
 * @param asOfDate The date to calculate the state for (defaults to now).
 * @returns An object with detailed loan metrics.
 */
export const calculateLoanMetrics = (loan: Loan, asOfDate: Date = new Date()): LoanMetrics => {
    const dailyRate = loan.interestRate / 100 / 365.25;

    const allTransactions = [
      { date: loan.startDate, amount: loan.principal, isPrincipal: true },
      ...loan.payments.map(p => ({...p, isPrincipal: false}))
    ].sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateA !== dateB) {
            return dateA - dateB;
        }
        // If dates are same, principal disbursement comes first
        return a.isPrincipal ? -1 : (b.isPrincipal ? 1 : 0);
    });

    let balance = 0;
    let totalInterestAccrued = 0;
    let lastDate = new Date(loan.startDate + 'T00:00:00');
    
    // Ensure asOfDate has no time component to match transaction dates
    const asOfDateOnly = new Date(asOfDate);
    asOfDateOnly.setHours(0,0,0,0);


    for (const transaction of allTransactions) {
        const transactionDate = new Date(transaction.date + 'T00:00:00');
        
        if (transactionDate > asOfDateOnly) break;

        const days = (transactionDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);

        if (days > 0 && balance > 0) {
            const interest = balance * dailyRate * days;
            balance += interest;
            totalInterestAccrued += interest;
        }

        if (transaction.isPrincipal) {
            balance += transaction.amount;
        } else {
            balance -= transaction.amount; // payments reduce, redraws (negative) increase
        }

        lastDate = transactionDate;
    }

    const daysSinceLast = (asOfDateOnly.getTime() - lastDate.getTime()) / (1000 * 3600 * 24);
    if (daysSinceLast > 0 && balance > 0) {
        const interest = balance * dailyRate * daysSinceLast;
        balance += interest;
        totalInterestAccrued += interest;
    }

    const totalPaid = loan.payments.reduce((sum, p) => p.amount > 0 ? sum + p.amount : sum, 0);
    const totalRedrawn = loan.payments.reduce((sum, p) => p.amount < 0 ? sum - p.amount : sum, 0);
    const totalPrincipalAmount = loan.principal + totalRedrawn;
    const totalToBeRepaid = totalPrincipalAmount + totalInterestAccrued;
    
    const progress = totalToBeRepaid > 0 ? (totalPaid / totalToBeRepaid) * 100 : (balance <= 0 ? 100 : 0);

    return {
        remainingBalance: Math.max(0, balance),
        totalInterestAccrued: Math.max(0, totalInterestAccrued),
        totalToBeRepaid: Math.max(loan.principal, totalToBeRepaid),
        totalPaid,
        progress,
    };
};
