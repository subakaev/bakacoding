import { getLayout } from "components/layouts/Layout";
import Link from "next/link";
import { List, ListItem, ListItemText } from "@mui/material";
import _ from "lodash";

const bfeLinks = ["coding", "answer", "design", "enjoy", "typescript"];

const Bfe = (): JSX.Element => {
  return (
    <div>
      <List component="div">
        {bfeLinks.map((name) => (
          <Link key={name} href={`/bfe/${name}`} passHref>
            <ListItem button component="a">
              <ListItemText primary={_.capitalize(name)} />
            </ListItem>
          </Link>
        ))}
      </List>
    </div>
  );
};

Bfe.getLayout = getLayout;

export default Bfe;
