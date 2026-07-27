export type BaggageType = 'personal' | 'cabin' | 'checked';
export type SizeUnit = 'cm' | 'in';
export type WeightUnit = 'kg' | 'lb';

export interface BaggagePolicy {
  id: string;
  airline_id: string;
  type: BaggageType;
  max_length: number;
  max_width: number;
  max_height: number;
  max_weight: number;
  size_unit: SizeUnit;
  weight_unit: WeightUnit;
  name: string; // e.g., "Standard Economy Cabin Bag"
  notes?: string;
}

export interface Airline {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
  country: string;
  website: string;
  policies?: BaggagePolicy[];
}
