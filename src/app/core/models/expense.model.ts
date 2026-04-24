export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  category: string;
  date: string; // ISO date string
  notes?: string;
  attachment?: ExpenseAttachment;
  createdAt: number;
  updatedAt: number;
}

export interface ExpenseAttachment {
  fileName: string;
  storagePath: string;
  downloadUrl?: string;
  mimeType: string;
  size?: number;
}

export type CreateExpenseData = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;
