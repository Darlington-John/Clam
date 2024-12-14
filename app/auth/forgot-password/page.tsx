'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import loadingGif from '~/public/images/load.svg';
import danger from '~/public/icons/exclamation.svg';
import wallet from '~/public/icons/Wallet.svg';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const VerifyEmail = () => {
   const [error, setError] = useState('');

   const [email, setEmail] = useState('');

   const [submitting, setSubmitting] = useState(false);

   const check = !email;
   const handleSubmit = async (e: any) => {
      e.preventDefault();
      if (check) {
         setSubmitting(false);
         return;
      }
      setError('');

      setSubmitting(true);
      try {
         const res = await fetch('/api/forgot-password/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
         });

         if (res.ok) {
            setSubmitting(false);
            const data = await res.json();

            localStorage.setItem('email', data.email);
            window.location.href = '/auth/forgot-password/verify-email';
         } else {
            const data = await res.json();
            setError(data.error || 'Login failed');
            setSubmitting(false);
         }
      } catch (err) {
         setError('An  error occurred');
         setSubmitting(false);
      }
   };
   const router = useRouter();
   useEffect(() => {
      const token = localStorage.getItem('token');
      const oauthId = localStorage.getItem('oauthId');
      if (token || oauthId) {
         router.push('/dashboard');
      }
   }, [router]);

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
                  Get an overview of your income, expenses, & subscriptions!
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
                  Forgot password
               </h1>
               <h1 className="text-[17px]   text-black  leading-6  text-center md:text-sm">
                  You’re about to reset your password. Enter your email so we
                  send instructions to reset your password.
               </h1>
               <div className="flex flex-col w-full gap-4 ">
                  <div className="w-full  flex  flex-col gap-1">
                     <div className="relative w-full flex items-center justify-center">
                        <input
                           className={`h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1   ${
                              error ? 'border-red pr-8' : 'border-[#DFDDE3]'
                           }`}
                           type="email"
                           value={email}
                           onChange={(e) => {
                              setEmail(e.target.value);
                              setError('');
                           }}
                           placeholder="Email address"
                           name="email"
                           required
                        />
                        {error && (
                           <Image
                              src={danger}
                              alt=""
                              className="w-5 absolute  right-2 cursor-pointer "
                           />
                        )}
                     </div>
                     {error && (
                        <p className={`text-[9px] text-red`}>
                           {error || 'Incorrect password'}
                        </p>
                     )}
                  </div>
               </div>

               <button
                  className={`bg-purple text-center text-sm  norm-mid  h-10 rounded-full text-white w-full    ${
                     !check
                        ? 'opacity-100 hover:ring ring-offset-2 hover:ring-[2px]  ring-purple duration-300'
                        : 'opacity-40'
                  }`}
                  disabled={submitting || check}
                  onClick={handleSubmit}
               >
                  {submitting ? (
                     <Image src={loadingGif} alt="" className="w-10 mx-auto" />
                  ) : (
                     'Continue'
                  )}
               </button>

               <Link
                  href={'/auth/log-in'}
                  className=" text-purple norm-mid  text-[17px] text-center  md:text-sm"
               >
                  Back to Login
               </Link>
            </div>
         </section>
      </main>
   );
};

export default VerifyEmail;
