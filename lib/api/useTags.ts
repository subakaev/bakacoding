import axios from "axios";
import useSWR from "swr";

const tagsFetcher = (url: string): Promise<string[]> =>
  axios.get(url).then((res) => res.data);

//TODO:
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useTags = () => {
  const { data, error, mutate } = useSWR("/api/tags", tagsFetcher);

  return {
    tags: data ?? [],
    loading: !data && !error,
    error,
    mutate,
  };
};

export default useTags;
