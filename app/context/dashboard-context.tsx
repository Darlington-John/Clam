'use client';
import React, {
   createContext,
   useContext,
   useState,
   useMemo,
   useRef,
   useCallback,
   useEffect,
} from 'react';
import { useUser } from './auth-context';
import { usePopup } from '~/utils/tooggle-popups';
import { toast } from 'react-toastify';
import { FaCheck } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [isOverlayOpen, setIsOverlayOpen] = useState(false);
   const { user } = useUser();
   const router = useRouter();
   const allUserEntries = useMemo(() => {
      const entriesWithBook: Array<{ entry: any; book: any }> = [];

      if (user && user.books) {
         user.books.forEach((book: any) => {
            book.entries.forEach((entry: any) => {
               entriesWithBook.push({ entry, book });
            });
         });
      }

      entriesWithBook.sort((a, b) => {
         const dateA = new Date(a.entry.createdAt).getTime();
         const dateB = new Date(b.entry.createdAt).getTime();
         return dateB - dateA;
      });
      return entriesWithBook;
   }, [user]);
   const {
      isVisible: isNewBookVisible,
      isActive: newBook,
      ref: newBookRef,
      togglePopup: toggleNewBookPopup,
   } = usePopup();
   const [error, setError] = useState('');
   const [bookName, setBookName] = useState('');
   const [isCreating, setIsCreating] = useState(false);
   const createBook = useCallback(async () => {
      if (!bookName.trim()) {
         setError('Enter book name first');
         return;
      }

      try {
         setIsCreating(true);
         setError('');

         const userId = user?._id;
         if (!userId) {
            setError('User not authenticated');
            return;
         }

         const res = await fetch('/api/create-book', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               bookName: bookName.trim(),
               userId,
            }),
         });
         const data = await res.json();
         if (!res.ok) {
            throw new Error(data.message || 'Failed to create book');
         }

         toast.success(`Book created successfully`, {
            icon: <FaCheck color="white" />,
         });
         toggleNewBookPopup();
         setBookName('');
         setTimeout(() => {
            router.push(`/dashboard/books/${data.bookId}`);
         }, 2000);
      } catch (error) {
         console.error('Error creating book:', error);
         setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
         setIsCreating(false);
      }
   }, [bookName, toggleNewBookPopup, user, router]);
   const {
      isVisible: isFirstThingsVisible,
      isActive: firstThings,
      ref: firstThingsRef,
      togglePopup: toggleFirstThingsPopup,
   } = usePopup();
   const [popupShown, setPopupShown] = useState(false);

   useEffect(() => {
      if (popupShown || newBook) {
         return;
      }
      if (!user || user?.books?.length > 0 || firstThings) {
         return;
      }

      setTimeout(() => {
         toggleFirstThingsPopup();
         setPopupShown(true);
      }, 5000);
      // setTimeout(() => {
      //    setPopupShown(true);
      // }, 6000);
   }, [user, firstThings, popupShown]);
   const providerValue = useMemo(
      () => ({
         isOverlayOpen,
         setIsOverlayOpen,
         allUserEntries,
         newBook,
         isNewBookVisible,
         newBookRef,
         error,
         setError,
         createBook,
         isCreating,
         bookName,
         setBookName,
         toggleNewBookPopup,
         isFirstThingsVisible,
         firstThings,
         firstThingsRef,
         toggleFirstThingsPopup,
      }),
      [
         isOverlayOpen,
         setIsOverlayOpen,
         allUserEntries,
         newBook,
         isNewBookVisible,
         newBookRef,
         error,
         setError,
         createBook,
         isCreating,
         bookName,
         setBookName,
         toggleNewBookPopup,
         isFirstThingsVisible,
         firstThings,
         firstThingsRef,
         toggleFirstThingsPopup,
      ]
   );

   return (
      <DashboardContext.Provider value={providerValue}>
         {children}
      </DashboardContext.Provider>
   );
};

export const useDashboard = () => useContext(DashboardContext);
