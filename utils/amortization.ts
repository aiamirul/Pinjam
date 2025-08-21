import { Loan } from '../types';
import { AmortizationDataPoint } from '../types';

export const generateChartData = (loan: Loan): AmortizationDataPoint[] => {
  if (loan.payments.length === 0) return [{
    date: loan.startDate,
    principalPaid: 0,
    interestPaid: 0,
    totalPaid: 0,
  }];

  const sortedPayments = [...loan.payments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  let balance = loan.principal;
  let cumulativeInterestPaid = 0;
  let cumulativePrincipalPaid = 0;
  let lastDate = new Date(loan.startDate + 'T00:00:00');
  
  const dailyRate = loan.interestRate / 100 / 365.25;

  const data: AmortizationDataPoint[] = [{
    date: loan.startDate,
    principalPaid: 0,
    interestPaid: 0,
    totalPaid: 0,
  }];

  for (const payment of sortedPayments) {
    const paymentDate = new Date(payment.date + 'T00:00:00');
    if (paymentDate < lastDate) continue;

    const timeDiff = paymentDate.getTime() - lastDate.getTime();
    const days = Math.max(0, timeDiff / (1000 * 3600 * 24));
    
    const interestAccrued = (balance > 0) ? (balance * dailyRate * days) : 0;
    
    let interestPaidOnThisTx = 0;
    let principalPaidOnThisTx = 0;

    if (payment.amount >= 0) { // Payment
      interestPaidOnThisTx = Math.min(payment.amount, interestAccrued);
      principalPaidOnThisTx = payment.amount - interestPaidOnThisTx;
    } else { // Redraw
      principalPaidOnThisTx = payment.amount; // Negative value
    }

    balance += interestAccrued;
    balance -= payment.amount;

    cumulativeInterestPaid += interestPaidOnThisTx;
    cumulativePrincipalPaid += principalPaidOnThisTx;
    
    data.push({
      date: payment.date,
      principalPaid: cumulativePrincipalPaid,
      interestPaid: cumulativeInterestPaid,
      totalPaid: cumulativePrincipalPaid + cumulativeInterestPaid,
    });

    lastDate = paymentDate;
  }

  return data;
};
