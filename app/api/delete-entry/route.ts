import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function DELETE(req: NextRequest) {
   try {
      await connectMongo();

      const { userId, entryId, book } = await req.json();

      if (!entryId || !userId) {
         return NextResponse.json(
            { error: 'Entry ID and user ID are required' },
            { status: 400 }
         );
      }

      const updatedUser = await User.findOneAndUpdate(
         { _id: userId, 'books.name': book },
         {
            $pull: {
               'books.$.entries': {
                  _id: entryId,
               },
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
         message: 'Entry deleted successfully',
      });
   } catch (error) {
      return NextResponse.json(
         { error: 'An error occurred while deleting the entry' },
         { status: 500 }
      );
   }
}
