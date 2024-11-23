import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';
import mongoose from 'mongoose';

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

      const newBook = { _id: new mongoose.Types.ObjectId(), name: bookName };

      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { $push: { books: newBook } },
         { new: true }
      );

      if (!updatedUser) {
         return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const createdBook: any = updatedUser.books.find(
         (book: any) => book._id.toString() === newBook._id.toString()
      );

      return NextResponse.json({
         message: 'Book created successfully',
         bookId: createdBook?._id,
      });
   } catch (error) {
      console.error('Error creating book:', error);
      return NextResponse.json(
         { error: 'An error occurred while creating the book' },
         { status: 500 }
      );
   }
}
