import Image from 'next/image';
import chevronDown from '~/public/icons/chevron-down.svg';
import load from '~/public/images/load.svg';

import income from '~/public/icons/arrow-circle-down.svg';
import expense from '~/public/icons/arrow-circle-up.svg';
import incomeFade from '~/public/icons/arrow-circle-down-fade.svg';
import expenseFade from '~/public/icons/arrow-circle-up-fade.svg';
import plusGrey from '~/public/icons/plus-circle-grey.svg';
import tagIcon from '~/public/icons/tag.svg';
import danger from '~/public/icons/exclamation.svg';
import { usePopup } from '~/utils/tooggle-popups';
import { useUser } from '~/app/context/auth-context';

import dangerFade from '~/public/icons/exclamation-fade.svg';
const EditEntry = (props: any) => {
   const { isDarkMode } = useUser();

   const {
      editEntryPopup,
      isEditEntryVisible,
      editEntryRef,
      activeEditButton,
      toggleEditButton,
      selectedEntry,
      handleEntryChange,
      inputWidth,
      error,
      setError,
      spanRef,
      setSelectedEntry,
      editEntryLoading,
      editEntry,
      toggleEditEntryPopup,
   } = props;
   const {
      isVisible: isTagVisible,
      isActive: tag,
      setIsActive: setIsTagActive,
      ref: tagRef,
      togglePopup: toggleTagPopup,
   } = usePopup();
   const tags = ['important', 'fun', 'emergency', 'urgent', 'miscellaneous'];
   const handleTagClick = (tagValue: string) => {
      setSelectedEntry((prevEntry: any) =>
         prevEntry ? { ...prevEntry, tag: tagValue } : null
      );
   };

   return (
      editEntryPopup && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-6 rounded-2xl bg-white items-center   dark:bg-dark-grey dark:text-white      ${
                  isEditEntryVisible ? '' : 'pop-hidden'
               }`}
               ref={editEntryRef}
            >
               <div className="flex items-center w-full gap-1 flex-col">
                  <Image src={plusGrey} className="w-6  h-6 " alt="" />
                  <h1 className="fancy text-[22px] text-black leading-none dark:text-white">
                     Edit entry
                  </h1>
               </div>
               <div className="flex items-center  p-[2px]  rounded-lg bg-lightGrey  w-full dark:bg-dark-dimPurple   ">
                  <button
                     onClick={() => toggleEditButton('income')}
                     className={`px-4  rounded-lg  h-[28px] text-sm w-full  flex  items-center  gap-1 justify-center  text-black  dark:text-white   ${
                        activeEditButton === 'income'
                           ? 'bg-white   dark:bg-[#6D6873]  '
                           : ' '
                     }`}
                  >
                     <Image
                        src={isDarkMode ? incomeFade : income}
                        className="w-4  h-4 "
                        alt=""
                     />
                     <span>Income</span>
                  </button>
                  <button
                     onClick={() => toggleEditButton('expense')}
                     className={`px-4  rounded-lg  h-[28px] text-sm w-full  flex  items-center  gap-1 justify-center text-black dark:text-white     ${
                        activeEditButton === 'expense'
                           ? 'bg-white dark:bg-[#6D6873] '
                           : ' '
                     }`}
                  >
                     <Image
                        src={isDarkMode ? expenseFade : expense}
                        className="w-4  h-4 "
                        alt=""
                     />
                     <span>Expense</span>
                  </button>
               </div>
               <div className="flex  items-center justify-center  gap-1 py-2 border-y border-lightGrey w-full border-dotted  dark:border-dark-lightGrey">
                  <span className="text-black  text-[22px] fancy   dark:text-white">
                     $
                  </span>
                  <input
                     type="text"
                     value={selectedEntry?.amount}
                     style={{
                        width: `${inputWidth}px`,
                     }}
                     onChange={(e) => {
                        handleEntryChange(e);
                        setError('');
                     }}
                     autoFocus
                     className="  outline-none  number-input  text-[34px] fancy dark:bg-dark-grey dark:text-white  "
                     placeholder="Edit amount"
                  />
                  <span
                     ref={spanRef}
                     className="text-[34px] self-start fancy invisible absolute "
                  >
                     {selectedEntry?.amount || ' '}
                  </span>
               </div>
               {error === 'Enter an amount' && (
                  <div className="w-full flex items-center justify-center gap-2">
                     <div className="bg-pink p-1  rounded-full dark:bg-dark-red">
                        <Image
                           src={isDarkMode ? dangerFade : danger}
                           className="w-3 h-3"
                           alt=""
                        />
                     </div>
                     <h1 className="text-sm text-red dark:text-dark-pink">
                        Enter an amount
                     </h1>
                  </div>
               )}

               <div className="flex  gap-1  flex-col  w-full">
                  <h1 className="text-sm">Edit Description</h1>
                  <textarea
                     placeholder="E.g money from services rendered"
                     className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto h-[110px] max-h-[150px] dark:bg-dark-darkPurple    dark:border-dark-lightGrey"
                     value={selectedEntry?.note}
                     onChange={(e) =>
                        setSelectedEntry((prevEntry: any) =>
                           prevEntry
                              ? { ...prevEntry, note: e.target.value }
                              : null
                        )
                     }
                  />
               </div>
               <div className="flex  gap-1  flex-col  w-full">
                  <h1 className="text-sm">Edit tag</h1>
                  <div className="h-[40px]  w-full flex items-center justify-center relative">
                     <input
                        placeholder="Search or create a tag"
                        className="text-sm     w-full h-full outline-none  bg-lightGrey  border border-lightGreyBorder rounded-lg  py-2 px-3 overflow-auto pr-8 dark:bg-dark-darkPurple    dark:border-dark-lightGrey "
                        value={selectedEntry?.tag}
                        onChange={(e) =>
                           setSelectedEntry((prevEntry: any) =>
                              prevEntry
                                 ? { ...prevEntry, tag: e.target.value }
                                 : null
                           )
                        }
                        onClick={toggleTagPopup}
                     />
                     <Image
                        src={chevronDown}
                        onClick={toggleTagPopup}
                        className={`w-5 h-5 absolute right-3 duration-300  ${
                           tag ? 'rotate-180' : ''
                        }`}
                        alt=""
                     />
                     {tag && (
                        <div
                           className={`w-full        duration-300 ease-in-out flex flex-col py-1  px-2   gap-1  bg-white  absolute  top-12   z-40  opacity-100  shadow-custom  h-[200px] overflow-auto  flow rounded-lg dark:bg-dark-darkPurple  ${
                              isTagVisible ? '' : ' opacity-0'
                           }`}
                           ref={tagRef}
                        >
                           {tags.map((data: any, index: any) => (
                              <button
                                 key={index + 1}
                                 onClick={() => {
                                    handleTagClick(data);
                                    setIsTagActive(false);
                                 }}
                                 className="w-full  h-[40px]  hover:bg-lightGrey flex items-center  gap-2  duration-150 text-sm  px-2  rounded-lg  border-b border-lightGrey  shrink-0 dark:border-dark-lightGrey  dark:hover:bg-dark-lightGrey "
                              >
                                 <Image
                                    src={tagIcon}
                                    className="w-5 h-5"
                                    alt=""
                                 />
                                 <span>{data}</span>
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
               {error && error !== 'Enter an amount' && (
                  <div className="w-full flex items-center justify-center gap-2">
                     <div className="bg-pink p-1  rounded-full">
                        <Image src={danger} className="w-3 h-3" alt="" />
                     </div>
                     <h1 className="text-sm text-red">{error}</h1>
                  </div>
               )}
               <div className="flex items-center gap-3 w-full">
                  <button
                     className="bg-purple text-white px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full justify-center  "
                     onClick={editEntry}
                     disabled={editEntryLoading}
                  >
                     {editEntryLoading ? (
                        <Image className="w-10" src={load} alt="" />
                     ) : (
                        <span>Edit entry</span>
                     )}
                  </button>
                  <button
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm dark:bg-dark-purple dark:text-white "
                     onClick={toggleEditEntryPopup}
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default EditEntry;
