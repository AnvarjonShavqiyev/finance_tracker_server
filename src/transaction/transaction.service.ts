import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TransactionDto } from "./transaction.dto";
import { CODE_200, CODE_201, TRANSACTION_TYPE } from "src/constants";
import { calculateUsageCompleteness } from "src/helpers/calculateUsageCompleteness";
import { calculateRate } from "src/helpers/calculateRate";
import { BudgetService } from "src/budget/Budget.service";
import { MailService } from "src/mail/mail.service";
import { AMOUNT_TYPE, TransactionFilters } from "src/types";
import { getTransactionFilters } from "src/helpers/getTransactionFilters";

  @Injectable()
  export class TransactionService {
      constructor(private prisma: PrismaService, private budgetService: BudgetService, private mailService: MailService) {}

      async getTransactions(userId: number, filters: TransactionFilters = {}) {
        try {
          const cleanFilters = getTransactionFilters(filters)
              
          const transactions = await this.prisma.transaction.findMany({
            where: {
              userId,
              ...cleanFilters,
            },
            include: {
              category: {
                select: { name: true },
              },
            },
            orderBy: {
              amount: 'asc',
            },
          });
          return transactions;
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }

      async getTransaction(id: number) {
          try {
              const transaction = await this.prisma.transaction.findUnique({
                  where: {id}
              })

              if (!transaction) {
                throw new NotFoundException('This transaction not found!');
              }

              return transaction;
          } catch (error) {
              throw new InternalServerErrorException(error.message)
          }
      }

      async createTransaction(dto: TransactionDto, userId: number) {
          try {
            const transaction = await this.prisma.transaction.create({
              data: { ...dto, userId },
            });
        
            if (transaction.type !== TRANSACTION_TYPE.INCOME) {
              const { categoryId, amount, currency: transactionCurrency } = transaction;

              if (!categoryId) {
                throw new ConflictException('Category id is null');
              }

              const {id, usage, limit, currency: budgetCurrency} = await this.budgetService.findBudgetByUserAndCategory(userId, categoryId);
              const {updatedUsage, completeness} = await calculateUsageCompleteness({usage, limit, amount, fromCurrency: transactionCurrency, toCurrency: budgetCurrency});
          
              await this.prisma.budget.update({
                where: {
                  id,
                },
                data: {
                  usage: updatedUsage,
                  completeness,
                },
              });

              if (!categoryId) {
                throw new ConflictException('Category id is null');
              }


              await this.mailService.checkAndSendBudgetAlert(userId, categoryId, completeness)
            }
        
            return {
              statusCode: CODE_201,
              message: "Transaction created succesfully!",
              transaction,
            };
          } catch (error) {
            throw new InternalServerErrorException(error.message);
          }
      }


      async editTransaction(dto: TransactionDto, id: number, userId: number) {
          try {
              const {type, amount} = dto;
              if(type !== TRANSACTION_TYPE.INCOME) {
                const {categoryId, amount: oldAmount, currency: transactionCurrency} = await this.getTransaction(id);

                if (!categoryId) {
                  throw new ConflictException('Category id is null');
                }

                const {usage, limit, currency: budgetCurrency, id: budgetId} = await this.budgetService.findBudgetByUserAndCategory(userId, categoryId);
                
                const diff = amount - oldAmount;

                const {updatedUsage, completeness} = await calculateUsageCompleteness({usage, limit, amount: diff, fromCurrency: transactionCurrency, toCurrency: budgetCurrency})

                await this.prisma.budget.update({where: {id: budgetId}, data: {usage: updatedUsage, completeness}})
              }  

              const transaction = await this.prisma.transaction.update({where: {id}, data: {
                ...dto, categoryId: dto.categoryId as number,
              }}) 

              return {statusCode: CODE_200, message: 'Transaction successfully updated!', transaction}
          } catch (error) {
              throw new InternalServerErrorException(error.message)
          }        
      }

      async deleteTransaction(id: number, userId: number) {
        try {
          const transaction = await this.getTransaction(id);

          if (transaction.type !== TRANSACTION_TYPE.INCOME) {
            const { categoryId, amount, currency: transactionCurrency } = transaction;

            if (!categoryId) {
              throw new ConflictException('Category id is null');
            }


            const budget = await this.prisma.budget.findUnique({
              where: { userId_categoryId: { userId, categoryId } },
            });

            if (budget) {
              const { id: budgetId, currency } = budget;
              const convertedAmount = await calculateRate({
                amount,
                toCurrency: currency,
                fromCurrency: transactionCurrency,
              });

              if (typeof convertedAmount !== "number" || isNaN(convertedAmount)) {
                throw new Error("Invalid converted amount");
              }

              await this.prisma.budget.update({
                where: { id: budgetId },
                data: {
                  usage: {
                    decrement: convertedAmount,
                  },
                },
              });
            }
          }

          await this.prisma.transaction.delete({ where: { id } });

          return { statusCode: CODE_200, message: "Transaction successfully deleted!" };
        } catch (error) {
          throw new InternalServerErrorException(error.message);
        }
      }
  } 