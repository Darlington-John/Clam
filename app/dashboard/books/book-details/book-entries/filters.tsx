'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import cash from '~/public/icons/cash.svg';
import dotedLine from '~/public/images/dottedLine.png';
import arrowDown from '~/public/icons/chevron-down.svg';
import calendar from '~/public/icons/calendar.svg';
import search from '~/public/icons/search-black.svg';
import tagIcon from '~/public/icons/tag.svg';
import Fuse from 'fuse.js';
import { useUser } from '~/app/context/auth-context';
import { usePopup } from '~/utils/tooggle-popups';
import close from '~/public/icons/xframe.png';
import check from '~/public/icons/check.svg';

const Filters = (props: any) => {
   const {
      isFilterEntryVisible,
      filterEntryRef,
      filterEntry,
      toggleFilterEntryPopup,
      bookData,
      minAmountValue,
      maxAmountValue,
      setMinAmountValue,
      setMaxAmountValue,
      minDateValue,
      setMinDateValue,
      maxDateValue,
      setMaxDateValue,
      selectedTags,
      handleAddTag,
      handleRemoveTag,
      selectedType,
      handleRadioChange,
      selectedUploaded,
      handleUploadedChange,
      selectedNote,
      handleNoteChange,
      areAllFiltersDefault,
      handleApplyFilters,
      handleClearFilters,
      setSearchTerm: parentSearchTerm,
   } = props;
   const [activeIndices, setActiveIndices] = useState<number[]>([]);
   const { user } = useUser();
   const handleItemClick = (index: number) => {
      setActiveIndices((prevIndices) =>
         prevIndices.includes(index)
            ? prevIndices.filter((i) => i !== index)
            : [...prevIndices, index]
      );
   };
   const getEntriesByBookId = (bookId: string) => {
      if (!user || !user.books) return [];
      const book = user.books.find((book: any) => book._id === bookId);

      if (!book || !book.entries) return [];

      const tags = book.entries
         .map((entry: any) => entry.tag)
         .filter((tag: any) => tag && tag.trim() !== '');

      return [...new Set(tags)];
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
         keys: ['tag'],
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
      isVisible: isTagVisible,
      isActive: tag,
      setIsActive: setIsTagActive,
      ref: tagRef,
      togglePopup: toggleTagPopup,
   } = usePopup();

   return (
      filterEntry && (
         <div
            className={`h-auto   w-[320px] z-[50] p-4 duration-300 ease shrink-0 flex flex-col gap-4 p-6 rounded-lg bg-white border border-lightGreyBorder shadow-custom absolute -top-[150px] left-10 sm:top-1/2  sm:left-1/2 sm:transform sm:fixed  sm:-translate-x-1/2  sm:-translate-y-1/2    ${
               isFilterEntryVisible ? 'opacity-100' : 'opacity-0'
            }`}
            ref={filterEntryRef}
         >
            <div className="flex items-center justify-between">
               <h1 className="text-[27px] text-black fancy">Filters</h1>
               <button
                  onClick={() => {
                     handleClearFilters();
                     parentSearchTerm('');
                     toggleFilterEntryPopup();
                  }}
                  className="bg-lightPurple  text-purple    h-[32px] text-sm   shrink-0  w-auto py-2 px-3 rounded-full  hover:bg-purple   hover:text-white   duration-300 flex items-center gap-2"
               >
                  Reset
               </button>
            </div>
            <div className="flex flex-col  gap-4  w-full">
               <div className="flex flex-wrap w-full gap-3">
                  <div className="flex w-full gap-4  items-center overflow-hidden text-sm">
                     <span>Type</span>
                     <Image
                        src={dotedLine}
                        className="w-full h-[1.5px]"
                        alt=""
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="radio"
                              value="All"
                              checked={selectedType === 'All'}
                              onChange={handleRadioChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">All</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="radio"
                              value="Income"
                              checked={selectedType === 'Income'}
                              onChange={handleRadioChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">Income</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="radio"
                              value="Expense"
                              checked={selectedType === 'Expense'}
                              onChange={handleRadioChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">Expense</span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-wrap w-full gap-3">
                  <div className="flex w-full gap-4  items-center overflow-hidden text-sm">
                     <span>Uploaded</span>
                     <Image
                        src={dotedLine}
                        className="w-full h-[1.5px]"
                        alt=""
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="uploaded"
                              value="All"
                              checked={selectedUploaded === 'All'}
                              onChange={handleUploadedChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">All</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="uploaded"
                              value="Manually"
                              checked={selectedUploaded === 'Manually'}
                              onChange={handleUploadedChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">Manually</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="uploaded"
                              value="Via report"
                              checked={selectedUploaded === 'Via report'}
                              onChange={handleUploadedChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">Via report</span>
                     </div>
                  </div>
               </div>
               <div className="flex flex-wrap  w-full gap-3">
                  <div className="flex w-full gap-4  items-center overflow-hidden text-sm">
                     <span className="shrink-0">Note added</span>
                     <Image
                        src={dotedLine}
                        className="w-full h-[1.5px]"
                        alt=""
                     />
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="note"
                              value="All"
                              checked={selectedNote === 'All'}
                              onChange={handleNoteChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">All</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="note"
                              value="Yes"
                              checked={selectedNote === 'Yes'}
                              onChange={handleNoteChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">Yes</span>
                     </div>
                  </div>
                  <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 ">
                        <label className="radio flex items-center   h-[20px] w-[20px]">
                           <input
                              type="radio"
                              name="note"
                              value="No"
                              checked={selectedNote === 'No'}
                              onChange={handleNoteChange}
                           />
                           <span className="checkmark"></span>
                        </label>
                        <span className="text-sm">No</span>
                     </div>
                  </div>
               </div>
            </div>
            <div className="w-full flex flex-col  ">
               <AccordionItem
                  isOpen={activeIndices.includes(0)}
                  onClick={() => handleItemClick(0)}
                  content="Amount range"
                  icon={cash}
                  info="Enter amount range to filter from"
               >
                  <AmountFilter
                     minValue={minAmountValue}
                     setMinValue={setMinAmountValue}
                     maxValue={maxAmountValue}
                     setMaxValue={setMaxAmountValue}
                     minLabel="Lowest"
                     maxLabel="Highest"
                     type="number"
                  />
               </AccordionItem>
               <AccordionItem
                  isOpen={activeIndices.includes(1)}
                  onClick={() => handleItemClick(1)}
                  content="Date range"
                  icon={calendar}
                  info="Select date range to filter from"
               >
                  <AmountFilter
                     minValue={minDateValue}
                     setMinValue={setMinDateValue}
                     maxValue={maxDateValue}
                     setMaxValue={setMaxDateValue}
                     minLabel="Start date"
                     maxLabel="End date"
                     type="date"
                  />
               </AccordionItem>
            </div>
            <div className="h-[32px] relative flex items-center justify-center">
               <Image src={search} alt="" className="w-5 h-5 absolute left-2" />
               <input
                  className={` py-1    bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-1   ring-purple outline-none    line-clamp-1 duration-300 ease h-full pl-9 w-full    `}
                  value={searchTerm}
                  onChange={(e) => {
                     handleChange(e);
                     setIsTagActive(true);
                  }}
                  onClick={() => toggleTagPopup()}
                  type={'text'}
                  placeholder="Search for a tag to apply"
               />
               {searchTerm.trim() !== '' && tag && (
                  <div
                     className={`w-full        duration-300 ease-in-out flex flex-col py-1  px-2   gap-1  bg-white  absolute  top-12   z-40    shadow-custom  h-auto  overflow-auto  flow border border-lightGrey rounded-lg    ${
                        isTagVisible ? 'opacity-100' : '  opacity-0'
                     }`}
                     ref={tagRef}
                  >
                     {filteredEntries.length === 0 ? (
                        <div className="w-full  flex items-center justify-center">
                           <span className="text-sm text-grey">
                              No results found for &quot;
                              {searchTerm}
                              &quot;
                           </span>
                        </div>
                     ) : (
                        filteredEntries
                           .slice(0, 3)
                           .map((data: any, index: any) => (
                              <button
                                 key={index + 1}
                                 onClick={() => {
                                    handleAddTag(data);
                                    setIsTagActive(false);
                                 }}
                                 className="w-full  h-[40px]   hover:bg-lightGrey flex items-center  gap-2  duration-150 text-sm  px-2  rounded-lg  border-b border-lightGrey  shrink-0"
                              >
                                 <Image
                                    src={tagIcon}
                                    className="w-5 h-5"
                                    alt=""
                                 />
                                 <span>{data}</span>
                              </button>
                           ))
                     )}
                  </div>
               )}
            </div>
            <div className="flex  items-center flex-wrap gap-2">
               {selectedTags.map((tag: string, index: number) => (
                  <div
                     key={index}
                     className="h-[24px] flex items-center justify-center gap-2 border border-lightGrey  rounded-sm  px-1"
                  >
                     <span className="text-sm">{tag}</span>
                     <Image
                        onClick={() => handleRemoveTag(tag)}
                        src={close}
                        className="w-4  h-4 "
                        alt=""
                     />
                  </div>
               ))}
            </div>
            {!areAllFiltersDefault() && (
               <div className="flex items-center gap-3">
                  <button
                     onClick={handleApplyFilters}
                     className="bg-purple text-white px-4 h-[32px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full justify-center  "
                  >
                     <Image className="w-5" src={check} alt="" />
                     <span>Apply</span>
                  </button>
                  <button
                     onClick={() => {
                        parentSearchTerm('');
                        toggleFilterEntryPopup();
                     }}
                     className="bg-lightPurple  text-purple px-4 h-[32px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                  >
                     Close
                  </button>
               </div>
            )}
         </div>
      )
   );
};

interface AccordionItemProps {
   isOpen: boolean;
   onClick: () => void;

   [key: string]: any;
}
const AccordionItem: React.FC<AccordionItemProps> = ({
   isOpen,
   onClick,
   content,
   icon,
   info,
   children,
}) => {
   const contentHeight = useRef<HTMLDivElement | null>(null);
   const [height, setHeight] = useState('0px');

   useEffect(() => {
      if (isOpen && contentHeight.current) {
         setHeight(`${contentHeight.current.scrollHeight}px`);
      } else {
         setHeight('0px');
      }
   }, [isOpen]);

   return (
      <div className="overflow-hidden text-[28px] w-full flex flex-col">
         <button
            className="w-full text-left py-2 flex items-center justify-between font-medium outline-none"
            onClick={onClick}
         >
            <div className="flex items-center gap-2">
               <Image src={icon} alt="" className="w-5 h-5" />
               <p className="text-sm">{content}</p>
            </div>
            <Image
               src={arrowDown}
               alt=""
               className={`w-5 h-5 ease-out duration-300 ${
                  isOpen ? 'rotate-[360deg]' : ''
               }`}
            />
         </button>
         <div
            ref={contentHeight}
            className="ease-out duration-300"
            style={{ height }}
         >
            <div className="flex flex-col py-2">
               <h1 className="text-sm text-grey">{info}</h1>
               {children}
            </div>
         </div>
      </div>
   );
};
interface FilterProps {
   minValue: string;
   setMinValue: (value: string) => void;
   maxValue: string;
   setMaxValue: (value: string) => void;
   minLabel: string;
   maxLabel: string;
   type?: string;
}

const AmountFilter: React.FC<FilterProps> = ({
   minValue,
   setMinValue,
   maxValue,
   setMaxValue,
   minLabel,
   maxLabel,
   type = 'text',
}) => (
   <div className="flex items-center justify-between w-full">
      <div className="flex py-2 w-[49%] gap-1 flex-col">
         <h1 className="text-sm">{minLabel}</h1>
         <input
            className="h-[40px] p-1 bg-lightGrey text-black text-sm rounded-lg border border-[#DFDDE3] border-2 focus:border-purple outline-none w-full duration-300"
            type={type}
            placeholder="Enter value"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
         />
      </div>
      <div className="flex py-2 w-[49%] gap-1 flex-col">
         <h1 className="text-sm">{maxLabel}</h1>
         <input
            className="h-[40px] p-1 bg-lightGrey text-black text-sm rounded-lg border border-[#DFDDE3] border-2 focus:border-purple outline-none w-full duration-300"
            type={type}
            placeholder="Enter value"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
         />
      </div>
   </div>
);
export default Filters;
