import AccessDenied from "components/AccessDenied";
import Loading from "components/Loading";
import { useSession } from "next-auth/client";
import { FunctionComponent } from "react";
import { UserRole } from "types/UserRole";
import Layout from "./Layout";

const AdminLayout: FunctionComponent = ({ children }) => {
  const [session, loading] = useSession();

  console.log(session);

  if (
    typeof window !== "undefined" &&
    !loading &&
    !session?.user?.roles?.includes(UserRole.Admin)
  ) {
    return <AccessDenied />;
  }

  return <Layout>{loading ? <Loading /> : children}</Layout>;
};

export const getAdminLayout = (page: any) => <AdminLayout>{page}</AdminLayout>;

export default Layout;
