/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { env } from "../env";
import { prisma } from "../prisma";
import { setupStripeCustomer } from "./auth-config-setup";

export const { handlers, auth: baseAuth } = NextAuth((req) => ({
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    // ℹ️ Add this line if you want to add an onboarding page
    // newUser: "/onboarding/1",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: env.GITHUB_ID,
      clientSecret: env.GITHUB_SECRET,
      // This is required because AuthJS beta is not stable.
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "database",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session(params) {
      if (params.newSession) return params.session;

      const typedParams = params as unknown as {
        session: Session;
        user?: User;
      };

      if (!typedParams.user) return typedParams.session;

      typedParams.user.passwordHash = null;

      return typedParams.session;
    },
  },
  events: {
    createUser: async (message) => {
      const user = message.user;

      if (!user.email) {
        return;
      }

      const stripeCustomerId = await setupStripeCustomer(user);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId,
        },
      });
    },
  },
}));
