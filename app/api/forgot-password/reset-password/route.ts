
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function POST(req: NextRequest) {
  try {
    await connectMongo();

    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User with this email does not exist.' }, { status: 404 });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'An error occurred while updating the password.' }, { status: 500 });
  }
}
