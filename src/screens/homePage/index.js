import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from "@mui/icons-material/Menu";
import ProjectsIcon from "@mui/icons-material/WorkOutline";
import VideoEditIcon from "@mui/icons-material/MovieCreationOutlined";
import BlockchainIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccountSettingsIcon from "@mui/icons-material/SettingsOutlined";
import { Route } from "react-router-dom";
import ProjectView from "./ProjectView";
import VideoEditor from "./VideoEditor";
import { Link } from "react-router-dom";

const StyledDrawerPaper = styled("div")(({ theme }) => ({
  width: 250,
  background: "linear-gradient(45deg, #3f51b5 0%, #9c27b0 100%)",
  color: "#ffffff",
}));

export default function DrawerComponent() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={toggleDrawer}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        open={open}
        onClose={toggleDrawer}
        PaperProps={{ component: StyledDrawerPaper }}
      >
        <List>
          {[
            {
              text: "Project View",
              icon: <ProjectsIcon />,
              link: "/projects",
            },
            {
              text: "Video Editor",
              icon: <VideoEditIcon />,
              link: "/video-edit",
            },
            {
              text: "Ai Creator",
              icon: <BlockchainIcon />,
              link: "/ai-creator",
            },
            {
              text: "Account Settings",
              icon: <AccountSettingsIcon />,
              link: "/account-settings",
            },
            {
              text: "Test",
              link: "/test",
            },
          ].map((item, index) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.link}
              onClick={toggleDrawer}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
