import { getLayout } from "components/layouts/Layout";
import { InferGetServerSidePropsType } from "next";
import _ from "lodash";
import { getEntries } from "lib/contentful";
import ContentfulQuestionSetTrainer from "components/ContentfulQuestionSetTrainer";
import { Paper } from "@material-ui/core";

const BfeCoding = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <Paper>
      <ContentfulQuestionSetTrainer ids={props.ids} />
    </Paper>
  );
};

BfeCoding.getLayout = getLayout;

export const getServerSideProps = async () => {
  const data = await getEntries("questionsSet");

  const ids = data.items.map((item) => item.sys.id);

  return {
    props: { data, ids },
  };
};

export default BfeCoding;
