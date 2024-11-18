import Image from 'next/image';
import loading from '~/public/images/load.svg';
import trashCan from '~/public/icons/trash-can.svg';
import trashWhite from '~/public/icons/trash-white.svg';
const DeleteBook = (props: any) => {
   const {
      deleteBook,
      isDeleteBookVisible,
      deleteBookRef,
      removeBook,
      isDeleting,
      toggleDeleteBookPopup,
      props: book,
   } = props;
   return (
      deleteBook && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-4 rounded-2xl bg-white items-center      ${
                  isDeleteBookVisible ? '' : 'pop-hidden'
               }`}
               ref={deleteBookRef}
            >
               <div className="flex flex-col items-center w-full  gap-1">
                  <Image src={trashCan} alt="" className="w-10  h-10" />
                  <h1 className="text-[22px] fancy text-center ">
                     Delete this book
                  </h1>
                  <p className="text-sm  leading-[20px]  text-center text-grey">
                     You’re about to delete {`'${book.book.name}'`}. All entries
                     within it will also be deleted. You can’t undo this. Are
                     you sure you want to delete this book?
                  </p>
               </div>
               <div className="flex items-center gap-3">
                  <button
                     className="bg-red text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-red  duration-300 flex items-center gap-2 norm-mid text-sm  "
                     onClick={removeBook}
                     disabled={isDeleting}
                  >
                     {isDeleting ? (
                        <Image className="w-8" src={loading} alt="loading" />
                     ) : (
                        <Image className="w-5" src={trashWhite} alt="" />
                     )}
                     <>
                        <span>{isDeleting ? 'Deleting' : 'Delete book'}</span>
                     </>
                  </button>
                  <button
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                     onClick={toggleDeleteBookPopup}
                  >
                     Close
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default DeleteBook;
