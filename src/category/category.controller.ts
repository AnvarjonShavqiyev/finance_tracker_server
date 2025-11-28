import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDto } from "./category.dto";
import { JwtAuthGuard } from "src/auth/auth.guard";

@UseGuards(JwtAuthGuard)
@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get()
    async getCategories() {
        return this.categoryService.getCategories();
    }

    @Get('/:id')
    async getCategory(@Param('id') id: string) {
        return this.categoryService.getCategory(+id);
    }

    @Post()
    async createCategory(@Body() dto: CategoryDto) {
        return this.categoryService.createCategory(dto);
    }

    @Patch('/:id')
    async editCategory(@Body() dto: CategoryDto, @Param('id') id: string) {
        return this.categoryService.editCategory(dto, +id);
    }

    @Delete('/:id')
    async deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(+id);
    }
}