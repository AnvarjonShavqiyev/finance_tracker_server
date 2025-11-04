import { Module } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { BudgetService } from "src/budget/Budget.service";
import { MailModule } from "src/mail/mail.module";
import { TransactionCron } from "./transaction.cron";

@Module({
    imports: [MailModule],
    controllers: [TransactionController],
    providers: [TransactionService, BudgetService, TransactionCron]
})

export class TransactionModule {}