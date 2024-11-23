const EntriesHeader = () => {
   return (
      <div className="flex items-center w-full  h-[40px] bg-lightGrey border  border-lightGreyBorder rounded-t-lg md:w-[760px]  dark:bg-dark-dimPurple dark:border-dark-lightGrey dark:text-white">
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
   );
};

export default EntriesHeader;
