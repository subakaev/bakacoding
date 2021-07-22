import { getLayout } from "components/layouts/Layout";
import _ from "lodash";
import { Paper, Box } from "@material-ui/core";
import InterviewQuestionSetsForm from "components/interview/InterviewQuestionSetsForm";

const InterviewTemplatePage = () => {
  return (
    <Paper>
      <Box p={5}>
        <InterviewQuestionSetsForm />
      </Box>
    </Paper>
  );
};

InterviewTemplatePage.getLayout = getLayout;

export default InterviewTemplatePage;
