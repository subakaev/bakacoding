import { useForm, Controller } from "react-hook-form";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import _ from "lodash";
import { getContentfulClient } from "lib/contentful";
import axios from "axios";
import {
  CodingCardsActionType,
  useCodingCardsContext,
} from "./CodingCardsContext";
import { CodingCardFields, Difficulty } from "types/contentful/CodingCard";
import { CodingCard } from "lib/db/models/CodingCardModel";

enum CardType {
  All = "All",
  Pending = "Pending",
}

interface FormValues {
  difficulty: Difficulty;
  type: CardType;
}

const CodingCardsFilter = () => {
  const { dispatch } = useCodingCardsContext();

  const { handleSubmit, control, formState } = useForm<FormValues>({
    defaultValues: { difficulty: Difficulty.All, type: CardType.Pending },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      dispatch({ type: CodingCardsActionType.CARDS_LOADING });

      // TODO move to lib
      const client = getContentfulClient();

      const entries = await client.getEntries<Pick<CodingCardFields, "slug">>({
        content_type: "codingTask",
        select: "fields.slug",
        ...(values.difficulty !== Difficulty.All && {
          "fields.difficulty": values.difficulty,
        }),
      });

      console.log(entries);

      // TODO move to lib
      const response = await axios.get("/api/coding-cards/statuses");
      console.log(response);
      // const cards =
      //   values.type === CardType.Pending
      //     ? await axios.get("/api/coding-cards?active=true")
      //     : { data: [] };

      // const set = new Set(cards.data.map((c: CodingCard) => c.slug));

      // console.log(cards);
      const map: Record<string, Date> = response.data.reduce(
        (
          acc: Record<string, Date>,
          { slug, nextRepetitionDate }: CodingCard
        ) => {
          acc[slug] = new Date(nextRepetitionDate);
          return acc;
        },
        {}
      );

      const now = new Date();

      dispatch({
        type: CodingCardsActionType.CARDS_LOADED,
        payload: {
          slugs: entries.items
            .map((item) => item.fields.slug)
            .filter((s) => {
              if (values.type === CardType.All) {
                return true;
              }

              return !map[s] || map[s] > now;
            }),
          filter: values,
        },
      });
    } catch {
      dispatch({ type: CodingCardsActionType.ERROR });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="difficulty"
        control={control}
        render={({ field }) => {
          return (
            <FormControl>
              <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
              <Select
                {...field}
                sx={{ width: 200 }}
                size="small"
                id="difficulty-select"
                labelId="difficulty-select-label"
                label="Difficulty">
                {Object.values(Difficulty).map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {_.capitalize(difficulty)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }}
      />
      <Controller
        name="type"
        control={control}
        render={({ field }) => {
          return (
            <FormControl>
              <InputLabel id="card-type-select-label">Card type</InputLabel>
              <Select
                {...field}
                sx={{ width: 200 }}
                size="small"
                id="card-type-select"
                labelId="card-type-select-label"
                label="Card type">
                {Object.values(CardType).map((value) => (
                  <MenuItem key={value} value={value}>
                    {_.capitalize(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        }}
      />
      <LoadingButton
        type="submit"
        variant="contained"
        sx={{ ml: 2 }}
        loading={formState.isSubmitting}>
        Apply
      </LoadingButton>
    </form>
  );
};

export default CodingCardsFilter;
