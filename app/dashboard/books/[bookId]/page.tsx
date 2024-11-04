import connectMongo from '~/lib/mongodb';
import User from '~/models/User';
import BookDetails from '../book-details/book-details';

const BookPage = async ({ params }: any) => {
     const { bookId } = await params;
     try {
          await connectMongo();

          const user = await User.findOne(
               { 'books._id': bookId },
               { 'books.$': 1 }
          ).lean();

          if (!user || !user.books.length) {
               return null;
          }

          const book: any = user?.books[0];

          const cleanBook = JSON.parse(
               JSON.stringify({
                    name: book.name,
                    entries: book.entries || [],

                    _id: book._id as string,
               })
          );

          return <BookDetails bookData={cleanBook} />;
     } catch (error) {
          console.error('Error fetching book data:', error);
          return null;
     }
};

export default BookPage;
