'use client';
import Image from 'next/image';
import wallet from '~/public/icons/Wallet.svg';
import { signIn } from 'next-auth/react';
import eye from '~/public/icons/eye.svg';
import eyeoff from '~/public/icons/eye-off.svg';
import { useEffect, useState } from 'react';
import load from '~/public/images/load.svg';
import google from '~/public/icons/google.svg';
import Link from 'next/link';
import danger from '~/public/icons/exclamation.svg';
import { useRouter } from 'next/navigation';
const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const handleTogglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
   };
   const check = !(email && password);

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (check) {
         setSubmitting(false);
      } else {
         setSubmitting(true);
      }
      try {
         const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
         });

         if (res.ok) {
            setSubmitting(false);
            const data = await res.json();
            localStorage.setItem('token', data.token);
            window.location.href = '/dashboard';
         } else {
            const data = await res.json();
            setError(data.error || 'Login failed');
            setSubmitting(false);
         }
      } catch (err) {
         setError('An unexpected error occurred');
         setSubmitting(false);
      }
   };

   const router = useRouter();

   const [ready, setReady] = useState(false);

   useEffect(() => {
      if (!ready) {
         setReady(true); // Trigger a re-render when component mounts
      }
   }, [ready]);

   useEffect(() => {
      if (ready) {
         const token = localStorage.getItem('token');
         const oauthId = localStorage.getItem('oauthId');
         if (token || oauthId) {
            router.push('/dashboard');
         } else {
            router.push('/auth/log-in');
         }
      }
   }, [ready, router]);
   return (
      <main className="flex  h-screen w-full">
         <section className="h-full flex flex-1 items-center justify-center   bg-custom-gradient px-5 sm:hidden">
            <div className="flex flex-col items-start  gap-4 text-white w-[410px]  lg:w-full">
               <div className="flex items-center ">
                  <h1 className="text-3xl font-[family-name:var(--font-instrument)]  lg:text-2xl  ">
                     Clam
                  </h1>
                  <Image src={wallet} alt="" className="w-[26px]" />
               </div>
               <h1 className="text-[67px] leading-[72px]  fancy  lg:text-4xl  md:text-3xl">
                  Get an overview of your income, expenses, & subscriptions!
               </h1>
            </div>
         </section>
         <section className="h-full flex flex-1 items-center justify-center  bg-white">
            <div className="flex flex-col  w-[288px] gap-4">
               <div className=" items-center  hidden sm:flex mx-auto">
                  <h1 className="text-3xl font-[family-name:var(--font-instrument)]  lg:text-2xl  ">
                     Clam
                  </h1>
                  <Image src={wallet} alt="" className="w-[26px]" />
               </div>
               <h1 className="fancy text-[43px] text-center lg:text-3xl">
                  Welcome back
               </h1>
               <Link
                  href={'/auth/sign-up'}
                  className="underline text-purple norm-mid  text-[17px] text-center md:text-sm"
               >
                  Create account instead?
               </Link>
               <form
                  className="flex flex-col gap-4 w-full"
                  onSubmit={handleSubmit}
               >
                  <div className="flex flex-col gap-1 ">
                     <div className="relative w-full flex items-center justify-center">
                        <input
                           className={`h-[40px] py-1 px-3 bg-lightGrey text-black  text-sm rounded-lg border  focus:ring-2 focus:bg-lightPurple   ring-purple outline-none w-full  ${
                              error.startsWith('Sorry')
                                 ? 'border-red pr-8'
                                 : 'border-[#DFDDE3]'
                           }`}
                           placeholder="Email address"
                           type="email"
                           name="email"
                           value={email}
                           onChange={(e) => {
                              setEmail(e.target.value);
                              setError('');
                           }}
                           required
                        />
                        {error.startsWith('Sorry') && (
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
                           error !== 'Incorrect password'
                              ? 'text-red'
                              : 'text-grey'
                        }`}
                     >
                        {error !== 'Incorrect password'
                           ? error === 'Illegal arguments: string, undefined'
                              ? 'An error occured. Try signing in with google'
                              : error
                           : 'We will be verifying this mail'}
                     </label>
                  </div>
                  <div className="w-full  flex  flex-col gap-1">
                     <div className="relative w-full flex items-center justify-center">
                        <input
                           className={`h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1 ${
                              error === 'Incorrect password'
                                 ? 'border-red pr-8'
                                 : 'border-[#DFDDE3]'
                           } `}
                           type={isPasswordVisible ? 'text' : 'password'}
                           placeholder="Password"
                           name="password"
                           required
                           value={password}
                           onChange={(e) => {
                              setPassword(e.target.value);
                              setError('');
                           }}
                        />
                        <Image
                           src={isPasswordVisible ? eyeoff : eye}
                           alt=""
                           className="w-5 absolute  right-2 cursor-pointer "
                           onClick={handleTogglePasswordVisibility}
                        />
                     </div>
                     {error === 'Incorrect password' && (
                        <p className={`text-[9px] text-red`}>
                           {error || 'Incorrect password'}
                        </p>
                     )}
                  </div>
                  <button
                     type="submit"
                     className="bg-purple text-center text-sm  norm-mid  h-10 rounded-full text-white  hover:ring ring-offset-2 hover:ring-[2px]  ring-purple duration-300  "
                     disabled={submitting}
                  >
                     {submitting ? (
                        <Image src={load} alt="" className="w-10 mx-auto" />
                     ) : (
                        'Continue'
                     )}
                  </button>
               </form>

               <button
                  className="text-purple  text-center text-sm  norm-mid  h-10 rounded-full   bg-lightPurple flex items-center justify-center gap-1 hover:ring ring-offset-2 hover:ring-[2px]  ring-purple duration-300"
                  onClick={() => signIn('google')}
               >
                  <Image
                     src={google}
                     alt=""
                     className="w-5   cursor-pointer "
                  />
                  <span>Use Google Instead</span>
               </button>
               <Link
                  href={'/auth/forgot-password'}
                  className="underline text-purple norm-mid  text-[17px] text-center md:text-sm"
               >
                  Forgot password?
               </Link>
            </div>
         </section>
      </main>
   );
};

export default Login;
