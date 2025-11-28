interface CalculateRateProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
};

export const calculateRate = async ({
  amount,
  fromCurrency,
  toCurrency,
}: CalculateRateProps): Promise<number | undefined> => {
  if (fromCurrency === toCurrency) return amount;

  try {
    const res = await fetch(
      `${process.env.CURRENCY_API}&base_currency=${fromCurrency}&currencies=${toCurrency}`
    );

    if (!res.ok) {
      throw new Error(`Currency conversion failed: ${res.statusText}`);
    }

    const data = await res.json();
    const rate = data?.data?.[toCurrency];

    if (typeof rate === "number") {
      return amount * rate;
    } else {
      throw new Error("No valid rate in API response")
    }
  } catch (error) {
    throw new Error("Failed to fetch conversion rate")
  }
};
