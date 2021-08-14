import React, { useState } from "react";
import {
  Paper,
  Box,
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
} from "@material-ui/core";
import { useSession } from "next-auth/client";
import axios from "axios";
import { getAdminLayout } from "components/layouts/AdminLayout";
import MemoryCardFormDialog from "components/dialogs/MemoryCardFormDialog";
import { MemoryCard } from "types/MemoryCard";
import useDialog from "lib/hooks/useDialog";
import useSWR from "swr";
import DeleteMemoryCardDialog from "components/dialogs/DeleteMemoryCardDialog";
import EditMemoryCardDialog from "components/dialogs/EditMemoryCardDialog";
import TagsFilter from "components/TagsFilter";
import useTags from "lib/api/useTags";
import useCards from "lib/api/useCards";

const AdminPage = (): JSX.Element => {
  const [session] = useSession();
  const { open, closeDialog, openDialog } = useDialog();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { tags, mutate } = useTags();

  const { cards, revalidate } = useCards(selectedTags);

  const onSubmit = async (data: MemoryCard) => {
    try {
      // TODO: use swr mutate here
      await axios.post("/api/cards", {
        ...data,
        userId: session?.user.id,
      });

      await axios.put("/api/tags", {
        tags: Array.from(new Set([...tags, ...data.tags])),
      });

      await mutate();
      revalidate();
    } catch (e) {
      console.error(e); // TODO: remove console.log
    }
  };

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
        <TagsFilter tags={tags} onApply={setSelectedTags} />
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
                    <EditMemoryCardDialog
                      card={card}
                      tags={tags}
                      onChanged={revalidate}
                    />
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
