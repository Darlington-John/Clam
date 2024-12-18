'use client';
import { signOut, useSession } from 'next-auth/react';
import React, {
   createContext,
   useContext,
   useState,
   useEffect,
   useMemo,
} from 'react';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const { data: session }: any = useSession();

   useEffect(() => {
      if (
         session?.user?.oauthId &&
         !localStorage.getItem('logoutFlag') &&
         !localStorage.getItem('oauthId')
      ) {
         localStorage.setItem('oauthId', session.user.oauthId);
      }
   }, [session]);

   useEffect(() => {
      if (session) {
         localStorage.removeItem('logoutFlag');
      }
   }, [session]);

   useEffect(() => {
      const fetchUser = async () => {
         setLoading(true);
         try {
            const token: any = localStorage.getItem('token');
            const oauthId = localStorage.getItem('oauthId');

            if (!token && !oauthId) return;

            const isTokenExpired = () => {
               try {
                  const decodedToken = JSON.parse(atob(token.split('.')[1]));
                  return decodedToken.exp * 1000 < Date.now();
               } catch (error) {
                  console.error('Failed to parse token:', error);
                  return true;
               }
            };

            if (token && isTokenExpired()) {
               localStorage.removeItem('token');
               if (!oauthId) {
                  window.location.href = '/auth/log-in';
                  return;
               }
            }

            const pollUserData = async () => {
               try {
                  const res = await fetch('/api/user', {
                     headers: {
                        Authorization: token
                           ? `Bearer ${token}`
                           : `OAuthId ${oauthId}`,
                     },
                  });

                  if (res.ok) {
                     const data = await res.json();
                     setUser(data.user);
                  } else if ([401, 404, 500].includes(res.status)) {
                     localStorage.removeItem('token');
                     localStorage.setItem('logoutFlag', 'true');
                     signOut({ callbackUrl: '/auth/log-in' });
                     localStorage.removeItem('oauthId');

                     window.location.href = '/auth/log-in';
                  } else {
                     console.warn('Unexpected response status:', res.status);
                  }
               } catch (err) {
                  console.error('Failed to fetch user', err);
               } finally {
                  setTimeout(pollUserData, 2000);
               }
            };

            pollUserData();
         } catch (error) {
            console.error('Error during fetching user:', error);
            window.location.href = '/auth/log-in';
         } finally {
            setLoading(false);
         }
      };

      fetchUser();

      return () => {
         setUser(null);
         setLoading(true);
      };
   }, []);
   const [isDarkMode, setIsDarkMode] = useState(false);

   useEffect(() => {
      const darkModePreference = localStorage.getItem('darkMode');
      if (darkModePreference === 'true') {
         document.documentElement.classList.add('dark');
         setIsDarkMode(true);
      }
   }, []);

   const handleToggle = () => {
      const root = document.documentElement;

      if (isDarkMode) {
         root.classList.remove('dark');
         localStorage.setItem('darkMode', 'false');
         setIsDarkMode(false);
      } else {
         root.classList.add('dark');
         localStorage.setItem('darkMode', 'true');
         setIsDarkMode(true);
      }
   };
   const providerValue = useMemo(
      () => ({
         user,
         loading,
         isDarkMode,
         setIsDarkMode,
         handleToggle,
      }),
      [user, loading, isDarkMode, setIsDarkMode, handleToggle]
   );

   return (
      <UserContext.Provider value={providerValue}>
         {children}
      </UserContext.Provider>
   );
};

export const useUser = () => useContext(UserContext);
