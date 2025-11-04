export const TEN = 10;
export const MIN_PASSWORD_LENGHT = 6;
export const USER_ROLES = ['USER', 'ADMIN']

export enum TRANSACTION_TYPE {
    INCOME = 'INCOME',
    EXPENSE = 'EXPENSE',
    TRANSFER = 'TRANSFER'
}

export const spendsVsIncomeColumns = [
    { header: 'Period', key: 'period', width: 15 },
    { header: 'Income', key: 'income', width: 15 },
    { header: 'Expense', key: 'expense', width: 15 },
];

export const spendsByCategoriesColumns = [
    {header: 'Category', key: 'category', width: 15},
    {header: 'Amount', key: 'amount', width: 15},
]

export const transactionsColumns = [
    { header: 'Description', key: 'description', width: 15 },
    { header: 'Amount', key: 'amount', width: 15 },
    { header: 'Category', key: 'category.name', width: 15 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
]

export enum SETTINGS_TYPES {
    SEND_DAILY_REPORTS = 'sendDailyReports'
}

export const TOKEN_EXPIRES_IN = '8h'

export const ZERO = 0
export const HUNDRED = 100
export const TWINTY_THREE = 23
export const FIFTY_NINE = 59
export const THREE_NINES = 999
export const ONE = 1
export const SEVEN = 7
export const COMPLETENESS_THRESHOLD = 90

export const UNIQUE_CONFLICT_CODE = 'P2002';
export const FOREIGN_CONFLICT_CODE = 'P2003';

export const CODE_201 = 201;
export const CODE_200 = 200;

export const DAY_FORMAT = 'yyyy-MM-dd'
export const WEEK_FORMAT = "yyyy-'W'I"
export const MONTH_FORMAT = 'yyyy-MM'
export const YEAR_FORMAT = 'yyyy'
