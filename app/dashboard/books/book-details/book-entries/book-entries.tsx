'use client';

import empty from '~/public/images/empty.svg';
import Image from 'next/image';
import plus from '~/public/icons/plus-circle-white.svg';
import more from '~/public/icons/dots-horizontal.svg';
import searchIcon from '~/public/icons/search.svg';
import loadingGif from '~/public/images/load-purple.svg';
import { usePopup } from '~/utils/tooggle-popups';
import Fuse from 'fuse.js';
import { useState } from 'react';
import filterIcon from '~/public/icons/filter.svg';
import { useUser } from '~/app/context/auth-context';
import Pagination from '../pagination';
import Entries from './entries';
const BookEntries = (props: any) => {
   const {
      bookData,
      toggleAddEntryPopup,
      paginationProps,
      isLoading,
      handleDeleteEntry,
   } = props;
   const { user } = useUser();
   const getEntriesByBookId = (bookId: string) => {
      if (!user || !user.books) return [];
      const book = user.books.find((book: any) => book._id === bookId);
      return book ? book.entries : [];
   };

   const entries = getEntriesByBookId(bookData?._id);

   interface SearchResults {
      entryResults: Array<any>;
   }
   const [searchTerm, setSearchTerm] = useState('');
   const [searchResults, setSearchResults] = useState<SearchResults>({
      entryResults: [],
   });

   const handleSearch = (query: string) => {
      if (!query) {
         setSearchResults({ entryResults: [] });
         return;
      }

      const fuseEntries = new Fuse(entries || [], {
         keys: ['amount', 'note', 'tag', 'createdAt'],
         threshold: 0.3,
         includeScore: true,
      });

      const results = fuseEntries.search(query);

      const exactMatch = results.length > 0 ? results[0].item : null;
      const fuzzyMatches = results.slice(1, 6).map((result) => result.item);

      const finalResults = exactMatch
         ? [exactMatch, ...fuzzyMatches]
         : fuzzyMatches;
      setSearchResults({ entryResults: finalResults });
   };

   const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchTerm(query);
      handleSearch(query);
   };

   const filteredEntries = searchTerm ? searchResults.entryResults : entries;
   const {
      isVisible: isSearchVisible,
      isActive: search,
      ref: searchRef,
      togglePopup: toggleSearchPopup,
   } = usePopup();
   const {
      isVisible: isFilterEntryVisible,
      isActive: filterEntry,
      ref: filterEntryRef,
      togglePopup: toggleFilterEntryPopup,
   } = usePopup();
   return (
      <section className="flex  items-start gap-4  flex-col  ">
         <div className="flex items-center justify-between w-full ">
            <div className="flex items-center gap-1">
               <h1 className="text-[22px] text-black  fancy shrink-0">
                  Your entries
               </h1>
               <div
                  className="relative  flex items-center justify-center "
                  ref={searchRef}
               >
                  <Image
                     src={searchIcon}
                     alt=""
                     className={`w-5 h-5   left-2 cursor-pointer  z-10 ${
                        isSearchVisible ? 'absolute' : ' '
                     }`}
                     onClick={toggleSearchPopup}
                  />
                  {search && (
                     <input
                        className={`h-[32px] py-1    bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-1   ring-purple outline-none    line-clamp-1 duration-300 ease    ${
                           isSearchVisible
                              ? 'opacity-100   pl-9 w-[290px]'
                              : 'opacity-0 w-[0px] '
                        } `}
                        value={searchTerm}
                        onChange={handleChange}
                        type={'text'}
                        placeholder="Amount, date, tag, and notes"
                        name="password"
                     />
                  )}
               </div>
               {!isSearchVisible && (
                  <div className="relative">
                     <Image
                        src={filterIcon}
                        alt=""
                        className="w-5 h-5  cursor-pointer   "
                        onClick={toggleFilterEntryPopup}
                     />
                     {filterEntry && (
                        <div
                           className={`absolute  top-10 left-0  h-full   w-[320px] z-10 p-4 duration-300 ease shrink-0 flex flex-col gap-4 p-6 rounded-lg bg-white border border-lightGreyBorder shadow-custom ${
                              isFilterEntryVisible ? 'opacity-100' : 'opacity-0'
                           }`}
                           ref={filterEntryRef}
                        >
                           hellp
                        </div>
                     )}
                  </div>
               )}
            </div>

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
         {isLoading ? (
            <div className="flex items-center justify-center h-[440px]  w-full">
               <Image
                  src={loadingGif}
                  className=" h-28  mx-auto self-center "
                  alt=""
               />
            </div>
         ) : searchTerm.trim() === '' ? (
            <>
               {bookData?.entries.length > 0 ? (
                  <div className="flex flex-col  w-full overflow-x-auto  overflow-y-hidden ">
                     <div className="flex items-center w-full  h-[40px] bg-lightGrey border  border-lightGreyBorder rounded-t-lg md:w-[760px]">
                        <div className="w-[10%] h-full text-start  flex items-center  px-3  xl:w-[20%] ">
                           <h1 className="text-sm ">Amount ($)</h1>
                        </div>
                        <div className="w-[12%] h-full text-start  flex items-center  px-3  xl:w-[25%] ">
                           <h1 className="text-sm ">Date</h1>
                        </div>
                        <div className="w-[10%] h-full text-start  flex items-center  px-3   xl:w-[20%]">
                           <h1 className="text-sm ">Tag</h1>
                        </div>
                        <div className="w-[63%] h-full text-start  flex items-center  px-3  xl:w-[35%] ">
                           <h1 className="text-sm ">Note</h1>
                        </div>
                     </div>
                     {bookData?.entries.map((entry: any, index: number) => (
                        <Entries
                           {...entry}
                           entry={entry}
                           index={index}
                           handleDeleteEntry={handleDeleteEntry}
                           bookData={bookData}
                           key={index + 1}
                        />
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
            </>
         ) : (
            <>
               {searchTerm !== '' && filteredEntries.length === 0 ? (
                  <h1 className="text-sm text-grey">
                     Could&apos;nt find an entry that matches{' '}
                     {`'${searchTerm}'`}
                  </h1>
               ) : (
                  <div className="flex flex-col  w-full overflow-x-auto  overflow-y-hidden ">
                     <div className="flex items-center w-full  h-[40px] bg-lightGrey border  border-lightGreyBorder rounded-t-lg md:w-[760px]">
                        <div className="w-[10%] h-full text-start  flex items-center  px-3  xl:w-[20%] ">
                           <h1 className="text-sm ">Amount ($)</h1>
                        </div>
                        <div className="w-[12%] h-full text-start  flex items-center  px-3  xl:w-[25%] ">
                           <h1 className="text-sm ">Date</h1>
                        </div>
                        <div className="w-[10%] h-full text-start  flex items-center  px-3   xl:w-[20%]">
                           <h1 className="text-sm ">Tag</h1>
                        </div>
                        <div className="w-[63%] h-full text-start  flex items-center  px-3  xl:w-[35%] ">
                           <h1 className="text-sm ">Note</h1>
                        </div>
                     </div>
                     {filteredEntries?.map((entry: any, index: number) => (
                        <Entries
                           {...entry}
                           entry={entry}
                           index={index}
                           handleDeleteEntry={handleDeleteEntry}
                           bookData={filteredEntries}
                           key={index + 1}
                        />
                     ))}
                  </div>
               )}
            </>
         )}
         {!isLoading && searchTerm.trim() === '' && (
            <Pagination {...paginationProps} />
         )}
      </section>
   );
};

export default BookEntries;
