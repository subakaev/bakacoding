import { makeStyles } from "@mui/styles";
import { ToggleButtonGroup, ToggleButton } from "@mui/lab";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import WarningIcon from "@mui/icons-material/Warning";
import { Grade } from "../../types/interview";

const useStyles = makeStyles({
  solved: {
    "&.Mui-selected": {
      background: "#198754",
      color: "white",
      "&:hover": {
        background: "#157347",
      },
    },
  },
  average: {
    "&.Mui-selected": {
      background: "#ffcd39",
      "&:hover": {
        background: "#ffca2c",
      },
    },
  },
  failed: {
    "&.Mui-selected": {
      background: "#b02a37",
      color: "white",
      "&:hover": {
        background: "#bb2d3b",
      },
    },
  },
});

interface GradeToggleProps {
  value: Grade | null;
  onChange: (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    // TODO: fix any type here
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => void;
}

const GradeToggle = ({ value, onChange }: GradeToggleProps): JSX.Element => {
  const classes = useStyles();

  return (
    <ToggleButtonGroup
      value={value}
      onChange={onChange}
      exclusive
      aria-label="text alignment"
      size="small">
      <ToggleButton
        value="failed"
        aria-label="left aligned"
        className={classes.failed}>
        <ClearIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="average"
        aria-label="centered"
        className={classes.average}>
        <WarningIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="solved"
        aria-label="right aligned"
        className={classes.solved}>
        <DoneIcon fontSize="small" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default GradeToggle;
