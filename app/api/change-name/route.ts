import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const { email, name } = await req.json();

      const user = await User.findOne({ email });
      if (!user) {
         return NextResponse.json(
            { error: 'User  not authenticated' },
            { status: 404 }
         );
      }

      user.name = name;
      await user.save();

      return NextResponse.json(
         { message: 'Name updated successfully.' },
         { status: 200 }
      );
   } catch (error) {
      console.error('Error updating name:', error);
      return NextResponse.json(
         { error: 'An error occurred while updating the name.' },
         { status: 500 }
      );
   }
}
