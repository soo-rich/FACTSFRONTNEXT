// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import type {NextAuthOptions} from 'next-auth'

import {AuthService} from "@/service/auth/auth-service";
import {JwtUtils} from "@/service/jwt/JwtUtils";


export const authOptions: NextAuthOptions = {


  // ** Configure one or more authentication providers
  // ** Please refer to https://next-auth.js.org/configuration/options#providers for more `providers` options
  providers: [
    CredentialProvider({
      // ** The name to display on the sign in form (e.g. 'Sign in with...')
      // ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {
        username: {label: "Username", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        /*
         * You need to provide your own logic here that takes the credentials submitted and returns either
         * an object representing a user or value that is false/null if the credentials are invalid.
         * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
         * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
         */

        try {
          // ** Login API Call to match the user credentials and receive user data in response along with his role
          if (!credentials) return null;

          const res = await AuthService.login({
            username: credentials.username,
            password: credentials.password,
          });

          console.log(res, 'res from login', credentials.username, credentials.password, 'credentials');

          if (res.bearer && res.refresh) {
            const userInfo = JwtUtils.decode(res.bearer);

            return {
              id: userInfo?.sub,
              email: userInfo?.email,
              name: userInfo?.nom || "Utilisateur",
              numero: userInfo?.numero,
              role: userInfo?.role,
              bearer: res.bearer,
              refresh: res.refresh,
            };
          }

          return null;
        } catch (e: any) {
          throw new Error(e.message)
        }
      }
    }),



    // ** ...add more providers here
  ],

  // ** Please refer to https://next-auth.js.org/configuration/options#session for more `session` options
  session: {
    /*
     * Choose how you want to save the user session.
     * The default is `jwt`, an encrypted JWT (JWE) stored in the session cookie.
     * If you use an `adapter` however, NextAuth default it to `database` instead.
     * You can still force a JWT session by explicitly defining `jwt`.
     * When using `database`, the session cookie will only contain a `sessionToken` value,
     * which is used to look up the session in the database.
     * If you use a custom credentials provider, user accounts will not be persisted in a database by NextAuth.js (even if one is configured).
     * The option to use JSON Web Tokens for session tokens must be enabled to use a custom credentials provider.
     */
    strategy: 'jwt',

    // ** Seconds - How long until an idle session expires and is no longer valid
    maxAge: 24 * 60 * 60 // ** 30 days
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#pages for more `pages` options
  pages: {
    signIn: '/login'
  },

  // ** Please refer to https://next-auth.js.org/configuration/options#callbacks for more `callbacks` options
  callbacks: {
    /*
     * While using `jwt` as a strategy, `jwt()` callback will be called before
     * the `session()` callback. So we have to add custom parameters in `token`
     * via `jwt()` callback to make them accessible in the `session()` callback
     */
    async jwt({token, user}) {
      return {...token, ...user}
    },
    async session({session, token}) {
      return {...session, ...token}
    }
  }
}
