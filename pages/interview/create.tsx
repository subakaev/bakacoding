import { getLayout } from "components/layouts/Layout";
import { Paper, Box, Button } from "@mui/material";
import InterviewQuestionSetsForm from "components/interview/InterviewQuestionSetsForm";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreateInterviewPage = (): JSX.Element => {
  return (
    <Paper>
      <Box p={1} mb={2}>
        <Link href="/interview" passHref>
          <Button color="primary" size="small" startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </Link>
      </Box>
      <Box px={5} pb={5}>
        <InterviewQuestionSetsForm />
      </Box>
    </Paper>
  );
};

CreateInterviewPage.getLayout = getLayout;

export default CreateInterviewPage;
