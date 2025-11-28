import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { getNextRunDate } from '../helpers/getNextRunDate';

@Injectable()
export class TransactionCron {
  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCron() {
    const now = new Date();

    const transactions = await this.prisma.transaction.findMany({
      where: {
        isRecurring: true,
        OR: [
          {nextTimeAt: { lte: now }},
          {nextTimeAt: null}
        ],
      },
    });

    await Promise.all(
      transactions.map(async (transaction) => {
        const { nextTimeAt, repeatInterval, id, ...rest } = transaction;
        const nextRun = getNextRunDate(nextTimeAt ?? now, repeatInterval);

        try {
          await this.prisma.$transaction(async (trx) => {
            await trx.transaction.create({
              data: {
                ...rest,
                repeatInterval,
                nextTimeAt: nextRun,
              },
            });

            await trx.transaction.update({
              where: { id },
              data: { nextTimeAt: nextRun },
            });
          });
        } catch (error) {
          throw new Error(error.message);
        }
      }),
    );
  }
}
