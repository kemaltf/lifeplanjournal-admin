import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

import prisma from '@/lib/prismadb';

/**
 * Create register function
 * @param request
 * @returns user
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { username, first_name, last_name, email, password, phone_number } = body;

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create data
  const user = await prisma.user.create({
    data: {
      username,
      first_name,
      last_name,
      email,
      hashed_password: hashedPassword,
      phone_number,
    },
  });

  return NextResponse.json(user);
}
