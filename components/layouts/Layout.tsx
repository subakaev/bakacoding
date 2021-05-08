import {
  AppBar,
  Button,
  Link as MuiLink,
  Box,
  Toolbar,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { FunctionComponent } from "react";
import Link from "next/link";

const useStyles = makeStyles({
  brand: {
    color: "white",
  },
});

const Layout: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Link href="/" passHref>
            <MuiLink color="primary">
              <Typography variant="h6" className={classes.brand}>
                Bakacoding
              </Typography>
            </MuiLink>
          </Link>

          <Box ml={3} display="flex">
            <Link href="/bfe" passHref>
              <Button color="inherit">BFE</Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <div>{children}</div>
    </div>
  );
};

export const getLayout = (page: any) => <Layout>{page}</Layout>;

export default Layout;
