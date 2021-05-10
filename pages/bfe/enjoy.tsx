import { getLayout } from "components/layouts/Layout";
import { InferGetServerSidePropsType } from "next";
import _ from "lodash";
import { getEntriesByTags } from "lib/contentful";
import ContentfulCodeTaskTrainer from "components/ContentfulCodeTaskTrainer";
import { Paper } from "@material-ui/core";

const BfeCoding = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <Paper>
      <ContentfulCodeTaskTrainer ids={props.ids} />
    </Paper>
  );
};

BfeCoding.getLayout = getLayout;

export const getServerSideProps = async () => {
  const data = await getEntriesByTags("codeTask", ["bfe", "enjoy"]);

  const ids = data.items.map((item) => item.sys.id);

  return {
    props: { data, ids },
  };
};

export default BfeCoding;
