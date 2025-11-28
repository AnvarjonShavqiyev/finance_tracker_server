import { z } from 'zod';
import { createZodDto } from '@anatine/zod-nestjs';
import { MIN_PASSWORD_LENGHT, USER_ROLES } from '../constants/index'

export const RegisterSchema = z.object({
    username: z.string(),
    email: z.email('Email should be on email format'),
    password: z.string().min(MIN_PASSWORD_LENGHT, 'Password should be include 6 characters at least'),
    role: z.enum(USER_ROLES).optional(),
});

export const LoginSchema = z.object({
    email: z.email('Email should be on email format'),
    password: z.string().min(MIN_PASSWORD_LENGHT, 'Password should be include 6 characters at least')
});

export class RegisterDto extends createZodDto(RegisterSchema) {}
export class LoginDto extends createZodDto(LoginSchema) {}