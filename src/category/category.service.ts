import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CategoryDto } from "./category.dto";
import { CODE_200, CODE_201, FOREIGN_CONFLICT_CODE } from "src/constants";

@Injectable()
export  class CategoryService {
    constructor (private prisma: PrismaService) {}

    async getCategories() {
        try {
            const categories = await this.prisma.category.findMany();

            return {statusCode: CODE_200, categories};
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async getCategory(id: number) {
        try {
            const category = await this.prisma.category.findUnique({where: {id}});

            return {statusCode: CODE_200, payload: category};
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async createCategory(dto: CategoryDto) {
        try {
            const { name } = dto;
            const category = await this.prisma.category.create({data: {
                name,
            }});

            return {statusCode: CODE_201, message: 'Category is successfully created!', category};
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException(`Category with name "${name}" already exists`);
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async editCategory(dto: CategoryDto, id: number) {
        try {
            if (!id) {
                throw new BadRequestException('Category ID is required for edit');
            }

            const category = await this.prisma.category.update({where: {id}, data: dto});

            return {statusCode: CODE_200, payload: category};
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async deleteCategory(id: number) {
        try {
            if (!id) {
                throw new BadRequestException('Category ID is required for deletion');
            }

            await this.prisma.category.delete({where: {id}});

            return {statusCode: CODE_200, message: 'Category is successfully deleted!'};
        } catch (error) {
            if (error.code === FOREIGN_CONFLICT_CODE) {
                throw new ConflictException(`This category cannot be deleted because it is on usage`);
            }

            throw new InternalServerErrorException(error.message)
        }
    }
}