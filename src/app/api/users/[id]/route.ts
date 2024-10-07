
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongo';
import User from '@/app/rolesPermissions/users/schema/MongooseSchema';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const deletedUser = await User.findByIdAndDelete(params.id);
    
    if (!deletedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);  
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

