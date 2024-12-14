import Image from 'next/image';
import { useState } from 'react';
import { useUser } from '~/app/context/auth-context';

import danger from '~/public/icons/exclamation.svg';
import loading from '~/public/images/load.svg';
import check from '~/public/icons/check.svg';
import userIcon from '~/public/images/userprofile.svg';
import { FaCheck } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
const ChangeName = (props: any) => {
   const { user } = useUser();
   const {
      changeName,
      changeNameRef,
      isChangeNameVisible,
      toggleChangeNamePopup,
   } = props;

   const [nameError, setNameError] = useState('');
   const [name, setName] = useState('');
   const [isNameSaving, setNameSaving] = useState(false);
   const [nameSaved, setNameSaved] = useState(false);
   const email = user?.email;
   const handleUpdateName = async (e: any) => {
      e.preventDefault();
      if (name.trim() === '') {
         setNameSaving(false);
         setNameError('Name is required');
         return;
      }
      setNameSaving(true);
      try {
         const res = await fetch('/api/change-name', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email }),
         });

         if (res.ok) {
            setNameSaving(false);
            setNameSaved(true);
            setTimeout(() => toggleChangeNamePopup(), 1000);
            toast.success(`Name updated`, {
               icon: <FaCheck color="white" />,
            });
         } else {
            const data = await res.json();
            setNameError(data.error || `Could'nt update name`);
            setNameSaving(false);
         }
      } catch (err) {
         setNameError('An  error occurred');
         setNameSaving(false);
      }
   };
   return (
      changeName && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0  `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-4  rounded-2xl bg-white items-center  dark:bg-dark-grey dark:text-white   ${
                  isChangeNameVisible ? '' : 'pop-hidden'
               }`}
               ref={changeNameRef}
            >
               <div className="flex flex-col items-center gap-1">
                  <Image src={userIcon} className="w-10 h-10" alt="" />
                  <h1 className="text-[22px] fancy text-center leading-[28px]">
                     {user?.name ? 'Change your name' : 'Enter your name'}
                  </h1>
                  <h1 className="text-sm text-grey text-center">
                     Enter your name below
                  </h1>
               </div>
               <div className="flex flex-col gap-1 w-full ">
                  <div className="relative w-full flex items-center justify-center">
                     <input
                        className={`h-[40px] py-1 px-3 bg-lightGrey text-black  text-sm rounded-lg border  focus:ring-2 focus:bg-lightPurple   ring-purple outline-none w-full  dark:bg-dark-darkPurple     dark:border-dark-lightGrey dark:text-white dark:focus:ring-dark-purple ${
                           nameError ? 'border-red pr-8' : 'border-[#DFDDE3]'
                        }`}
                        placeholder="Your name"
                        type="text"
                        name="firstName"
                        value={name}
                        required
                        onChange={(e) => {
                           setName(e.target.value);
                           setNameError('');
                        }}
                     />
                     {nameError && (
                        <Image
                           src={danger}
                           alt=""
                           className="w-5 absolute  right-2 cursor-pointer "
                        />
                     )}
                  </div>

                  <label
                     htmlFor="email"
                     className={`text-[9px]    ${
                        nameError ? 'text-red' : 'text-grey'
                     }`}
                  >
                     {nameError}
                  </label>
               </div>
               <div className="flex items-center gap-2">
                  <button
                     onClick={handleUpdateName}
                     disabled={isNameSaving || name.trim() === ''}
                     className="bg-purple text-white px-4 h-[40px]  rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-[146px] justify-center  "
                  >
                     <Image
                        className={isNameSaving ? 'w-8' : 'w-5'}
                        src={isNameSaving ? loading : check}
                        alt=""
                     />
                     <span>
                        {nameSaved
                           ? 'Saved'
                           : isNameSaving
                           ? 'Saving'
                           : 'Save changes'}
                     </span>
                  </button>
                  <button
                     onClick={() => {
                        setName('');
                        toggleChangeNamePopup();
                     }}
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  dark:bg-dark-purple dark:text-white   "
                  >
                     Close
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default ChangeName;
