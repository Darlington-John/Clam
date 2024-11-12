import Image from 'next/image';
import right from '~/public/icons/chevron-right.svg';
const Pagination = (props: any) => {
   const {
      currentPage,
      handleNextPage,
      handlePreviousPage,
      totalEntries,
      entriesLimit,
      totalPages,
   } = props;
   const startIndex = (currentPage - 1) * entriesLimit + 1;
   const endIndex = Math.min(currentPage * entriesLimit, totalEntries);
   return (
      <div className="flex items-center justify-between  gap-4 w-full">
         {totalEntries > 0 && (
            <div>
               <span className="text-sm">
                  Showing {startIndex}–{endIndex} of {totalEntries}
               </span>
            </div>
         )}
         {totalEntries > entriesLimit && (
            <div className="flex items-center gap-2  rounded-lg p-1  border border-lightGreyBorder ">
               <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`py-2  px-4 flex items-center justify-center  ${
                     currentPage === 1 && 'opacity-20'
                  }`}
               >
                  <Image
                     src={right}
                     alt=""
                     className="w-4 shrink-0 rotate-180"
                  />
               </button>

               <span className="text-xs text-grey">
                  Page {currentPage} of {totalPages}
               </span>

               <button
                  onClick={handleNextPage}
                  disabled={
                     currentPage === Math.ceil(totalEntries / entriesLimit)
                  }
                  className={`py-2  px-4 flex items-center justify-center  ${
                     currentPage === Math.ceil(totalEntries / entriesLimit) &&
                     'opacity-20'
                  }`}
               >
                  <Image src={right} alt="" className="w-4 shrink-0" />
               </button>
            </div>
         )}
      </div>
   );
};

export default Pagination;
