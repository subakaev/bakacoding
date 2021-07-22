import { useState } from "react";
import { getLayout } from "components/layouts/Layout";
import { Paper, Box, Button } from "@material-ui/core";
import store from "store2";
import { InterviewQuestionSet } from "../../types/interview";
import InterviewForm from "components/interview/InterviewForm";
import InterviewResult from "components/interview/InterviewResult";
import Link from "next/link";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const ConductInterviewPage = () => {
  const [questionSets] = useState<InterviewQuestionSet[]>(
    store.namespace("inteview").get("questionSets", [])
  );

  const [interviewResult, setInterviewResult] = useState("");

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
