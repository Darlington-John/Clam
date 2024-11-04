import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
     try {
          await connectMongo();

          const { bookName, userId } = await req.json();

          if (!bookName || !userId) {
               return NextResponse.json(
                    { error: 'Book name and user ID are required' },
                    { status: 400 }
               );
          }

          const updatedUser = await User.findByIdAndUpdate(
               userId,
               { $push: { books: { name: bookName } } },
               { new: true }
          );

          if (!updatedUser) {
               return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
               );
          }

          return NextResponse.json({
               message: 'Book created successfully',
               user: updatedUser,
          });
     } catch (error) {
          console.error('Error creating book:', error);
          return NextResponse.json(
               { error: 'An error occurred while creating the book' },
               { status: 500 }
          );
     }
}
