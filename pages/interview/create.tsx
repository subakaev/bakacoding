import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import { Paper, Box } from "@material-ui/core";
import InterviewQuestionSetsForm from "components/interview/InterviewQuestionSetsForm";

const CreateInterviewPage = () => {
  return (
    <Paper>
      <Box p={5}>
        <InterviewQuestionSetsForm />
      </Box>
    </Paper>
  );
};

CreateInterviewPage.getLayout = getLayout;

export default CreateInterviewPage;
