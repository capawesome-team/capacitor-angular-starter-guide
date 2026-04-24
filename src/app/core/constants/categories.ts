export interface ExpenseCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  {
    id: 'food',
    label: 'Food & Drinks',
    icon: 'restaurant-outline',
    color: '#FF6B6B'
  },
  {
    id: 'transport',
    label: 'Transport',
    icon: 'car-outline',
    color: '#4ECDC4'
  },
  {
    id: 'accommodation',
    label: 'Accommodation',
    icon: 'bed-outline',
    color: '#45B7D1'
  },
  {
    id: 'activities',
    label: 'Activities',
    icon: 'ticket-outline',
    color: '#96CEB4'
  },
  { id: 'shopping', label: 'Shopping', icon: 'bag-outline', color: '#FFEAA7' },
  {
    id: 'flights',
    label: 'Flights',
    icon: 'airplane-outline',
    color: '#DDA0DD'
  },
  { id: 'health', label: 'Health', icon: 'medkit-outline', color: '#FF8A80' },
  {
    id: 'communication',
    label: 'Communication',
    icon: 'call-outline',
    color: '#80CBC4'
  },
  {
    id: 'entertainment',
    label: 'Entertainment',
    icon: 'game-controller-outline',
    color: '#CE93D8'
  },
  {
    id: 'other',
    label: 'Other',
    icon: 'ellipsis-horizontal-outline',
    color: '#B0BEC5'
  }
];

export function getCategoryById(id: string): ExpenseCategory {
  return (
    EXPENSE_CATEGORIES.find((c) => c.id === id) ??
    EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1]
  );
}
