import Image from 'next/image';

import plus from '~/public/icons/plus-circle-white.svg';
import more from '~/public/icons/dots-horizontal.svg';
import { usePopup } from '~/utils/tooggle-popups';
import { generatePDF } from '~/utils/generate-pdf';
import document from '~/public/icons/document.svg';

import plussm from '~/public/icons/plus-sm.svg';
import infoCircle from '~/public/icons/information-circle-dark.svg';
import printer from '~/public/icons/printer.svg';
import { useUser } from '~/app/context/auth-context';
const AddPrintEntry = (props: any) => {
   const { toggleAddEntryPopup, bookData } = props;
   const { user } = useUser();
   const {
      isVisible: isPrintEntryVisible,
      isActive: printEntry,
      ref: printEntryRef,
      togglePopup: togglePrintEntryPopup,
   } = usePopup();
   const printButtons = [
      {
         id: 1,
         icon: plussm,
         action: 'Upload report',
         onClick: togglePrintEntryPopup,
      },
      {
         id: 2,
         icon: document,
         action: 'Manage reports',
         onClick: togglePrintEntryPopup,
      },
      {
         id: 3,
         icon: infoCircle,
         action: 'What is a report',
         onClick: togglePrintEntryPopup,
      },
      {
         id: 4,
         icon: printer,
         action: 'Print entries',
         onClick: () => generatePDF(bookData, user),
      },
   ];
   return (
      <div className="flex items-center gap-4">
         <button
            className="bg-purple text-white px-4 py-2 rounded-full text-sm flex gap-2 items-center"
            onClick={toggleAddEntryPopup}
         >
            <Image src={plus} className="w-5 h-5" alt="" />
            <span>Add entry</span>
         </button>
         <div className="relative ">
            <Image
               src={more}
               className="w-5 h-5  cursor-pointer "
               alt=""
               onClick={togglePrintEntryPopup}
            />
            {printEntry && (
               <>
                  <div
                     className={`absolute top-8  right-0     bg-purple     flex flex-col w-[170px]  rounded-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder  md:w-[150px]      ${
                        isPrintEntryVisible
                           ? 'opacity-100'
                           : 'opacity-0 pointer-events-none'
                     }`}
                     ref={printEntryRef}
                  >
                     {printButtons.map((data) => (
                        <button
                           className="flex  gap-2 md:gap-1  items-center text-sm md:text-xs   h-[40px] md:h-[30px]  w-full bg-white shrink-0 px-3 hover:bg-lightPurple  duration-300 ease"
                           key={data.id}
                           onClick={data.onClick}
                        >
                           <Image
                              src={data.icon}
                              className="w-4  md:w-3 md:h-3.5  h-4  md:w-3 md:h-3.5 "
                              alt=""
                           />
                           <span>{data.action}</span>
                        </button>
                     ))}
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default AddPrintEntry;
