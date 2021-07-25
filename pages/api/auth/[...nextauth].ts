import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";
import Models from "models";

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_AUTH_SECRET,
    }),
  ],
  adapter: Adapters.TypeORM.Adapter(
    {
      type: "mongodb",
      url: process.env.DATABASE_URL,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      synchronize: true,
      logging: true,
    },
    {
      models: {
        User: Models.User as any,
        Account: Adapters.TypeORM.Models.Account,
        Session: Adapters.TypeORM.Models.Session,
        VerificationRequest: Adapters.TypeORM.Models.VerificationRequest,
      },
    }
  ),
  callbacks: {
    async session(session, user) {
      session.roles = user.roles ?? [];
      return session;
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
