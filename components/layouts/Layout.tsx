import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { FunctionComponent } from "react";

const Layout: FunctionComponent = ({ children }) => {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">News</Typography>
        </Toolbar>
      </AppBar>
      <div>{children}</div>
    </div>
  );
};

export const getLayout = (page: any) => <Layout>{page}</Layout>;

export default Layout;
