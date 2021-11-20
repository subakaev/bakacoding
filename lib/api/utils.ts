import { NextApiRequest } from "next";
import { Types } from "mongoose";
import { getSession } from "next-auth/client";

export const getUserIdFromSession = async (
  req: NextApiRequest
): Promise<Types.ObjectId> => {
  const session = await getSession({ req });

  const userId = session?.user?.id;

  return new Types.ObjectId(userId);
};
