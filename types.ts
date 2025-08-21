export interface Payment {
  id: string;
  amount: number;
  date: string;
}

export interface Loan {
  id: string;
  hash: string;
  name: string;
  principal: number;
  interestRate: number;
  payments: Payment[];
  startDate: string;
  lenderName?: string;
  borrowerName?: string;
}

export interface AmortizationDataPoint {
  date: string;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
}