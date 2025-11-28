import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { CategoryModule } from './category/category.module';
import { TransactionModule } from './transaction/transaction.module';
import { BudgetModule } from './budget/Budget.module';
import { PrismaModule } from './prisma/prisma.module';
import { ReportsModule } from './reports/reports.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    AuthModule, 
    CategoryModule, 
    TransactionModule, 
    BudgetModule, 
    PrismaModule, 
    ReportsModule,
    SettingsModule,
    ScheduleModule.forRoot()
  ],
  providers: [PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
