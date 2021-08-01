import React from "react";
import _ from "lodash";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import axios from "axios";
import useDialog from "lib/hooks/useDialog";
import DeleteIcon from "@material-ui/icons/Delete";

const DeleteMemoryCardDialog = ({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted: () => Promise<boolean>;
}) => {
  const { open, openDialog, closeDialog } = useDialog();

  const deleteCard = async () => {
    try {
      const response = await axios.delete(`/api/cards/${id}`);
      await onDeleted();
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
      <Dialog open={open} onClose={closeDialog} maxWidth="xs" fullWidth>
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

export default DeleteMemoryCardDialog;
