import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import Adapters from "next-auth/adapters";
import Providers from "next-auth/providers";

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_AUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_AUTH_SECRET,
    }),
  ],
  // database: {
  //   type: "mongodb",
  //   url: process.env.DATABASE_URL,
  //   useNewUrlParser: true,
  //   synchronize: true,
  //   logging: true,
  // },
  // database: {
  //   type: "mongodb",
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   database: process.env.DATABASE_URL,
  // },
  // database: process.env.DATABASE_URL,
  adapter: Adapters.TypeORM.Adapter({
    type: "mongodb",
    url: process.env.DATABASE_URL,
    useNewUrlParser: true,
    synchronize: true,
    logging: true,
  }),
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options);
