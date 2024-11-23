'use client';
import Image from 'next/image';
import searchIcon from '~/public/icons/search.svg';
import loadingGif from '~/public/images/load-purple.svg';
import loadingFade from '~/public/images/spinner-fade.svg';
import { usePopup } from '~/utils/tooggle-popups';
import Fuse from 'fuse.js';
import { useState } from 'react';
import filterIcon from '~/public/icons/filter.svg';
import { useUser } from '~/app/context/auth-context';
import Pagination from '../pagination';
import Filters from './filters';
import badge from '~/public/icons/Badge-red.png';
import EntriesHeader from './entries-header';
import NoEntries from './no-entries';
import AddPrintEntry from './print-add-entries';
import Entries from './entries/entries';
import { FaCheck } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
const BookEntries = (props: any) => {
   const { user, isDarkMode } = useUser();
   const {
      bookData,
      allBookData,
      toggleAddEntryPopup,
      paginationProps,
      isLoading,
      handleDeleteEntry,
      targetHeight,
   } = props;
   const entriesProps = { handleDeleteEntry, bookData };

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

   const searchedEntries = searchTerm ? searchResults.entryResults : entries;
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

   const [minAmountValue, setMinAmountValue] = useState('');
   const [maxAmountValue, setMaxAmountValue] = useState('');
   const [minDateValue, setMinDateValue] = useState('');
   const [maxDateValue, setMaxDateValue] = useState('');
   const [selectedTags, setSelectedTags] = useState<string[]>([]);

   const handleAddTag = (tag: string) => {
      if (!selectedTags.includes(tag)) {
         setSelectedTags([...selectedTags, tag]);
      }
      setSearchTerm('');
   };

   const handleRemoveTag = (tag: string) => {
      setSelectedTags(
         selectedTags.filter((selectedTag) => selectedTag !== tag)
      );
   };
   const [selectedType, setSelectedType] = useState('All');

   const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedType(event.target.value);
   };
   const [selectedUploaded, setSelectedUploaded] = useState('All');

   const handleUploadedChange = (
      event: React.ChangeEvent<HTMLInputElement>
   ) => {
      setSelectedUploaded(event.target.value);
   };
   const [selectedNote, setSelectedNote] = useState('All');
   const [filteredEntries, setFilteredEntries] = useState<any[]>([]);
   const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedNote(event.target.value);
   };
   const areAllFiltersDefault = () => {
      const isAmountFilled = minAmountValue !== '';
      const isDateFilled = minDateValue !== '';
      const areTagsSet = selectedTags.length > 0;
      const isTypeDefault = selectedType === 'All';
      const isUploadedDefault = selectedUploaded === 'All';
      const isNoteDefault = selectedNote === 'All';

      return !(
         isAmountFilled ||
         isDateFilled ||
         areTagsSet ||
         !isTypeDefault ||
         !isUploadedDefault ||
         !isNoteDefault
      );
   };
   const applyFilters = (entries: any[]) => {
      return entries.filter((entry: any) => {
         if (selectedType !== 'All') {
            if (selectedType === 'Income' && !entry.income) return false;
            if (selectedType === 'Expense' && !entry.expense) return false;
         }

         if (selectedUploaded !== 'All') {
            if (selectedUploaded === 'Manually' && entry.viaReport !== false)
               return false;
            if (selectedUploaded === 'Via report' && entry.viaReport !== true)
               return false;
         }

         if (selectedNote !== 'All') {
            if (selectedNote === 'No' && entry.note !== '') return false;
            if (selectedNote === 'Yes' && entry.note === '') return false;
         }

         if (minAmountValue && !maxAmountValue) {
            if (entry.amount < parseFloat(minAmountValue)) return false;
         }
         if (minAmountValue && maxAmountValue) {
            if (
               entry.amount < parseFloat(minAmountValue) ||
               entry.amount > parseFloat(maxAmountValue)
            ) {
               return false;
            }
         }

         const entryDate = new Date(entry.createdAt);
         if (minDateValue && !maxDateValue) {
            if (entryDate < new Date(minDateValue)) return false;
         }
         if (minDateValue && maxDateValue) {
            if (
               entryDate < new Date(minDateValue) ||
               entryDate > new Date(maxDateValue)
            ) {
               return false;
            }
         }

         if (selectedTags.length > 0) {
            if (!selectedTags.includes(entry.tag)) return false;
         }

         return true;
      });
   };

   const [areFiltersApplied, setAreFiltersApplied] = useState(false);
   const handleApplyFilters = () => {
      setAreFiltersApplied(true);
      const rawEntries = getEntriesByBookId(bookData?._id);
      const filteredEntries = applyFilters(rawEntries);
      setFilteredEntries(filteredEntries);
      toggleFilterEntryPopup();
      setSearchTerm('');
      toast.success(`Filters applied`, {
         icon: <FaCheck color="white" />,
         autoClose: 1500,
      });
   };
   const handleClearFilters = () => {
      setMinAmountValue('');
      setMaxAmountValue('');
      setMinDateValue('');
      setMaxDateValue('');
      setSelectedTags([]);
      setSelectedType('All');
      setSelectedUploaded('All');
      setSelectedNote('All');

      const rawEntries = getEntriesByBookId(bookData?._id);
      setFilteredEntries(rawEntries);

      setAreFiltersApplied(false);
   };

   const filtersProps = {
      isFilterEntryVisible,
      filterEntryRef,
      toggleFilterEntryPopup,
      filterEntry,
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
      setSearchTerm,
   };
   const AddPrintEntryProps = {
      toggleAddEntryPopup,
      allBookData,
   };
   return (
      <section className="flex  items-start gap-4  flex-col  ">
         <div className="flex items-center justify-between w-full sm:flex-col gap-3 ">
            <div className="flex items-center gap-2 sm:w-full  sm:order-2  sm:justify-start">
               <h1 className="text-[22px] text-black  fancy shrink-0  2xs:text-lg dark:text-white">
                  Your entries
               </h1>
               <div
                  className="relative  flex items-center justify-center h-[32px]   "
                  ref={searchRef}
               >
                  {searchTerm.trim() !== '' && (
                     <Image
                        src={badge}
                        alt=""
                        className={`w-2 h-2   left-2 absolute top-[5px] z-20  ${
                           isSearchVisible ? 'hidden' : ' '
                        }`}
                     />
                  )}
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
                        className={`h-[32px] py-1    bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-1   ring-purple outline-none    line-clamp-1 duration-300 ease dark:bg-dark-grey dark:border-dark-lightGrey dark:text-white dark:ring-dark-lightPurple    ${
                           isSearchVisible
                              ? 'opacity-100   pl-9 w-[290px] dxs:w-[250px]  2xs:w-[230px]  '
                              : 'opacity-0 w-[0px]  '
                        } `}
                        value={searchTerm}
                        onChange={handleChange}
                        onClick={handleClearFilters}
                        type={'text'}
                        placeholder="Amount, date, tag, and notes"
                     />
                  )}
               </div>
               {!isSearchVisible && (
                  <div className="relative">
                     {areFiltersApplied && (
                        <Image
                           src={badge}
                           alt=""
                           className={`w-2 h-2   right-[0px] absolute top-[0px] z-20  ${
                              isSearchVisible ? 'hidden' : ' '
                           }`}
                        />
                     )}
                     <Image
                        src={filterIcon}
                        alt=""
                        className="w-5 h-5  cursor-pointer   "
                        onClick={toggleFilterEntryPopup}
                     />
                     <Filters {...filtersProps} />
                  </div>
               )}
            </div>
            <AddPrintEntry {...AddPrintEntryProps} />
         </div>
         {isLoading ? (
            <div className="flex items-center justify-center h-[440px]  w-full">
               <Image
                  src={isDarkMode ? loadingFade : loadingGif}
                  className=" h-28  mx-auto self-center "
                  alt=""
               />
            </div>
         ) : (
            <>
               {areFiltersApplied ? (
                  filteredEntries.length === 0 ? (
                     <h1 className="text-sm text-grey">
                        Could&apos;nt find an entry that matches your filters
                     </h1>
                  ) : (
                     <div className="flex flex-col  w-full md:overflow-x-auto  md:overflow-y-hidden ">
                        <EntriesHeader />
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
                  )
               ) : searchTerm.trim() === '' ? (
                  <>
                     {bookData?.entries.length > 0 ? (
                        <div className="flex flex-col  w-full md:overflow-x-auto  md:overflow-y-hidden ">
                           <EntriesHeader />
                           {bookData?.entries.map(
                              (entry: any, index: number) => (
                                 <Entries
                                    {...entry}
                                    entry={entry}
                                    index={index}
                                    handleDeleteEntry={handleDeleteEntry}
                                    bookData={bookData}
                                    key={index + 1}
                                 />
                              )
                           )}
                        </div>
                     ) : (
                        <NoEntries targetHeight={targetHeight} />
                     )}
                  </>
               ) : (
                  <>
                     {searchTerm !== '' && searchedEntries.length === 0 ? (
                        <h1 className="text-sm text-grey">
                           Could&apos;nt find an entry that matches{' '}
                           {`'${searchTerm}'`}
                        </h1>
                     ) : (
                        <div className="flex flex-col  w-full md:overflow-x-auto  md:overflow-y-hidden ">
                           <EntriesHeader />
                           {searchedEntries?.map(
                              (entry: any, index: number) => (
                                 <Entries
                                    {...entry}
                                    entry={entry}
                                    index={index}
                                    {...entriesProps}
                                    bookData={searchedEntries}
                                    key={index + 1}
                                 />
                              )
                           )}
                        </div>
                     )}
                  </>
               )}
            </>
         )}
         {!isLoading &&
            searchTerm.trim() === '' &&
            areFiltersApplied === false && <Pagination {...paginationProps} />}
      </section>
   );
};

export default BookEntries;
