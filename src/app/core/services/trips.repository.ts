import { Injectable, inject } from '@angular/core';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { Trip, CreateTripData } from '../models/trip.model';
import { RepositoryReadResult } from '../models/repository-read.model';
import { removeUndefinedFields } from '../utils/firestore-map.utils';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class TripsRepository {
  private readonly userService = inject(UserService);

  private get basePath(): string {
    return `users/${this.userService.getUserId()}/trips`;
  }

  async getTrips(): Promise<Trip[]> {
    const { snapshots } = await FirebaseFirestore.getCollection({
      reference: this.basePath,
      queryConstraints: [
        { type: 'orderBy', fieldPath: 'createdAt', directionStr: 'desc' }
      ]
    });
    return snapshots.map((snap) => ({ id: snap.id, ...snap.data } as Trip));
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    const result = await this.getTripByIdResult(tripId);
    return result.data;
  }

  async getTripByIdResult(tripId: string): Promise<RepositoryReadResult<Trip>> {
    try {
      const { snapshot } = await FirebaseFirestore.getDocument({
        reference: `${this.basePath}/${tripId}`
      });
      if (!snapshot.data) {
        return { status: 'not-found', data: null };
      }
      return {
        status: 'ok',
        data: { id: snapshot.id, ...snapshot.data } as Trip
      };
    } catch (error) {
      return { status: 'error', data: null, error };
    }
  }

  async createTrip(data: CreateTripData): Promise<string> {
    const now = Date.now();
    const tripData = removeUndefinedFields({
      ...data,
      totalSpent: 0,
      createdAt: now,
      updatedAt: now
    });
    const { reference } = await FirebaseFirestore.addDocument({
      reference: this.basePath,
      data: tripData as Record<string, unknown>
    });
    const id = reference.id;
    return id;
  }

  async updateTrip(tripId: string, data: Partial<Trip>): Promise<void> {
    const updateData = removeUndefinedFields({
      ...data,
      updatedAt: Date.now()
    } as Record<string, unknown>);

    await FirebaseFirestore.updateDocument({
      reference: `${this.basePath}/${tripId}`,
      data: updateData
    });
  }

  async deleteTrip(tripId: string): Promise<void> {
    await FirebaseFirestore.deleteDocument({
      reference: `${this.basePath}/${tripId}`
    });
  }

  async recalculateTotalSpent(tripId: string): Promise<number> {
    const { snapshots } = await FirebaseFirestore.getCollection({
      reference: `${this.basePath}/${tripId}/expenses`
    });
    const total = snapshots.reduce((sum, snap) => {
      const amount = (snap.data as Record<string, unknown>)['amount'];
      return sum + (typeof amount === 'number' ? amount : 0);
    }, 0);
    await this.updateTrip(tripId, { totalSpent: total });
    return total;
  }
}
