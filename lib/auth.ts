import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import { AuthService } from "@/service/auth/auth-service";
import { JwtUtils } from "@/service/jwt/JwtUtils";

// @ts-ignore
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const res = await AuthService.login({
          username: credentials.username,
          password: credentials.password,
        });

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
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    //@ts-ignore
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          ...user,
        };
      }

      if (token.bearer) {
        const decoded = JwtUtils.decode(
          typeof token?.bearer === "string" ? token.bearer : "",
        );
        const currentTime = Math.floor(Date.now() / 1000);

        if (decoded && decoded.exp && decoded.exp - currentTime < 300) {
          const refresh = await AuthService.refreshToken(
            typeof token?.refresh === "string" ? token.refresh : "",
          );

          if (refresh) {
            const newInfo = JwtUtils.decode(refresh.bearer);

            return {
              ...token,
              refresh: refresh.refresh,
              bearer: refresh.refresh,
              id: newInfo?.sub,
              email: newInfo?.email,
              name: newInfo?.nom || "Utilisateur",
              numero: newInfo?.numero,
              role: newInfo?.role,
            };
          } else {
            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },
    //@ts-ignore
    async session({ session, token }) {
      // Passer les données du token à la session
      session.user = {
        id: typeof token.id === "string" ? token.id : undefined,
        email: typeof token.email === "string" ? token.email : undefined,
        name: typeof token.name === "string" ? token.name : undefined,
        numero: typeof token.numero === "string" ? token.numero : undefined,
        role: typeof token.role === "string" ? token.role : undefined,
      };

      // Ajouter le token bearer pour les appels API
      session.bearer =
        typeof token.bearer === "string" ? token.bearer : undefined;
      session.refresh =
        typeof token.refresh === "string" ? token.refresh : undefined;

      // Gérer les erreurs de rafraîchissement
      if (token.error) {
        session.error =
          typeof token.error === "string" ? token.error : undefined;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, //1jrs
  },
  secret: process.env.NEXTAUTH_SECRET || "YFYFWN/YxRuyeai2+gRl",
  debug: process.env.NODE_ENV === "development",
};
