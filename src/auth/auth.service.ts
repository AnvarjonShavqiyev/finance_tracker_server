import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { CODE_200, CODE_201 } from 'src/constants';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { LoginDto, RegisterDto } from './auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const { email, password, username, role } = dto;
      const existingUser = await this.prisma.user.findUnique({ where: { email } });

      if (existingUser) {
        throw new ConflictException('This email is already used!');
      }

      const hashedPassword = await argon2.hash(password);

      await this.prisma.user.create({
        data: {
          email,
          username,
          role: role as Role || Role.USER,
          password: hashedPassword,
        },
      });

      return { statusCode: CODE_201, message: 'User registered successfully!' };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(dto: LoginDto) {
    try {
      const { password, email } = dto;
      const user = await this.prisma.user.findUnique({ where: { email } });

      if (!user) throw new UnauthorizedException('Not found this user!');

      const isTruePassword = await argon2.verify(user.password, password);

      if (!isTruePassword) {
        throw new UnauthorizedException('Email or password is wrong!');
      }

      const token = this.jwt.sign({ userId: user.id, email });

      return { statusCode: CODE_200, message: 'Successfully logged in', token };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUsers() {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          username: true,
        }
      });
      return {statusCode: CODE_200, payload: users}
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserEmail(id: number) {
    try {
      const user = await this.prisma.user.findUnique({where: {id}});
      
      if(!user) {
        throw new NotFoundException('User not found!')
      }

      return user.email;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
