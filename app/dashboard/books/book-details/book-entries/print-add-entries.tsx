import Image from 'next/image';

import plus from '~/public/icons/plus-circle-white.svg';
import more from '~/public/icons/dots-horizontal.svg';
import { usePopup } from '~/utils/tooggle-popups';
import { generatePDF } from '~/utils/generate-pdf';
import document from '~/public/icons/document.svg';
import info from '~/public/icons/infocircle.svg';
import plussm from '~/public/icons/plus-sm.svg';
import infoCircle from '~/public/icons/information-circle-dark.svg';
import printer from '~/public/icons/printer.svg';
import { useUser } from '~/app/context/auth-context';
import { useEffect, useState } from 'react';
import tagIcon from '~/public/icons/tag.svg';
import png from '~/public/icons/photo.svg';
import load from '~/public/images/load.svg';
import chevronDown from '~/public/icons/chevron-down.svg';
import { AmountFilter } from './filters';
import { generateImage } from '~/utils/generate-image';
const AddPrintEntry = (props: any) => {
   const {
      toggleAddEntryPopup,
      allBookData,
      minPrintDateValue,
      setMinPrintDateValue,
      maxPrintDateValue,
      setMaxPrintDateValue,
   } = props;
   const { user } = useUser();

   const {
      isVisible: isPromptVisible,
      isActive: prompt,
      ref: promptRef,
      togglePopup: togglePromptPopup,
   } = usePopup();
   const {
      isVisible: isTypeVisible,
      isActive: type,
      setIsActive: setIsTypeActive,
      ref: typeRef,
      togglePopup: toggleTypePopup,
   } = usePopup();
   const {
      isVisible: isPrintVisible,
      isActive: print,
      ref: printRef,
      togglePopup: togglePrintPopup,
   } = usePopup();
   const [activeButton, setActiveButton] = useState<'all' | 'range'>('all');
   const toggleButton = (button: 'all' | 'range') => {
      setActiveButton(button);
   };

   const [typeValue, setTypeValue] = useState('PDF');
   const handleTypeClick = (typeValue: string) => {
      setTypeValue(typeValue);
   };

   const types = [
      { id: 1, type: 'PDF', icon: document },
      { id: 2, type: 'PNG', icon: png },
   ];
   const printButtons = [
      {
         id: 1,
         icon: plussm,
         action: 'Upload report',
         onClick: togglePromptPopup,
      },
      {
         id: 2,
         icon: document,
         action: 'Manage reports',
         onClick: togglePromptPopup,
      },
      {
         id: 3,
         icon: infoCircle,
         action: 'What is a report',
         onClick: togglePromptPopup,
      },
      {
         id: 4,
         icon: printer,
         action: 'Print entries',
         onClick: togglePrintPopup,
      },
   ];

   const [status, setStatus] = useState<
      'idle' | 'printing' | 'success' | 'error'
   >('idle');

   const handlePrintPdf = () => {
      generatePDF(allBookData, user, setStatus);
      setTimeout(() => setStatus('idle'), 5000);
   };

   const [imageStatus, setImageStatus] = useState<
      'idle' | 'printing' | 'success' | 'error'
   >('idle');

   const handlePrintImage = () => {
      generateImage(setImageStatus);
      setTimeout(() => setImageStatus('idle'), 5000);
   };

   return (
      <div className="flex items-center gap-4 sm:w-full sm:justify-end sm:order-1">
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
               onClick={togglePromptPopup}
            />
            {prompt && (
               <>
                  <div
                     className={`absolute top-8  right-0     bg-purple     flex flex-col w-[170px]  rounded-lg border border-lightGreyBorder overflow-hidden shadow-custom z-10 duration-300 ease  divide-y divide-lightGreyBorder  md:w-[150px]      ${
                        isPromptVisible
                           ? 'opacity-100'
                           : 'opacity-0 pointer-events-none'
                     }`}
                     ref={promptRef}
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
            {print && (
               <div
                  className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
               >
                  <div
                     className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-6 rounded-2xl bg-white items-center      ${
                        isPrintVisible ? '' : 'pop-hidden'
                     }`}
                     ref={printRef}
                  >
                     <div className="flex items-center w-full gap-1 flex-col">
                        <Image src={printer} className="w-6  h-6 " alt="" />
                        <h1 className="fancy text-[22px] text-black leading-none">
                           Print all entries
                        </h1>
                     </div>
                     {activeButton === 'all' && (
                        <div className="flex gap-2 items-center w-full">
                           <Image src={info} alt="" className="w-5 h-5" />

                           <p className="text-sm text-black">
                              You are printing all entries in this book
                           </p>
                        </div>
                     )}
                     <div className="flex  gap-1  flex-col  w-full">
                        <h1 className="text-sm">
                           How do you want these entries?
                        </h1>
                        <div className="h-[40px]  w-full flex items-center justify-center relative">
                           <input
                              placeholder="Search or create a tag"
                              className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto pr-8 cursor-pointer "
                              value={typeValue}
                              readOnly
                              onChange={(e) => {
                                 setTypeValue(e.target.value);
                                 setIsTypeActive(false);
                              }}
                              onClick={toggleTypePopup}
                           />
                           <Image
                              src={chevronDown}
                              onClick={toggleTypePopup}
                              className={`w-5 h-5 absolute right-3 duration-300  ${
                                 type ? 'rotate-180' : ''
                              }`}
                              alt=""
                           />
                           {type && (
                              <div
                                 className={`w-full        duration-300 ease-in-out flex flex-col py-1  px-2   gap-1  bg-white  absolute  top-12   z-40  opacity-100  shadow-custom  overflow-auto  flow rounded-lg   sm:h-auto ${
                                    isTypeVisible ? '' : ' opacity-0'
                                 }`}
                                 ref={typeRef}
                              >
                                 {types.map((data: any, index: any) => (
                                    <button
                                       key={index + 1}
                                       onClick={() => {
                                          handleTypeClick(data.type);
                                          setIsTypeActive(false);
                                       }}
                                       className={`w-full  h-[40px]   flex items-center  gap-2  duration-150 text-sm  px-2  rounded-lg  border-b border-lightGrey  shrink-0 ${
                                          typeValue === data.type
                                             ? 'bg-lightGrey'
                                             : ' hover:bg-lightGrey'
                                       }`}
                                    >
                                       <Image
                                          src={data.icon}
                                          className="w-5 h-5"
                                          alt=""
                                       />
                                       <span>{data.type}</span>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </div>
                     </div>
                     <div className="flex items-center gap-3 w-full">
                        <button
                           onClick={
                              typeValue === 'PDF'
                                 ? () => handlePrintPdf()
                                 : () => handlePrintImage()
                           }
                           disabled={
                              typeValue === 'PDF'
                                 ? status === 'printing' || status === 'success'
                                 : imageStatus === 'printing' ||
                                   imageStatus === 'success'
                           }
                           className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full justify-center  "
                        >
                           {typeValue === 'PDF' ? (
                              status === 'printing' ? (
                                 <Image className="w-10" src={load} alt="" />
                              ) : (
                                 <span>
                                    {status === 'success'
                                       ? 'Printed'
                                       : 'Print Entries'}
                                 </span>
                              )
                           ) : imageStatus === 'printing' ? (
                              <Image className="w-10" src={load} alt="" />
                           ) : (
                              <span>
                                 {imageStatus === 'success'
                                    ? 'Printed'
                                    : 'Print Entries'}
                              </span>
                           )}
                        </button>
                        <button
                           // onClick={() => {
                           //    parentSearchTerm('');
                           //    toggleFilterEntryPopup();
                           // }}
                           className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                           onClick={() => {
                              togglePrintPopup();
                           }}
                        >
                           {typeValue === 'PDF'
                              ? status === 'success'
                                 ? 'Done'
                                 : 'Cancel'
                              : imageStatus === 'success'
                              ? 'Done'
                              : 'Cancel'}
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default AddPrintEntry;
