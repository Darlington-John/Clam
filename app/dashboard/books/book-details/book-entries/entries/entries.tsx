import { usePopup } from '~/utils/tooggle-popups';
import Image from 'next/image';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import infoGrey from '~/public/icons/information-circle-grey.svg';
import arrowDownFade from '~/public/icons/arrow-circle-down-fade.svg';
import arrowUpFade from '~/public/icons/arrow-circle-up-fade.svg';
import infoCircle from '~/public/icons/information-circle-dark.svg';
import moreFade from '~/public/icons/moreFade.svg';
import { formatDate } from '~/utils/formattedDate';
import moreBlack from '~/public/icons/li_more-horizontal.svg';
import info from '~/public/icons/information-circle-dark.svg';
import trash from '~/public/icons/trash.svg';
import trashFade from '~/public/icons/trashFade.svg';
import pencil from '~/public/icons/pencil.svg';
import { useEffect, useRef, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { useUser } from '~/app/context/auth-context';
import { toast } from 'react-toastify';
import EditEntry from './edit-entry';
import EntriesDetails from './entries-details';

const Entries = (props: any) => {
   const {
      isVisible: isDeleteEntryVisible,
      isActive: deleteEntry,
      ref: deleteEntryRef,
      togglePopup: toggleDeleteEntryPopup,
   } = usePopup();
   const { handleDeleteEntry, bookData } = props;
   const {
      isVisible: isEditEntryVisible,
      isActive: editEntryPopup,
      ref: editEntryRef,
      togglePopup: toggleEditEntryPopup,
   } = usePopup();
   const {
      isVisible: isEntryDetailsVisible,
      isActive: entryDetails,
      ref: entryDetailsRef,
      togglePopup: toggleEntryDetailsPopup,
   } = usePopup();
   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 760);
   useEffect(() => {
      const handleResize = () => {
         setIsLargeScreen(window.innerWidth > 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const [error, setError] = useState('');
   const { user, isDarkMode } = useUser();
   const [selectedEntry, setSelectedEntry] = useState<any>(null);
   const [activeEditButton, setActiveEditButton] = useState<
      'income' | 'expense' | ''
   >('');
   const toggleEditButton = (type: 'income' | 'expense') => {
      setActiveEditButton(type);
      if (selectedEntry) {
         setSelectedEntry({
            ...selectedEntry,
            income: type === 'income',
            expense: type === 'expense',
         });
      }
   };
   const handleSelectEntry = (entry: any) => {
      setSelectedEntry(entry);
      setActiveEditButton(
         entry.income ? 'income' : entry.expense ? 'expense' : ''
      );
   };

   const spanRef = useRef<HTMLSpanElement>(null);
   const [inputWidth, setInputWidth] = useState(170);
   useEffect(() => {
      if (spanRef.current) {
         const newWidth = selectedEntry?.amount
            ? spanRef.current.offsetWidth
            : 170;
         setInputWidth(newWidth);
      }
   }, [selectedEntry?.amount]);
   const handleEntryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = e.target.value;

      if (newAmount === '' || /^\d*$/.test(newAmount)) {
         setSelectedEntry((prevEntry: any) => {
            if (prevEntry) {
               return {
                  ...prevEntry,
                  amount: newAmount === '' ? undefined : Number(newAmount),
               };
            }
            return prevEntry;
         });
      }
   };
   const [editEntryLoading, setEditEntryLoading] = useState(false);
   const editEntry = async () => {
      if (!selectedEntry?.amount) {
         setError('Enter an amount');
         return;
      }
      if (editEntryLoading) {
         return;
      }
      try {
         setEditEntryLoading(true);
         setError('');

         const userId = user?._id;
         const entryId = selectedEntry?._id;
         if (!userId) {
            setError('User not authenticated');
            return;
         }
         if (!entryId) {
            setError('Entry not found');
            return;
         }
         const bookId = bookData?._id;
         if (!bookId) {
            setError('Book not found');
            return;
         }

         const res = await fetch('/api/edit-entry', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               amount: selectedEntry?.amount,
               income: activeEditButton === 'income',
               expense: activeEditButton === 'expense',
               book: bookData?.name,
               tag: selectedEntry?.tag,
               note: selectedEntry?.note,
               userId,
               entryId,
            }),
         });

         if (!res.ok) {
            const errorData = await res.json();
            setError(errorData.error || 'Failed to edit entry');
            toast.error('Failed to edit entry');
         }
         toggleEditEntryPopup();
         const event = new Event('entryUpdated');
         window.dispatchEvent(event);
         toast.success(`Entry edited successfully`, {
            icon: <FaCheck color="white" />,
         });
      } catch (error) {
         setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
         setEditEntryLoading(false);
      }
   };

   const editEntryProps = {
      editEntryPopup,
      isEditEntryVisible,
      editEntryRef,
      activeEditButton,
      toggleEditButton,
      selectedEntry,
      handleEntryChange,
      inputWidth,
      error,
      setError,
      spanRef,
      setSelectedEntry,
      editEntryLoading,
      editEntry,
      toggleEditEntryPopup,
   };

   const entryDetailsProps = {
      entryDetails,
      isEntryDetailsVisible,
      entryDetailsRef,
      toggleEntryDetailsPopup,
      toggleEditEntryPopup,
      selectedEntry,
   };
   return (
      props.entry && (
         <div
            className={`flex items-center w-full  h-[40px] bg-white  border-b border-x  border-[#DFDDE3] opacity-100 duration-300 md:w-[760px] dark:border-dark-lightGrey dark:bg-dark-darkPurple dark:text-white   ${
               props.index === props.bookData.entries.length - 1 &&
               'rounded-b-lg '
            }`}
            key={props.index + 1}
         >
            <div className="w-[10%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[20%]">
               <h1 className="text-sm ">{props.entry?.amount}</h1>
               {props.entry?.income ? (
                  <Image
                     src={isDarkMode ? arrowDownFade : arrowDown}
                     className="w-4 h-4"
                     alt=""
                  />
               ) : (
                  <Image
                     src={isDarkMode ? arrowUpFade : arrowUp}
                     className="w-4 h-4"
                     alt=""
                  />
               )}
            </div>
            <div className="w-[12%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[25%] ">
               <h1 className="text-sm ">
                  {formatDate(props.entry?.createdAt)}
               </h1>
               <Image
                  src={isDarkMode ? infoCircle : infoGrey}
                  className="w-4 h-4"
                  alt=""
               />
            </div>
            <div className="w-[10%] h-full text-start  flex items-center  px-3  xl:w-[20%]">
               <h1 className="text-[9px] py-1 px-2  p rounded  border border-lightGreyBorder dark:border-dark-lightGrey dark:bg-[#262429]">
                  {props.entry?.tag || '-'}
               </h1>
            </div>
            <div className="w-[63%] h-full text-start  flex items-center  px-3  xl:w-[30%] ">
               <h1 className="text-sm  line-clamp-1">
                  {props.entry?.note || '-'}
               </h1>
            </div>
            <div className="w-[5%] h-full text-start  flex items-center  px-3 justify-center  relative">
               <Image
                  src={isDarkMode ? moreFade : moreBlack}
                  className="w-4 h-4  cursor-pointer"
                  alt=""
                  onClick={toggleDeleteEntryPopup}
               />
               {deleteEntry && (
                  <>
                     <div
                        className={`absolute top-6  right-5    bg-purple     flex flex-col w-[170px]  rounded-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder   md:w-[130px] md:hidden  dark:divide-dark-lightGrey  dark:border-dark-lightGrey     ${
                           isDeleteEntryVisible
                              ? 'opacity-100'
                              : 'opacity-0 pointer-events-none'
                        }`}
                        ref={isLargeScreen ? deleteEntryRef : null}
                     >
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease  dark:bg-dark-dimPurple dark:hover:bg-dark-grey"
                           onClick={() => {
                              toggleEditEntryPopup();
                              handleSelectEntry(props.entry);
                           }}
                        >
                           <Image
                              src={pencil}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>Edit entry</span>
                        </button>
                        <button
                           className="flex  gap-2 md:gap-1  items-center  text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease dark:bg-dark-dimPurple dark:hover:bg-dark-grey"
                           onClick={() => {
                              toggleEntryDetailsPopup();
                              handleSelectEntry(props.entry);
                           }}
                        >
                           <Image
                              src={info}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>See details</span>
                        </button>
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-red text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease dark:bg-dark-dimPurple  dark:text-dark-pink dark:hover:bg-dark-grey"
                           onClick={() => handleDeleteEntry(props.entry?._id)}
                        >
                           <Image
                              src={isDarkMode ? trashFade : trash}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>Delete</span>
                        </button>
                     </div>
                     <div
                        className={`fixed bottom-0  right-0         flex-col w-full   rounded-t-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder     hidden  md:flex    dark:divide-dark-lightGrey  dark:border-dark-lightGrey    ${
                           isDeleteEntryVisible
                              ? 'opacity-100  pop'
                              : 'opacity-0 pointer-events-none pop-hidden'
                        }`}
                        ref={isLargeScreen ? null : deleteEntryRef}
                     >
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-sm     h-[45px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease dark:bg-dark-dimPurple dark:hover:bg-dark-grey"
                           onClick={() => {
                              toggleEditEntryPopup();
                              handleSelectEntry(props.entry);
                           }}
                        >
                           <Image
                              src={pencil}
                              className="w-4    h-4   "
                              alt=""
                           />
                           <span>Edit entry</span>
                        </button>
                        <button
                           className="flex  gap-2   items-center  text-sm    h-[45px]   w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease dark:bg-dark-dimPurple dark:hover:bg-dark-grey"
                           onClick={() => {
                              toggleEntryDetailsPopup();
                              handleSelectEntry(props.entry);
                           }}
                        >
                           <Image src={info} className="w-4   h-4   " alt="" />
                           <span>See details</span>
                        </button>

                        <button
                           className="flex  gap-2   items-center text-red text-sm     h-[45px]   w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease dark:bg-dark-dimPurple dark:hover:bg-dark-grey dark:text-dark-pink"
                           onClick={() => handleDeleteEntry(props.entry?._id)}
                        >
                           <Image
                              src={isDarkMode ? trashFade : trash}
                              className="w-4    h-4  "
                              alt=""
                           />
                           <span>Delete</span>
                        </button>
                     </div>
                  </>
               )}
            </div>
            <EditEntry {...editEntryProps} />
            <EntriesDetails {...entryDetailsProps} />
         </div>
      )
   );
};

export default Entries;
