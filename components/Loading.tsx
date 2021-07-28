import { Box, CircularProgress } from "@material-ui/core";

const Loading = () => {
  return (
    <Box p={5} textAlign="center">
      <CircularProgress size={100} />
    </Box>
  );
};

export default Loading;
