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
import { UserRole } from "types/UserRole";

const useStyles = makeStyles({
  brand: {
    color: "white",
  },
});

const Layout: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  const [session] = useSession();

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
            <Link href="/cards" passHref>
              <Button color="inherit">Cards</Button>
            </Link>
            {session?.user.roles.includes(UserRole.Admin) && (
              <Link href="/admin" passHref>
                <Button color="inherit">Admin</Button>
              </Link>
            )}
          </Box>
          <Box>
            {!session && (
              <>
                Not signed
                <Button color="inherit" onClick={() => signIn()}>
                  Sign In
                </Button>
              </>
            )}
            {session && (
              <>
                Signed as {session.user?.email}{" "}
                <Button color="inherit" onClick={() => signOut()}>
                  Sign Out
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box my={3}>{children}</Box>
      </Container>
    </div>
  );
};

export const getLayout = (page: JSX.Element): JSX.Element => (
  <Layout>{page}</Layout>
);

export default Layout;
