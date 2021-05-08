import React from "react";
import { ThemeProvider, CssBaseline, createMuiTheme } from "@material-ui/core";
import "../styles/globals.css";

const theme = createMuiTheme();

const MyApp = ({ Component, pageProps }) => {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const getLayout = Component.getLayout || ((page) => page);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {getLayout(<Component {...pageProps}></Component>)}
    </ThemeProvider>
  );
};

export default MyApp;
