import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const { email, verificationCode } = await req.json();
      const user = await User.findOne({ email });

      if (!user) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isMatch = await bcrypt.compare(
         verificationCode.toString(),
         user.verificationHash as any
      );

      if (!isMatch) {
         return NextResponse.json(
            { error: 'Invalid verification code' },
            { status: 400 }
         );
      }

      (user.verificationHash as any) = undefined;

      return NextResponse.json({ email: email }, { status: 200 });
   } catch (error) {
      return NextResponse.json(
         { error: 'Verification failed' },
         { status: 500 }
      );
   }
}
