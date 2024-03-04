import React, { useContext, useEffect, useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MoreIcon from "@mui/icons-material/MoreVert";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MyContext } from "../../MyContext";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function NavBar({
  handleDrawerToggle,
  setData,
  originalData,
  showSearchAndDrawer,
}) {
  const { itemCount } = useContext(MyContext);
  const [totalItemCount, setTotalItemCount] = itemCount;
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Function to handle search input change
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filterDataBySearch = () => {
    // Convert searchQuery to lowercase for case-insensitive search
    let query = searchQuery.toLowerCase();
    if (showSearchAndDrawer) {
      // Filter the data array based on the search query
      const filteredData = originalData.filter((item) => {
        // Convert title and description to lowercase for case-insensitive search
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();

        // Check if the title or description contains the search query
        return title.includes(query) || description.includes(query);
      });
      setData(filteredData);
    }
  };

  useEffect(() => {
    if (searchQuery === "" && showSearchAndDrawer) setData(originalData);
    else filterDataBySearch();
  }, [searchQuery]);

  const getTotalItemCount = async (user_id) => {
    if (!user_id) return;
    try {
      const cartItemQuery = query(
        collection(db, "cartItems"),
        where("user_id", "==", user_id)
      );

      const querySnapshot = await getDocs(cartItemQuery);

      let totalCount = 0;

      querySnapshot.forEach((doc) => {
        const cartItemData = doc.data();
        totalCount += cartItemData.count;
      });
      setTotalItemCount(totalCount);
    } catch (error) {
      console.error("Error calculating total item count:", error);
    }
  };

  useEffect(() => {
    // getting currently loggedin user details from firebase.
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // user is not logged in.
        setCurrentUser(null);
      }
    });
  }, []);

  useEffect(() => {
    getTotalItemCount(currentUser?.uid);
  }, [currentUser]);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("sign out successfully");
      })
      .catch((error) => console.log(error));
  };

  const handleSignIn = () => {
    navigate("/sign-in");
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {currentUser && (
        <MenuItem>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>{currentUser?.displayName}</p>
        </MenuItem>
      )}
      <MenuItem
        onClick={() => {
          if (currentUser) navigate("/my-cart");
          else navigate("/sign-up");
        }}
      >
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          {currentUser ? (
            <Badge
              badgeContent={totalItemCount ? totalItemCount : 0}
              color="error"
            >
              <ShoppingCartCheckoutIcon />
            </Badge>
          ) : (
            <AppRegistrationIcon />
          )}
        </IconButton>
        <p>{currentUser ? "MyCart" : "SignUp"}</p>
      </MenuItem>
      <MenuItem onClick={currentUser ? userSignOut : handleSignIn}>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          {currentUser ? <LogoutIcon /> : <LoginIcon />}
        </IconButton>
        <p>{currentUser ? "SignOut" : "SignIn"}</p>
      </MenuItem>
    </Menu>
  );

  const renderMobileSearch = (
    <Search
      sx={{
        display: { lg: "none", md: "block", sm: "block", xs: "block" },
        marginLeft: { xs: "1.5rem", sm: "1.7rem" },
        marginBottom: "1rem",
        maxWidth: "90%",
      }}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
        onChange={handleSearchInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            filterDataBySearch();
          }
        }}
      />
    </Search>
  );

  const renderWebSearch = (
    <Search
      sx={{
        display: { lg: "block", md: "none", sm: "none", xs: "none" },
        minWidth: "50%",
        marginLeft: "200",
      }}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        value={searchQuery}
        onChange={handleSearchInputChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            filterDataBySearch();
          }
        }}
      />
    </Search>
  );

  return (
    <Box className="sticky" sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          {showSearchAndDrawer && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            noWrap
            component="div"
            onClick={() => navigate("/")}
            sx={{ display: { sm: "block", cursor: "pointer" } }}
          >
            Fashion Up
          </Typography>
          <Box sx={{ flexGrow: 0.5 }} />
          {showSearchAndDrawer && renderWebSearch}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={currentUser ? userSignOut : handleSignIn}
            >
              {currentUser ? (
                <>
                  <LogoutIcon />
                  <Typography variant="h6">SignOut</Typography>
                </>
              ) : (
                <>
                  <LoginIcon />
                  <Typography variant="h6">SignIn</Typography>
                </>
              )}
            </IconButton>
            <IconButton
              sx={{ marginLeft: "2rem" }}
              size="large"
              aria-label="show 4 new mails"
              color="inherit"
              onClick={() => {
                if (currentUser) navigate("/my-cart");
                else navigate("/sign-up");
              }}
            >
              {currentUser ? (
                <>
                  <Badge
                    badgeContent={totalItemCount ? totalItemCount : 0}
                    color="error"
                  >
                    <ShoppingCartCheckoutIcon />
                  </Badge>
                  <Typography variant="h6">MyCart</Typography>
                </>
              ) : (
                <>
                  <AppRegistrationIcon />
                  <Typography variant="h6">SignUp</Typography>
                </>
              )}
            </IconButton>
            {currentUser && (
              <IconButton
                sx={{ marginLeft: "2rem" }}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
                <Typography variant="h6">{currentUser?.displayName}</Typography>
              </IconButton>
            )}
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
        {showSearchAndDrawer && renderMobileSearch}
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}

export default NavBar;
