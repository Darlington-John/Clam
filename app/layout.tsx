import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NextAuthProvider } from './Providers';
import { UserProvider } from './context/auth-context';
import { DashboardProvider } from './context/dashboard-context';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const geistSans = localFont({
   src: './fonts/GeistVF.woff',
   variable: '--font-geist-sans',
   weight: '100 900',
});
const geistMono = localFont({
   src: './fonts/GeistMonoVF.woff',
   variable: '--font-geist-mono',
   weight: '100 900',
});
const InstrumentSerif = localFont({
   src: './fonts/InstrumentSerif.ttf',
   variable: '--font-instrument',
   weight: '100  900',
});
const Apercu = localFont({
   src: './fonts/apercu.otf',
   variable: '--font-apercu',
   weight: '100  900',
});
const ApercuMid = localFont({
   src: './fonts/apercumedium.otf',
   variable: '--font-apercu-mid',
   weight: '100  900',
});

export const metadata: Metadata = {
   title: 'Clam',
   description: 'We track your income, expenses, & subscriptions!',
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en">
         <body
            className={`${geistSans.variable} ${geistMono.variable} ${InstrumentSerif.variable}  ${Apercu.variable} ${ApercuMid.variable}  antialiased `}
         >
            <ToastContainer position="top-center" closeButton={false} />
            <NextAuthProvider>
               <UserProvider>
                  <DashboardProvider>{children}</DashboardProvider>
               </UserProvider>
            </NextAuthProvider>
         </body>
      </html>
   );
}
