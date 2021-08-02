import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useForm } from "react-hook-form";
import TextInput from "components/form/TextInput";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AutocompleteInput from "components/form/AutoCompleteInput";
import { Cancel, Save } from "@material-ui/icons";
import { MemoryCard } from "types/MemoryCard";

const schema = yup.object().shape({
  question: yup.string().required(),
  answer: yup.string().required(),
  link: yup.string(),
  tags: yup.array(yup.string()).required(),
});

interface MemoryCardFormDialogProps {
  open: boolean;
  closeDialog: () => void;
  onSubmit: (data: MemoryCard) => Promise<void>; // TODO: add type
  initialValues?: Partial<MemoryCard>;
  tags: string[];
  title: string;
}

const MemoryCardFormDialog = ({
  open,
  closeDialog,
  onSubmit,
  initialValues = {},
  tags,
  title,
}: MemoryCardFormDialogProps): JSX.Element => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm<MemoryCard>({
    defaultValues: {
      ...initialValues,
      tags: initialValues.tags ?? [],
    },
    resolver: yupResolver(schema),
  });

  const submitHandler = async (data: MemoryCard) => {
    await onSubmit(data);
    closeDialog();
  };

  return (
    <Dialog open={open} onClose={closeDialog} maxWidth="xl" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <TextInput
            name="question"
            control={control}
            label="Question"
            rows={5}
            multiline
            fullWidth
            disabled={isSubmitting}
          />
          <TextInput
            name="answer"
            control={control}
            label="Answer"
            rows={5}
            multiline
            fullWidth
            disabled={isSubmitting}
          />
          <TextInput
            name="link"
            control={control}
            label="Link"
            fullWidth
            disabled={isSubmitting}
          />
          <AutocompleteInput name="tags" control={control} options={tags} />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeDialog}
            disabled={isSubmitting}
            startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={isSubmitting}
            startIcon={<Save />}>
            {isSubmitting ? <CircularProgress size={15} /> : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MemoryCardFormDialog;
