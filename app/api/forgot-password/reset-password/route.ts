import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const { email, password } = await req.json();

      const user = await User.findOne({ email });
      if (!user) {
         return NextResponse.json(
            { error: 'User with this email does not exist.' },
            { status: 404 }
         );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      user.password = hashedPassword;
      await user.save();
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
         expiresIn: '1y',
      });
      return NextResponse.json(
         { message: 'Password updated successfully.', token: token },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error updating password:', error);
      return NextResponse.json(
         { error: 'An error occurred while updating the password.' },
         { status: 500 }
      );
   }
}
