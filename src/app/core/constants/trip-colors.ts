export const TRIP_COLORS: string[] = [
  '#4A90D9',
  '#50C878',
  '#FF6B6B',
  '#FFB347',
  '#9B59B6',
  '#1ABC9C',
  '#E74C3C',
  '#3498DB',
  '#2ECC71',
  '#F39C12'
];

export function randomTripColor(): string {
  return TRIP_COLORS[Math.floor(Math.random() * TRIP_COLORS.length)];
}
