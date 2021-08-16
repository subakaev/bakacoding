import axios from "axios";
import { MemoryCard } from "types/MemoryCard";
import useSWR from "swr";

const cardsFetcher = (url: string, tags: string[]): Promise<MemoryCard[]> =>
  axios
    .get(`${url}?${tags.map((tag) => `tags=${tag}`).join("&")}`)
    .then((res) => res.data);

//TODO:
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useCards = (tags: string[]) => {
  const { data, error, revalidate } = useSWR(
    ["/api/admin/cards", tags],
    cardsFetcher
  );

  return {
    cards: data ?? [],
    loading: !data && !error,
    error,
    revalidate,
  };
};

export default useCards;
