import { NextApiRequest, NextApiResponse } from "next";
import { NextApiRequestWithSession } from "types/api";
import { UserRole } from "types/UserRole";

const withAdmin = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => {
  return async (
    req: NextApiRequestWithSession,
    res: NextApiResponse
  ): Promise<void> => {
    if (!req?.session?.user?.roles?.includes(UserRole.Admin)) {
      return res.status(403).send("Forbidden");
    }

    return handler(req, res);
  };
};

export default withAdmin;
