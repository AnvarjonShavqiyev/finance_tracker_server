import { HUNDRED } from "src/constants";
import { calculateRate } from "./calculateRate";

interface CalculateUsageCompletenessProps {
  usage: number;
  amount: number;
  limit: number;
  fromCurrency: string;
  toCurrency: string;
};

export const calculateUsageCompleteness = async ({
  usage,
  amount,
  limit,
  fromCurrency,
  toCurrency,
}: CalculateUsageCompletenessProps) => {
  const convertedAmount = await calculateRate({ amount, fromCurrency, toCurrency });

  if (convertedAmount === null || convertedAmount === undefined) {
    throw new Error('Failed calcultation for usage and completeness.');
  }

  const updatedUsage = usage + convertedAmount;
  const completeness = (updatedUsage / limit) * HUNDRED;

  return { updatedUsage, completeness };
};