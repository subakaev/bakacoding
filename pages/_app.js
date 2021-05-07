import "../styles/globals.css";

const MyApp = ({ Component, pageProps }) => {
  const getLayout = Component.getLayout || ((page) => page);
  return getLayout(<Component {...pageProps}></Component>);
};

export default MyApp;
