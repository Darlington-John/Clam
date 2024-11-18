import Link from 'next/link';
import DeleteInfo from './delete-info';
import DeleteBook from './delete-book';
import { FaCheck } from 'react-icons/fa';
import { useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import { usePopup } from '~/utils/tooggle-popups';
import { usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import Image from 'next/image';
import more from '~/public/icons/dots-horizontal.svg';

import bookOpenGrey from '~/public/icons/book-open-grey.svg';
const SidebarCard = (props: any) => {
   const { user } = useUser();
   const {
      isVisible: isDeleteInfoVisible,
      isActive: deleteInfo,
      ref: deleteInfoRef,
      togglePopup: toggleDeleteInfoPopup,
   } = usePopup();
   const {
      isVisible: isDeleteBookVisible,
      isActive: deleteBook,
      ref: deleteBookRef,
      togglePopup: toggleDeleteBookPopup,
   } = usePopup();
   const [isDeleting, setIsDeleting] = useState(false);
   const removeBook = async () => {
      const bookId = props.book._id;
      if (!bookId.trim()) {
         toast.error('Book not found');
         return;
      }

      try {
         setIsDeleting(true);

         const userId = user?._id;
         if (!userId) {
            toast.error('User not authenticated');
         }

         const res = await fetch('/api/delete-book', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               bookId: bookId,
               userId,
            }),
         });

         if (!res.ok) {
            const data = await res.json();
            toast.error(data.error);
         }
         toast.success(`Book deleted`, {
            icon: <FaCheck color="white" />,
         });

         toggleDeleteBookPopup();
      } catch (error) {
         console.error('Error creating book:', error);
      } finally {
         setIsDeleting(false);
      }
   };
   const linkname = usePathname();

   const deleteInfoProps = {
      toggleDeleteBookPopup,
      toggleDeleteInfoPopup,
      deleteInfo,
      isDeleteInfoVisible,
      deleteInfoRef,
   };

   const deleteBookProps = {
      deleteBook,
      isDeleteBookVisible,
      deleteBookRef,
      removeBook,
      isDeleting,
      toggleDeleteBookPopup,
      props,
   };

   return (
      <div className="relative flex  items-center">
         <Link
            href={`/dashboard/books/${props.book._id}`}
            className={`  rounded-lg py-2 pl-3 pr-5  text-[22px] fancy flex items-center  gap-2  w-full xl:text-xl relative   ${
               linkname === `/dashboard/books/${props.book._id}` &&
               ' bg-[#F1F1F4]'
            }`}
            key={props.book._id}
         >
            <Image src={bookOpenGrey} alt="" className="w-5 h-5  " />
            <span className="line-clamp-1">{props.book.name}</span>
         </Link>
         {linkname !== `/dashboard/books/${props.book._id}` && (
            <Image
               src={more}
               alt=""
               className="w-4  h-4  absolute right-2  cursor-pointer"
               onClick={toggleDeleteInfoPopup}
            />
         )}

         <DeleteInfo {...deleteInfoProps} />
         <DeleteBook {...deleteBookProps} />
      </div>
   );
};

export default SidebarCard;
