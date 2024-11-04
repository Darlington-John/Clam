import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
     try {
          await connectMongo();

          const { description, book, userId } = await req.json();

          if (!description || !book || !userId) {
               return NextResponse.json(
                    {
                         error: 'Description, book name, and user ID are required',
                    },
                    { status: 400 }
               );
          }

          const updatedUser = await User.findOneAndUpdate(
               { _id: userId, 'books.name': book },
               {
                    $set: {
                         'books.$.description': description,
                    },
               },
               { new: true }
          );

          if (!updatedUser) {
               return NextResponse.json(
                    { error: 'User or book not found' },
                    { status: 404 }
               );
          }

          return NextResponse.json({
               message: 'Entry created successfully',
          });
     } catch (error) {
          return NextResponse.json(
               { error: 'An error occurred while creating the entry' },
               { status: 500 }
          );
     }
}
