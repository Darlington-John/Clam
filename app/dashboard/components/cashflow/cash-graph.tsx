'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
} from 'recharts';
import { useUser } from '~/app/context/auth-context';
const CashGraph = () => {
   const { user } = useUser();
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
                     <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                     <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                     </feMerge>
                  </filter>
               </defs>
            </LineChart>
         </ResponsiveContainer>
      </section>
   );
};

export default CashGraph;
