'use client';
import Image from 'next/image';
import book from '~/public/icons/book-open-.svg';
import { usePopup } from '~/utils/tooggle-popups';
import right from '~/public/icons/chevron-right.svg';
import { useEffect, useRef, useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import BookCashFlow from './cash-flow';
import BookEntries from './entries';
import EntryPopup from './entry-popup';
const BookDetails = ({ bookData }: any) => {
     const { user } = useUser();
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
     const [activeButton, setActiveButton] = useState<'income' | 'expense'>(
          'income'
     );
     const toggleButton = (button: 'income' | 'expense') => {
          setActiveButton(button);
     };
     const [amount, setAmount] = useState('');
     const spanRef = useRef<HTMLSpanElement>(null);
     const [inputWidth, setInputWidth] = useState(170);
     useEffect(() => {
          if (spanRef.current) {
               const newWidth = amount ? spanRef.current.offsetWidth : 170;
               setInputWidth(newWidth);
          }
     }, [amount]);
     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newAmount = e.target.value;
          if (/^\d*$/.test(newAmount)) {
               setAmount(newAmount);
          }
     };
     const [note, setNote] = useState('');
     const [tagValue, setTagValue] = useState('');
     const tags = ['important', 'fun', 'emergency', 'urgent', 'miscellaneous'];

     const handleTagClick = (tagValue: string) => {
          setTagValue(tagValue);
     };

     const [error, setError] = useState('');
     const [addEntryLoading, setAddEntryLoading] = useState(false);
     const createEntry = async () => {
          if (!amount.trim()) {
               setError('Enter an amount');
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
                         amount: amount,
                         income: activeButton === 'income',
                         expense: activeButton === 'expense',
                         book: bookData?.name,
                         tag: tagValue,
                         note: note,
                         userId,
                    }),
               });

               if (!res.ok) {
                    setError('Failed to create entry');
               }
               setAmount('');
               setTagValue('');
               setNote('');
               setActiveButton('income');
               toggleAddEntryPopup();
          } catch (error) {
               setError(
                    error instanceof Error ? error.message : 'An error occurred'
               );
          } finally {
               setAddEntryLoading(false);
          }
     };
     const [description, setDescription] = useState('');
     const [addDescriptionLoading, setAddDescriptionLoading] = useState(false);
     const [addDescriptionError, setAddDescriptionError] = useState('');
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
          } catch (error) {
               setAddDescriptionError(
                    error instanceof Error ? error.message : 'An error occurred'
               );
          } finally {
               setAddDescriptionLoading(false);
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
          setDescription,
     };
     return (
          <div className="bg-lightestGrey h-full w-full px-6 flex flex-col gap-4">
               <div className="flex items-center justify-between w-full hidden sm:flex bg-white  py-2 px-4 rounded-[8px]">
                    <div className="flex items-center gap-2">
                         <Image src={book} className="w-5 h-5" alt="" />
                         <h1 className="text-[17px] text-black  fancy">
                              {bookData?.name}
                         </h1>
                    </div>
                    <Image src={right} className="w-5 h-5" alt="" />
               </div>
               <BookCashFlow {...cashFlowProps} />
               <BookEntries
                    bookData={bookData}
                    toggleAddEntryPopup={toggleAddEntryPopup}
               />
               <EntryPopup {...entryPopupProps} />
          </div>
     );
};
export default BookDetails;
