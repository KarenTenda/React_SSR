
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/app/rolesPermissions/users/schema/MongooseSchema';
import { UserFormSchema, zodUserSchema } from '@/app/rolesPermissions/users/schema/ZodSchema';
import { z } from 'zod';

const PAGE_SIZE = 5;

export async function GET(req: Request) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1'); 

  try {
    const skip = (page - 1) * PAGE_SIZE; 
    const users = await User.find().skip(skip).limit(PAGE_SIZE); 
    const totalUsers = await User.countDocuments(); 

    return NextResponse.json({
      users,
      totalPages: Math.ceil(totalUsers / PAGE_SIZE),
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json();

    const validatedData: UserFormSchema = zodUserSchema.parse(body);

    const newUser = new User(validatedData);
    await newUser.save();

    return NextResponse.json({ message: 'User added successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);

    let errorMessage = 'An unknown error occurred';

    if (error instanceof z.ZodError) {
      errorMessage = error.issues.map(issue => issue.message).join(', ');
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: 'Failed to add user', details: errorMessage }, { status: 400 });

  }
}
