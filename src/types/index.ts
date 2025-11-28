import { Request } from "express";

export interface JwtPayload {
  userId: number;
  email: string;
  iat?: number;  
  exp?: number;  
};

export type UserRole = 'user' | 'admin';

export type PeriodType = 'Day' | 'Week' | 'Month' | 'Year';

export enum AMOUNT_TYPE  {
  LESS_THAN = 'LESS_THAN',
  HIGHER_THAN = 'HIGHER_THAN',
  EQUAL_TO = 'EQUAL_TO'
};

export interface TransactionFilters {
  fromDate?: Date,
  toDate?: Date,
  categoryId?: number,
  amount?: number,
  amountType?: AMOUNT_TYPE
};

export interface Settings {
  sendDailyReports: boolean
};

export interface AuthRequest extends Request {
  user: {
    userId: number;
  };
};

export type Nullable<T> = T | null;

export interface Spending { 
  category: string; 
  amount: string; 
  count: string ;
}

export type GroupedTransactions = Record<string, { period: string; income: number; expense: number }>;
