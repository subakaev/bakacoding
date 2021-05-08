import { getLayout } from "components/layouts/Layout";
import { createClient } from "contentful";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID ?? "",
  accessToken: process.env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN ?? "",
  host: "preview.contentful.com",
});

const BfeCoding = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  console.log(props.ids);
  return <div>Hello</div>;
};

BfeCoding.getLayout = getLayout;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
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
