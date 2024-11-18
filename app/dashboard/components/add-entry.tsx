import Image from 'next/image';
import bolt from '~/public/icons/lightning-bolt.svg';
import bookIcon from '~/public/icons/book-open.svg';
import bookAdd from '~/public/icons/document-add.svg';
import sparkles from '~/public/icons/sparkles.svg';
import { usePopup } from '~/utils/tooggle-popups';
import { useUser } from '~/app/context/auth-context';
import bookWhiteIcon from '~/public/icons/book-open-white.svg';
import greyBook from '~/public/icons/book-open-grey.svg';
import wave from '~/public/icons/wave.svg';
import loading from '~/public/images/load.svg';
import danger from '~/public/icons/exclamation.svg';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { FaCheck } from 'react-icons/fa';
import { useDashboard } from '~/app/context/dashboard-context';
const AddEntry = () => {
   const { user } = useUser();
   const {
      isVisible: isNewEntryVisible,
      isActive: newEntry,
      ref: newEntryRef,
      togglePopup: toggleNewEntryPopup,
   } = usePopup();
   const { isNewBookVisible, newBook, newBookRef, toggleNewBookPopup } =
      useDashboard();
   const [error, setError] = useState('');
   const [bookName, setBookName] = useState('');
   const [isCreating, setIsCreating] = useState(false);
   const createBook = async () => {
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

         if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Failed to create book');
         }
         toast.success(`Book created successfully`, {
            icon: <FaCheck color="white" />,
         });
         toggleNewBookPopup();
         setBookName('');
      } catch (error) {
         console.error('Error creating book:', error);
         setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
         setIsCreating(false);
      }
   };
   const buttons = [
      {
         id: 2,
         function: 'Create a book',
         icon: bookIcon,
         onClick:
            user?.books?.length > 0 ? toggleNewBookPopup : toggleNewEntryPopup,
      },
      {
         id: 3,
         function: 'Upload a report',
         icon: bookAdd,
         onClick:
            user?.books?.length > 0 ? toggleNewBookPopup : toggleNewEntryPopup,
      },
      {
         id: 4,
         function: 'Summarize status',
         icon: sparkles,
         onClick:
            user?.books?.length > 0 ? toggleNewBookPopup : toggleNewEntryPopup,
      },
   ];

   return (
      <div className="md:w-full overflow-x-auto  overflow-y-hidden min-h-[100px] pl-6">
         <div className="flex w-full items-center gap-4 justify-center  py-8  px-6    md:justify-auto   md:w-[600px] md:pb-4">
            <Image className="w-5" src={bolt} alt="" />
            <div className="flex items-center gap-2 p-2 rounded-full bg-white    shrink-0">
               {buttons.map((data, index) => (
                  <button
                     className="h-[32px]  py-2 px-3 rounded-full flex items-center gap-2 bg-lightPurple norm-mid text-sm text-purple hover:ring hover:ring-2 ring-purple duration-300 "
                     key={index + 1}
                     onClick={data.onClick}
                  >
                     <Image className="w-5" src={data.icon} alt="" />
                     <span>{data.function}</span>
                  </button>
               ))}
            </div>
            <Image className="w-5" src={bolt} alt="" />
         </div>
         {newEntry && (
            <div
               className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
            >
               <div
                  className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6 gap-4 rounded-2xl bg-white items-center     ${
                     isNewEntryVisible ? '' : 'pop-hidden'
                  }`}
                  ref={newEntryRef}
               >
                  <Image className="w-14 h-14" src={wave} alt="" />
                  <h1 className="fancy text-[22px] text-black">
                     First thing first
                  </h1>
                  <p className="text-sm text-center">
                     You’d need to create a book to start recording your
                     entries. Think of books like folders for your entries. You
                     can create as many books as you want.
                  </p>
                  <div className="flex items-center gap-3">
                     <button
                        className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm  "
                        onClick={() => {
                           toggleNewBookPopup();
                           toggleNewEntryPopup();
                        }}
                     >
                        <Image className="w-5" src={bookWhiteIcon} alt="" />
                        <span>Create a book</span>
                     </button>
                     <button
                        className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                        onClick={toggleNewEntryPopup}
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
         {newBook && (
            <div
               className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
            >
               <div
                  className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6 gap-4 rounded-2xl bg-white items-center     ${
                     isNewBookVisible ? '' : 'pop-hidden'
                  }`}
                  ref={newBookRef}
               >
                  <div className="flex flex-col gap-1 items-center">
                     <Image className="w-14 h-14" src={greyBook} alt="" />
                     <h1 className="fancy text-[22px] text-black">
                        Create a new book
                     </h1>
                  </div>

                  <p className="text-sm text-center text-grey">
                     All your entries go in a book. You can create as many books
                     as you want.
                  </p>
                  <div className="flex flex-col gap-1 w-full">
                     <div className="relative w-full flex items-center justify-center">
                        <input
                           className={`h-[40px] py-1 px-3 bg-lightGrey text-black  text-sm rounded-lg border  focus:ring-2 focus:bg-lightPurple   ring-purple outline-none w-full  ${
                              error ? 'border-red pr-8' : 'border-[#DFDDE3]'
                           }`}
                           placeholder="Book name"
                           type="text"
                           name="bookName"
                           value={bookName}
                           onChange={(e) => {
                              setBookName(e.target.value);
                              setError('');
                           }}
                           required
                        />
                        {error && (
                           <Image
                              src={danger}
                              alt=""
                              className="w-5 absolute  right-2 cursor-pointer "
                           />
                        )}
                     </div>
                     {error && <p className="text-red text-[9px]">{error}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                     <button
                        className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm  "
                        onClick={createBook}
                        disabled={isCreating}
                     >
                        {isCreating ? (
                           <Image className="w-8" src={loading} alt="loading" />
                        ) : (
                           <>
                              {' '}
                              <Image
                                 className="w-5"
                                 src={bookWhiteIcon}
                                 alt=""
                              />
                              <span>Create book</span>
                           </>
                        )}
                     </button>
                     <button
                        className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                        onClick={toggleNewBookPopup}
                     >
                        Close
                     </button>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default AddEntry;
