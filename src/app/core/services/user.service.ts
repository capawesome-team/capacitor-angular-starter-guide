import { Injectable, signal } from '@angular/core';

const MOCK_USER_ID = 'local-user';

@Injectable({ providedIn: 'root' })
export class UserService {
  /** Current user ID. Will be replaced with real auth when added. */
  readonly userId = signal(MOCK_USER_ID);

  getUserId(): string {
    return this.userId();
  }
}
