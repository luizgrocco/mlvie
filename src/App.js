import React from "react";
import "./App.css";
import * as Sentry from "@sentry/react";

import { MachineLearning, ThreeJS } from "./components";
import { Drawer, Box, AppBar, Toolbar } from "@mui/material";

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
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ backgroundColor: "#282c34" }} />
      </AppBar>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 240,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 240,
            boxSizing: "border-box",
            backgroundColor: "#000000",
          },
        }}
        // sx={{
        //   width: 240,
        //   flexShrink: 0,
        //   [`& .MuiDrawer-paper`]: {
        //     width: 240,
        //     boxSizing: "border-box",
        //     backgroundColor: "#282c34",
        //   },
        // }}
      />
      <Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}>
        <Toolbar sx={{ backgroundColor: "#282c34" }} />
        <MachineLearning />
      </Box>
    </Box>
  );
}

export default Sentry.withProfiler(App);
