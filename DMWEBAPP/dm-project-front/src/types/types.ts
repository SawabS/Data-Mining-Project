export type Accident = {
  id: string;
  source: string;
  severity: number;
  startTime: string; // ISO DateTime
  endTime: string; // ISO DateTime
  startLat: string; // Decimal (kept as string to avoid precision loss)
  startLng: string; // Decimal
  distance: number;
  description: string;
  street: string;
  city: string;
  county: string;
  state: string;
  zipcode: string;
  country: string;
  timezone: string;
  airportCode: string;
  weatherTimestamp: string; // ISO DateTime
  temperature: number;
  humidity: number;
  pressure: number;
  visibility: number;
  windDirection: string;
  windSpeed: string; // Decimal
  weatherCondition: string;
  amenity: boolean;
  bump: boolean;
  crossing: boolean;
  giveWay: boolean;
  junction: boolean;
  noExit: boolean;
  railway: boolean;
  roundabout: boolean;
  station: boolean;
  stop: boolean;
  trafficCalming: boolean;
  trafficSignal: boolean;
  turningLoop: boolean;
  sunriseSunset: string;
  civilTwilight: string;
  nauticalTwilight: string;
  astronomicalTwilight: string;
  durationSeconds: number;
  year: number;
  month: number;
  hour: number;
  dayOfWeek: string;
};
