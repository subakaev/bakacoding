import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MarkdownText from "./markdown/MarkdownText";

interface CodeTaskSolutionProps {
  id: string;
  text: string;
  title?: string;
}

const CodeTaskSolution = ({
  id,
  text,
  title = "Solution",
}: CodeTaskSolutionProps): JSX.Element => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}>
        <Typography variant="subtitle1">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box>
          <MarkdownText text={text} />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CodeTaskSolution;
