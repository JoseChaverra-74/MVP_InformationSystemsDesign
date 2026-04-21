import { Tour, mockTours } from './mockData';

const TOURS_KEY = 'turistgo_tours';

export function getAllTours(): Tour[] {
  try {
    const stored = localStorage.getItem(TOURS_KEY);
    if (stored) {
      const customTours = JSON.parse(stored) as Tour[];
      return [...mockTours, ...customTours];
    }
  } catch (error) {
    console.error('Error loading tours from storage:', error);
  }
  return [...mockTours];
}

export function addTour(tour: Tour): void {
  try {
    const stored = localStorage.getItem(TOURS_KEY);
    const customTours = stored ? JSON.parse(stored) : [];
    customTours.push(tour);
    localStorage.setItem(TOURS_KEY, JSON.stringify(customTours));
  } catch (error) {
    console.error('Error saving tour to storage:', error);
  }
}

export function updateTour(tourId: string, updates: Partial<Tour>): void {
  try {
    const allTours = getAllTours();
    const updatedTours = allTours.map(t =>
      t.id === tourId ? { ...t, ...updates } : t
    );

    // Separate mock tours and custom tours
    const customTours = updatedTours.filter(t => !mockTours.find(mt => mt.id === t.id));
    localStorage.setItem(TOURS_KEY, JSON.stringify(customTours));
  } catch (error) {
    console.error('Error updating tour in storage:', error);
  }
}
