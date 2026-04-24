import { format, parseISO } from 'date-fns';
import { Trip } from '../../core/models/trip.model';

export const getTripBudgetProgress = (trip: Trip | null): number => {
  if (!trip?.budget || trip.budget <= 0) return 0;
  return Math.min(trip.totalSpent / trip.budget, 1);
};

export const getTripBudgetColor = (
  trip: Trip | null
): 'danger' | 'warning' | 'success' => {
  const progress = getTripBudgetProgress(trip);
  if (progress >= 0.9) return 'danger';
  if (progress >= 0.7) return 'warning';
  return 'success';
};

export const getTripRemainingBudget = (trip: Trip | null): number | null => {
  if (!trip?.budget || trip.budget <= 0) return null;
  return trip.budget - trip.totalSpent;
};

export const formatTripDateRange = (trip: Trip | null): string => {
  if (!trip) return '';
  const start = trip.startDate ? parseISO(trip.startDate) : null;
  const end = trip.endDate ? parseISO(trip.endDate) : null;
  if (!start || !end) return '';
  const startStr = format(start, 'MMM d');
  const endStr = format(end, 'MMM d, yyyy');
  return `${startStr} – ${endStr}`;
};
