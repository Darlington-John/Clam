'use client'
import {signIn, signOut, useSession} from 'next-auth/react'
const SignInBtn = () => {
    const {status}= useSession();
    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('oauthId');
     signOut();
      };
    return ( 
        <>
{    status ==="authenticated"?(  <button 
        className="bg-lightPurple w-[200px] text-purple  p-4 text-center "  onClick={handleSignOut}>
    Sign out
        </button>):(  <button 
        className="bg-lightPurple w-[200px] text-purple  p-4 text-center "  onClick={()=>signIn("google")}>
    Sign in with google
        </button>)}
        <button 
        className="bg-lightPurple w-[200px] text-purple  p-4 text-center "  onClick={handleSignOut}>
    Sign out
        </button>
        </>
   );
}
 
export default SignInBtn;