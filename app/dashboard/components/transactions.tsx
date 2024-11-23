'use client';
import Image from 'next/image';
import { useMemo } from 'react';
import { useUser } from '~/app/context/auth-context';
import empty from '~/public/images/empty.svg';
import { formatDate } from '~/utils/formattedDate';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import infoGreyFade from '~/public/icons/information-circle-fade.svg';
import arrowUpFade from '~/public/icons/arrow-circle-up-fade.svg';
import arrowDownFade from '~/public/icons/arrow-circle-down-fade.svg';
import infoGrey from '~/public/icons/information-circle-grey.svg';
import moreBlack from '~/public/icons/li_more-horizontal.svg';
import { useDashboard } from '~/app/context/dashboard-context';

const Transactions = () => {
   const { isDarkMode } = useUser();
   const { allUserEntries } = useDashboard();

   return (
      <section className="flex  items-start gap-4  flex-col  pb-10   px-6  md:px-6  dark:bg-dark-darkPurple">
         <h1 className="text-[22px] text-black  fancy dark:text-white ">
            Most Recent transactions
         </h1>
         <div
            className={`flex items-center gap-4 w-full   justify-center dark:bg-dark-darkPurple   ${
               allUserEntries.length > 0
                  ? 'h-auto'
                  : 'h-[320px] rounded-lg border border-[#DFDDE3]  p-4 dark:border-dark-lightGrey'
            }`}
         >
            <div className="flex flex-col  w-full overflow-x-auto  overflow-y-hidden  ">
               {allUserEntries.length > 0 && (
                  <div className="flex items-center w-full  h-[40px] bg-lightGrey border  border-lightGreyBorder rounded-t-lg md:w-[760px]  dark:bg-dark-dimPurple dark:text-white dark:border-dark-lightGrey">
                     <div className="w-[15%] h-full text-start  flex items-center  px-3  xl:w-[15%]">
                        <h1 className="text-sm ">Amount ($)</h1>
                     </div>
                     <div className="w-[15%] h-full text-start  flex items-center  px-3  xl:w-[20%] ">
                        <h1 className="text-sm ">Date</h1>
                     </div>
                     <div className="w-[15%] h-full text-start  flex items-center  px-3  xl:w-[15%]  ">
                        <h1 className="text-sm ">Book</h1>
                     </div>
                     <div className="w-[15%] h-full text-start  flex items-center  px-3  ">
                        <h1 className="text-sm ">Tag</h1>
                     </div>
                     <div className="w-[40%] h-full text-start  flex items-center  px-3  xl:w-[35%] ">
                        <h1 className="text-sm ">Note</h1>
                     </div>
                  </div>
               )}

               {allUserEntries.length > 0 ? (
                  <>
                     {allUserEntries
                        .slice(0, 10)
                        .map((item: any, index: number) => (
                           <div
                              className={`flex items-center w-full  h-[40px] bg-white  border  border-lightGreyBorder opacity-100  md:w-[760px]  dark:border-dark-lightGrey dark:bg-dark-darkPurple dark:text-white     ${
                                 index === allUserEntries.length - 1 &&
                                 'rounded-b-lg '
                              }`}
                              key={index + 1}
                           >
                              <div className="w-[15%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[15%] ">
                                 <h1 className="text-sm ">
                                    {item.entry?.amount}
                                 </h1>
                                 {item.entry?.income ? (
                                    <Image
                                       src={
                                          isDarkMode ? arrowDownFade : arrowDown
                                       }
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
                              <div className="w-[15%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[20%]  line-clamp-1">
                                 <h1 className="text-sm ">
                                    {formatDate(item.entry?.createdAt)}
                                 </h1>
                                 <Image
                                    src={isDarkMode ? infoGreyFade : infoGrey}
                                    className="w-4 h-4"
                                    alt=""
                                 />
                              </div>
                              <div className="w-[15%] h-full text-start  flex items-center  px-3 ">
                                 <h1 className="text-sm  line-clamp-1">
                                    {item.book?.name || '-'}
                                 </h1>
                              </div>
                              <div className="w-[15%] h-full text-start  flex items-center  px-3  ">
                                 <h1 className="text-[9px] py-1 px-2   rounded  border border-lightGreyBorder dark:border-dark-lightGrey dark:bg-[#262429] ">
                                    {item.entry?.tag || '-'}
                                 </h1>
                              </div>
                              <div className="w-[40%] h-full text-start  flex items-center  px-3  xl:w-[35%] ">
                                 <h1 className="text-sm  line-clamp-1">
                                    {item.entry?.note || '-'}
                                 </h1>
                              </div>
                           </div>
                        ))}
                  </>
               ) : (
                  <div className="flex items-center gap-3 flex-col bg-lightestGrey  dark:bg-dark-darkPurple ">
                     <Image src={empty} alt="" className="w-20 h-20" />
                     <h1 className="text-[17px] sm:text-base text-black dark:text-white">
                        No entries yet
                     </h1>
                     <p className="text-sm text-grey leading-[20px] text-center dark:text-dark-dimGrey">
                        Your most recent entries <br />
                        will show up here.
                     </p>
                  </div>
               )}
            </div>
         </div>
      </section>
   );
};

export default Transactions;
