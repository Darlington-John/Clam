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

const Entries = (props: any) => {
   const {
      isVisible: isDeleteEntryVisible,
      isActive: deleteEntry,
      ref: deleteEntryRef,
      togglePopup: toggleDeleteEntryPopup,
   } = usePopup();
   return (
      props.entry && (
         <div
            className={`flex items-center w-full  h-[40px] bg-white  border  border-lightGreyBorder opacity-100 duration-300 md:w-[760px]   ${
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
            <div
               className="w-[5%] h-full text-start  flex items-center  px-3 justify-center  relative"
               onClick={toggleDeleteEntryPopup}
            >
               <Image src={moreBlack} className="w-4 h-4" alt="" />
               {deleteEntry && (
                  <div
                     className={`absolute top-6  right-5    bg-purple     flex flex-col w-[170px]  rounded-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder  md:w-[130px]     ${
                        isDeleteEntryVisible
                           ? 'opacity-100'
                           : 'opacity-0 pointer-events-none'
                     }`}
                     ref={deleteEntryRef}
                  >
                     <button className="flex  gap-2 md:gap-1  items-center text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease">
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
               )}
            </div>
         </div>
      )
   );
};

export default Entries;
