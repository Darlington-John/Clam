import Image from 'next/image';
import empty from '~/public/images/empty.svg';

const NoEntries = (props: any) => {
   return (
      <div
         className="flex items-center gap-4 w-full  rounded-lg border border-[#DFDDE3] p-4 justify-center min-h-[320px] dark:border-dark-lightGrey"
         style={{ height: `${props.targetHeight}px` }}
      >
         <div className="flex items-center gap-3 flex-col">
            <Image src={empty} alt="" className="w-20 h-20" />
            <h1 className="text-[17px] sm:text-base text-black dark:text-white">
               No entries yet
            </h1>
            <p className="text-sm text-grey leading-[20px] text-center dark:text-dark-dimGrey">
               Your most recent entries <br />
               will show up here.
            </p>
         </div>
      </div>
   );
};
export default NoEntries;
