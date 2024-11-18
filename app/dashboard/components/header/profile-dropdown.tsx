import Image from 'next/image';
import { useUser } from '~/app/context/auth-context';
import { formatDate } from '~/utils/formattedDate';

import right from '~/public/icons/chevron-right.svg';
import logoutIcon from '~/public/icons/logout.svg';
import { signOut } from 'next-auth/react';
const Profile = (props: any) => {
   const { user } = useUser();
   const {
      profile,
      isProfileVisible,
      profileRef,
      toggleChangeNamePopup,
      toggleChangePasswordPopup,
   } = props;

   return (
      profile && (
         <div
            className={`w-[320px]  border border-lightGreyBorder   rounded-lg  py-4 px-6  flex flex-col gap-4  bg-lightestGrey  shadow-custom duration-300 absolute top-10 left-0    lg:left-1/2  lg:transform   lg:-translate-x-1/2    ${
               isProfileVisible ? 'opacity-100' : 'opacity-0'
            }`}
            ref={profileRef}
         >
            <h1 className="text-[27px]  fancy">Your account</h1>
            <div className="flex flex-col w-full gap-1">
               <div className="flex  items-center gap-3 py-2 px-3   bg-white rounded-lg  border-lightGreyBorder">
                  <img
                     src={'/images/blueMain4.png'}
                     className="w-10 h-10 object-cover  rounded-full"
                     alt=""
                  />
                  <div className="flex flex-col items-start line-clamp-1 ">
                     <h1 className="text-[16px]  norm-mid leading-[24px] line-clamp-1  ">
                        {user?.name ? user.name : user?.email}
                     </h1>
                     {user?.name && (
                        <h1 className="text-sm leading-[20px]">
                           {user?.email}
                        </h1>
                     )}
                  </div>
               </div>
               <h1 className="text-sm text-[#8D8896] py-1 px-3">
                  joined{' '}
                  <span className="norm-mid text-black">
                     {formatDate(user?.createdAt)}
                  </span>
               </h1>
               <div className="w-full flex flex-col gap-2 ">
                  <button
                     className="flex items-center bg-white justify-between p-3 rounded-lg outline-none  hover:bg-lightPurple  duration-150 "
                     onClick={toggleChangeNamePopup}
                  >
                     <h1 className="text-sm">
                        {user?.name ? 'Change name' : 'Enter your name'}
                     </h1>
                     <Image src={right} alt="" className="h-5 w-5" />
                  </button>
                  <button
                     className="flex items-center bg-white justify-between p-3 rounded-lg outline-none  hover:bg-lightPurple  duration-150 "
                     onClick={toggleChangePasswordPopup}
                  >
                     <h1 className="text-sm">
                        {' '}
                        {user?.password ? 'Change password' : 'Set a password'}
                     </h1>
                     <Image src={right} alt="" className="h-5 w-5" />
                  </button>
                  <div className="flex items-center bg-white justify-between p-3 rounded-lg ">
                     <h1 className="text-sm">Dark theme</h1>
                     <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                     </label>
                  </div>
               </div>
            </div>
            <button
               className="bg-purple  rounded-full w-full  flex items-center justify-center  h-[40px] gap-2 duration-300 hover:ring  ring-purple ring-offset-1"
               onClick={
                  user?.authProvider === 'local'
                     ? async () => {
                          localStorage.removeItem('token');
                          window.location.href = '/auth/log-in';
                       }
                     : () => {
                          signOut({ callbackUrl: '/auth/log-in' });
                          localStorage.removeItem('oauthId');
                       }
               }
            >
               <Image src={logoutIcon} className="w-5 h-5 " alt="" />
               <span className="norm-mid text-white text-sm">Log Out</span>
            </button>
         </div>
      )
   );
};

export default Profile;
