import React, { useState } from "react";
import _ from "lodash";
import {
  Paper,
  Box,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  IconButton,
} from "@material-ui/core";
import { useSession } from "next-auth/client";
import axios from "axios";
import { getAdminLayout } from "components/layouts/AdminLayout";
import MemoryCardFormDialog from "components/dialogs/MemoryCardFormDialog";
import { MemoryCard } from "types/MemoryCard";
import useDialog from "lib/hooks/useDialog";
import EditIcon from "@material-ui/icons/Edit";
import useSWR from "swr";
import DeleteMemoryCardDialog from "components/dialogs/DeleteMemoryCardDialog";

const cardsFetcher = (url: string): Promise<MemoryCard[]> =>
  axios.get(url).then((res) => res.data);

const useCards = () => {
  const { data, error, revalidate } = useSWR("/api/cards", cardsFetcher);

  return {
    cards: data ?? [],
    loading: !data && !error,
    error,
    revalidate,
  };
};

const AdminPage = () => {
  const [session] = useSession();
  const { open, closeDialog, openDialog } = useDialog();

  const { cards, revalidate } = useCards();

  const onSubmit = async (data: MemoryCard) => {
    try {
      // TODO: use swr mutate here
      const response = await axios.post("/api/cards", {
        ...data,
        userId: session?.user.id,
      });

      console.log(response.data);

      setTags(Array.from(new Set([...tags, ...data.tags])));
    } catch (e) {
      console.error(e); // TODO: remove console.log
    }
  };

  const [tags, setTags] = useState(["one", "two", "three"]);

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
        {cards.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Id</TableCell>
                <TableCell>Question</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {cards.map((card) => (
                <TableRow key={card._id}>
                  <TableCell>{card._id}</TableCell>
                  <TableCell>{card.question}</TableCell>
                  <TableCell>
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <DeleteMemoryCardDialog
                      id={card._id}
                      onDeleted={revalidate}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Box>
    </Paper>
  );
};

AdminPage.getLayout = getAdminLayout;

export default AdminPage;
