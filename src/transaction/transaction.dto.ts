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
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  toDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),

  categoryId: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),

  amount: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),

  amountType: z.enum(AMOUNT_TYPE).optional(),
});

export class TransactionQueryDto extends createZodDto(TransactionQuerySchema) {};
export class TransactionDto extends createZodDto(TransactionSchema) {};
