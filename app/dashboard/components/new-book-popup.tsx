import Image from 'next/image';
import bookWhiteIcon from '~/public/icons/book-open-white.svg';
import greyBook from '~/public/icons/book-open-grey.svg';
import loading from '~/public/images/load.svg';
import danger from '~/public/icons/exclamation.svg';
import { useDashboard } from '~/app/context/dashboard-context';
import { useUser } from '~/app/context/auth-context';
export const NewBookPopup = () => {
   const {
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
   } = useDashboard();
   const { isDarkMode } = useUser();
   return (
      newBook && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6 gap-4 rounded-2xl bg-white items-center dark:bg-dark-grey       ${
                  isNewBookVisible ? '' : 'pop-hidden'
               }`}
               ref={newBookRef}
            >
               <div className="flex flex-col gap-1 items-center">
                  <Image className="w-14 h-14" src={greyBook} alt="" />
                  <h1 className="fancy text-[22px] text-black dark:text-white">
                     Create a new book
                  </h1>
               </div>

               <p className="text-sm text-center text-grey dark:text-dimGrey">
                  All your entries go in a book. You can create as many books as
                  you want.
               </p>
               <div className="flex flex-col gap-1 w-full">
                  <div className="relative w-full flex items-center justify-center">
                     <input
                        className={`h-[40px] py-1 px-3 bg-lightGrey text-black  text-sm rounded-lg border  focus:ring-2 focus:bg-lightPurple   ring-purple outline-none w-full dark:bg-dark-darkPurple dark:border-dark-lightGrey dark:text-white    ${
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
                           <Image className="w-5" src={bookWhiteIcon} alt="" />
                           <span>Create book</span>
                        </>
                     )}
                  </button>
                  <button
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  dark:bg-dark-purple dark:text-white "
                     onClick={toggleNewBookPopup}
                  >
                     Close
                  </button>
               </div>
            </div>
         </div>
      )
   );
};
