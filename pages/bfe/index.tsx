import { getLayout } from "components/layouts/Layout";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { createClient } from "contentful";
import Link from "next/link";
import { List, ListItem, ListItemText } from "@material-ui/core";
import _ from "lodash";

const bfeLinks = ["coding", "answer", "design", "enjoy", "typescript"];

const Bfe = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(props.data);
  return (
    <div>
      <List component="div">
        {bfeLinks.map((name) => (
          <Link key={name} href={`/bfe/${name}`} passHref>
            <ListItem button component="a">
              <ListItemText primary={_.capitalize(name)} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
};

Bfe.getLayout = getLayout;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID ?? "",
    accessToken: process.env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN ?? "",
    host: "preview.contentful.com",
  });

  const data = await client.getEntries({
    content_type: "codeTask",
    "metadata.tags.sys.id[in]": "bfe",
  });

  return {
    props: { data },
  };
};

export default Bfe;
