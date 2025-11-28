import { createZodDto } from "@anatine/zod-nestjs";
import z from "zod";

export const BudgetSchema = z.object({
    currency: z.string(),
    categoryId: z.number(),
    limit: z.number()
})

export class BudgetDto extends createZodDto(BudgetSchema) {}