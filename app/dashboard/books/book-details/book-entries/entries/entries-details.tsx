import Image from 'next/image';
import { formatDate } from '~/utils/formattedDate';
import { formatTime } from '~/utils/formatTime';
import infoCircle from '~/public/icons/information-circle-dark.svg';
const EntriesDetails = (props: any) => {
   const {
      entryDetails,
      isEntryDetailsVisible,
      entryDetailsRef,
      toggleEntryDetailsPopup,
      toggleEditEntryPopup,
      selectedEntry,
   } = props;
   const details = [
      { id: 1, field: 'Amount', value: selectedEntry?.amount },
      {
         id: 2,
         field: 'Type',
         value: selectedEntry?.income === true ? 'Income' : 'Expense',
      },
      {
         id: 3,
         field: 'Date',
         value: formatDate(selectedEntry?.createdAt),
      },
      {
         id: 4,
         field: 'Time',
         value: formatTime(selectedEntry?.createdAt),
      },
      {
         id: 5,
         field: 'Tag',
         value: selectedEntry?.tag || '-',
      },
      {
         id: 6,
         field: 'Via',
         value:
            selectedEntry?.viaReport === true ? 'Via report' : 'Manual entry',
      },
      {
         id: 7,
         field: 'Note',
         value: selectedEntry?.note || '',
         break: true,
      },
   ];
   return (
      entryDetails && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-6 rounded-2xl bg-white items-center      ${
                  isEntryDetailsVisible ? '' : 'pop-hidden'
               }`}
               ref={entryDetailsRef}
            >
               <div className="flex items-center w-full gap-1 flex-col">
                  <Image src={infoCircle} className="w-6  h-6 " alt="" />
                  <h1 className="fancy text-[22px] text-black leading-none">
                     Entry details
                  </h1>
               </div>

               <div className="w-full flex flex-col divide-y-[0.5px]  divide-[#C6C2CC]  ">
                  {details.map((data) => (
                     <div
                        className={`flex     w-full ${
                           data.break
                              ? 'flex-col gap-0  items-start min-h-[40px] py-2'
                              : ' justify-between items-center h-[40px]'
                        }`}
                        key={data?.id}
                     >
                        <span
                           className={`text-sm   ${
                              data.break ? ' order-2 text-grey' : '  text-black'
                           }`}
                        >
                           {data?.value}
                        </span>
                        <span
                           className={`text-sm   ${
                              data.break ? ' order-1  text-black' : 'text-grey '
                           }`}
                        >
                           {data?.field}
                        </span>
                     </div>
                  ))}
               </div>
               <div className="flex items-center gap-3 w-full">
                  <button
                     className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full justify-center  "
                     onClick={toggleEntryDetailsPopup}
                  >
                     Okay
                  </button>
                  <button
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  shrink-0"
                     onClick={() => {
                        toggleEditEntryPopup();
                        toggleEntryDetailsPopup();
                     }}
                  >
                     Edit entry
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default EntriesDetails;
