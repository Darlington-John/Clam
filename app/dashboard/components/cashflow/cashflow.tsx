import Image from 'next/image';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import arrowDownFade from '~/public/icons/arrow-circle-down-fade.svg';
import arrowUpFade from '~/public/icons/arrow-circle-up-fade.svg';
import chevronGrey from '~/public/icons/chevron-down-grey.svg';
import calendar from '~/public/icons/calendar.svg';
import line from '~/public/images/line.png';
import info from '~/public/icons/information-circle.svg';
import infoFade from '~/public/icons/information-circle-yellow-fade.svg';
import wave from '~/public/icons/wave.svg';
import badgeGreen from '~/public/icons/Badge.svg';
import lineDark from '~/public/images/line-dark.png';
import badgeGreenFade from '~/public/icons/Badge-green-fade.svg';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formattedDate } from '~/utils/formattedDate';
import { useUser } from '~/app/context/auth-context';
import { useDashboard } from '~/app/context/dashboard-context';
import CashGraph from './cash-graph';

const CashFlow = () => {
   const { user, loading, isDarkMode } = useUser();
   const { allUserEntries } = useDashboard();

   const { totalIncome, totalExpense } = useMemo(() => {
      let income = 0;
      let expense = 0;

      if (user && user.books) {
         user.books.forEach((book: any) => {
            book.entries.forEach((entry: any) => {
               if (entry.income) {
                  income += parseFloat(entry.amount);
               }
               if (entry.expense) {
                  expense += parseFloat(entry.amount);
               }
            });
         });
      }

      return { totalIncome: income, totalExpense: expense };
   }, [user]);

   return (
      <section className="flex flex-col  w-full  gap-4 px-6 dark:bg-dark-darkPurple">
         <section className="w-full  flex gap-4  md:flex-col ">
            <section className="flex bg-white  rounded-2xl justify-center  items-center relative  shrink-0  w-[73%]  h-[180px] xl:h-[150px] md:h-auto md:w-full  xs:flex-col dark:bg-dark-grey">
               <div className="text-sm  flex gap-2 items-center  py-1 px-4  rounded-full  absolute top-2  bg-lightestGrey text-grey norm-mid  xl:px-3 xs:top-auto z-10   dark:bg-dark-lightGrey dark:text-dark-dimGrey">
                  <Image
                     src={calendar}
                     className="w-4  h-4  object-cover rounded-full "
                     alt=""
                  />
                  <h1>{formattedDate}</h1>
                  <Image
                     src={chevronGrey}
                     className="w-5 h-5 object-cover rounded-full "
                     alt=""
                  />
               </div>
               <Image
                  src={isDarkMode ? lineDark : line}
                  className="h-[55px]  absolute  xs:rotate-90 xs:h-full  xs:w-[5px]  object-cover xs:hidden "
                  alt=""
               />
               <div className="w-full absolute hidden xs:flex bg-lightestGrey  p-[2px]   "></div>
               <div className="flex-1 flex   py-6 px-8  flex-col items-center gap-4 xl:py-3 xl:px-4  xs:w-full  xs:py-6 xs:gap-2">
                  <div className="flex flex-col gap-1">
                     <div className="flex gap-2  items-center">
                        {isDarkMode ? (
                           <Image
                              className="w-5 h-5"
                              src={arrowDownFade}
                              alt=""
                           />
                        ) : (
                           <Image className="w-5 h-5" src={arrowDown} alt="" />
                        )}

                        <span className="text-[22px] leading-none  fancy xl:text-lg sm:text-base dark:text-white">
                           INCOME
                        </span>
                     </div>
                     <h1 className="text-[56px] leading-none   fancy  text-center xl:text-4xl xl:text-[43px] dark:text-white">
                        ${totalIncome?.toFixed(0) || '0'}
                     </h1>
                  </div>
                  <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1  dark:text-dark-lightYellow dark:bg-dark-darkYellow">
                     <span>No change from last month</span>
                     {isDarkMode ? (
                        <Image src={infoFade} alt="" className="w-4 h-4" />
                     ) : (
                        <Image src={info} alt="" className="w-4 h-4" />
                     )}
                  </button>
               </div>
               <div className="flex-1 flex   py-6 px-8  flex-col items-center gap-4 xl:py-3 xl:px-4 xs:w-full  xs:py-6 xs:gap-2">
                  <div className="flex flex-col gap-1">
                     <div className="flex gap-2  items-center">
                        {isDarkMode ? (
                           <Image
                              className="w-5 h-5"
                              src={arrowUpFade}
                              alt=""
                           />
                        ) : (
                           <Image className="w-5 h-5" src={arrowUp} alt="" />
                        )}

                        <span className="text-[22px] leading-none  fancy xl:text-lg sm:text-sm dark:text-white">
                           EXPENSE
                        </span>
                     </div>
                     <h1 className="text-[56px] leading-none   fancy  text-center  xl:text-[43px] dark:text-white">
                        ${totalExpense?.toFixed(0) || '0'}
                     </h1>
                  </div>
                  <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1  dark:text-dark-lightYellow dark:bg-dark-darkYellow">
                     <span>No change from last month</span>
                     {isDarkMode ? (
                        <Image src={infoFade} alt="" className="w-4 h-4" />
                     ) : (
                        <Image src={info} alt="" className="w-4 h-4" />
                     )}
                  </button>
               </div>
            </section>
            <div className="flex shrink-0 bg-white rounded-2xl p-4  w-[25%] flex-col gap-2 items-start xl:p-3 xl:gap-1 md:w-auto dark:bg-dark-grey">
               <div className="flex flex-col gap-2 items-start xl:gap-1 xs:flex-row xs:items-center xs:justify-between w-full">
                  <h1 className="text-[17px] fancy xl:text-base dark:text-white">
                     STATUS FOR {formattedDate}
                  </h1>
                  <div className="flex gap-1 items-center text-sm text-green norm-mid dark:text-dark-lightGreen">
                     {isDarkMode ? (
                        <Image
                           className="w-2 h-2 rounded-full"
                           alt=""
                           src={badgeGreenFade}
                        />
                     ) : (
                        <Image
                           className="w-2 h-2 rounded-full"
                           alt=""
                           src={badgeGreen}
                        />
                     )}

                     <span>Healthy</span>
                  </div>
               </div>
               <p className="text-sm leading-[20px] xl:leading-tight dark:text-white">
                  There’s nothing to report here. Enter entries for at least a
                  week to see how you’re holding up.
               </p>
            </div>
         </section>
         <section className="w-full  flex gap-4  md:flex-col ">
            <CashGraph />

            <div className="flex shrink-0  rounded-2xl   w-[25%] flex-col gap-3 items-start  xl:gap-2 md:w-auto    lg:justify-between    ">
               <div className="flex flex-col gap-4 w-full  bg-white p-6  rounded-2xl xl:gap-2 lg:p-4 dark:bg-dark-grey">
                  <div className="flex gap-2 py-2 px-3   items-start bg-lightGreen border border-lightAqua rounded-lg p-2  lg:py-1 lg:gap-1">
                     <Image
                        src={wave}
                        alt=""
                        className="w-6 h-6 lg:w-4 lg:h-4 lg:hidden sm:flex sm:w-6 sm:h-6"
                     />
                     <div className="flex flex-col ">
                        <h1 className="text-aqua text-[17px] norm-mid">
                           You’re here!
                        </h1>
                        <h1 className="text-sm text-black">
                           Time to get started.
                        </h1>
                     </div>
                  </div>
                  <p className="text-sm leading-[20px] xl:leading-tight dark:text-white">
                     Use Clam to manage your day-to-day income and expenses.
                     Create a new book to start recording your entries. An
                     overview of all your entries is shown here.
                  </p>
               </div>
               <div className="flex gap-2 items-center justify-between w-full p-3 bg-white rounded-lg  dark:bg-dark-grey">
                  <h1 className="text-sm text-black dark:text-white ">
                     Total entries
                  </h1>
                  <h1 className="text-sm text-grey dark:text-white">
                     {allUserEntries.length || 0}
                  </h1>
               </div>
            </div>
         </section>
      </section>
   );
};

export default CashFlow;
