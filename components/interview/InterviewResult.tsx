import { Button, TextField, Box } from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";

interface InterviewResultProps {
  value: string;
}

const InterviewResult = ({ value }: InterviewResultProps): JSX.Element => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <Box mt={2}>
      <Box display="flex" justifyContent="flex-end" mb={0.5}>
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={copyToClipboard}
          startIcon={<FileCopyIcon />}>
          Copy
        </Button>
      </Box>
      <TextField
        rows={20}
        multiline
        value={value}
        fullWidth
        variant="outlined"
        label="Interview result"
      />
    </Box>
  );
};

export default InterviewResult;
