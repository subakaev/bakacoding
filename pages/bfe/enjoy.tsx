import { getLayout } from "components/layouts/Layout";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getEntriesByTags } from "lib/contentful";
import ContentfulCodeTaskTrainer from "components/ContentfulCodeTaskTrainer";
import { Paper } from "@mui/material";

const BfeCoding = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
): JSX.Element => {
  return (
    <Paper>
      <ContentfulCodeTaskTrainer ids={props.ids} />
    </Paper>
  );
};

BfeCoding.getLayout = getLayout;

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await getEntriesByTags("codeTask", ["bfe", "enjoy"]);

  const ids = data.items.map((item) => item.sys.id);

  return {
    props: { data, ids },
  };
};

export default BfeCoding;
