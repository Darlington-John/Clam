'use client';
import { useRouter } from 'next/navigation';
import Header from './components/header';
import Sidebar from './components/sidebar';
import { useEffect } from 'react';
import { useUser } from '../context/auth-context';
import Image from 'next/image';
import loadingGif from '~/public/images/load-purple.svg';
import Overlay from './components/overlay';
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
     const { loading } = useUser();
     return (
          <main className="h-screen overflow-hidden  flex items-start ">
               <Sidebar hidden />
               <Overlay />
               {loading ? (
                    <Image
                         src={loadingGif}
                         className=" h-28  mx-auto self-center "
                         alt=""
                    />
               ) : (
                    <section className="h-full overflow-auto  w-full bg-lightestGrey pb-10">
                         <Header />

                         {children}
                    </section>
               )}
          </main>
     );
}
