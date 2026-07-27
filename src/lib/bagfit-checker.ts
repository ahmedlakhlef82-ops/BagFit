import { BaggagePolicy, SizeUnit, WeightUnit } from '@/types/airline';
import { convertSize, convertWeight } from './units';

export interface BagDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
  sizeUnit: SizeUnit;
  weightUnit: WeightUnit;
}

export interface CheckResult {
  fits: boolean;
  exceeds: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
  };
  policy: BaggagePolicy;
}

export function checkBagFit(
  bag: BagDimensions,
  policy: BaggagePolicy
): CheckResult {
  // Convert policy dimensions to match bag input units for comparison
  const maxL = convertSize(policy.max_length, policy.size_unit, bag.sizeUnit);
  const maxW = convertSize(policy.max_width, policy.size_unit, bag.sizeUnit);
  const maxH = convertSize(policy.max_height, policy.size_unit, bag.sizeUnit);
  const maxWeight = convertWeight(
    policy.max_weight,
    policy.weight_unit,
    bag.weightUnit
  );

  // Sort dimensions to ensure order doesn't matter (e.g., L W H can be 50 40 20 or 20 40 50)
  const bagDims = [bag.length, bag.width, bag.height].sort((a, b) => b - a);
  const policyDims = [maxL, maxW, maxH].sort((a, b) => b - a);

  const exceeds: CheckResult['exceeds'] = {};
  let fits = true;

  if (bagDims[0] > policyDims[0]) {
    exceeds.length = Number((bagDims[0] - policyDims[0]).toFixed(1));
    fits = false;
  }
  if (bagDims[1] > policyDims[1]) {
    exceeds.width = Number((bagDims[1] - policyDims[1]).toFixed(1));
    fits = false;
  }
  if (bagDims[2] > policyDims[2]) {
    exceeds.height = Number((bagDims[2] - policyDims[2]).toFixed(1));
    fits = false;
  }

  if (maxWeight > 0 && bag.weight > maxWeight) {
    exceeds.weight = Number((bag.weight - maxWeight).toFixed(1));
    fits = false;
  }

  return { fits, exceeds, policy };
}
