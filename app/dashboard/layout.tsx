'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../context/auth-context';
import Image from 'next/image';
import loadingGif from '~/public/images/load-purple.svg';
import loadingFadeGif from '~/public/images/spinner-fade.svg';
import Overlay from './components/overlay';
import Header from './components/header/header';
import Sidebar from './components/sidebar/sidebar';
import { NewBookPopup } from './components/new-book-popup';
import FirstThingsFirst from './components/first-things-first';
export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   const router = useRouter();
   useEffect(() => {
      const token = localStorage.getItem('token');
      const oauthId = localStorage.getItem('oauthId');
      if (token || oauthId) {
         router.push('/dashboard');
      }
   }, [router]);
   const { loading, isDarkMode } = useUser();
   return (
      <main className="h-screen overflow-hidden  flex items-start  dark:bg-dark-darkPurple">
         <Sidebar hidden />
         <NewBookPopup />
         <FirstThingsFirst />
         <Overlay />
         {loading ? (
            <Image
               src={isDarkMode ? loadingFadeGif : loadingGif}
               className=" h-28  mx-auto self-center "
               alt=""
            />
         ) : (
            <section className="h-full overflow-auto  w-full bg-lightestGrey pb-10 dark:bg-dark-darkPurple    ">
               <Header />

               {children}
            </section>
         )}
      </main>
   );
}
