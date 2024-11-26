import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;
export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const { email, password, newPassword } = await req.json();

      const user = await User.findOne({ email });
      if (!user) {
         return NextResponse.json(
            { error: 'User with this email does not exist.' },
            { status: 404 }
         );
      }

      if (user.authProvider === 'google') {
         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
         user.password = hashedNewPassword;
         user.authProvider = 'local';
         const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: '1y',
         });
         console.log('token000000', token);
         await user.save();

         return NextResponse.json(
            {
               message:
                  'Password set successfully, authProvider updated to "local".',
               token: token,
            },
            { status: 200 }
         );
      }

      if (user.authProvider === 'local') {
         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) {
            return NextResponse.json(
               { error: 'Incorrect password.' },
               { status: 401 }
            );
         }

         const hashedNewPassword = await bcrypt.hash(newPassword, 10);
         user.password = hashedNewPassword;
         await user.save();

         return NextResponse.json(
            { message: 'Password updated successfully.' },
            { status: 200 }
         );
      }

      return NextResponse.json(
         { error: 'Unexpected authProvider type.' },
         { status: 400 }
      );
   } catch (error) {
      console.error('Error updating password:', error);
      return NextResponse.json(
         { error: 'An error occurred while updating the password.' },
         { status: 500 }
      );
   }
}
