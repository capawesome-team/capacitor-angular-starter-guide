import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const TABS_ROUTES: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'trips',
        loadComponent: () =>
          import('../features/trips/trips.page').then((m) => m.TripsPage)
      },
      {
        path: 'trips/new',
        loadComponent: () =>
          import('../features/trips/trip-form/trip-form.page').then(
            (m) => m.TripFormPage
          )
      },
      {
        path: 'trips/:tripId',
        loadComponent: () =>
          import('../features/trips/trip-detail/trip-detail.page').then(
            (m) => m.TripDetailPage
          )
      },
      {
        path: 'trips/:tripId/edit',
        loadComponent: () =>
          import('../features/trips/trip-form/trip-form.page').then(
            (m) => m.TripFormPage
          )
      },
      {
        path: 'trips/:tripId/expenses/new',
        loadComponent: () =>
          import('../features/expenses/expense-form/expense-form.page').then(
            (m) => m.ExpenseFormPage
          )
      },
      {
        path: 'trips/:tripId/expenses/:expenseId',
        loadComponent: () =>
          import(
            '../features/expenses/expense-detail/expense-detail.page'
          ).then((m) => m.ExpenseDetailPage)
      },
      {
        path: 'trips/:tripId/expenses/:expenseId/edit',
        loadComponent: () =>
          import('../features/expenses/expense-form/expense-form.page').then(
            (m) => m.ExpenseFormPage
          )
      },
      {
        path: 'add',
        loadComponent: () =>
          import('../features/expenses/expense-form/expense-form.page').then(
            (m) => m.ExpenseFormPage
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../features/profile/profile.page').then((m) => m.ProfilePage)
      },
      {
        path: '',
        redirectTo: 'trips',
        pathMatch: 'full'
      }
    ]
  }
];
