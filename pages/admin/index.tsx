import React from "react";
import { Paper, Box, Button } from "@material-ui/core";
import Link from "next/link";
import { getAdminLayout } from "components/layouts/AdminLayout";

const AdminPage = (): JSX.Element => {
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

AdminPage.getLayout = getAdminLayout;

export default AdminPage;
