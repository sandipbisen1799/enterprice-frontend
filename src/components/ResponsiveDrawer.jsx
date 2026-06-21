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
import { useTheme as useMuiTheme, useMediaQuery } from "@mui/material";
import { useApi } from "../context/contextApi";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Bell, CircleChevronDown, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import profileimage from "../assets/profileimg.png";
import { logoutAPI } from "../services/user.service";
import { toast } from "react-toastify";

const COLLAPSED_WIDTH = 72;
const EXPANDED_WIDTH = 240;

function ResponsiveDrawer({ window, children, lists, onNavigate }) {
  const { setUser, setIsLogin, user, theme: appTheme, toggleTheme } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));

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
      setUser({
        userName: "",
        isVerified: false,
        email: "",
        accountType: "",
      });
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
        bgcolor: appTheme === "light" ? "background.paper" : "#0f172a",
        color: appTheme === "light" ? "text.primary" : "#f1f5f9",
        borderRight: "1px solid",
        borderColor: appTheme === "light" ? "grey.200" : "grey.900",
      }}
      onMouseEnter={() => isCollapsed && setIsCollapsed(false)}
      onMouseLeave={() => controls && setIsCollapsed(true)}
    >
      <List disablePadding sx={{ mt: 2 }}>
        {lists.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isSelected}
                onClick={() => onNavigate(item.path)}
                sx={{
                  minHeight: 52,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  px: isCollapsed ? 0 : 3,
                  mx: 1,
                  borderRadius: "12px",
                  my: 0.5,
                  transition: "all 0.2s ease",
                  bgcolor: isSelected 
                    ? (appTheme === "light" ? "rgba(79, 70, 229, 0.08) !important" : "rgba(124, 58, 237, 0.15) !important")
                    : "transparent",
                  color: isSelected 
                    ? (appTheme === "light" ? "#4F46E5" : "#a78bfa") 
                    : (appTheme === "light" ? "#475569" : "#94a3b8"),
                  "&:hover": {
                    bgcolor: appTheme === "light" ? "rgba(79, 70, 229, 0.04)" : "rgba(255, 255, 255, 0.03)",
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: isCollapsed ? "auto" : 40,
                    justifyContent: "center",
                    color: isSelected 
                      ? (appTheme === "light" ? "#4F46E5" : "#a78bfa") 
                      : (appTheme === "light" ? "#64748b" : "#64748b"),
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && (
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: "0.875rem", 
                      fontWeight: isSelected ? 600 : 500,
                      fontFamily: "Poppins, sans-serif"
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
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
        elevation={0}
        sx={{
          width: "100%",
          bgcolor: appTheme === "light" ? "#4F46E5" : "#1e293b",
          zIndex: muiTheme.zIndex.drawer + 2,
          borderBottom: "1px solid",
          borderColor: appTheme === "light" ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
          transition: "background-color 0.3s ease",
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

            <h1 className="text-white text-xl font-bold tracking-wider flex items-center gap-1.5">
              Winden <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full uppercase font-medium">Admin</span>
            </h1>

            {!isMobile && (
              <ArrowRight
                size={22}
                className={`cursor-pointer transition-transform text-white/80 hover:text-white ${
                  isCollapsed ? "rotate-180" : ""
                }`}
                onClick={() => {
                  setIsCollapsed((p) => !p);
                  setControls((p) => !p);
                }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
            <IconButton color="inherit" onClick={toggleTheme} sx={{ p: 0.5, color: "rgba(255, 255, 255, 0.85)", "&:hover": { color: "#fff" } }}>
              {appTheme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </IconButton>

            <Bell size={20} className="text-white/80 hover:text-white cursor-pointer transition-colors" />

            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { borderColor: "#fff" }
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
              size={20}
              className="text-white/80 hover:text-white cursor-pointer transition-colors"
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
              bgcolor: appTheme === "light" ? "white" : "#1e293b",
              borderRadius: 2,
              boxShadow: 4,
              border: "1px solid",
              borderColor: appTheme === "light" ? "grey.250" : "grey.850",
              minWidth: 150,
              overflow: "hidden",
              zIndex: muiTheme.zIndex.appBar + 10,
            }}
          >
            <Box
              sx={{
                px: 3,
                py: 1.5,
                cursor: "pointer",
                color: appTheme === "light" ? "text.primary" : "#f1f5f9",
                fontFamily: "Poppins, sans-serif",
                fontSize: "0.875rem",
                fontWeight: 500,
                "&:hover": { bgcolor: appTheme === "light" ? "grey.100" : "grey.800" },
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
              border: "none",
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
              transition: muiTheme.transitions.create("width", {
                easing: muiTheme.transitions.easing.sharp,
                duration: muiTheme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
              position: "fixed",
              height: "calc(100% - 64px)",
              border: "none",
              zIndex: muiTheme.zIndex.drawer,
              bgcolor: appTheme === "light" ? "background.paper" : "#0f172a",
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
          width: "100%",
          mt: "18px",
          backgroundColor: appTheme === "light" ? "#F8FAFC" : "#020617",
          color: appTheme === "light" ? "#1e293b" : "#f1f5f9",
          minHeight: "calc(100vh - 64px)",
          boxSizing: "border-box",
          overflowX: "hidden",
          transition: "background-color 0.3s ease, color 0.3s ease",
        }}
        onClick={() => setShowDropdown(false)}
      >
        <Toolbar variant="dense" />
        <Box sx={{ p: { xs: 2, sm: 4 } }}>{children}</Box>
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