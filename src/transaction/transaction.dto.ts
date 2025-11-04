import { createZodDto } from "@anatine/zod-nestjs";
import { TransactionType } from "@prisma/client";
import { AMOUNT_TYPE } from "src/types";
import z from "zod";

export const TransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  currency: z.string(),
  categoryId: z.number().optional(),
  type: z.enum(TransactionType),
  accountId: z.number()
});

export const TransactionQuerySchema = z.object({
  fromDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),

  toDate: z
    .string()
    .datetime()
    .transform((val) => new Date(val))
    .optional(),

  categoryId: z
    .string()
    .transform((val) => Number(val))
    .optional(),

  amount: z
    .string()
    .transform((val) => Number(val))
    .optional(),

  amountType: z.enum(AMOUNT_TYPE).optional(),
});

export class TransactionQueryDto extends createZodDto(TransactionQuerySchema) {};
export class TransactionDto extends createZodDto(TransactionSchema) {};
