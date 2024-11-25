import Image from 'next/image';
import sparkles from '~/public/icons/sparkles.svg';
import sparklesLight from '~/public/icons/sparkles-light.svg';
import down from '~/public/icons/chevron-down.svg';
import downWhite from '~/public/icons/chevron-down-white.svg';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import bars from '~/public/icons/menu-alt.svg';
import barsFade from '~/public/icons/menuFade.svg';
import { useDashboard } from '~/app/context/dashboard-context';
import { useUser } from '~/app/context/auth-context';
import { usePopup } from '~/utils/tooggle-popups';
import Profile from './profile-dropdown';
import ChangeName from './change-name';
import ChangePassword from './change-password';
import ChangeProfile from './change-profile';
const Header = () => {
   const { isOverlayOpen, setIsOverlayOpen } = useDashboard();
   const linkname = usePathname();

   const { isDarkMode } = useUser();
   useEffect(() => {
      const overlayElement = document.getElementById('myOverlay');
      if (!overlayElement) {
         return;
      }
      overlayElement.style.width = '0%';
      setIsOverlayOpen(false);
   }, [linkname, setIsOverlayOpen]);
   const handleToggleOverlay = () => {
      toggleOverlay();
      setIsOverlayOpen(!isOverlayOpen);
   };
   const { user } = useUser();
   const {
      isVisible: isProfileVisible,
      isActive: profile,
      ref: profileRef,
      togglePopup: toggleProfilePopup,
   } = usePopup();
   const {
      isVisible: isChangeNameVisible,
      isActive: changeName,
      ref: changeNameRef,
      togglePopup: toggleChangeNamePopup,
   } = usePopup();
   const {
      isVisible: isChangePasswordVisible,
      isActive: changePassword,
      ref: changePasswordRef,
      togglePopup: toggleChangePasswordPopup,
   } = usePopup();
   const {
      isVisible: isChangeProfileVisible,
      isActive: changeProfile,
      ref: changeProfileRef,
      togglePopup: toggleChangeProfilePopup,
   } = usePopup();
   const profileDropdownProps = {
      profile,
      isProfileVisible,
      profileRef,
      toggleChangeNamePopup,
      toggleChangePasswordPopup,
      toggleChangeProfilePopup,
   };
   const changeNameProps = {
      changeName,
      changeNameRef,
      isChangeNameVisible,
      toggleChangeNamePopup,
   };
   const changePasswordProps = {
      changePassword,
      isChangePasswordVisible,
      changePasswordRef,
      toggleChangePasswordPopup,
   };
   const changeProfileProps = {
      isChangeProfileVisible,
      changeProfile,
      changeProfileRef,
      toggleChangeProfilePopup,
   };
   return (
      <header className="flex items-center justify-between  w-full py-3 px-6  xl:px-3 sticky top-0 bg-lightestGrey z-20 dark:bg-dark-darkPurple   ">
         <Image
            src={isDarkMode ? barsFade : bars}
            alt=""
            className="hidden w-6 lg:flex  "
            onClick={handleToggleOverlay}
         />
         <div className="relative">
            <div
               className="text-sm  flex gap-2 items-center  py-1 px-2 rounded-full bg-white dark:bg-dark-grey  cursor-pointer "
               onClick={toggleProfilePopup}
            >
               <img
                  src={user?.profile ? user.profile : '/icons/default-user.svg'}
                  className="w-6 h-6 object-cover rounded-full "
                  alt=""
                  width={24}
                  height={24}
               />
               <h1 className="dark:text-white">
                  {user?.name ? user.name : user?.email}
               </h1>
               {isDarkMode ? (
                  <Image
                     src={downWhite}
                     className={`w-5 h-5 object-cover rounded-full duration-300  ${
                        isProfileVisible && ' rotate-180'
                     }`}
                     alt=""
                  />
               ) : (
                  <Image
                     src={down}
                     className={`w-5 h-5 object-cover rounded-full duration-300  ${
                        isProfileVisible && ' rotate-180'
                     }`}
                     alt=""
                  />
               )}
            </div>

            <Profile {...profileDropdownProps} />
         </div>
         <button className="flex items-center gap-2 px-3 py-2 norm-mid  text-purple xl:text-sm dark:text-dark-lightPurple">
            {isDarkMode ? (
               <Image className="" src={sparklesLight} alt="" />
            ) : (
               <Image className="" src={sparkles} alt="" />
            )}

            <span className="sm:hidden">Assistant</span>
         </button>
         <ChangeName {...changeNameProps} />
         <ChangePassword {...changePasswordProps} />
         <ChangeProfile {...changeProfileProps} />
      </header>
   );
};

export default Header;

export const toggleOverlay = () => {
   const overlayElement = document.getElementById('myOverlay');
   if (!overlayElement) {
      return;
   }

   if (overlayElement.style.width === '100%') {
      overlayElement.style.width = '0%';
   } else {
      overlayElement.style.width = '100%';
   }
};
