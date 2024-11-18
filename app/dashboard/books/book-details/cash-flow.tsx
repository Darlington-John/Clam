'use client';
import Image from 'next/image';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import chevronGrey from '~/public/icons/chevron-down-grey.svg';
import calendar from '~/public/icons/calendar.svg';
import line from '~/public/images/line.png';
import info from '~/public/icons/information-circle.svg';
import pencil from '~/public/icons/pencil.svg';
import loading from '~/public/images/load.svg';
import { formattedDate } from '~/utils/formattedDate';
import closeIcon from '~/public/icons/close.svg';

const BookCashFlow = (props: any) => {
   const {
      bookData,
      addDescription,
      addDescriptionLoading,
      addDescriptionError,
      description,
      setDescription,
      setAddDescriptionError,
      incomeTotal,
      expenseTotal,
      editDescription,
      setEditDescription,
   } = props;

   return (
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
                     ${incomeTotal}
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
                     ${expenseTotal}
                  </h1>
               </div>
               <button className="bg-yellow py-1 px-2 text-darkYellow text-sm rounded-full flex items-center gap-1 ">
                  <span>No change from last month</span>
                  <Image src={info} alt="" className="w-4 h-4" />
               </button>
            </div>
         </section>
         <div className="flex shrink-0 bg-white rounded-2xl p-4  w-[25%] flex-col gap-2 items-start xl:p-3 xl:gap-1 md:w-auto">
            <div className="flex items-center justify-between  w-full">
               <h1 className="text-[17px] text-black fancy ">
                  {bookData?.name}
               </h1>
               <div className="flex">
                  {description ? (
                     <button
                        className="flex items-center gap-1 text-xs text-white bg-purple rounded-lg h-[30px]  px-2"
                        onClick={addDescription}
                        disabled={addDescriptionLoading}
                     >
                        {addDescriptionLoading ? (
                           <Image src={loading} alt="" className="w-6 h-6" />
                        ) : (
                           'Add'
                        )}
                     </button>
                  ) : (
                     <Image
                        src={
                           editDescription && bookData?.description
                              ? closeIcon
                              : pencil
                        }
                        alt=""
                        className="w-5 h-5"
                        onClick={() => setEditDescription((prev: any) => !prev)}
                     />
                  )}
               </div>
            </div>
            {addDescriptionError && (
               <p className="text-red text-xs">{addDescriptionError}</p>
            )}
            {editDescription ? (
               <textarea
                  placeholder="Add a description"
                  className="text-sm     w-full h-full outline-none resize-none"
                  value={description}
                  onChange={(e) => {
                     setDescription(e.target.value);
                     setAddDescriptionError('');
                  }}
                  style={{ overflow: 'hidden' }}
               />
            ) : bookData?.description ? (
               <p className="text-sm text-grey">{bookData?.description}</p>
            ) : (
               <textarea
                  placeholder="Add a description"
                  className="text-sm     w-full h-full outline-none resize-none"
                  value={description}
                  onChange={(e) => {
                     setDescription(e.target.value);
                     setAddDescriptionError('');
                  }}
                  style={{ overflow: 'hidden' }}
               />
            )}
         </div>
      </section>
   );
};

export default BookCashFlow;
