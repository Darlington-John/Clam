'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { useUser } from '~/app/context/auth-context';
import { usePopup } from '~/utils/tooggle-popups';
import BookCashFlow from '../book-details/cash-flow';
import EntryPopup from '../book-details/entry-popup';
import bookIcon from '~/public/icons/book-open-.svg';
import rightIcon from '~/public/icons/chevron-right.svg';
import BookEntries from '../book-details/book-entries/book-entries';
import { generatePDF } from '~/utils/generate-pdf';
const BookPage = () => {
   const { user } = useUser();
   const { bookId } = useParams();
   const [bookData, setBookData] = useState<any>(null);
   const [isLoading, setIsLoading] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalEntries, setTotalEntries] = useState(0);
   const [totalPages, setTotalPages] = useState(0);
   const [incomeTotal, setIncomeTotal] = useState(0);
   const [expenseTotal, setExpenseTotal] = useState(0);

   const [entriesLimit, setEntriesLimit] = useState(10);
   const [amount, setAmount] = useState('');
   const [note, setNote] = useState('');
   const [tagValue, setTagValue] = useState('');
   const [error, setError] = useState('');
   const [addEntryLoading, setAddEntryLoading] = useState(false);
   const [description, setDescription] = useState('');
   const [addDescriptionLoading, setAddDescriptionLoading] = useState(false);
   const [addDescriptionError, setAddDescriptionError] = useState('');
   const [isDeleting, setIsDeleting] = useState(false);
   const [editDescription, setEditDescription] = useState(false);
   const spanRef = useRef<HTMLSpanElement>(null);
   const [inputWidth, setInputWidth] = useState(170);

   const {
      isVisible: isAddEntryVisible,
      isActive: addEntry,
      ref: addEntryRef,
      togglePopup: toggleAddEntryPopup,
   } = usePopup();

   const {
      isVisible: isTagVisible,
      isActive: tag,
      setIsActive: setIsTagActive,
      ref: tagRef,
      togglePopup: toggleTagPopup,
   } = usePopup();
   const cashFlowRef = useRef<HTMLDivElement>(null);
   const footerRef = useRef<HTMLDivElement>(null);
   const [targetHeight, setTargetHeight] = useState<number>(320);
   useEffect(() => {
      const calculateHeight = () => {
         try {
            const viewportHeight = window.innerHeight;
            const headerHeight =
               cashFlowRef.current?.getBoundingClientRect().height || 60;
            const footerHeight =
               footerRef.current?.getBoundingClientRect().height || 180;
            const calculatedHeight =
               viewportHeight - (headerHeight + footerHeight);

            setTargetHeight(calculatedHeight > 0 ? calculatedHeight : 320);
         } catch (error) {
            console.error('Error calculating height:', error);
            setTargetHeight(320);
         }
      };

      calculateHeight();
      window.addEventListener('resize', calculateHeight);

      return () => {
         window.removeEventListener('resize', calculateHeight);
      };
   }, []);

   const [activeButton, setActiveButton] = useState<'income' | 'expense'>(
      'income'
   );
   const tags = ['important', 'fun', 'emergency', 'urgent', 'miscellaneous'];

   useEffect(() => {
      const fetchBookData = async (page: any) => {
         setIsLoading(true);
         try {
            const screenSize = window.innerWidth;

            if (screenSize > 1700) {
               setEntriesLimit(20);
            } else if (screenSize <= 1600) {
               setEntriesLimit(10);
            }

            const res = await fetch(
               `/api/books/${bookId}?page=${page}&limit=${entriesLimit}`
            );
            if (res.ok) {
               const data = await res.json();
               setBookData(data.book);
               setTotalEntries(data.book.totalEntries);
               setIncomeTotal(data.book.incomeTotal);
               setExpenseTotal(data.book.expenseTotal);
               setTotalPages(Math.ceil(data.book.totalEntries / entriesLimit));
            } else {
               console.error('Error fetching updated book data');
            }
         } catch (error) {
            console.error('Error during fetching:', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchBookData(currentPage);

      const handleEntryCreated = () => {
         fetchBookData(currentPage);
      };
      window.addEventListener('entryUpdated', handleEntryCreated);

      return () => {
         window.removeEventListener('entryUpdated', handleEntryCreated);
      };
   }, [bookId, currentPage, entriesLimit]);
   useEffect(() => {
      if (spanRef.current) {
         const newWidth = amount ? spanRef.current.offsetWidth : 170;
         setInputWidth(newWidth);
      }
   }, [amount]);

   const handleNextPage = () => {
      if (currentPage < totalPages) {
         setCurrentPage((prevPage) => prevPage + 1);
      }
   };

   const handlePreviousPage = () => {
      if (currentPage > 1) {
         setCurrentPage((prevPage) => prevPage - 1);
      }
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = e.target.value;
      if (/^\d*$/.test(newAmount)) {
         setAmount(newAmount);
      }
   };

   const handleTagClick = (tagValue: string) => {
      setTagValue(tagValue);
   };

   const toggleButton = (button: 'income' | 'expense') => {
      setActiveButton(button);
   };

   const createEntry = async () => {
      if (!amount.trim()) {
         setError('Enter an amount');
         return;
      }
      if (addEntryLoading) {
         return;
      }
      try {
         setAddEntryLoading(true);
         setError('');

         const userId = user?._id;
         if (!userId) {
            setError('User not authenticated');
            return;
         }
         const bookId = bookData?._id;
         if (!bookId) {
            setError('Book not found');
            return;
         }

         const res = await fetch('/api/create-entry', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               amount,
               income: activeButton === 'income',
               expense: activeButton === 'expense',
               book: bookData?.name,
               tag: tagValue,
               note,
               userId,
            }),
         });

         if (!res.ok) {
            setError('Failed to create entry');
            toast.error('Failed to create entry');
         }
         setAmount('');
         setTagValue('');
         setNote('');
         setActiveButton('income');
         toggleAddEntryPopup();
         const event = new Event('entryUpdated');
         window.dispatchEvent(event);
         toast.success(`Entry created successfully`, {
            icon: <FaCheck color="white" />,
         });
      } catch (error) {
         setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
         setAddEntryLoading(false);
      }
   };

   const addDescription = async () => {
      if (!description.trim()) {
         setAddDescriptionError('Enter a description');
         return;
      }
      try {
         setAddDescriptionLoading(true);
         setAddDescriptionError('');

         const userId = user?._id;
         if (!userId) {
            setAddDescriptionError('User not authenticated');
            return;
         }
         const bookId = bookData?._id;
         if (!bookId) {
            setAddDescriptionError('Book not found');
            return;
         }

         const res = await fetch('/api/add-description', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               description,
               book: bookData?.name,
               userId,
            }),
         });

         if (!res.ok) {
            setAddDescriptionError('Failed to add description');
         }
         setDescription('');
         const event = new Event('entryUpdated');

         window.dispatchEvent(event);
         toast.success(`Description added successfully`, {
            icon: <FaCheck color="white" />,
         });
         setEditDescription(false);
      } catch (error) {
         setAddDescriptionError(
            error instanceof Error ? error.message : 'An error occurred'
         );
      } finally {
         setAddDescriptionLoading(false);
      }
   };

   const handleDeleteEntry = async (entryId: string) => {
      const userId = user?._id;
      if (!userId) {
         toast.error('User not authenticated');
         return;
      }
      if (isDeleting) {
         return;
      }
      setIsDeleting(true);

      try {
         const res = await fetch('/api/delete-entry', {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               userId,
               entryId,
               book: bookData?.name,
            }),
         });

         if (!res.ok) {
            toast.error(`Couldn't delete the entry`);
         } else {
            const event = new Event('entryUpdated');
            window.dispatchEvent(event);
            toast.success(`Entry deleted successfully`, {
               icon: <FaCheck color="white" />,
            });
         }
      } catch (error) {
         console.error('Error deleting message:', error);
      } finally {
         setIsDeleting(false);
      }
   };

   const entryPopupProps = {
      addEntry,
      isAddEntryVisible,
      addEntryRef,
      toggleAddEntryPopup,
      toggleButton,
      activeButton,
      amount,
      handleChange,
      setError,
      note,
      setNote,
      tagValue,
      setTagValue,
      handleTagClick,
      tag,
      isTagVisible,
      tagRef,
      toggleTagPopup,
      createEntry,
      addEntryLoading,
      inputWidth,
      spanRef,
      error,
      setIsTagActive,
      tags,
   };

   const cashFlowProps = {
      bookData,
      addDescription,
      addDescriptionLoading,
      addDescriptionError,
      setAddDescriptionError,
      description,
      incomeTotal,
      expenseTotal,
      setDescription,
      editDescription,
      setEditDescription,
   };

   const paginationProps = {
      currentPage,
      handleNextPage,
      handlePreviousPage,
      totalEntries,
      entriesLimit,
      totalPages,
   };

   const bookEntriesProps = {
      bookData,
      toggleAddEntryPopup,
      paginationProps,
      isLoading,
      handleDeleteEntry,
      targetHeight,
      inputWidth,
      spanRef,
      generatePDF,
   };
   return (
      <div className="h-auto w-full px-6 flex flex-col gap-4 pb-5 ">
         {/* <iframe
            id="pdf-preview"
            style={{ width: '100%', height: '500px' }}
         ></iframe> */}

         <div className="flex items-center justify-between w-full hidden sm:flex bg-white py-2 px-4 rounded-[8px]">
            <div className="flex items-center gap-2">
               <Image src={bookIcon} className="w-5 h-5" alt="Book Icon" />
               <h1 className="text-[17px] text-black fancy">
                  {bookData?.name}
               </h1>
            </div>
            <Image src={rightIcon} className="w-5 h-5" alt="Right Icon" />
         </div>
         <div ref={cashFlowRef}>
            <BookCashFlow {...cashFlowProps} />
         </div>
         <div>
            <BookEntries {...bookEntriesProps} />
         </div>
         <EntryPopup {...entryPopupProps} />
      </div>
   );
};

export default BookPage;
