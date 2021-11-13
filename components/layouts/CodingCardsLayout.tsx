import CodingCardsProvider from "components/coding-cards/CodingCardsContext";
import { FunctionComponent } from "react";
import Layout from "./Layout";

const CodingCardsLayout: FunctionComponent = ({ children }) => {
  return (
    <Layout>
      <CodingCardsProvider>{children}</CodingCardsProvider>
    </Layout>
  );
};

export const getLayout = (page: JSX.Element): JSX.Element => (
  <CodingCardsLayout>{page}</CodingCardsLayout>
);

export default CodingCardsLayout;
