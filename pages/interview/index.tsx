import { getLayout } from "components/layouts/Layout";
import { Paper, Box, Button } from "@mui/material";
import Link from "next/link";

const InterviewPage = (): JSX.Element => {
  return (
    <Paper>
      <Box p={5}>
        <Box mb={2}>
          <Link href="/interview/create" passHref>
            <Button color="primary" size="large" variant="contained">
              Create
            </Button>
          </Link>
        </Box>
        <Box>
          <Link href="/interview/conduct" passHref>
            <Button color="primary" size="large" variant="contained">
              Conduct
            </Button>
          </Link>
        </Box>
      </Box>
    </Paper>
  );
};

InterviewPage.getLayout = getLayout;

export default InterviewPage;
