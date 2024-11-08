'use client';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';
import CashFlow from './components/cash-flow';
import AddEntry from './components/add-entry';
import Transactions from './components/transactions';

const Dashboard = () => {
   const router = useRouter();
   useEffect(() => {
      const token = localStorage.getItem('token');
      const oauthId = localStorage.getItem('oauthId');
      if (token || oauthId) {
         router.push('/dashboard');
      } else {
         router.push('/auth/log-in');
      }
   }, [router]);
   return (
      <div className="bg-lightestGrey  h-full  w-full   flex  flex-col gap-4  ">
         <CashFlow />
         {/* {loading ? 'loading' : user?.email}
            <UserInfo /> */}
         <AddEntry />
         <Transactions />
      </div>
   );
};

export default Dashboard;
