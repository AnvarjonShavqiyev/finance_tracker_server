import { AMOUNT_TYPE, TransactionFilters } from "src/types";

export const getTransactionFilters = (filters: TransactionFilters) => {
    const { fromDate, toDate, categoryId, amount, amountType } = filters;
            
    const dateFilter =
      fromDate || toDate
        ? {
            date: {
              ...(fromDate && { gte: fromDate }),
              ...(toDate && { lte: toDate }),
            },
          }
        : {};
        
    const categoryFilter = categoryId ? { categoryId } : {};
        
    const amountFilter =
      amount && amountType
        ? {
            amount: {
              ...(amountType === AMOUNT_TYPE.LESS_THAN && { lt: amount }),
              ...(amountType === AMOUNT_TYPE.HIGHER_THAN && { gt: amount }),
              ...(amountType === AMOUNT_TYPE.EQUAL_TO && { equals: amount }),
            },
          }
        : {};

    return {...dateFilter, ...categoryFilter, ...amountFilter};
}