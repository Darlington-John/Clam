import { signOut } from 'next-auth/react';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import eye from '~/public/icons/eye.svg';
import eyeoff from '~/public/icons/eye-off.svg';
import eyeFade from '~/public/icons/eyeFade.svg';
import eyeOffFade from '~/public/icons/eye-off-fade.svg';
import userIcon from '~/public/images/userprofile.svg';
import loading from '~/public/images/load.svg';
import check from '~/public/icons/check.svg';
const ChangePassword = (props: any) => {
   const { user, isDarkMode } = useUser();
   const email = user?.email;
   const {
      changePassword,
      isChangePasswordVisible,
      changePasswordRef,
      toggleChangePasswordPopup,
   } = props;
   const [password, setPassword] = useState('');
   const [passwordError, setPasswordError] = useState('');
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
   const handleTogglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
   };
   const [newPassword, setNewPassword] = useState('');
   const [retypePassword, setRetypePassword] = useState('');
   const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
   const [isRetypePasswordVisible, setIsRetypePasswordVisible] =
      useState(false);
   const handleToggleNewPasswordVisibility = () => {
      setIsNewPasswordVisible(!isNewPasswordVisible);
   };
   const handleToggleRetypePasswordVisibility = () => {
      setIsRetypePasswordVisible(!isRetypePasswordVisible);
   };
   const [isPasswordSaving, setPasswordSaving] = useState(false);
   const [passwordSaved, setPasswordSaved] = useState(false);

   const handleUpdatePassword = async (e: any) => {
      e.preventDefault();
      if (isPasswordSaving) {
         return;
      }
      if (password.trim() === '') {
         setPasswordSaving(false);
         setPasswordError('Old password is required');
         return;
      }
      if (newPassword.trim() === '') {
         setPasswordSaving(false);
         setPasswordError('New password is required');
         return;
      }
      setPasswordSaving(true);
      try {
         const token = localStorage.getItem('token');
         const res = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ password, email, newPassword }),
         });

         if (res.ok) {
            setPasswordSaving(false);
            setPassword('');
            setPasswordSaved(true);
            toast.success(`Password updated`, {
               icon: <FaCheck color="white" />,
            });
            toggleChangePasswordPopup();
         } else {
            const data = await res.json();
            setPasswordError(data.error || 'Password update failed');
            setPasswordSaving(false);
         }
      } catch (err) {
         setPasswordError('An  error occurred');
         setPasswordSaving(false);
      }
   };
   const handleSetPassword = async (e: any) => {
      e.preventDefault();
      if (isPasswordSaving) {
         return;
      }
      if (password.trim() === '' || retypePassword.trim() === '') {
         setPasswordSaving(false);
         setPasswordError(`Both passwords are required`);
         return;
      }
      if (password !== retypePassword) {
         setPasswordSaving(false);
         setPasswordError(`Passwords don't match`);
         return;
      }

      setPasswordSaving(true);
      try {
         const oauthId = localStorage.getItem('oauthId');
         const res = await fetch('/api/change-password', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${oauthId}`,
            },
            body: JSON.stringify({ password, email, newPassword }),
         });

         if (res.ok) {
            const data = await res.json();
            setPasswordSaving(false);
            setPasswordSaved(true);
            setPassword('');
            toast.success(`Password set`, {
               icon: <FaCheck color="white" />,
            });
            localStorage.removeItem('oauthId');
            localStorage.setItem('token', data.token);
            toggleChangePasswordPopup();
            signOut();
         } else {
            const data = await res.json();
            setPasswordError(data.error || 'Password update failed');
            setPasswordSaving(false);
         }
      } catch (err) {
         setPasswordError('An  error occurred');
         setPasswordSaving(false);
      }
   };
   return (
      changePassword && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-4  rounded-2xl bg-white items-center dark:bg-dark-grey  dark:text-white    ${
                  isChangePasswordVisible ? '' : 'pop-hidden'
               }`}
               ref={changePasswordRef}
            >
               <div className="flex flex-col items-center gap-1">
                  <Image src={userIcon} className="w-10 h-10" alt="" />
                  <h1 className="text-[22px] fancy text-center leading-[28px]">
                     {user?.password ? 'Change your password' : 'Set password'}
                  </h1>
               </div>
               {user?.authProvider === 'google' ? (
                  <>
                     <div className="w-full  flex  flex-col gap-1">
                        <h1 className="text-sm">Password</h1>
                        <div className="relative w-full flex items-center justify-center">
                           <input
                              className={`h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1 dark:bg-dark-darkPurple    dark:text-white ${
                                 [`Passwords don't match`].includes(
                                    passwordError
                                 )
                                    ? 'border-red dark:border-darkpink  pr-8'
                                    : 'border-[#DFDDE3]'
                              } `}
                              type={isPasswordVisible ? 'text' : 'password'}
                              placeholder="Password"
                              name="password"
                              required
                              value={password}
                              onChange={(e) => {
                                 setPassword(e.target.value);
                                 setPasswordError('');
                              }}
                           />
                           <Image
                              src={isPasswordVisible ? eyeoff : eye}
                              alt=""
                              className="w-5 absolute  right-2 cursor-pointer "
                              onClick={handleTogglePasswordVisibility}
                           />
                        </div>
                     </div>
                     <div className="w-full  flex  flex-col gap-1">
                        <h1 className="text-sm">Re-type password</h1>
                        <div className="relative w-full flex items-center justify-center">
                           <input
                              className={`h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1 dark:bg-dark-darkPurple    dark:border-dark-lightGrey dark:text-white ${
                                 passwordError === `Passwords don't match`
                                    ? 'border-red dark:border-darkpink  pr-8'
                                    : 'border-[#DFDDE3]'
                              } `}
                              type={
                                 isRetypePasswordVisible ? 'text' : 'password'
                              }
                              placeholder="Password"
                              name="newPassword"
                              required
                              value={retypePassword}
                              onChange={(e) => {
                                 setRetypePassword(e.target.value);
                                 setPasswordError('');
                              }}
                           />
                           <Image
                              src={isRetypePasswordVisible ? eyeoff : eye}
                              alt=""
                              className="w-5 absolute  right-2 cursor-pointer "
                              onClick={handleToggleRetypePasswordVisibility}
                           />
                        </div>
                     </div>
                     {passwordError && (
                        <p
                           className={`text-[9px] text-red dark:text-dark-pink`}
                        >
                           {passwordError}
                        </p>
                     )}
                     <div className="flex items-center gap-2">
                        <button
                           onClick={handleSetPassword}
                           className="bg-purple text-white px-4 h-[40px]  rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full  justify-center  "
                        >
                           <Image
                              className={isPasswordSaving ? 'w-8' : 'w-5'}
                              src={isPasswordSaving ? loading : check}
                              alt=""
                           />
                           <span>
                              {passwordSaved
                                 ? 'Saved'
                                 : isPasswordSaving
                                 ? 'Saving'
                                 : 'Save changes'}
                           </span>
                        </button>
                        <button
                           onClick={() => {
                              setPassword('');
                              setRetypePassword('');
                              setPasswordError('');
                              toggleChangePasswordPopup();
                           }}
                           className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  "
                        >
                           Close
                        </button>
                     </div>
                  </>
               ) : (
                  <>
                     {' '}
                     <div className="w-full  flex  flex-col gap-1">
                        <h1 className="text-sm">Old password</h1>
                        <div className="relative w-full flex items-center justify-center">
                           <input
                              className={`h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1 dark:border-dark-lightGrey dark:bg-dark-darkPurple    dark:text-white ${
                                 [
                                    'Old password is required',
                                    'Incorrect password.',
                                 ].includes(passwordError)
                                    ? 'border-red dark:border-darkpink  pr-8'
                                    : 'border-[#DFDDE3]'
                              } `}
                              type={isPasswordVisible ? 'text' : 'password'}
                              placeholder="Password"
                              name="password"
                              required
                              value={password}
                              onChange={(e) => {
                                 setPassword(e.target.value);
                                 setPasswordError('');
                              }}
                           />
                           <Image
                              src={
                                 isDarkMode
                                    ? isPasswordVisible
                                       ? eyeOffFade
                                       : eyeFade
                                    : isPasswordVisible
                                    ? eyeoff
                                    : eye
                              }
                              alt=""
                              className="w-5 absolute  right-2 cursor-pointer "
                              onClick={handleTogglePasswordVisibility}
                           />
                        </div>
                        {[
                           'Old password is required',
                           'Incorrect password.',
                        ].includes(passwordError) && (
                           <p
                              className={`text-[9px] text-red dark:text-dark-pink`}
                           >
                              {passwordError}
                           </p>
                        )}
                     </div>
                     <div className="w-full  flex  flex-col gap-1">
                        <h1 className="text-sm">New password</h1>
                        <div className="relative w-full flex items-center justify-center">
                           <input
                              className={`h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1  dark:border-dark-lightGrey dark:bg-dark-darkPurple  dark:text-white  ${
                                 passwordError === 'New password is required'
                                    ? 'border-red dark:border-darkpink  pr-8'
                                    : 'border-[#DFDDE3]'
                              } `}
                              type={isNewPasswordVisible ? 'text' : 'password'}
                              placeholder="Password"
                              name="newPassword"
                              required
                              value={newPassword}
                              onChange={(e) => {
                                 setNewPassword(e.target.value);
                                 setPasswordError('');
                              }}
                           />
                           <Image
                              src={
                                 isDarkMode
                                    ? isRetypePasswordVisible
                                       ? eyeOffFade
                                       : eyeFade
                                    : isRetypePasswordVisible
                                    ? eyeoff
                                    : eye
                              }
                              alt=""
                              className="w-5 absolute  right-2 cursor-pointer "
                              onClick={handleToggleNewPasswordVisibility}
                           />
                        </div>
                        {passwordError === 'New password is required' && (
                           <p
                              className={`text-[9px] text-red dark:text-dark-pink`}
                           >
                              {passwordError || 'New password is required'}
                           </p>
                        )}
                     </div>
                     {![
                        'New password is required',
                        'Old password is required',
                        'Incorrect password.',
                     ].includes(passwordError) && (
                        <p
                           className={`text-[9px] text-red dark:text-dark-pink`}
                        >
                           {passwordError}
                        </p>
                     )}
                     <div className="flex items-center gap-2">
                        <button
                           onClick={handleUpdatePassword}
                           className="bg-purple text-white px-4 h-[40px]  rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-full  justify-center  "
                        >
                           <Image
                              className={isPasswordSaving ? 'w-8' : 'w-5'}
                              src={isPasswordSaving ? loading : check}
                              alt=""
                           />
                           <span>
                              {passwordSaved
                                 ? 'Saved'
                                 : isPasswordSaving
                                 ? 'Saving'
                                 : 'Save changes'}
                           </span>
                        </button>
                        <button
                           onClick={() => {
                              setPassword('');
                              setNewPassword('');
                              setPasswordError('');
                              toggleChangePasswordPopup();
                           }}
                           className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  dark:bg-dark-purple dark:text-white "
                        >
                           Close
                        </button>
                     </div>
                  </>
               )}
            </div>
         </div>
      )
   );
};

export default ChangePassword;
