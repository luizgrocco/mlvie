import React from "react";
import "./App.css";
import * as Sentry from "@sentry/react";

import { MachineLearning, ThreeJS } from "./components";
import { Drawer, Box, AppBar } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#282c34",
      }}
    >
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${240}px)`, ml: `${240}px` }}
      />
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#282c34",
          },
        }}
      />
    </Box>
  );
}

export default Sentry.withProfiler(App);
