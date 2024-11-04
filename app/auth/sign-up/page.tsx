'use client'
import Image from "next/image";
import wallet from '~/public/icons/Wallet.svg'
import {signIn} from 'next-auth/react'
import eye from '~/public/icons/eye.svg'
import eyeoff from'~/public/icons/eye-off.svg'
import { useState, ChangeEvent, FormEvent, useEffect
} from 'react';
import load from '~/public/images/load.svg'
import google from '~/public/icons/google.svg'
import Link from "next/link";
import danger from '~/public/icons/exclamation.svg'
import { useRouter } from "next/navigation";
interface FormData {
      email: string;
      password: string;
    }

const SignUp = () => {
    const [isPasswordVisible, setIsPasswordVisible]= useState<any>(false);
const [error, setError] = useState('');
const togglePasswordVisibility=()=>{
    setIsPasswordVisible(!isPasswordVisible)
}
const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
      });
      const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('')
      };
      const [submitting, setSubmitting]= useState(false);


      const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        const allFieldsFilled = Object.values(formData).every((field) => field.trim() !== '');
        if (!allFieldsFilled) {
          return;
        }
        if(submitting){
          return;
        }
    setSubmitting(true);
        try {
          const res = await fetch('/api/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          });
    
          if (res.ok) {
            const data = await res.json();
            localStorage.setItem('email', data.email);
            window.location.href = '/auth/verify-email';
           
    setSubmitting(false);
          }else {
            try {
              const error = await res.json();
          
              if (error?.error === 'This email is already in use. Try something else.') {
                setError(error.error);
              } else {
                alert(error?.error || 'An unknown error occurred');
              }
            } catch (parseError) {
              alert('An error occurred. Please try again.');
            } finally {
              setSubmitting(false);
            }
          }
        } catch (error) {
          console.error('Error during sign up:', error);
          alert('An unexpected error occurred. Please try again later.');
        }
      };
      const router = useRouter()

      useEffect(() => {
        const token = localStorage.getItem('token');
        const oauthId = localStorage.getItem('oauthId');
        if (token || oauthId) {
          router.push('/dashboard'); 
        }
      }, [router]);
    return ( 
        <main className="flex  h-screen w-full">
        <section className="h-full flex flex-1 items-center justify-center   bg-custom-gradient px-5 sm:hidden">
        <div className="flex flex-col items-start  gap-4 text-white w-[410px]  lg:w-full">
        <div className="flex items-center ">
        <h1 className="text-3xl font-[family-name:var(--font-instrument)]  lg:text-2xl  ">Clam</h1>
        <Image src={wallet} alt=''  className="w-[26px]"/>
        </div>
        <h1 className="text-[67px] leading-[72px]  fancy  lg:text-4xl  md:text-3xl">
        We track your income, expenses, & subscriptions!
        </h1>
        <h1 className="text-[17px] leading-6  norm  md:text-sm  ">We actually do more than all these but let’s just leave it at this for now.
        </h1>
        </div>
        </section>
        <section className="h-full flex flex-1 items-center justify-center  bg-white">
        <div className="flex flex-col  w-[288px] gap-4">
        <div className=" items-center  hidden sm:flex mx-auto">
        <h1 className="text-3xl font-[family-name:var(--font-instrument)]  lg:text-2xl  ">Clam</h1>
        <Image src={wallet} alt=''  className="w-[26px]"/>
        </div>
        <h1 className="fancy text-[43px] text-center lg:text-3xl">Create Account</h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 ">
            <div className="relative w-full flex items-center justify-center">
        <input className={`h-[40px] py-1 px-3 bg-lightGrey text-black  text-sm rounded-lg border  focus:ring-2 focus:bg-lightPurple   ring-purple outline-none w-full  ${error? 'border-red pr-8': 'border-[#DFDDE3]'}`} placeholder="Email address"
         type='email' name="email" 
          value={formData.email}
        required
        onChange={handleChange}/>
        {error &&(
          <Image src={danger} 
        alt="" className="w-5 absolute  right-2 cursor-pointer "/>
        )}
                 </div>
                 
        <label htmlFor="email" className={`text-[9px]    ${error? 'text-red': 'text-grey'}`}>{error || 'We will be verifying this mail'}</label>
        </div>
        <div className="relative w-full flex items-center justify-center">
        <input className="h-[40px] py-1 pl-3 pr-8  bg-lightGrey text-black  text-sm rounded-lg border border-[#DFDDE3] focus:ring-2  ring-purple outline-none   w-full line-clamp-1" 
        required
        type={isPasswordVisible?'text':'password'} placeholder="Password"
         name="password" 
        value={formData.password}
        onChange={handleChange}/>
        <Image src={isPasswordVisible?eyeoff:eye} 
        alt="" className="w-5 absolute  right-2 cursor-pointer "
         onClick={togglePasswordVisibility}/>
        </div>
        <button type="submit" className="bg-purple text-center text-sm  norm-mid  h-10 rounded-full text-white  hover:ring ring-offset-2 hover:ring-[2px]  ring-purple duration-300  " 
        disabled={submitting}>
            {submitting? <Image src={load} alt="" className="w-10 mx-auto"/>: 'Continue'}
        
        </button>
        </form>
        
        
        <button className="text-purple  text-center text-sm  norm-mid  h-10 rounded-full   bg-lightPurple flex items-center justify-center gap-1  hover:ring ring-offset-2 hover:ring-[2px]  ring-purple duration-300" onClick={() => signIn("google")}>
        <Image src={google} alt="" className="w-5   cursor-pointer "/>
            <span>Use Google Instead</span>
        </button>
        <Link href={'/auth/log-in'} className="underline text-purple norm-mid  text-[17px] text-center  md:text-sm">
        Login instead?
        </Link>
        </div>
        </section>
            </main> 
     );
}
 
export default SignUp;