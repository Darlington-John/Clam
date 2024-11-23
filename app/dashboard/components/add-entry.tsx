import Image from 'next/image';
import bolt from '~/public/icons/lightning-bolt.svg';
import bookIcon from '~/public/icons/book-open.svg';
import bookFadeIcon from '~/public/icons/book-open-fade.svg';
import bookAdd from '~/public/icons/document-add.svg';
import bookAddFade from '~/public/icons/document-add-fade.svg';
import sparkles from '~/public/icons/sparkles.svg';
import sparklesFade from '~/public/icons/sparkles-fade.svg';
import { useUser } from '~/app/context/auth-context';
import { useDashboard } from '~/app/context/dashboard-context';
const AddEntry = () => {
   const { user, isDarkMode } = useUser();

   const { toggleNewBookPopup } = useDashboard();
   const buttons = [
      {
         id: 2,
         function: 'Create a book',
         icon: bookIcon,
         dark: bookFadeIcon,
         onClick: toggleNewBookPopup,
      },
      {
         id: 3,
         function: 'Upload a report',
         icon: bookAdd,
         onClick: toggleNewBookPopup,
         dark: bookAddFade,
      },
      {
         id: 4,
         function: 'Summarize status',
         icon: sparkles,
         onClick: toggleNewBookPopup,
         dark: sparklesFade,
      },
   ];
   return (
      <div className="md:w-full overflow-x-auto  overflow-y-hidden min-h-[100px] pl-6">
         <div className="flex w-full items-center gap-4 justify-center  py-8  px-6    md:justify-auto   md:w-[600px] md:pb-4">
            <Image className="w-5" src={bolt} alt="" />
            <div className="flex items-center gap-2 p-2 rounded-full bg-white    shrink-0 dark:bg-dark-grey">
               {buttons.map((data, index) => (
                  <button
                     className="h-[32px]  py-2 px-3 rounded-full flex items-center gap-2 bg-lightPurple norm-mid text-sm text-purple hover:ring hover:ring-2 ring-purple dark:ring-lightPurple  duration-300 dark:bg-dark-purple dark:text-dark-lightPurple "
                     key={index + 1}
                     onClick={data.onClick}
                  >
                     <Image
                        className="w-5"
                        src={isDarkMode ? data.dark : data.icon}
                        alt=""
                     />
                     <span>{data.function}</span>
                  </button>
               ))}
            </div>
            <Image className="w-5" src={bolt} alt="" />
         </div>
      </div>
   );
};

export default AddEntry;
