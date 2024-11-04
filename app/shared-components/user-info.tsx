'use client'
import {  useSession } from "next-auth/react";
import SignInBtn from "./sign-in-button";

const UserInfo = () => {
    const {status, data: session}: any = useSession();
    if (status ==="authenticated"){
        return(
            <div className="text-white">
                {/* @ts-ignore */}
                user info  <img src={session.user?.image}alt="" className="w-10"/>
                <p>Google ID: {session.user?.oauthId}</p>
               <SignInBtn/>
            </div>
        )
    };
}
 
export default UserInfo;