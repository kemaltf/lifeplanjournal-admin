import bcrypt from 'bcrypt';
import prisma from '@/lib/prismadb';
import { NextResponse } from 'next/server';
export async function POST(request: Request) {
  const body = await request.json();
  const { username, first_name, last_name, email, password, phone_number } = body;
  const hashedPassword = await bcrypt.hash(password, 12);

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
