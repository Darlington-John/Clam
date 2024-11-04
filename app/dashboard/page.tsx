'use client';
import { useRouter } from 'next/navigation';
// import { useUser } from '../context/auth-context';
// import UserInfo from '../shared-components/user-info';
import { useEffect } from 'react';
import CashFlow from './components/cash-flow';
import AddEntry from './components/add-entry';
import Transactions from './components/transactions';

const Dashboard = () => {
     // const { loading, user } = useUser();
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
          <div className="bg-lightestGrey  h-full  w-full px-6  flex  flex-col gap-4  ">
               <CashFlow />
               {/* {loading ? 'loading' : user?.email}
            <UserInfo /> */}
               <AddEntry />
               <Transactions />
          </div>
     );
};

export default Dashboard;
