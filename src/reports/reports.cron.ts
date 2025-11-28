import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SETTINGS_TYPES } from "src/constants";
import { SettingsService } from "src/settings/settings.service";
import { ReportsService } from "./reports.service";
import { MailService } from "src/mail/mail.service";

@Injectable()
export class ReportsCron {
    constructor(
        private readonly settingsService: SettingsService, 
        private readonly reportsService: ReportsService,
        private readonly mailService: MailService
    ){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async sendDailyReport () {
        const recievers = await this.settingsService.getAllEnabledSettings(SETTINGS_TYPES.SEND_DAILY_REPORTS)
        recievers.forEach(async ({user: {id, email}}) => {
            const report = await this.reportsService.getDailySummary(id);
            await this.mailService.sendDailySummary(email, report as unknown as Buffer)
        })
    }
}