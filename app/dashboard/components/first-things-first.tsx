'use client';
import Image from 'next/image';
import bookWhiteIcon from '~/public/icons/book-open-white.svg';
import wave from '~/public/icons/wave.svg';
import { useDashboard } from '~/app/context/dashboard-context';
const FirstThingsFirst = () => {
   const {
      isFirstThingsVisible,
      firstThings,
      firstThingsRef,
      toggleFirstThingsPopup,
      toggleNewBookPopup,
   } = useDashboard();
   return (
      firstThings && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6 gap-4 rounded-2xl bg-white items-center     ${
                  isFirstThingsVisible ? '' : 'pop-hidden'
               }`}
               ref={firstThingsRef}
            >
               <Image className="w-14 h-14" src={wave} alt="" />
               <h1 className="fancy text-[22px] text-black">
                  First thing first
               </h1>
               <p className="text-sm text-center">
                  You’d need to create a book to start recording your entries.
                  Think of books like folders for your entries. You can create
                  as many books as you want.
               </p>
               <div className="flex items-center gap-3">
                  <button
                     className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm  "
                     onClick={() => {
                        toggleNewBookPopup();
                        toggleFirstThingsPopup();
                     }}
                  >
                     <Image className="w-5" src={bookWhiteIcon} alt="" />
                     <span>Create a book</span>
                  </button>
                  <button
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                     onClick={toggleFirstThingsPopup}
                  >
                     Close
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default FirstThingsFirst;
