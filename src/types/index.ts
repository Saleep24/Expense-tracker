export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export type Transaction = {
  id: string;
  amount: number;
  category: Category;
  date: Date;
  description: string;
  type: 'expense' | 'income';
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    endDate?: Date;
  };
};

export type Budget = {
  id: string;
  category: Category;
  amount: number;
  period: 'monthly' | 'yearly';
  spent: number;
};

export type FinancialGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  category: Category;
};

export type User = {
  id: string;
  name: string;
  email: string;
  currency: string;
  monthlyIncome: number;
  budgets: Budget[];
  goals: FinancialGoal[];
};

export type DateRange = {
  startDate: Date;
  endDate: Date;
};

export type ThemeMode = 'light' | 'dark'; 