import React, { useState, useEffect } from "react";
import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import {
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@material-ui/core";
import Link from "next/link";
import { useSession } from "next-auth/client";
import { Session } from "next-auth";
import axios from "axios";
import { Control, Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Autocomplete } from "@material-ui/lab";

interface MemoryCard {
  question: string;
  answer: string;
  link: string;
  tags: string[];
}

interface TextInputProps {
  name: string;
  control: Control<any>;
  defaultValue?: string;
  [key: string]: any;
}

const TextInput = ({
  name,
  control,
  defaultValue = "",
  ...other
}: TextInputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, formState: { errors } }) => (
        <TextField
          {...field}
          variant="filled"
          size="small"
          {...other}
          error={!!errors[name]}
          helperText={errors[name]?.message ?? " "}
        />
      )}
    />
  );
};

const schema = yup.object().shape({
  question: yup.string().required(),
  answer: yup.string().required(),
  link: yup.string(),
  tags: yup.array(yup.string()).required(),
});

const useClientSession = (): [Session | null, boolean] => {
  const [session, loading] = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return [session, !isClient || loading];
};

const delay = () =>
  new Promise((resolve) => setTimeout(() => resolve(1), 4000));

const AdminPage = () => {
  const [session, loading] = useClientSession();
  const [cards, setCards] = useState([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const { handleSubmit, control, formState } = useForm<MemoryCard>({
    defaultValues: { tags: [] },
    resolver: yupResolver(schema),
  });

  console.log(formState.errors);

  const onSubmit = async (data: MemoryCard) => {
    console.log(data);
    try {
      const response = await axios.post("/api/cards", data);

      setTags(Array.from(new Set([...tags, ...data.tags])));
    } catch (e) {
      console.log(e);
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

  // When rendering client side don't display anything until loading is complete
  if (loading) return null;

  if (!session || !session?.user?.roles?.includes("Admin")) {
    return <div>Access denied</div>;
  }

  if (cardsLoading) {
    return <div>loading...</div>;
  }

  console.log(cards);

  return (
    <Paper>
      <Box p={5}>
        <Button color="primary" variant="contained" onClick={openDialog}>
          New Card
        </Button>
        <Dialog open={dialogOpen} onClose={closeDialog}>
          <DialogTitle>New Card</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                name="question"
                control={control}
                label="Question"
                rows={5}
                multiline
                fullWidth
              />
              <TextInput
                name="answer"
                control={control}
                label="Answer"
                rows={5}
                multiline
                fullWidth
              />
              <TextInput name="link" control={control} label="Link" fullWidth />
              <Controller
                name="tags"
                defaultValue={[]}
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    freeSolo
                    options={tags}
                    value={field.value}
                    onChange={(_, v) => field.onChange(v)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Multiple values"
                        placeholder="Favorites"
                      />
                    )}
                  />
                )}
              />
              <Button variant="contained" color="primary" type="submit">
                Add
              </Button>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={closeDialog} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  );
};

AdminPage.getLayout = getLayout;

export default AdminPage;
