export interface Activity {
  id: number;
  type: string;
  time: string;
  title: string;
  description: string;
  image: string;
  lat?: number;
  lng?: number;
  mapTop?: string;
  mapLeft?: string;
}

export interface TransitDetails {
  mode: 'flight' | 'ferry' | 'bus' | 'van' | 'tricycle' | string;
  departureTime?: string;
  arrivalTime?: string;
  duration: string;
}

export interface Day {
  dayNumber: number;
  dayTitle: string;
  activities: Activity[];
  transitDetails?: TransitDetails;
  routingRationale?: string;
  estimatedCost?: string;
}

export interface Itinerary {
  title: string;
  duration: string;
  days: Day[];
}
