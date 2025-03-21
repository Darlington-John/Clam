import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '~/lib/mongodb';
import User from '~/models/User';

export async function GET(req: NextRequest, context: { params: any }) {
   try {
      await connectMongo();
      const { bookId } = await context.params;

      const { searchParams } = new URL(req.url);
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limitParam = searchParams.get('limit');
      const limit = limitParam ? parseInt(limitParam, 10) : null;

      const user = await User.findOne(
         { 'books._id': bookId },
         { 'books.$': 1 }
      ).lean();

      if (!user || !user.books.length) {
         return NextResponse.json({ error: 'Book not found' }, { status: 404 });
      }

      const book: any = user.books[0];

      let sortedEntries = book.entries.sort(
         (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      if (limit) {
         sortedEntries = sortedEntries.slice((page - 1) * limit, page * limit);
      }

      const incomeTotal = book.entries.reduce((total: any, entry: any) => {
         return entry.income ? total + parseFloat(entry.amount) : total;
      }, 0);

      const expenseTotal = book.entries.reduce((total: any, entry: any) => {
         return entry.expense ? total + parseFloat(entry.amount) : total;
      }, 0);

      const cleanBook = {
         name: book.name,
         entries: sortedEntries,
         description: book.description,
         _id: book._id,
         totalEntries: book.entries.length,
         incomeTotal,
         expenseTotal,
      };

      return NextResponse.json({ book: cleanBook });
   } catch (error) {
      console.error('Error fetching book data:', error);
      return NextResponse.json(
         { error: 'Failed to fetch book data' },
         { status: 500 }
      );
   }
}
