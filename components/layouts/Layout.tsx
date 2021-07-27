import {
  AppBar,
  Button,
  Link as MuiLink,
  Box,
  Toolbar,
  Typography,
  makeStyles,
  Container,
} from "@material-ui/core";
import { FunctionComponent } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";

const useStyles = makeStyles({
  brand: {
    color: "white",
  },
});

const Layout: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  const [session, loading] = useSession();

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
            <Link href="/cs" passHref>
              <Button color="inherit">CS</Button>
            </Link>
            <Link href="/bfe" passHref>
              <Button color="inherit">BFE</Button>
            </Link>
            <Link href="/js" passHref>
              <Button color="inherit">JS</Button>
            </Link>
            {session?.user.roles.includes("Admin") && (
              <Link href="/admin" passHref>
                <Button color="inherit">Admin</Button>
              </Link>
            )}
          </Box>
          {session?.user?.roles?.includes("Admin") && <div>Admin</div>}
          <Box>
            {!session && (
              <>
                Not signed
                <Button color="inherit" onClick={() => signIn()}>
                  Sign In
                </Button>
              </>
            )}
            {session && <>Signed as {session.user?.email}</>}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box my={3}>{children}</Box>
      </Container>
    </div>
  );
};

export const getLayout = (page: any) => <Layout>{page}</Layout>;

export default Layout;
