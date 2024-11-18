import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req: NextRequest) {
   try {
      await connectMongo();

      const authHeader = req.headers.get('Authorization');

      if (!authHeader) {
         return NextResponse.json(
            { error: 'No authorization header provided' },
            { status: 401 }
         );
      }

      let user;

      if (authHeader.startsWith('Bearer ')) {
         const token = authHeader.replace('Bearer ', '');

         if (!JWT_SECRET) {
            return NextResponse.json(
               { error: 'Server configuration error' },
               { status: 500 }
            );
         }

         const decoded: any = jwt.verify(token, JWT_SECRET);
         if (!decoded.userId) {
            return NextResponse.json(
               { error: 'Invalid token' },
               { status: 401 }
            );
         }

         user = await User.findById(decoded.userId);
      } else if (authHeader.startsWith('OAuthId ')) {
         const oauthId = authHeader.replace('OAuthId ', '');

         user = await User.findOne({ oauthId });
      } else {
         return NextResponse.json(
            { error: 'Invalid authorization header format' },
            { status: 400 }
         );
      }

      if (!user) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      return NextResponse.json({ user });
   } catch (error) {
      console.error('An error occurred:', error);
      return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
   }
}
