import { useState } from "react";
import { getLayout } from "components/layouts/Layout";
import { Paper, Box } from "@material-ui/core";
import store from "store2";
import { InterviewQuestionSet } from "../../types/interview";
import InterviewForm from "components/interview/InterviewForm";
import InterviewResult from "components/interview/InterviewResult";

const ConductInterviewPage = () => {
  const [questionSets] = useState<InterviewQuestionSet[]>(
    store.namespace("inteview").get("questionSets", [])
  );

  const [interviewResult, setInterviewResult] = useState("");

  return (
    <Paper>
      <Box p={5}>
        <InterviewForm
          questionSets={questionSets}
          onFinished={setInterviewResult}
        />
        {!!interviewResult && <InterviewResult value={interviewResult} />}
      </Box>
    </Paper>
  );
};

ConductInterviewPage.getLayout = getLayout;

export default ConductInterviewPage;
