import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private initialized = false;

  initialize(): void {
    if (this.initialized) {
      return;
    }
    initializeApp(environment.firebase);
    this.initialized = true;
  }
}
