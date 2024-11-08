'use client';
import React, {
   createContext,
   useContext,
   useState,
   useMemo,
   useRef,
} from 'react';
import { useUser } from './auth-context';

const DashboardContext = createContext<any>(null);

export const DashboardProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [isOverlayOpen, setIsOverlayOpen] = useState(false);
   const { user } = useUser();
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
   const providerValue = useMemo(
      () => ({ isOverlayOpen, setIsOverlayOpen, allUserEntries }),
      [isOverlayOpen, setIsOverlayOpen, allUserEntries]
   );

   return (
      <DashboardContext.Provider value={providerValue}>
         {children}
      </DashboardContext.Provider>
   );
};

export const useDashboard = () => useContext(DashboardContext);
