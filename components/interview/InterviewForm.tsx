import { Typography, Button, TextField, Box } from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { useForm, Controller } from "react-hook-form";
import { Answer, InterviewQuestionSet } from "../../types/interview";
import GradeToggle from "components/interview/GradeToggle";
import { generateInterviewResult } from "lib/interview";

interface FormValues {
  answers: { [id: string]: Answer };
}

const getDefaultFormValues = (
  questionSets: InterviewQuestionSet[]
): FormValues => ({
  answers: questionSets.reduce(
    (acc, question) => ({
      ...acc,
      [question.id]: { comment: "", grade: null },
    }),
    {}
  ),
});

interface InterviewFormProps {
  questionSets: InterviewQuestionSet[];
  onFinished: (result: string) => void;
}

const InterviewForm = ({ questionSets, onFinished }: InterviewFormProps) => {
  const { control, handleSubmit, setValue, getValues } = useForm<FormValues>({
    defaultValues: getDefaultFormValues(questionSets),
  });

  const onSubmit = (data: FormValues) => {
    onFinished(generateInterviewResult(questionSets, data.answers));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {questionSets.map((questionSet) => (
        <Box key={questionSet.id} mb={5}>
          <Typography variant="h5">{questionSet.name}</Typography>
          {questionSet.questions.map((question) => (
            <Box key={question.id} pt={2}>
              <Typography variant="body1">{question.question}</Typography>

              <Box display="flex" alignItems="center" mt={1}>
                <Controller
                  name={`answers.${question.id}.grade`}
                  defaultValue={undefined}
                  control={control}
                  render={({ field: { name } }) => (
                    <GradeToggle
                      value={getValues(name)}
                      onChange={(_, v) => setValue(name, v)}
                    />
                  )}
                />
                <Box ml={2} flexGrow={1}>
                  <Controller
                    name={`answers.${question.id}.comment`}
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField
                        {...field}
                        variant="outlined"
                        label="Comment"
                        size="small"
                        fullWidth
                      />
                    )}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      ))}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        startIcon={<DoneIcon />}
      >
        Finish
      </Button>
    </form>
  );
};

export default InterviewForm;
