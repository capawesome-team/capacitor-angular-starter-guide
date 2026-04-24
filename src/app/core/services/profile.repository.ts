import { Injectable, inject } from '@angular/core';
import { FirebaseFirestore } from '@capacitor-firebase/firestore';
import { UserProfile } from '../models/profile.model';
import { removeUndefinedFields } from '../utils/firestore-map.utils';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class ProfileRepository {
  private readonly userService = inject(UserService);

  private get docPath(): string {
    return `users/${this.userService.getUserId()}`;
  }

  async getProfile(): Promise<UserProfile | null> {
    try {
      const { snapshot } = await FirebaseFirestore.getDocument({
        reference: this.docPath
      });
      if (!snapshot.data) return null;
      return { id: snapshot.id, ...snapshot.data } as UserProfile;
    } catch {
      return null;
    }
  }

  async saveProfile(profile: Partial<UserProfile>): Promise<void> {
    const now = Date.now();
    try {
      await FirebaseFirestore.getDocument({ reference: this.docPath });
      await FirebaseFirestore.updateDocument({
        reference: this.docPath,
        data: removeUndefinedFields({ ...profile, updatedAt: now } as Record<
          string,
          unknown
        >)
      });
    } catch {
      await FirebaseFirestore.setDocument({
        reference: this.docPath,
        data: removeUndefinedFields({
          displayName: 'Traveler',
          email: '',
          defaultCurrency: 'USD',
          ...profile,
          createdAt: now,
          updatedAt: now
        } as Record<string, unknown>)
      });
    }
  }
}
