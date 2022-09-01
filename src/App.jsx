import React, { useState } from "react";
import "./App.css";
import * as Sentry from "@sentry/react";

import { MachineLearning, ThreeJS } from "./components";
import {
  Drawer,
  Box,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Filter1Icon from "@mui/icons-material/Filter1";
import ViewInArIcon from "@mui/icons-material/ViewInAr";

const pages = {
  machineLearning: <MachineLearning />,
  cube: <ThreeJS />,
};

function App() {
  const [tab, setTab] = useState("machineLearning");

  const onSelectTab = (tab) => {
    setTab(tab);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#1a1a1a",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ backgroundColor: "#1a1a1a" }}>
          <Typography
            sx={{
              fontFamily: "Brush Script MT, Brush Script Std, cursive",
              fontSize: "28px !important",
              color: "orange",
            }}
          >
            Luiz Rocco
          </Typography>
        </Toolbar>
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
            backgroundColor: "#262626",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List disablePadding>
            <ListItem
              key="home"
              disablePadding
              sx={{
                "&:hover": { backgroundColor: "#ab7f07" },
              }}
              divider
            >
              <ListItemButton onClick={() => onSelectTab("machineLearning")}>
                <ListItemIcon>
                  <HomeIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Home"}
                  primaryTypographyProps={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem
              key="machineLearning"
              disablePadding
              sx={{
                "&:hover": { backgroundColor: "#ab7f07" },
              }}
              divider
            >
              <ListItemButton onClick={() => onSelectTab("machineLearning")}>
                <ListItemIcon>
                  <Filter1Icon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Digit Recognizer"}
                  primaryTypographyProps={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem
              key="cube"
              disablePadding
              sx={{
                "&:hover": { backgroundColor: "#ab7f07" },
              }}
              divider
            >
              <ListItemButton onClick={() => onSelectTab("cube")}>
                <ListItemIcon>
                  <ViewInArIcon sx={{ color: "white" }} />
                </ListItemIcon>
                <ListItemText
                  primary={"Rubik's Cube"}
                  primaryTypographyProps={{
                    color: "white",
                    fontWeight: "bold",
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box sx={{ display: "flex", flex: "1 1 auto", flexDirection: "column" }}>
        <Toolbar sx={{ backgroundColor: "#282c34" }} />
        {pages[tab]}
      </Box>
    </Box>
  );
}

export default Sentry.withProfiler(App);
