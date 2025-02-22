import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { 
  User, 
  Transaction, 
  Budget, 
  FinancialGoal, 
  ThemeMode,
  DateRange 
} from '../types';

interface Store {
  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;

  // Budgets
  budgets: Budget[];
  addBudget: (budget: Budget) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  removeBudget: (id: string) => void;

  // Financial Goals
  goals: FinancialGoal[];
  addGoal: (goal: FinancialGoal) => void;
  updateGoal: (id: string, goal: Partial<FinancialGoal>) => void;
  removeGoal: (id: string) => void;

  // UI State
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}

const useStore = create<Store>()(
  persist(
    (set) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Transactions
      transactions: [],
      addTransaction: (transaction) =>
        set((state) => ({ transactions: [...state.transactions, transaction] })),
      removeTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
      updateTransaction: (id, transaction) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...transaction } : t
          ),
        })),

      // Budgets
      budgets: [],
      addBudget: (budget) =>
        set((state) => ({ budgets: [...state.budgets, budget] })),
      updateBudget: (id, budget) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...budget } : b
          ),
        })),
      removeBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),

      // Financial Goals
      goals: [],
      addGoal: (goal) =>
        set((state) => ({ goals: [...state.goals, goal] })),
      updateGoal: (id, goal) =>
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...goal } : g
          ),
        })),
      removeGoal: (id) =>
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id),
        })),

      // UI State
      themeMode: 'light',
      setThemeMode: (mode) => set({ themeMode: mode }),
      dateRange: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      },
      setDateRange: (range) => set({ dateRange: range }),
    }),
    {
      name: 'expense-tracker-storage',
    }
  )
);

export default useStore; 