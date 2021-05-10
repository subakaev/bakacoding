import {
  ContentfulClientApi,
  createClient,
  EntryCollection,
  Entry,
} from "contentful";

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

export type TagMode = "all" | "in";

export function getEntriesByTags<T>(
  contentType: string,
  tags: string[],
  mode: TagMode = "all"
): Promise<EntryCollection<T>> {
  return getContentfulClient().getEntries<T>({
    content_type: contentType,
    [`metadata.tags.sys.id[${mode}]`]: tags.join(","),
  });
}

export function getEntryById<T>(id: string): Promise<Entry<T>> {
  return getContentfulClient().getEntry(id);
}
