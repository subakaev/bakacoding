import { NextApiRequest } from "next";
import { Session } from "next-auth";

export type NextApiRequestWithSession = NextApiRequest & { session: Session };
