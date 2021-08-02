/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: fix any types here
import React from "react";
import { ThemeProvider, CssBaseline, createMuiTheme } from "@material-ui/core";
import { Provider } from "next-auth/client";
import "../styles/globals.css";

const theme = createMuiTheme();

const MyApp = ({
  Component,
  pageProps,
}: {
  Component: any;
  pageProps: any;
}): JSX.Element => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles != null) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const getLayout = Component.getLayout || ((page: JSX.Element) => page);
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {getLayout(<Component {...pageProps}></Component>)}
      </ThemeProvider>
    </Provider>
  );
};

export default MyApp;
