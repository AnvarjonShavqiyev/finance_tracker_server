import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { TransactionService } from "./transaction.service";
import { TransactionDto, TransactionQueryDto } from "./transaction.dto";
import { JwtAuthGuard } from "src/auth/auth.guard";
import { AuthRequest } from "src/types";
import { ZodValidationPipe } from "@anatine/zod-nestjs";

@UseGuards(JwtAuthGuard)
@Controller('transaction')
export class TransactionController {
    constructor (private transactionService: TransactionService) {}

    @Get()
    async getTransactions(@Req() req: AuthRequest, @Query(new ZodValidationPipe()) query: TransactionQueryDto) {
        return this.transactionService.getTransactions(req.user.userId, query);
    }

    @Get('/:id')
    async getTransaction(@Param('id') id: string) {
        return this.transactionService.getTransaction(+id)
    } 

    @Post()
    async createTransaction(@Body() dto: TransactionDto, @Req() req: AuthRequest) {
        return this.transactionService.createTransaction(dto, req.user.userId);
    }

    @Patch('/:id')
    async updateTransaction(@Body() dto: TransactionDto, @Param('id') id: string, @Req() req: AuthRequest) {
        return this.transactionService.editTransaction(dto, +id, req.user.userId);
    }

    @Delete('/:id')
    async deleteTransaction(@Param('id') id: string, @Req() req: AuthRequest) {
        return this.transactionService.deleteTransaction(+id, req.user.userId);
    }
}