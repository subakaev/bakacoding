import { getLayout } from "components/layouts/CodingCardsLayout";
import { getContentfulClient } from "lib/contentful";
import {
  GetStaticProps,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from "next";
import { CodingCardFields } from "types/contentful/CodingCard";
import {
  Container,
  Card,
  CardHeader,
  CardContent,
  Link as MuiLink,
} from "@mui/material";
import MarkdownText from "components/markdown/MarkdownText";
import { Entry } from "contentful";

const CodingCard = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const entry = props.entry;

  if (!entry) {
    return "Loading...";
  }

  return (
    <Container maxWidth="xl">
      <Card>
        <CardHeader title={entry.fields.title} />
        <CardContent>
          <MarkdownText text={entry.fields.description} />
          <MuiLink href={entry.fields.link} target="_blank">
            Open
          </MuiLink>
        </CardContent>
      </Card>
    </Container>
  );
};

CodingCard.getLayout = getLayout;

export const getStaticProps: GetStaticProps<{
  entry: Entry<CodingCardFields>;
}> = async (context: GetStaticPropsContext) => {
  const slug = context.params?.slug;

  if (!slug) {
    return {
      notFound: true,
    };
  }

  const client = getContentfulClient();

  const entries = await client.getEntries<CodingCardFields>({
    content_type: "codingTask",
    "fields.slug": slug,
  });

  const [entry] = entries.items;

  return {
    props: {
      entry,
    },
    revalidate: 1,
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: true,
  };
};

export default CodingCard;
