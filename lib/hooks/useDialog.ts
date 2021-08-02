import { useState } from "react";

interface UseDialogState {
  open: boolean;
  closeDialog: () => void;
  openDialog: () => void;
}

const useDialog = (openByDefault = false): UseDialogState => {
  const [open, setOpen] = useState(openByDefault);

  const closeDialog = () => {
    setOpen(false);
  };

  const openDialog = () => {
    setOpen(true);
  };

  return { open, closeDialog, openDialog };
};

export default useDialog;
