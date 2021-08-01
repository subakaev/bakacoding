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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import { useSession } from "next-auth/client";
import axios from "axios";
import { getAdminLayout } from "components/layouts/AdminLayout";
import MemoryCardFormDialog from "components/dialogs/MemoryCardFormDialog";
import { MemoryCard } from "types/MemoryCard";
import useDialog from "lib/hooks/useDialog";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import useSWR from "swr";

const cardsFetcher = (url: string): Promise<MemoryCard[]> =>
  axios.get(url).then((res) => res.data);

const useCards = () => {
  const { data, error } = useSWR("/api/cards", cardsFetcher);

  return {
    cards: data ?? [],
    loading: !data && !error,
    error,
  };
};

const DeleteCardDialog = ({ id }: { id: string }) => {
  const { open, openDialog, closeDialog } = useDialog();

  const deleteCard = async () => {
    try {
      const response = await axios.delete(`/api/cards/${id}`);
      closeDialog();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <IconButton onClick={openDialog} color="secondary">
        <DeleteIcon />
      </IconButton>
      <Dialog open={open} onClose={closeDialog}>
        <DialogTitle>Delete Card</DialogTitle>
        <DialogContent>Are you sure?</DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={deleteCard}
            color="secondary"
            startIcon={<DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const AdminPage = () => {
  const [session] = useSession();
  const { open, closeDialog, openDialog } = useDialog();

  const { cards } = useCards();

  const onSubmit = async (data: MemoryCard) => {
    try {
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
                    <DeleteCardDialog id={card._id} />
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
