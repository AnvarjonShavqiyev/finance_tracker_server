import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ZERO } from "src/constants";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class BudgetCron {
  constructor(private prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async resetBudgets() {
    try {
      await this.prisma.budget.updateMany({
        data: { usage: ZERO, completeness: ZERO },
      });

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
