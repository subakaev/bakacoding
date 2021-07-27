import React, { useState, useEffect } from "react";
import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import { Paper, Box, Button } from "@material-ui/core";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { Session } from "next-auth";

const useClientSession = (): [Session | null, boolean] => {
  const [session, loading] = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return [session, !isClient || loading];
};

const AdminPage = () => {
  const [session, loading] = useClientSession();

  // When rendering client side don't display anything until loading is complete
  if (loading) return null;

  if (!session || !session?.user?.roles?.includes("Admin")) {
    return <div>Access denied</div>;
  }

  return (
    <Paper>
      <Box p={5}>
        <Link href="/admin/cards" passHref>
          <Button size="large" variant="contained" color="primary">
            Cards
          </Button>
        </Link>
      </Box>
    </Paper>
  );
};

AdminPage.getLayout = getLayout;

export default AdminPage;
