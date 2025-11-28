import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { BudgetDto } from "./Budget.dto";
import { CODE_200, CODE_201, HUNDRED, UNIQUE_CONFLICT_CODE } from "src/constants";
import { calculateRate } from "src/helpers/calculateRate";

@Injectable()
export class BudgetService {
    constructor (private prisma: PrismaService) {}

    async getButgets(userId: number){
        try {
            const budgets = this.prisma.budget.findMany(
            {
                where: {userId}, 
                orderBy: {limit: 'asc'},
                include: {
                    category: true,
                }
            });

            return budgets;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getBudget(id: number) {
        try {
            const budget = await this.prisma.budget.findUnique({where: {id}});

            if (!budget) {
                throw new NotFoundException("Budget not found");
            }

            return budget;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async createBudget(dto: BudgetDto, userId: number){
       try {
            const budget = await this.prisma.budget.create({
                data: {
                    ...dto,
                    userId
                }
            });

            return {statusCode: CODE_201, message: 'Budget is successfully created!', budget};
       } catch (error) {
            if (error.code === UNIQUE_CONFLICT_CODE) {
                throw new ConflictException('This budget already created, please create with another category or use exist one.');
            }
            throw new InternalServerErrorException(error.message);
       }
    }

    async findBudgetByUserAndCategory(userId: number, categoryId: number) {
        try {
            const budget = await this.prisma.budget.findUnique({
              where: { userId_categoryId: { userId, categoryId } },
            });

            if (!budget) {
                throw new NotFoundException(`Budget not found for userId=${userId}, categoryId=${categoryId}`);
            }
        
            return budget;
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async editBudget(dto: BudgetDto, id: number) {
        try {
            let {completeness, currency, usage, limit} = await this.getBudget(id);

            if (currency !== dto.currency) {
                usage = await calculateRate({amount: usage, fromCurrency: currency, toCurrency: dto.currency}) ?? usage;
            }

            if (limit !== dto.limit) {
                completeness = (usage / dto.limit) * HUNDRED;
            }

            await this.prisma.budget.update({where: {id: id}, data: {
                ...dto,
                usage,
                completeness
            }});

            return {statusCode: CODE_200, message: 'Budget is successfully updated!'} ;           
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteBudget(id: number) {
        try {
            await this.prisma.budget.delete({where: {id}})
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
}