import { NextApiResponse } from "next";
import { getSession } from "next-auth/client";
import { NextApiRequestWithSession } from "types/api";

const withAuth = (
  handler: (
    req: NextApiRequestWithSession,
    res: NextApiResponse
  ) => Promise<void>
) => {
  return async (
    req: NextApiRequestWithSession,
    res: NextApiResponse
  ): Promise<void> => {
    const session = await getSession({ req });

    if (session == null) {
      return res.status(401).send("Not authenticated");
    }

    req.session = session;

    return handler(req, res);
  };
};

export default withAuth;
