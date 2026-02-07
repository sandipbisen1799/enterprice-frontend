import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import { useTheme, useMediaQuery } from "@mui/material";
import { useApi } from "../context/contextApi";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Bell, CircleChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import profileimage from "../assets/profileimg.png";
import { logoutAPI } from "../services/user.service";
import { toast } from "react-toastify";

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 240;

function ResponsiveDrawer({ window, children, lists, onNavigate }) {
  const { setUser, setIsLogin, user } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [controls, setControls] = useState(false);
  const drawerWidth = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
      setControls(false);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await logoutAPI();
      setUser(null);
      localStorage.removeItem("token");
      setIsLogin(false);
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        overflowX: "hidden",
        bgcolor: "background.paper",
      }}
   onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => controls && setIsCollapsed(true)}
    >
      <List disablePadding>
        {lists.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => onNavigate(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: isCollapsed ? "center" : "flex-start",
                px: isCollapsed ? 0 : 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: isCollapsed ? "auto" : 40,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary={item.text} />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      {/* ─── FULL-WIDTH APP BAR ─── */}
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          width: "100%",
          bgcolor: "#1976d2e6",
          zIndex: theme.zIndex.drawer + 2,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <h1 className="text-white text-xl font-semibold">Winden</h1>

            {!isMobile && (
              <ArrowRight
                size={28}
                className={`cursor-pointer transition-transform text-white ${
                  isCollapsed ? "rotate-180" : ""
                }`}
           onClick={() => {
                setIsCollapsed((p) => !p);
                setControls((p) => !p);
              }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Bell size={22} className="text-white cursor-pointer" />

            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                overflow: "hidden",
                bgcolor: "white",
                cursor: "pointer",
              }}
              onClick={() => navigate("/admin/profile")}
            >
              <img
                src={user?.imageUrl || profileimage}
                alt="profile"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </Box>

            <CircleChevronDown
              size={24}
              className="text-white cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
            />
          </Box>
        </Toolbar>

        {/* Dropdown */}
        {showDropdown && (
          <Box
            sx={{
              position: "absolute",
              top: 64,
              right: 16,
              bgcolor: "white",
              borderRadius: 1,
              boxShadow: 3,
              minWidth: 140,
              overflow: "hidden",
              zIndex: theme.zIndex.appBar + 10,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 1.5,
                cursor: "pointer",
                color: 'black',
                "&:hover": { bgcolor: "grey.100" },
              }}
              onClick={() => {
                setShowDropdown(false);
                handleLogout();
              }}
            >
              Logout
            </Box>
          </Box>
        )}
      </AppBar>

      {/* ─── SIDEBAR / DRAWER ─── */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: 0 }}>
        {/* Mobile Drawer */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              top: 64,
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer – OVERLAY STYLE */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              top: 64,
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              // Overlay instead of pushing content
              position: "fixed",
              height: "calc(100% - 64px)",
              borderRight: "1px solid",
              borderColor: "divider",
              zIndex: theme.zIndex.drawer,
              bgcolor: "background.paper",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* ─── MAIN CONTENT – FULL WIDTH ─── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",                    // Full width always
          mt: "18px",                       // Respect AppBar height
          backgroundColor: "#F7F7F7",
          minHeight: "calc(100vh - 64px)",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
        onClick={() => setShowDropdown(false)}
      >
        <Toolbar variant="dense" /> {/* spacer */}
        <Box >{children}</Box>
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node,
  lists: PropTypes.array.isRequired,
  onNavigate: PropTypes.func.isRequired,
};

export default ResponsiveDrawer;