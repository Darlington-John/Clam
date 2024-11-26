import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

const authOptions: any = {
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
   ],
   callbacks: {
      async signIn({ user, account }: any) {
         if (account.provider === 'google') {
            const { name, email, id: oauthId } = user;

            try {
               const res = await fetch(
                  `${process.env.NEXTAUTH_URL}/api/signup`,
                  {
                     method: 'POST',
                     headers: {
                        'Content-Type': 'application/json',
                     },
                     body: JSON.stringify({
                        name,
                        email,
                        oauthId,
                        authProvider: 'google',
                        profile: user.image || '',
                     }),
                  }
               );

               const responseData = await res.json();

               if (res.ok) {
                  return true;
               } else if (res.status === 409) {
                  const loginRes = await fetch(
                     `${process.env.NEXTAUTH_URL}/api/login`,
                     {
                        method: 'POST',
                        headers: {
                           'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                           email,
                           password: '',
                        }),
                     }
                  );

                  const loginData = await loginRes.json();
                  if (loginRes.ok) {
                     return true;
                  } else {
                     console.error('Login API failed', loginData);
                     return false;
                  }
               } else {
                  console.error('Signup API failed', responseData);
                  return false;
               }
            } catch (error) {
               console.error('Error signing in with Google:', error);
               return false;
            }
         }

         return true;
      },
      async session({ session, token }: any) {
         session.user.oauthId = token.sub;
         return session;
      },
      async redirect({ url, baseUrl }: any) {
         return `${process.env.NEXTAUTH_URL}/dashboard`;
      },
   },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
