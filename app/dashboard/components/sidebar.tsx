import Image from 'next/image';
import logo from '~/public/images/Logo.png';
import home from '~/public/icons/home.svg';
import book from '~/public/icons/book-open-.svg';
import bookOpenGrey from '~/public/icons/book-open-grey.svg';
import { useUser } from '~/app/context/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { usePopup } from '~/utils/tooggle-popups';
import { useState } from 'react';

import bookWhiteIcon from '~/public/icons/book-open-white.svg';
import greyBook from '~/public/icons/book-open-grey.svg';
import loading from '~/public/images/load.svg';
import danger from '~/public/icons/exclamation.svg';

const Sidebar = ({ hidden }: any) => {
   const { user } = useUser();

   const linkname = usePathname();
   const {
      isVisible: isNewBookVisible,
      isActive: newBook,
      ref: newBookRef,
      togglePopup: toggleNewBookPopup,
   } = usePopup();

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

         toast.success('Book created successfully');
         toggleNewBookPopup();
         setBookName('');
      } catch (error) {
         console.error('Error creating book:', error);
         setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
         setIsCreating(false);
      }
   };
   return (
      <section
         className={`h-full w-[260px] px-6 pt-10 pb-5 flex flex-col gap-6 items-start shrink-0  xl:w-[200px] xl:pt-5 xl:px-2  bg-white lg:w-[260px] lg:px-4    ${
            hidden && 'lg:hidden'
         }`}
      >
         <div className="flex  items-center justify-between  w-full">
            <Image
               src={logo}
               alt=""
               className="w-[110px] xl:w-[90px] shrink-0"
            />
         </div>
         <h1 className="text-grey text-sm">YOUR BOOKS</h1>
         <div className="h-full  w-full flex flex-col gap-2">
            <Link
               href={'/dashboard'}
               className={`  rounded-lg py-2 px-3 text-[22px] fancy flex items-center  gap-2  w-full xl:text-xl  ${
                  linkname === '/dashboard' && ' bg-[#F1F1F4]'
               }`}
            >
               <Image src={home} alt="" className="w-5 h-5  " />
               <span>Overview</span>
            </Link>
            {user?.books
               .slice()
               .reverse()
               .map((book: any) => (
                  <Link
                     href={`/dashboard/books/${book._id}`}
                     className={`  rounded-lg py-2 px-3 text-[22px] fancy flex items-center  gap-2  w-full xl:text-xl  ${
                        linkname === `/dashboard/books/${book._id}` &&
                        ' bg-[#F1F1F4]'
                     }`}
                     key={book._id}
                  >
                     <Image src={bookOpenGrey} alt="" className="w-5 h-5  " />
                     <span className="line-clamp-1">{book.name}</span>
                  </Link>
               ))}
         </div>
         <button
            className="bg-purple text-white flex items-center   h-[32px] text-sm  norm-mid    gap-2  shrink-0  w-auto py-2 px-3 rounded-full  hover:ring hover:ring-offset-1  ring-purple duration-300"
            onClick={toggleNewBookPopup}
         >
            <Image src={book} alt="" className="w-5 h-5" />
            <span>New Book</span>
         </button>
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
      </section>
   );
};

export default Sidebar;
