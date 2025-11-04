import { Module } from "@nestjs/common";
import { BudgetService } from "./Budget.service";
import { BudgetController } from "./Budget.controller";
import { BudgetCron } from "./Budget.cron";

@Module({
    controllers: [BudgetController],
    providers: [BudgetService, BudgetCron]
})

export class BudgetModule {}