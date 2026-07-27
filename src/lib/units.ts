import { SizeUnit, WeightUnit } from '@/types/airline';

// 1 inch = 2.54 cm
// 1 lb = 0.453592 kg

export function cmToInches(cm: number): number {
  return Number((cm / 2.54).toFixed(1));
}

export function inchesToCm(inches: number): number {
  return Number((inches * 2.54).toFixed(1));
}

export function kgToLb(kg: number): number {
  return Number((kg * 2.20462).toFixed(1));
}

export function lbToKg(lb: number): number {
  return Number((lb / 2.20462).toFixed(1));
}

export function convertSize(
  value: number,
  from: SizeUnit,
  to: SizeUnit
): number {
  if (from === to) return value;
  if (from === 'cm' && to === 'in') return cmToInches(value);
  if (from === 'in' && to === 'cm') return inchesToCm(value);
  return value;
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit
): number {
  if (from === to) return value;
  if (from === 'kg' && to === 'lb') return kgToLb(value);
  if (from === 'lb' && to === 'kg') return lbToKg(value);
  return value;
}
