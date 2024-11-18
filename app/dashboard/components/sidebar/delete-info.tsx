import Image from 'next/image';
import trash from '~/public/icons/trash.svg';
const DeleteInfo = (props: any) => {
   const {
      toggleDeleteBookPopup,
      toggleDeleteInfoPopup,
      deleteInfo,
      isDeleteInfoVisible,
      deleteInfoRef,
   } = props;
   return (
      deleteInfo && (
         <div
            className={`w-[166px]  border border-lightGreyBorder   rounded-lg    flex flex-col   bg-lightestGrey  shadow-custom duration-300 absolute top-10  -right-[140px]   overflow-hidden z-20 md:-right-[0px]   ${
               isDeleteInfoVisible ? 'opacity-100' : 'opacity-0'
            }`}
            ref={deleteInfoRef}
         >
            <button
               className="h-[32px] flex items-center gap-2   hover:bg-lightPurple duration-150 px-3  bg-white  "
               onClick={() => {
                  toggleDeleteInfoPopup();
                  toggleDeleteBookPopup();
               }}
            >
               <Image src={trash} className="w-4 h-4" alt="" />

               <span className="text-sm text-red">Delete book</span>
            </button>
         </div>
      )
   );
};

export default DeleteInfo;
