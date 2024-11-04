import { NextRequest, NextResponse } from 'next/server';
import User from '~/models/User';
import connectMongo from '~/lib/mongodb';

export async function POST(req: NextRequest) {
     try {
          await connectMongo();

          const { amount, income, expense, book, tag, note, userId } =
               await req.json();

          if (!amount || !book || !userId) {
               return NextResponse.json(
                    { error: 'Amount, book name, and user ID are required' },
                    { status: 400 }
               );
          }

          const updatedUser = await User.findOneAndUpdate(
               { _id: userId, 'books.name': book },
               {
                    $push: {
                         'books.$.entries': {
                              amount,
                              income,
                              expense,
                              tag,
                              note,
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
               message: 'Entry created successfully',
          });
     } catch (error) {
          return NextResponse.json(
               { error: 'An error occurred while creating the entry' },
               { status: 500 }
          );
     }
}
