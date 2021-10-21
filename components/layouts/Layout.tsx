import {
  AppBar,
  Link as MuiLink,
  Box,
  Toolbar,
  Typography,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { makeStyles } from "@mui/styles";
import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import { UserRole } from "types/UserRole";

const useStyles = makeStyles({
  brand: {
    color: "white",
  },
});

const links = [
  { href: "/cs", title: "CS" },
  { href: "/bfe", title: "BFE" },
  { href: "/cards", title: "Cards" },
];

const Layout: FunctionComponent = ({ children }) => {
  const classes = useStyles();

  const [session] = useSession();

  const [open, setOpen] = useState(false);

  const closeDrawerHandler = () => {
    setOpen(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen((v) => !v)}>
            <MenuIcon />
          </IconButton>
          <Drawer open={open} onClose={closeDrawerHandler}>
            <List>
              {links.map(({ title, href }) => (
                <Link href={href} passHref key={href}>
                  <ListItem button onClick={closeDrawerHandler}>
                    <ListItemIcon>
                      <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary={title} />
                  </ListItem>
                </Link>
              ))}
              {session?.user.roles.includes(UserRole.Admin) && (
                <>
                  <Divider />
                  <Link href="/admin" passHref>
                    <ListItem button onClick={closeDrawerHandler}>
                      <ListItemIcon>
                        <InboxIcon />
                      </ListItemIcon>
                      <ListItemText primary="Admin" />
                    </ListItem>
                  </Link>
                </>
              )}
            </List>
          </Drawer>
          <Link href="/" passHref>
            <MuiLink color="primary" sx={{ flexGrow: 1 }}>
              <Typography variant="h6" className={classes.brand}>
                Bakacoding
              </Typography>
            </MuiLink>
          </Link>
          {!session && (
            <IconButton color="inherit" onClick={() => signIn()}>
              <PersonIcon />
            </IconButton>
          )}
          {session && (
            <IconButton color="inherit" onClick={() => signOut()}>
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box my={3}>{children}</Box>
      </Container>
    </>
  );
};

export const getLayout = (page: JSX.Element): JSX.Element => (
  <Layout>{page}</Layout>
);

export default Layout;
