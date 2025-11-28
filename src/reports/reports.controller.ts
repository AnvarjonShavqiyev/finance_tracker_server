import { Controller, Get, Param, Req, Res, UseGuards } from "@nestjs/common";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { AuthRequest, PeriodType } from "src/types";
import { Response } from "express";

@UseGuards(JwtAuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Get('/:n/transactions')
    async getTopNTransactions(@Req() req: AuthRequest, @Param('n') n: string) {
        return this.reportsService.getTopTransactionByN(+n, req.user.userId);
    }

    @Get('/spendsByCategory')
    async getSpendsByCategories(@Req() req: AuthRequest) {
        return this.reportsService.getSpendsByCategories(req.user.userId);
    }

    @Get('/spendsVsIncome/:period')
    async getSpendingVsIncome(@Req() req: AuthRequest, @Param('period') period: PeriodType) {
        return this.reportsService.getSpendingVsIncome(req.user.userId, period);
    }

    @Get('topNTransaction/:n/period/:period')
    async exportReport(@Req() req: AuthRequest, @Param('n') n:string, @Param('period') period: PeriodType, @Res() res: Response) {
        return this.reportsService.exportReport(req.user.userId, +n, period, res);
    }
}
