import Image from 'next/image';
import right from '~/public/icons/chevron-right.svg';
const Pagination = (props: any) => {
   const {
      currentPage,
      handleNextPage,
      handlePreviousPage,
      totalEntries,
      entriesPerPage,
      totalPages,
   } = props;
   const startIndex = (currentPage - 1) * entriesPerPage + 1;
   const endIndex = Math.min(currentPage * entriesPerPage, totalEntries);
   return (
      <div className="flex items-center justify-between  gap-4 w-full">
         {totalEntries > 0 && (
            <div>
               <span className="text-sm">
                  Showing {startIndex}–{endIndex} of {totalEntries}
               </span>
            </div>
         )}
         {totalEntries > 10 && (
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
                     currentPage === Math.ceil(totalEntries / entriesPerPage)
                  }
                  className={`py-2  px-4 flex items-center justify-center  ${
                     currentPage === Math.ceil(totalEntries / entriesPerPage) &&
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
