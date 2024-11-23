'use client';
import Image from 'next/image';
import { formatDate } from '~/utils/formattedDate';
import logo from '~/public/images/Logo.png';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import { useUser } from '~/app/context/auth-context';
import logoFade from '~/public/images/Logo-fade.png';
const PDFTemplate = (props: any) => {
   const { bookData } = props;
   const { user, isDarkMode } = useUser();
   const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
   });
   const details = [
      {
         header: 'NAME',
         body: user?.name,
      },
      {
         header: 'PRINTED ON',
         body: currentDate,
      },
      {
         header: 'BOOK NAME',
         body: bookData?.name,
      },
      {
         header: 'INCOME',
         body: `$${bookData?.incomeTotal}`,
      },
      {
         header: 'EXPENSE',
         body: `$${bookData?.expenseTotal}`,
      },
   ];
   return (
      <div
         className="flex w-[768px]   p-8 gap-8 flex-col  bg-lightestGrey   dark:bg-dark-darkPurple"
         id="to-image"
      >
         <div className="flex items-center justify-between">
            <Image
               src={isDarkMode ? logoFade : logo}
               alt=""
               width={100}
               height={100}
            />
            <h1 className="text-[22px] text-black fancy dark:text-white">
               Statement
            </h1>
         </div>
         <div className="flex flex-row   items-center  flex-wrap  gap-x-2   gap-y-4  p-4  justify-between">
            {details.map((data, index: any) => (
               <div
                  className="flex  flex-col items-start   flex-1 "
                  key={index + 1}
               >
                  <h1 className="text-grey  text-[9px] norm-mid uppercase dark:text-dark-dimGrey">
                     {data.header}
                  </h1>
                  <h1 className="text-[17px] fancy dark:text-white ">
                     {data.body}
                  </h1>
               </div>
            ))}
         </div>
         <div className="flex flex-col  gap-4 w-full">
            <h1 className="text-[17px] fancy dark:text-white">Transactions</h1>
            <div className="flex flex-col  w-full ">
               <div className="flex items-center w-full  pb-4   bg-lightGrey border  border-lightGreyBorder rounded-t-lg dark:bg-dark-dimPurple dark:text-white dark:border-dark-lightGrey ">
                  <div className="w-[25%] h-full text-start  flex items-center  px-3   ">
                     <h1 className="text-sm ">Amount ($)</h1>
                  </div>
                  <div className="w-[25%] h-full text-start  flex items-center  px-3  xl:w-[25%] ">
                     <h1 className="text-sm ">Date</h1>
                  </div>
                  <div className="w-[20%] h-full text-start  flex items-center  px-3   xl:w-[20%]">
                     <h1 className="text-sm ">Tag</h1>
                  </div>
                  <div className="w-[30%] h-full text-start  flex items-center  px-3  xl:w-[35%] ">
                     <h1 className="text-sm ">Note</h1>
                  </div>
               </div>
               {bookData?.entries.map((entry: any, index: number) => (
                  <div
                     className={`flex items-center w-full  min-h-[40px] bg-white  border-b border-x  border-[#DFDDE3] opacity-100 duration-300 dark:text-white dark:bg-dark-darkPurple  dark:border-dark-lightGrey   ${
                        index === bookData?.entries?.length - 1 &&
                        'rounded-b-lg '
                     }`}
                     key={index + 1}
                  >
                     <div className="w-[25%] h-full text-start  flex items-center  px-3 justify-between  pb-4  ">
                        <h1 className="text-sm ">{entry.amount}</h1>
                        {entry?.income ? (
                           <Image
                              src={arrowDown}
                              className="w-4 h-4 mt-[18px]  "
                              alt=""
                           />
                        ) : (
                           <Image
                              src={arrowUp}
                              className="w-4 h-4 mt-[18px]"
                              alt=""
                           />
                        )}
                     </div>
                     <div className="w-[25%] h-full text-start  flex items-center  px-3 justify-between   pb-4">
                        <h1 className="text-sm ">
                           {formatDate(entry?.createdAt)}
                        </h1>
                     </div>
                     <div className="w-[20%] h-full text-start  flex items-center  px-3  ">
                        <h1 className="text-[9px] py-1 px-2  p rounded  border border-lightGreyBorder  pb-4 dark:border-dark-lightGrey dark:bg-[#262429]">
                           {entry.tag || '-'}
                        </h1>
                     </div>
                     <div className="w-[30%] h-full text-start  flex items-center  px-3   py-[6px] px-3 pb-4 ">
                        <h1 className="text-sm">{entry.note || '-'}</h1>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default PDFTemplate;
