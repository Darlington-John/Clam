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
import { useEffect, useState } from 'react';
import chevronDown from '~/public/icons/chevron-down.svg';

import load from '~/public/images/load.svg';

import income from '~/public/icons/arrow-circle-down.svg';
import expense from '~/public/icons/arrow-circle-up.svg';
import plusGrey from '~/public/icons/plus-circle-grey.svg';
import tagIcon from '~/public/icons/tag.svg';
import danger from '~/public/icons/exclamation.svg';

const Entries = (props: any) => {
   const {
      isVisible: isDeleteEntryVisible,
      isActive: deleteEntry,
      ref: deleteEntryRef,
      togglePopup: toggleDeleteEntryPopup,
   } = usePopup();
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
                           onClick={toggleEditEntryPopup}
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
                           onClick={() =>
                              props.handleDeleteEntry(props.entry?._id)
                           }
                        >
                           <Image
                              src={trash}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
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
                           Add entry
                        </h1>
                     </div>
                     <div className="flex items-center  p-[2px]  rounded-lg bg-lightGrey  w-full">
                        <button
                           onClick={() => toggleButton('income')}
                           className={`px-4  rounded-lg  h-[28px] text-sm w-full  flex  items-center  gap-1 justify-center     ${
                              activeButton === 'income'
                                 ? 'bg-white  text-black'
                                 : ' text-black'
                           }`}
                        >
                           <Image src={income} className="w-4  h-4 " alt="" />
                           <span>Income</span>
                        </button>
                        <button
                           onClick={() => toggleButton('expense')}
                           className={`px-4  rounded-lg  h-[28px] text-sm w-full  flex  items-center  gap-1 justify-center     ${
                              activeButton === 'expense'
                                 ? 'bg-white  text-black'
                                 : ' text-black'
                           }`}
                        >
                           <Image src={expense} className="w-4  h-4 " alt="" />
                           <span>Expense</span>
                        </button>
                     </div>
                     {/* <div className="flex  items-center justify-center  gap-1 py-2 border-y border-lightGrey w-full">
                  <span className="text-black  text-[22px] fancy  ">$</span>
                  <input
                     type="text"
                     value={amount}
                     style={{
                        width: `${inputWidth}px`,
                     }}
                     onChange={(e) => {
                        handleChange(e);
                        setError('');
                     }}
                     autoFocus
                     className="  outline-none  number-input  text-[34px] fancy   "
                     placeholder="Enter amount"
                  />
                  <span
                     ref={spanRef}
                     className="text-[34px] self-start fancy invisible absolute "
                  >
                     {amount || ' '}
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
                  <h1 className="text-sm">Describe this entry</h1>
                  <textarea
                     placeholder="E.g money from services rendered"
                     className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto h-[110px] max-h-[150px]"
                     value={note}
                     onChange={(e) => setNote(e.target.value)}
                  />
               </div>
               <div className="flex  gap-1  flex-col  w-full">
                  <h1 className="text-sm">Add a tag</h1>
                  <div className="h-[40px]  w-full flex items-center justify-center relative">
                     <input
                        placeholder="Search or create a tag"
                        className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto pr-8 "
                        value={tagValue}
                        onChange={(e) => {
                           setTagValue(e.target.value);
                           setIsTagActive(false);
                        }}
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
                     onClick={createEntry}
                     disabled={EditEntryLoading}
                  >
                     {EditEntryLoading ? (
                        <Image className="w-10" src={load} alt="" />
                     ) : (
                        <span>Add entry</span>
                     )}
                  </button>
                  <button
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                     onClick={toggleEditEntryPopup}
                  >
                     Cancel
                  </button>
               </div> */}
                  </div>
               </div>
            )}
         </div>
      )
   );
};

export default Entries;
