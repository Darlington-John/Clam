import { usePopup } from '~/utils/tooggle-popups';
import Image from 'next/image';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';

import infoGrey from '~/public/icons/information-circle-grey.svg';
import { formatDate } from '~/utils/formattedDate';
import moreBlack from '~/public/icons/li_more-horizontal.svg';
import info from '~/public/icons/information-circle-dark.svg';
import trash from '~/public/icons/trash.svg';
import pencil from '~/public/icons/pencil.svg';
import printer from '~/public/icons/printer.svg';
import { useEffect, useRef, useState } from 'react';
import chevronDown from '~/public/icons/chevron-down.svg';

import load from '~/public/images/load.svg';

import income from '~/public/icons/arrow-circle-down.svg';
import expense from '~/public/icons/arrow-circle-up.svg';
import plusGrey from '~/public/icons/plus-circle-grey.svg';
import tagIcon from '~/public/icons/tag.svg';
import danger from '~/public/icons/exclamation.svg';
import { FaCheck } from 'react-icons/fa';
import { useUser } from '~/app/context/auth-context';
import { toast } from 'react-toastify';

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
      isActive: EditEntry,
      ref: EditEntryRef,
      togglePopup: toggleEditEntryPopup,
   } = usePopup();
   const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 760);
   useEffect(() => {
      const handleResize = () => {
         setIsLargeScreen(window.innerWidth > 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);
   const [activeButton, setActiveButton] = useState<'income' | 'expense'>(
      'income'
   );

   const toggleButton = (button: 'income' | 'expense') => {
      setActiveButton(button);
   };
   const [error, setError] = useState('');
   const { user } = useUser();
   const [selectedEntry, setSelectedEntry] = useState<any>(null);
   const [activeEditButton, setActiveEditButton] = useState<
      'income' | 'expense' | ''
   >('');
   const toggleEditButton = (type: 'income' | 'expense') => {
      setActiveButton(type);
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
   const {
      isVisible: isTagVisible,
      isActive: tag,
      setIsActive: setIsTagActive,
      ref: tagRef,
      togglePopup: toggleTagPopup,
   } = usePopup();
   const tags = ['important', 'fun', 'emergency', 'urgent', 'miscellaneous'];
   const handleTagClick = (tagValue: string) => {
      setSelectedEntry((prevEntry: any) =>
         prevEntry ? { ...prevEntry, tag: tagValue } : null
      );
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
   return (
      props.entry && (
         <div
            className={`flex items-center w-full  h-[40px] bg-white  border-b border-x  border-[#DFDDE3] opacity-100 duration-300 md:w-[760px]   ${
               props.index === props.bookData.entries.length - 1 &&
               'rounded-b-lg '
            }`}
            key={props.index + 1}
         >
            <div className="w-[10%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[20%]">
               <h1 className="text-sm ">{props.entry?.amount}</h1>
               {props.entry?.income ? (
                  <Image src={arrowDown} className="w-4 h-4" alt="" />
               ) : (
                  <Image src={arrowUp} className="w-4 h-4" alt="" />
               )}
            </div>
            <div className="w-[12%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[25%] ">
               <h1 className="text-sm ">
                  {formatDate(props.entry?.createdAt)}
               </h1>
               <Image src={infoGrey} className="w-4 h-4" alt="" />
            </div>
            <div className="w-[10%] h-full text-start  flex items-center  px-3  xl:w-[20%]">
               <h1 className="text-[9px] py-1 px-2  p rounded  border border-lightGreyBorder">
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
                  src={moreBlack}
                  className="w-4 h-4  cursor-pointer"
                  alt=""
                  onClick={toggleDeleteEntryPopup}
               />
               {deleteEntry && (
                  <>
                     <div
                        className={`absolute top-6  right-5    bg-purple     flex flex-col w-[170px]  rounded-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder  md:w-[130px] md:hidden     ${
                           isDeleteEntryVisible
                              ? 'opacity-100'
                              : 'opacity-0 pointer-events-none'
                        }`}
                        ref={isLargeScreen ? deleteEntryRef : null}
                     >
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease"
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
                        <button className="flex  gap-2 md:gap-1  items-center  text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease">
                           <Image
                              src={info}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>See details</span>
                        </button>
                        <button className="flex  gap-2 md:gap-1  items-center text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease">
                           <Image
                              src={printer}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>Print entry</span>
                        </button>
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-red text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease"
                           onClick={() => handleDeleteEntry(props.entry?._id)}
                        >
                           <Image
                              src={trash}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>Delete</span>
                        </button>
                     </div>
                     <div
                        className={`fixed bottom-0  right-0         flex-col w-full   rounded-t-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder     hidden  md:flex      ${
                           isDeleteEntryVisible
                              ? 'opacity-100  pop'
                              : 'opacity-0 pointer-events-none pop-hidden'
                        }`}
                        ref={isLargeScreen ? null : deleteEntryRef}
                     >
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-sm     h-[40px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease"
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
                        <button className="flex  gap-2   items-center  text-sm    h-[40px]   w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease">
                           <Image src={info} className="w-4   h-4   " alt="" />
                           <span>See details</span>
                        </button>
                        <button className="flex  gap-2   items-center text-sm     h-[40px]    w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease">
                           <Image
                              src={printer}
                              className="w-4   h-4   "
                              alt=""
                           />
                           <span>Print entry</span>
                        </button>
                        <button
                           className="flex  gap-2   items-center text-red text-sm     h-[40px]   w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease"
                           onClick={() => handleDeleteEntry(props.entry?._id)}
                        >
                           <Image src={trash} className="w-4    h-4  " alt="" />
                           <span>Delete</span>
                        </button>
                     </div>
                  </>
               )}
            </div>
            {EditEntry && (
               <div
                  className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
               >
                  <div
                     className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-6 rounded-2xl bg-white items-center      ${
                        isEditEntryVisible ? '' : 'pop-hidden'
                     }`}
                     ref={EditEntryRef}
                  >
                     <div className="flex items-center w-full gap-1 flex-col">
                        <Image src={plusGrey} className="w-6  h-6 " alt="" />
                        <h1 className="fancy text-[22px] text-black leading-none">
                           Edit entry
                        </h1>
                     </div>
                     <div className="flex items-center  p-[2px]  rounded-lg bg-lightGrey  w-full">
                        <button
                           onClick={() => toggleEditButton('income')}
                           className={`px-4  rounded-lg  h-[28px] text-sm w-full  flex  items-center  gap-1 justify-center     ${
                              activeEditButton === 'income'
                                 ? 'bg-white  text-black'
                                 : ' text-black'
                           }`}
                        >
                           <Image src={income} className="w-4  h-4 " alt="" />
                           <span>Income</span>
                        </button>
                        <button
                           onClick={() => toggleEditButton('expense')}
                           className={`px-4  rounded-lg  h-[28px] text-sm w-full  flex  items-center  gap-1 justify-center     ${
                              activeEditButton === 'expense'
                                 ? 'bg-white  text-black'
                                 : ' text-black'
                           }`}
                        >
                           <Image src={expense} className="w-4  h-4 " alt="" />
                           <span>Expense</span>
                        </button>
                     </div>
                     <div className="flex  items-center justify-center  gap-1 py-2 border-y border-lightGrey w-full">
                        <span className="text-black  text-[22px] fancy  ">
                           $
                        </span>
                        <input
                           type="text"
                           value={selectedEntry?.amount}
                           style={{
                              width: `${inputWidth}px`,
                           }}
                           onChange={(e) => {
                              handleEntryChange(e);
                              setError('');
                           }}
                           autoFocus
                           className="  outline-none  number-input  text-[34px] fancy   "
                           placeholder="Edit amount"
                        />
                        <span
                           ref={spanRef}
                           className="text-[34px] self-start fancy invisible absolute "
                        >
                           {selectedEntry?.amount || ' '}
                        </span>
                     </div>
                     {error === 'Enter an amount' && (
                        <div className="w-full flex items-center justify-center gap-2">
                           <div className="bg-pink p-1  rounded-full">
                              <Image src={danger} className="w-3 h-3" alt="" />
                           </div>
                           <h1 className="text-sm text-red">Enter an amount</h1>
                        </div>
                     )}

                     <div className="flex  gap-1  flex-col  w-full">
                        <h1 className="text-sm">Edit Description</h1>
                        <textarea
                           placeholder="E.g money from services rendered"
                           className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto h-[110px] max-h-[150px]"
                           value={selectedEntry?.note}
                           onChange={(e) =>
                              setSelectedEntry((prevEntry: any) =>
                                 prevEntry
                                    ? { ...prevEntry, note: e.target.value }
                                    : null
                              )
                           }
                        />
                     </div>
                     <div className="flex  gap-1  flex-col  w-full">
                        <h1 className="text-sm">Edit tag</h1>
                        <div className="h-[40px]  w-full flex items-center justify-center relative">
                           <input
                              placeholder="Search or create a tag"
                              className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto pr-8 "
                              value={selectedEntry?.tag}
                              onChange={(e) =>
                                 setSelectedEntry((prevEntry: any) =>
                                    prevEntry
                                       ? { ...prevEntry, tag: e.target.value }
                                       : null
                                 )
                              }
                              onClick={toggleTagPopup}
                           />
                           <Image
                              src={chevronDown}
                              onClick={toggleTagPopup}
                              className={`w-5 h-5 absolute right-3 duration-300  ${
                                 tag ? 'rotate-180' : ''
                              }`}
                              alt=""
                           />
                           {tag && (
                              <div
                                 className={`w-full        duration-300 ease-in-out flex flex-col py-1  px-2   gap-1  bg-white  absolute  top-12   z-40  opacity-100  shadow-custom  h-[200px] overflow-auto  flow rounded-lg  ${
                                    isTagVisible ? '' : ' opacity-0'
                                 }`}
                                 ref={tagRef}
                              >
                                 {tags.map((data: any, index: any) => (
                                    <button
                                       key={index + 1}
                                       onClick={() => {
                                          handleTagClick(data);
                                          setIsTagActive(false);
                                       }}
                                       className="w-full  h-[40px]  hover:bg-lightGrey flex items-center  gap-2  duration-150 text-sm  px-2  rounded-lg  border-b border-lightGrey  shrink-0"
                                    >
                                       <Image
                                          src={tagIcon}
                                          className="w-5 h-5"
                                          alt=""
                                       />
                                       <span>{data}</span>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>

                     {error && error !== 'Enter an amount' && (
                        <div className="w-full flex items-center justify-center gap-2">
                           <div className="bg-pink p-1  rounded-full">
                              <Image src={danger} className="w-3 h-3" alt="" />
                           </div>
                           <h1 className="text-sm text-red">{error}</h1>
                        </div>
                     )}
                     <div className="flex items-center gap-3 w-full">
                        <button
                           className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full justify-center  "
                           onClick={editEntry}
                           disabled={editEntryLoading}
                        >
                           {editEntryLoading ? (
                              <Image className="w-10" src={load} alt="" />
                           ) : (
                              <span>Edit entry</span>
                           )}
                        </button>
                        <button
                           className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                           onClick={toggleEditEntryPopup}
                        >
                           Cancel
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      )
   );
};

export default Entries;
