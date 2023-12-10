import { z } from 'zod';

export const signInSchema = z.object({
  username: z.string().min(3, { message: 'Username harus memiliki minimal 3 karakter' }).max(30, { message: 'Username tidak boleh lebih dari 30 karakter' }),
  password: z.string().min(6, { message: 'Password harus memiliki minimal 6 karakter' }).max(50, { message: 'Password tidak boleh lebih dari 50 karakter' }),
});

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: 'pending' | 'paid';
};
