import React, { useState, useEffect } from "react";
import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import { Paper, Box, Button } from "@material-ui/core";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { Session } from "next-auth";
import { getAdminLayout } from "components/layouts/AdminLayout";

const AdminPage = () => {
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
