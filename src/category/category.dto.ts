import { createZodDto } from "@anatine/zod-nestjs";
import z from "zod";

export const CategorySchema = z.object({
    name: z.string()
})

export class CategoryDto extends createZodDto(CategorySchema) {}