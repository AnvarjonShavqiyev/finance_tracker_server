import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { BudgetService } from "./Budget.service";
import { BudgetDto } from "./Budget.dto";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { AuthRequest } from "src/types";

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetController {
    constructor(private readonly budgetService: BudgetService) {}

    @Get()
    async getBudgets(@Req() req: AuthRequest) {
        return this.budgetService.getButgets(req.user.userId);
    }

    @Get('/:id')
    async getBudget(@Param('id') id: string) {
        return this.budgetService.getBudget(+id);
    }

    @Post()
    async createBudget(@Body() dto: BudgetDto, @Req() req: AuthRequest) {
        return this.budgetService.createBudget(dto, req.user.userId);
    }

    @Patch('/:id')
    async editBudget(@Body() dto: BudgetDto, @Param('id') id: string) {
        return this.budgetService.editBudget(dto, +id);
    }

    @Delete('/:id')
    async deleteBudget(@Param('id') id: string) {
        return this.budgetService.deleteBudget(+id);
    }
}