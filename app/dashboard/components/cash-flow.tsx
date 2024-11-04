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
import { useEffect, useRef, useState } from 'react';
import { formattedDate } from '~/utils/formattedDate';

const CashFlow = () => {
     const data = [
          {
               name: 'Page A',
               uv: 4000,
               pv: 2400,
               amt: 2400,
          },
          {
               name: 'Page B',
               uv: 3000,
               pv: 1398,
               amt: 2210,
          },
          {
               name: 'Page C',
               uv: 2000,
               pv: 9800,
               amt: 2290,
          },
          {
               name: 'Page D',
               uv: 2780,
               pv: 3908,
               amt: 2000,
          },
          {
               name: 'Page E',
               uv: 1890,
               pv: 4800,
               amt: 2181,
          },
          {
               name: 'Page F',
               uv: 2390,
               pv: 3800,
               amt: 2500,
          },
          {
               name: 'Page G',
               uv: 3490,
               pv: 4300,
               amt: 2100,
          },
     ];

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

          // Initial measurement
          updateDimensions();

          // Add resize listener
          window.addEventListener('resize', updateDimensions);

          // Cleanup
          return () => window.removeEventListener('resize', updateDimensions);
     }, []);

     return (
          <section className="flex flex-col  w-full  gap-4">
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
                                        <Image
                                             className="w-5 h-5"
                                             src={arrowDown}
                                             alt=""
                                        />
                                        <span className="text-[22px] leading-none  fancy xl:text-lg sm:text-base">
                                             INCOME
                                        </span>
                                   </div>
                                   <h1 className="text-[56px] leading-none   fancy  text-center xl:text-4xl xl:text-[43px]">
                                        $0
                                   </h1>
                              </div>
                              <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1 ">
                                   <span>No change from last month</span>
                                   <Image
                                        src={info}
                                        alt=""
                                        className="w-4 h-4"
                                   />
                              </button>
                         </div>
                         <div className="flex-1 flex   py-6 px-8  flex-col items-center gap-4 xl:py-3 xl:px-4 xs:w-full  xs:py-6 xs:gap-2">
                              <div className="flex flex-col gap-1">
                                   <div className="flex gap-2  items-center">
                                        <Image
                                             className="w-5 h-5"
                                             src={arrowUp}
                                             alt=""
                                        />
                                        <span className="text-[22px] leading-none  fancy xl:text-lg sm:text-sm">
                                             EXPENSE
                                        </span>
                                   </div>
                                   <h1 className="text-[56px] leading-none   fancy  text-center  xl:text-[43px]">
                                        $0
                                   </h1>
                              </div>
                              <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1 ">
                                   <span>No change from last month</span>
                                   <Image
                                        src={info}
                                        alt=""
                                        className="w-4 h-4"
                                   />
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
                              There’s nothing to report here. Enter entries for
                              at least a week to see how you’re holding up.
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
                                   data={data}
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
                                        dataKey="name"
                                        tick={{ fill: '#8D8896', fontSize: 14 }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#00000000' }}
                                   />
                                   <YAxis
                                        tick={{ fill: '#8D8896', fontSize: 14 }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#00000000' }}
                                   />
                                   <Tooltip />

                                   <Line
                                        type="linear"
                                        dataKey="pv"
                                        stroke="#F00"
                                        dot={false}
                                        activeDot={false}
                                        name="Income"
                                        filter="url(#glow)"
                                   />
                                   <Line
                                        type="linear"
                                        dataKey="uv"
                                        stroke="#00AD8E"
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
                    <div className="flex shrink-0  rounded-2xl   w-[25%] flex-col gap-3 items-start  xl:gap-2 md:w-auto  4xl:justify-between lg:justify-between    ">
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
                                   Use Clam to manage your day-to-day income and
                                   expenses. Create a new book to start
                                   recording your entries. An overview of all
                                   your entries is shown here.
                              </p>
                         </div>
                         <div className="flex gap-2 items-center justify-between w-full p-3 bg-white rounded-lg ">
                              <h1 className="text-sm text-black">
                                   Total entries
                              </h1>
                              <h1 className="text-sm text-grey">0</h1>
                         </div>
                    </div>
               </section>
          </section>
     );
};

export default CashFlow;
