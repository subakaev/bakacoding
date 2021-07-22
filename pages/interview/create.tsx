import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import { Paper, Box, Button } from "@material-ui/core";
import InterviewQuestionSetsForm from "components/interview/InterviewQuestionSetsForm";
import Link from "next/link";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const CreateInterviewPage = () => {
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
