import { Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { ReportsCron } from "./reports.cron";
import { SettingsService } from "src/settings/settings.service";
import { MailService } from "src/mail/mail.service";
import { AuthModule } from "src/auth/auth.module";
import { CategoryModule } from "src/category/category.module";

@Module({
    imports: [AuthModule, CategoryModule],
    controllers: [ReportsController],
    providers: [ReportsService, ReportsCron, SettingsService, MailService]
})

export class ReportsModule {}