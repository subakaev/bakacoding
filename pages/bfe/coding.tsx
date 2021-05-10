import { getLayout } from "components/layouts/Layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import _ from "lodash";
import { getContentfulClient } from "lib/contentful";
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

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const client = getContentfulClient();

  const data = await client.getEntries({
    content_type: "codeTask",
    "metadata.tags.sys.id[in]": "bfe,coding",
  });

  const ids = data.items.map((item) => item.sys.id);

  return {
    props: { data, ids },
  };
};

export default BfeCoding;
