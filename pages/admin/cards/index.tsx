import React, { useState, useEffect } from "react";
import _ from "lodash";
import { Paper, Box, Button } from "@material-ui/core";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { Session } from "next-auth";
import axios from "axios";
import { getAdminLayout } from "components/layouts/AdminLayout";
import MemoryCardFormDialog from "components/dialogs/MemoryCardFormDialog";
import { MemoryCard } from "types/MemoryCard";
import useDialog from "lib/hooks/useDialog";

const AdminPage = () => {
  const [session, loading] = useSession();
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const { open, closeDialog, openDialog } = useDialog();

  const onSubmit = async (data: MemoryCard) => {
    try {
      // TODO: assign user id to card
      const response = await axios.post("/api/cards", data);

      setTags(Array.from(new Set([...tags, ...data.tags])));
    } catch (e) {
      console.error(e); // TODO: remove console.log
    }
  };

  const [tags, setTags] = useState(["one", "two", "three"]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const getCards = async () => {
      setCardsLoading(true);
      try {
        // await delay();
        const response = await axios.get("/api/cards");

        setCards(response.data);
        setCardsLoading(false);
      } catch {
        setCardsLoading(false);
      }
    };

    getCards();
  }, [loading]);

  return (
    <Paper>
      <Box p={5}>
        <Button color="primary" variant="contained" onClick={openDialog}>
          New Card
        </Button>
        <MemoryCardFormDialog
          open={open}
          closeDialog={closeDialog}
          onSubmit={onSubmit}
          tags={tags}
          title="Create new card"
        />
      </Box>
    </Paper>
  );
};

AdminPage.getLayout = getAdminLayout;

export default AdminPage;
