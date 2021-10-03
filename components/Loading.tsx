import { Box, CircularProgress } from "@mui/material";

const Loading = (): JSX.Element => {
  return (
    <Box p={5} textAlign="center">
      <CircularProgress size={100} />
    </Box>
  );
};

export default Loading;
