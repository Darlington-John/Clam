'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import loadingGif from '~/public/images/load.svg';
import danger from '~/public/icons/exclamation.svg';
import wallet from '~/public/icons/Wallet.svg';
import Link from 'next/link';
const VerifyEmail = () => {
   const [error, setError] = useState('');
   const [isVerifying, setIsVerifying] = useState(false);
   const [email, setEmail] = useState<string | null>(null);
   const [verificationCode, setVerificationCode] = useState(Array(4).fill(''));
   useEffect(() => {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
         setEmail(storedEmail);
      } else {
         setError('Email not found. Please go back to sign up.');
      }
   }, []);
   const isVerificationCodeComplete = () => {
      return verificationCode.every((digit) => digit.length === 1);
   };

   const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
   ) => {
      setError('');
      const value = e.target.value;

      if (/^[0-9]$/.test(value) || value === '') {
         const newCode = [...verificationCode];
         newCode[index] = value;
         setVerificationCode(newCode);

         if (value && index < 5) {
            document.getElementById(`code-input-${index + 1}`)?.focus();
         }
      }
   };

   const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
   ) => {
      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
         document.getElementById(`code-input-${index - 1}`)?.focus();
      }
   };
   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('Text').trim();
      const isValid = /^[0-9]*$/.test(pastedData);

      if (isValid) {
         const newCode = [...verificationCode];
         pastedData.split('').forEach((char, i) => {
            if (i < newCode.length) newCode[i] = char;
         });
         setVerificationCode(newCode);

         const lastFilledIndex = Math.min(
            pastedData.length - 1,
            verificationCode.length - 1
         );
         document.getElementById(`code-input-${lastFilledIndex}`)?.focus();
      }
   };
   const handleVerify = async () => {
      if (!email) {
         setError('Email not found. Please go back to sign up.');
         return;
      }
      if (!isVerificationCodeComplete()) {
         setError('Please enter all 6 digits of the verification code.');
         return;
      }
      setIsVerifying(true);
      try {
         const codeString = verificationCode.join('');
         const response = await fetch('/api/forgot-password/verify-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, verificationCode: codeString }),
         });

         const data = await response.json();

         if (response.ok) {
            localStorage.setItem('token', data.token);
            setTimeout(() => {
               window.location.href = '/auth/forgot-password/reset';
            }, 5000);
         } else {
            setError(data.error || 'Verification failed');
         }
      } catch (error) {
         setError('An error occurred during verification');
      } finally {
         setIsVerifying(false);
      }
   };

   return (
      <main className="flex  h-screen w-full">
         <section className="h-full flex flex-1 items-center justify-center   bg-custom-gradient   px-5 sm:hidden">
            <div className="flex flex-col items-start  gap-4 text-white w-[410px]  lg:w-full">
               <div className="flex items-center ">
                  <h1 className="text-3xl font-[family-name:var(--font-instrument)]   lg:text-2xl ">
                     Clam
                  </h1>
                  <Image src={wallet} alt="" className="w-[26px]" />
               </div>
               <h1 className="text-[67px] leading-[72px]  fancy lg:text-4xl  md:text-3xl">
                  We track your income, expenses, & subscriptions!
               </h1>
               <h1 className="text-[17px] leading-6  norm md:text-sm ">
                  We actually do more than all these but let’s just leave it at
                  this for now.
               </h1>
            </div>
         </section>
         <section className="h-full flex flex-1 items-center justify-center  bg-white">
            <div className="flex flex-col gap-4 w-[290px] items-center">
               <div className=" items-center  hidden sm:flex mx-auto">
                  <h1 className="text-3xl font-[family-name:var(--font-instrument)]  lg:text-2xl  ">
                     Clam
                  </h1>
                  <Image src={wallet} alt="" className="w-[26px]" />
               </div>
               <h1 className="fancy text-[43px] text-center lg:text-3xl">
                  Verify your mail
               </h1>
               <h1 className="text-[17px]   text-black  leading-6  text-center md:text-sm">
                  We{`'`}ve sent you a mail at{' '}
                  <span className="norm-mid">{email}</span>. Enter the code in
                  the field below
               </h1>
               <div className="flex flex-col">
                  <div className="flex justify-between gap-2 w-full text-white">
                     {verificationCode.map((digit, index) => (
                        <input
                           key={index + 1}
                           id={`code-input-${index}`}
                           type="text"
                           value={digit}
                           onPaste={handlePaste}
                           onChange={(e) => handleChange(e, index)}
                           onKeyDown={(e) => handleKeyDown(e, index)}
                           maxLength={1}
                           className={`text-[22px]  font-semibold outline-none px-2 py-3 rounded-md w-full bg-lightGrey text-center focus:ring-2 ring-purple  w-[48px]  h-[56px] fancy text-black grow-0 shrink-0 max-w-[48px]  max-h-[56px]  ${
                              error && 'border border-red'
                           }`}
                           placeholder="."
                        />
                     ))}
                  </div>
               </div>
               {error && (
                  <div className="flex gap-2 items-center ">
                     <div className="p-1  bg-pink rounded-full ">
                        <Image src={danger} alt="" className="w-3" />
                     </div>
                     <h1 className="text-sm text-red">Code is incorrect</h1>
                  </div>
               )}
               <button
                  className={`bg-purple text-center text-sm  norm-mid  h-10 rounded-full text-white w-full    ${
                     isVerificationCodeComplete()
                        ? 'opacity-100 hover:ring ring-offset-2 hover:ring-[2px]  ring-purple duration-300'
                        : 'opacity-40'
                  }`}
                  disabled={isVerifying || !isVerificationCodeComplete()}
                  onClick={handleVerify}
               >
                  {isVerifying ? (
                     <Image src={loadingGif} alt="" className="w-10 mx-auto" />
                  ) : (
                     'Continue'
                  )}
               </button>

               <Link
                  href={'/auth/sign-up'}
                  className=" text-purple norm-mid  text-[17px] text-center  md:text-sm"
               >
                  Cancel
               </Link>
            </div>
         </section>
      </main>
   );
};

export default VerifyEmail;
