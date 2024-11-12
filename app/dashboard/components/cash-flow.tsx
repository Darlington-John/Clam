import Image from 'next/image';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import chevronGrey from '~/public/icons/chevron-down-grey.svg';
import calendar from '~/public/icons/calendar.svg';
import line from '~/public/images/line.png';
import info from '~/public/icons/information-circle.svg';
import wave from '~/public/icons/wave.svg';
import badgeGreen from '~/public/icons/Badge.svg';
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
   ResponsiveContainer,
} from 'recharts';
import { useEffect, useMemo, useRef, useState } from 'react';
import { formattedDate } from '~/utils/formattedDate';
import { useUser } from '~/app/context/auth-context';
import { useDashboard } from '~/app/context/dashboard-context';

const CashFlow = () => {
   const { user, loading } = useUser();
   const { allUserEntries } = useDashboard();
   const [containerWidth, setContainerWidth] = useState(0);
   const [containerHeight, setContainerHeight] = useState(0);
   const chartContainerRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const updateDimensions = () => {
         if (chartContainerRef.current) {
            setContainerWidth(chartContainerRef.current.offsetWidth);
            setContainerHeight(chartContainerRef.current.offsetHeight);
         }
      };

      updateDimensions();

      window.addEventListener('resize', updateDimensions);

      return () => window.removeEventListener('resize', updateDimensions);
   }, []);
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
   const chartData = useMemo(() => {
      const dataMap: Record<
         string,
         {
            key: string;
            week: string;
            day: string;
            income: number;
            expense: number;
         }
      > = {};

      let firstEntryDate: Date | null = null;

      if (user && user.books) {
         user.books.forEach((book: any) => {
            book.entries.forEach((entry: any) => {
               const entryDate = new Date(entry.createdAt);
               if (!firstEntryDate || entryDate < firstEntryDate) {
                  firstEntryDate = entryDate;
               }
            });
         });
      }

      if (firstEntryDate) {
         user.books.forEach((book: any) => {
            book.entries.forEach((entry: any) => {
               const entryDate = new Date(entry.createdAt);

               if (firstEntryDate) {
                  const daysSinceFirstEntry = Math.floor(
                     (entryDate.getTime() - firstEntryDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                  );

                  const weekNumber = Math.floor(daysSinceFirstEntry / 7) + 1;

                  const dayOfWeek = entryDate.toLocaleString('en-US', {
                     weekday: 'long',
                  });

                  const key = `Wk ${weekNumber} - ${dayOfWeek}`;

                  if (!dataMap[key]) {
                     dataMap[key] = {
                        key,
                        week: `Week ${weekNumber}`,
                        day: dayOfWeek,
                        income: 0,
                        expense: 0,
                     };
                  }

                  if (entry.income) {
                     dataMap[key].income += parseFloat(entry.amount);
                  }

                  if (entry.expense) {
                     dataMap[key].expense += parseFloat(entry.amount);
                  }
               }
            });
         });
      }

      const sortedData = Object.values(dataMap).sort((a, b) => {
         const daysOrder = [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
         ];
         const weekOrderA = parseInt(a.week.split(' ')[1]);
         const weekOrderB = parseInt(b.week.split(' ')[1]);

         if (weekOrderA === weekOrderB) {
            return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
         }

         return weekOrderA - weekOrderB;
      });

      return sortedData;
   }, [user]);

   return (
      <section className="flex flex-col  w-full  gap-4 px-6">
         <section className="w-full  flex gap-4  md:flex-col ">
            <section className="flex bg-white  rounded-2xl justify-center  items-center relative  shrink-0  w-[73%]  h-[180px] xl:h-[150px] md:h-auto md:w-full  xs:flex-col">
               <div className="text-sm  flex gap-2 items-center  py-1 px-4  rounded-full  absolute top-2  bg-lightestGrey text-grey norm-mid  xl:px-3 xs:top-auto z-10">
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
                  src={line}
                  className="h-[55px]  absolute  xs:rotate-90 xs:h-full  xs:w-[5px]  object-cover xs:hidden "
                  alt=""
               />
               <div className="w-full absolute hidden xs:flex bg-lightestGrey  p-[2px] "></div>
               <div className="flex-1 flex   py-6 px-8  flex-col items-center gap-4 xl:py-3 xl:px-4  xs:w-full  xs:py-6 xs:gap-2">
                  <div className="flex flex-col gap-1">
                     <div className="flex gap-2  items-center">
                        <Image className="w-5 h-5" src={arrowDown} alt="" />
                        <span className="text-[22px] leading-none  fancy xl:text-lg sm:text-base">
                           INCOME
                        </span>
                     </div>
                     <h1 className="text-[56px] leading-none   fancy  text-center xl:text-4xl xl:text-[43px]">
                        ${totalIncome?.toFixed(0) || '0'}
                     </h1>
                  </div>
                  <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1 ">
                     <span>No change from last month</span>
                     <Image src={info} alt="" className="w-4 h-4" />
                  </button>
               </div>
               <div className="flex-1 flex   py-6 px-8  flex-col items-center gap-4 xl:py-3 xl:px-4 xs:w-full  xs:py-6 xs:gap-2">
                  <div className="flex flex-col gap-1">
                     <div className="flex gap-2  items-center">
                        <Image className="w-5 h-5" src={arrowUp} alt="" />
                        <span className="text-[22px] leading-none  fancy xl:text-lg sm:text-sm">
                           EXPENSE
                        </span>
                     </div>
                     <h1 className="text-[56px] leading-none   fancy  text-center  xl:text-[43px]">
                        ${totalExpense?.toFixed(0) || '0'}
                     </h1>
                  </div>
                  <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1 ">
                     <span>No change from last month</span>
                     <Image src={info} alt="" className="w-4 h-4" />
                  </button>
               </div>
            </section>
            <div className="flex shrink-0 bg-white rounded-2xl p-4  w-[25%] flex-col gap-2 items-start xl:p-3 xl:gap-1 md:w-auto">
               <div className="flex flex-col gap-2 items-start xl:gap-1 xs:flex-row xs:items-center xs:justify-between w-full">
                  <h1 className="text-[17px] fancy xl:text-base">
                     STATUS FOR {formattedDate}
                  </h1>
                  <div className="flex gap-1 items-center text-sm text-green norm-mid">
                     <Image
                        className="w-2 h-2 rounded-full"
                        alt=""
                        src={badgeGreen}
                     />
                     <span>Healthy</span>
                  </div>
               </div>
               <p className="text-sm leading-[20px] xl:leading-tight">
                  There’s nothing to report here. Enter entries for at least a
                  week to see how you’re holding up.
               </p>
            </div>
         </section>
         <section className="w-full  flex gap-4  md:flex-col ">
            <section
               ref={chartContainerRef}
               className="flex bg-white rounded-2xl relative shrink-0 w-[73%] h-[280px]  lg:h-auto md:w-full xs:flex-col "
            >
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                     width={containerWidth || 500}
                     height={containerHeight || 280}
                     data={chartData}
                     margin={{
                        top: 24,
                        right: 42,
                        left: 12,
                        bottom: 14,
                     }}
                  >
                     <CartesianGrid
                        horizontal={true}
                        vertical={false}
                        strokeDasharray="0"
                     />
                     <XAxis
                        dataKey="key"
                        tick={{ fill: '#8D8896', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#00000000' }}
                     />
                     <YAxis
                        tick={{ fill: '#8D8896', fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: '#00000000' }}
                     />
                     <Tooltip />

                     <Line
                        type="linear"
                        dataKey="income"
                        stroke="#00AD8E"
                        dot={false}
                        name="Income"
                        filter="url(#glow)"
                     />
                     <Line
                        type="linear"
                        dataKey="expense"
                        stroke="#F00"
                        dot={false}
                        name="Expense"
                        filter="url(#glow)"
                     />
                     <defs>
                        <filter id="glow">
                           <feGaussianBlur
                              stdDeviation="2"
                              result="coloredBlur"
                           />
                           <feMerge>
                              <feMergeNode in="coloredBlur" />
                              <feMergeNode in="SourceGraphic" />
                           </feMerge>
                        </filter>
                     </defs>
                  </LineChart>
               </ResponsiveContainer>
            </section>
            <div className="flex shrink-0  rounded-2xl   w-[25%] flex-col gap-3 items-start  xl:gap-2 md:w-auto    lg:justify-between    ">
               <div className="flex flex-col gap-4 w-full  bg-white p-6  rounded-2xl xl:gap-2 lg:p-4">
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
                  <p className="text-sm leading-[20px] xl:leading-tight">
                     Use Clam to manage your day-to-day income and expenses.
                     Create a new book to start recording your entries. An
                     overview of all your entries is shown here.
                  </p>
               </div>
               <div className="flex gap-2 items-center justify-between w-full p-3 bg-white rounded-lg ">
                  <h1 className="text-sm text-black">Total entries</h1>
                  <h1 className="text-sm text-grey">
                     {allUserEntries.length || 0}
                  </h1>
               </div>
            </div>
         </section>
      </section>
   );
};

export default CashFlow;
