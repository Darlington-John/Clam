import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const { bookId, userId } = await req.json();
      if (!bookId) {
         return NextResponse.json({ error: 'Book not found' }, { status: 400 });
      }
      if (!userId) {
         return NextResponse.json({ error: 'User not found' }, { status: 400 });
      }

      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { $pull: { books: { _id: bookId } } },
         { new: true }
      );

      if (!updatedUser) {
         return NextResponse.json(
            { error: 'An error occurred while deleting the book' },
            { status: 404 }
         );
      }

      return NextResponse.json({
         message: 'Book deleted successfully',
         user: updatedUser,
      });
   } catch (error) {
      console.error('Error deleting book:', error);
      return NextResponse.json(
         { error: 'An error occurred while deleting the book' },
         { status: 500 }
      );
   }
}
