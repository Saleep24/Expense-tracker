import dayjs from 'dayjs';
import type { Transaction, Budget, DateRange } from '../types';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const calculateTotalExpenses = (
  transactions: Transaction[],
  dateRange?: DateRange
): number => {
  return transactions
    .filter((t) => {
      if (!dateRange) return t.type === 'expense';
      const transactionDate = dayjs(t.date);
      return (
        t.type === 'expense' &&
        transactionDate.isAfter(dateRange.startDate) &&
        transactionDate.isBefore(dateRange.endDate)
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateTotalIncome = (
  transactions: Transaction[],
  dateRange?: DateRange
): number => {
  return transactions
    .filter((t) => {
      if (!dateRange) return t.type === 'income';
      const transactionDate = dayjs(t.date);
      return (
        t.type === 'income' &&
        transactionDate.isAfter(dateRange.startDate) &&
        transactionDate.isBefore(dateRange.endDate)
      );
    })
    .reduce((sum, t) => sum + t.amount, 0);
};

export const calculateBudgetProgress = (
  budget: Budget,
  transactions: Transaction[]
): number => {
  const spent = transactions
    .filter(
      (t) =>
        t.type === 'expense' &&
        t.category.id === budget.category.id &&
        dayjs(t.date).isAfter(dayjs().startOf(budget.period === 'monthly' ? 'month' : 'year'))
    )
    .reduce((sum, t) => sum + t.amount, 0);

  return (spent / budget.amount) * 100;
};

export const groupTransactionsByCategory = (
  transactions: Transaction[]
): Record<string, number> => {
  return transactions.reduce((acc, transaction) => {
    const categoryId = transaction.category.id;
    acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const generateDateRanges = () => {
  const today = dayjs();
  
  return {
    thisMonth: {
      startDate: today.startOf('month').toDate(),
      endDate: today.endOf('month').toDate(),
    },
    lastMonth: {
      startDate: today.subtract(1, 'month').startOf('month').toDate(),
      endDate: today.subtract(1, 'month').endOf('month').toDate(),
    },
    thisYear: {
      startDate: today.startOf('year').toDate(),
      endDate: today.endOf('year').toDate(),
    },
    last3Months: {
      startDate: today.subtract(3, 'month').startOf('day').toDate(),
      endDate: today.toDate(),
    },
  };
};

export const calculateSavingsRate = (
  income: number,
  expenses: number
): number => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
}; 