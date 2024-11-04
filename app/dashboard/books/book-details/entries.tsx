'use client';

import empty from '~/public/images/empty.svg';
import Image from 'next/image';
import arrowUp from '~/public/icons/arrow-circle-up.svg';
import arrowDown from '~/public/icons/arrow-circle-down.svg';
import plus from '~/public/icons/plus-circle-white.svg';
import more from '~/public/icons/dots-horizontal.svg';
import infoGrey from '~/public/icons/information-circle-grey.svg';
import { formatDate } from '~/utils/formattedDate';
import moreBlack from '~/public/icons/li_more-horizontal.svg';
const BookEntries = ({ bookData, toggleAddEntryPopup }: any) => {
     return (
          <section className="flex  items-start gap-4  flex-col  ">
               <div className="flex items-center justify-between w-full ">
                    <h1 className="text-[22px] text-black  fancy">
                         Your entries
                    </h1>
                    <div className="flex items-center gap-4">
                         <button
                              className="bg-purple text-white px-4 py-2 rounded-full text-sm flex gap-2 items-center"
                              onClick={toggleAddEntryPopup}
                         >
                              <Image src={plus} className="w-5 h-5" alt="" />
                              <span>Add entry</span>
                         </button>
                         <Image src={more} className="w-5 h-5" alt="" />
                    </div>
               </div>
               {bookData?.entries.length > 0 ? (
                    <div className="flex flex-col  w-full">
                         <div className="flex items-center w-full  h-[40px] bg-lightGrey border  border-lightGreyBorder rounded-t-lg">
                              <div className="w-[10%] h-full text-start  flex items-center  px-3  xl:w-[15%] md:w-[25%] xs:w-full ">
                                   <h1 className="text-sm ">Amount ($)</h1>
                              </div>
                              <div className="w-[12%] h-full text-start  flex items-center  px-3  xl:w-[20%] md:w-[25%]  xs:w-full">
                                   <h1 className="text-sm ">Date</h1>
                              </div>
                              <div className="w-[10%] h-full text-start  flex items-center  px-3  md:w-[15%]   xs:justify-end xs:w-[20%]">
                                   <h1 className="text-sm ">Tag</h1>
                              </div>
                              <div className="w-[63%] h-full text-start  flex items-center  px-3  xl:w-[50%] md:w-[30%] xs:hidden">
                                   <h1 className="text-sm ">Note</h1>
                              </div>
                              <div className="w-[5%] h-full text-start  flex items-center  px-3 xs:hidden"></div>
                         </div>
                         {bookData?.entries.map((entry: any, index: number) => (
                              <div
                                   className={`flex items-center w-full  h-[40px] bg-white  border  border-lightGreyBorder   ${
                                        index === bookData.entries.length - 1 &&
                                        'rounded-b-lg '
                                   }`}
                                   key={index + 1}
                              >
                                   <div className="w-[10%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[15%] md:w-[25%]  xs:w-full">
                                        <h1 className="text-sm ">
                                             {entry?.amount}
                                        </h1>
                                        {entry?.income ? (
                                             <Image
                                                  src={arrowDown}
                                                  className="w-4 h-4"
                                                  alt=""
                                             />
                                        ) : (
                                             <Image
                                                  src={arrowUp}
                                                  className="w-4 h-4"
                                                  alt=""
                                             />
                                        )}
                                   </div>
                                   <div className="w-[12%] h-full text-start  flex items-center  px-3 justify-between  xl:w-[20%] md:w-[25%]  xs:w-full">
                                        <h1 className="text-sm ">
                                             {formatDate(entry?.createdAt)}
                                        </h1>
                                        <Image
                                             src={infoGrey}
                                             className="w-4 h-4"
                                             alt=""
                                        />
                                   </div>
                                   <div className="w-[10%] h-full text-start  flex items-center  px-3 md:w-[15%]    xs:justify-end xs:w-[20%]">
                                        <h1 className="text-[9px] py-1 px-2  p rounded  border border-lightGreyBorder">
                                             {entry?.tag || '-'}
                                        </h1>
                                   </div>
                                   <div className="w-[63%] h-full text-start  flex items-center  px-3  xl:w-[50%] md:w-[30%] xs:hidden">
                                        <h1 className="text-sm  line-clamp-1">
                                             {entry?.note || '-'}
                                        </h1>
                                   </div>
                                   <div className="w-[5%] h-full text-start  flex items-center  px-3 justify-center xs:hidden">
                                        <Image
                                             src={moreBlack}
                                             className="w-4 h-4"
                                             alt=""
                                        />
                                   </div>
                              </div>
                         ))}
                    </div>
               ) : (
                    <div className="flex items-center gap-4 w-full  rounded-lg border border-[#DFDDE3] p-4 justify-center  h-[320px]">
                         <div className="flex items-center gap-3 flex-col">
                              <Image src={empty} alt="" className="w-20 h-20" />
                              <h1 className="text-[17px] sm:text-base text-black">
                                   No entries yet
                              </h1>
                              <p className="text-sm text-grey leading-[20px] text-center">
                                   Your most recent entries <br />
                                   will show up here.
                              </p>
                         </div>
                    </div>
               )}
          </section>
     );
};

export default BookEntries;
