import React from "react";
import { IconButton } from "@material-ui/core";
import axios from "axios";
import useDialog from "lib/hooks/useDialog";
import EditIcon from "@material-ui/icons/Edit";
import MemoryCardFormDialog from "./MemoryCardFormDialog";
import { MemoryCard } from "types/MemoryCard";

const EditMemoryCardDialog = ({
  card,
  tags,
  onChanged,
}: {
  card: MemoryCard;
  tags: string[];
  onChanged: () => Promise<boolean>;
}): JSX.Element => {
  const { open, openDialog, closeDialog } = useDialog();

  const updateCard = async (data: MemoryCard) => {
    // TODO: use mutate here?
    await axios.put(`/api/admin/cards/${card._id}`, data);

    await onChanged();
    closeDialog();
  };

  return (
    <>
      <IconButton onClick={openDialog} color="primary">
        <EditIcon />
      </IconButton>
      <MemoryCardFormDialog
        title="Edit card"
        open={open}
        closeDialog={closeDialog}
        initialValues={card}
        onSubmit={updateCard}
        tags={tags}
      />
    </>
  );
};

export default EditMemoryCardDialog;
