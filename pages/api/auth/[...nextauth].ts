import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, User } from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";
import models from "models";

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
        // TODO: think what to do with any type here. It doesn't work without any for now.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        User: models.User as any,
        Account: Adapters.TypeORM.Models.Account,
        Session: Adapters.TypeORM.Models.Session,
        VerificationRequest: Adapters.TypeORM.Models.VerificationRequest,
      },
    }
  ),
  callbacks: {
    async session(session, user: User) {
      session.user.id = user.id;
      session.user.roles = user.roles ?? [];
      return session;
    },
  },
};

const authRoutes = (
  req: NextApiRequest,
  res: NextApiResponse
): void | Promise<void> => NextAuth(req, res, options);

export default authRoutes;
