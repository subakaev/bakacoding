import { ContentfulClientApi, createClient } from "contentful";

let client: ContentfulClientApi;

export const getContentfulClient = (): ContentfulClientApi => {
  if (!client) {
    client = createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID ?? "",
      accessToken:
        process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_API_ACCESS_TOKEN ?? "",
      host: "preview.contentful.com",
    });
  }

  return client;
};
