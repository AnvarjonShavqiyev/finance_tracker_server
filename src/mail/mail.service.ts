import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from 'src/auth/auth.service';
import { CategoryService } from 'src/category/category.service';
import { COMPLETENESS_THRESHOLD } from 'src/constants';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService,
  ) {}

  async checkAndSendBudgetAlert(userId: number, categoryId: number, completeness: number) {
    try {
      const to = await this.authService.getUserEmail(userId);
      const category = await this.categoryService.getCategory(categoryId);
      if (completeness >= COMPLETENESS_THRESHOLD) {
        await this.mailerService.sendMail({
          to,
          subject: `Budget alert: ${category.payload?.name}`,
          text: `Your budget for "${category.payload?.name}" has reached ${completeness}% of its limit.`,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async sendDailySummary(email: string, report: Uint8Array) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Daily summary',
      context: { message: 'You can check summary for today' },
      attachments: [
        { filename: 'daily-summary.xlsx', content: Buffer.from(report)}
      ]
    });
  }
}
