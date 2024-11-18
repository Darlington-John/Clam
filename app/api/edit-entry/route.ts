import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
   try {
      await connectMongo();

      const { amount, income, expense, book, tag, note, userId, entryId } =
         await req.json().catch(() => {
            return NextResponse.json(
               { error: 'Invalid JSON format' },
               { status: 400 }
            );
         });

      if (!amount || !book || !userId || !entryId) {
         return NextResponse.json(
            { error: 'Amount, book name, user ID and entry Id are required' },
            { status: 400 }
         );
      }

      const updatedUser = await User.updateOne(
         { _id: userId, 'books.name': book, 'books.entries._id': entryId },
         {
            $set: {
               'books.$[bookElem].entries.$[entryElem].amount': amount,
               'books.$[bookElem].entries.$[entryElem].income': income,
               'books.$[bookElem].entries.$[entryElem].expense': expense,
               'books.$[bookElem].entries.$[entryElem].tag': tag,
               'books.$[bookElem].entries.$[entryElem].note': note,
            },
         },
         {
            arrayFilters: [
               { 'bookElem.name': book },
               { 'entryElem._id': entryId },
            ],
            new: true,
         }
      );

      if (!updatedUser) {
         return NextResponse.json(
            { error: 'User or book not found' },
            { status: 404 }
         );
      }

      return NextResponse.json({
         message: 'Entry edited successfully',
      });
   } catch (error) {
      return NextResponse.json(
         { error: 'An error occurred while editing the entry' },
         { status: 500 }
      );
   }
}
