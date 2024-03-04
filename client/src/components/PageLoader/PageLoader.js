import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

function PageLoader() {
  return (
    <Box
      sx={{
        marginRight: { xs: "5rem" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "f-w",
        minHeight: "100vh",
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default PageLoader;
