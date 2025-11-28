import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { formatDateByPeriod } from "src/helpers/formatDateByPeriod";
import { PrismaService } from "src/prisma/prisma.service";
import { GroupedTransactions, PeriodType, Spending } from "src/types";
import { Response } from 'express';
import { spendsByCategoriesColumns, spendsVsIncomeColumns, transactionsColumns, TRANSACTION_TYPE, ZERO } from "src/constants";
import { getTodayStartEnd } from "src/helpers/getTodayStartEnd";
import * as ExcelJS from 'exceljs';
import { fillSheet } from "src/helpers/fillSheet";

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) {}

    async getTopTransactionByN(n: number, userId: number) {
        try {
            const transactions = await this.prisma.transaction.findMany({
                where: {userId},
                orderBy: {
                    amount: 'desc'
                },
                take: n,
                include: {
                    category: true
                }
            })

            return transactions;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getSpendsByCategories(userId: number) {
        try {
            const spendings = await this.prisma.$queryRaw<Spending[]>
            `
              SELECT c.name AS category,
                     SUM(t.amount)::text AS amount,
                     COUNT(*)::text AS count
              FROM "Transaction" t
              JOIN "Category" c ON t."categoryId" = c.id
              WHERE t."userId" = ${userId}
              GROUP BY c.name
            `;

          return spendings.map(spending => {
            const { amount, count } = spending;

            return {
              ...spending,
              amount: +amount,
              count: +count
            };
          });

        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getSpendingVsIncome(userId: number, period: PeriodType) {
      try {
        const transactions = await this.prisma.transaction.groupBy({
          by: ['type', 'date'],
          where: { userId },
          _sum: { amount: true },
          orderBy: { date: 'asc' },
        });

        const grouped = transactions.reduce<GroupedTransactions>(
          (acc, transaction) => {
            const formattedDate = formatDateByPeriod(transaction.date, period) as string;
            if (!acc[formattedDate]) {
              acc[formattedDate] = { period: formattedDate, income: ZERO, expense: ZERO };
            }
          
            if (transaction.type === TRANSACTION_TYPE.INCOME) {
              acc[formattedDate].income += transaction._sum.amount ?? ZERO;
            } else if (transaction.type === TRANSACTION_TYPE.EXPENSE) {
              acc[formattedDate].expense += transaction._sum.amount ?? ZERO;
            }
          
            return acc;
          },
          {},
        );
      
        const result = Object.values(grouped).sort((a, b) =>
          a.period.localeCompare(b.period),
        );
      
        return result;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }   
    }

    async exportReport(userId: number, n:number, period: PeriodType, res: Response) {
      try {
        const workBook = new ExcelJS.Workbook();

        const topNTransactionsWorkSheet = workBook.addWorksheet(`Top ${n} transactions`);
        const spendsByCategoriesWorkSheet = workBook.addWorksheet('Spends by categories');
        const spendsVsIncomeWorkSheet = workBook.addWorksheet(`Spends VS Income by ${period}`);
        
        const topNTransactions = await this.getTopTransactionByN(n, userId);
        const spendsByCategories = await this.getSpendsByCategories(userId);
        const spendsVsIncome = await this.getSpendingVsIncome(userId, period);

        topNTransactionsWorkSheet.columns = transactionsColumns;
        spendsByCategoriesWorkSheet.columns = spendsByCategoriesColumns;
        spendsVsIncomeWorkSheet.columns = spendsVsIncomeColumns;

        fillSheet(topNTransactionsWorkSheet, topNTransactions);
        fillSheet(spendsByCategoriesWorkSheet, spendsByCategories);
        fillSheet(spendsVsIncomeWorkSheet, spendsVsIncome);

        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=report.xlsx');

        await workBook.xlsx.write(res); 
        res.end();
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }

    async getDailySummary(userId: number) {
      try {
        const {start, end} = getTodayStartEnd();

        const transactions = await this.prisma.transaction.findMany({
          where: {
            userId,
            date: {
              gte: start,
              lte: end,
            }
          }
        })

        const workBook = new ExcelJS.Workbook();
        const transactionsWorkSheet = workBook.addWorksheet('Daily summary');
        transactionsWorkSheet.columns = transactionsColumns;

        transactions.forEach((row) => transactionsWorkSheet.addRow(row))

        return workBook.xlsx.writeBuffer();
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
}