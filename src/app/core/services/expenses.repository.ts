import { Injectable, inject } from '@angular/core';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { Expense, CreateExpenseData } from '../models/expense.model';
import { RepositoryReadResult } from '../models/repository-read.model';
import { removeUndefinedFields } from '../utils/firestore-map.utils';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class ExpensesRepository {
  private readonly userService = inject(UserService);

  private basePath(tripId: string): string {
    return `users/${this.userService.getUserId()}/trips/${tripId}/expenses`;
  }

  async getExpenses(tripId: string): Promise<Expense[]> {
    const { snapshots } = await FirebaseFirestore.getCollection({
      reference: this.basePath(tripId),
      queryConstraints: [
        { type: 'orderBy', fieldPath: 'date', directionStr: 'desc' }
      ]
    });
    return snapshots.map((snap) => ({ id: snap.id, ...snap.data } as Expense));
  }

  async getExpenseById(
    tripId: string,
    expenseId: string
  ): Promise<Expense | null> {
    const result = await this.getExpenseByIdResult(tripId, expenseId);
    return result.data;
  }

  async getExpenseByIdResult(
    tripId: string,
    expenseId: string
  ): Promise<RepositoryReadResult<Expense>> {
    try {
      const { snapshot } = await FirebaseFirestore.getDocument({
        reference: `${this.basePath(tripId)}/${expenseId}`
      });
      if (!snapshot.data) {
        return { status: 'not-found', data: null };
      }
      return {
        status: 'ok',
        data: { id: snapshot.id, ...snapshot.data } as Expense
      };
    } catch (error) {
      return { status: 'error', data: null, error };
    }
  }

  async createExpense(data: CreateExpenseData): Promise<string> {
    const now = Date.now();
    const expenseData = removeUndefinedFields({
      ...data,
      createdAt: now,
      updatedAt: now
    });
    const { reference } = await FirebaseFirestore.addDocument({
      reference: this.basePath(data.tripId),
      data: expenseData as Record<string, unknown>
    });
    return reference.id;
  }

  async updateExpense(
    tripId: string,
    expenseId: string,
    data: Partial<Expense>
  ): Promise<void> {
    const updateData = removeUndefinedFields({
      ...data,
      updatedAt: Date.now()
    } as Record<string, unknown>);

    await FirebaseFirestore.updateDocument({
      reference: `${this.basePath(tripId)}/${expenseId}`,
      data: updateData
    });
  }

  async deleteExpense(tripId: string, expenseId: string): Promise<void> {
    await FirebaseFirestore.deleteDocument({
      reference: `${this.basePath(tripId)}/${expenseId}`
    });
  }
}
