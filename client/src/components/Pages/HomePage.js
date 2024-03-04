import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import NavBar from "../NavBar/NavBar";
import DialogCard from "../ProductCard/DialogCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import axios from "axios";
import { Typography } from "@mui/material";
import ItemNotFound from "./ItemNotFound";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import RangeSlider from "../RangeSlider/RangeSlider";
import { priceRanges } from "../../data/priceRanges";
import PageLoader from "../PageLoader/PageLoader";

const drawerWidth = 240;

function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [sliderRange, setSliderRange] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API);
      setOriginalData(response.data);
      setData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
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
    if (originalData.length > 0) {
      let min = Infinity,
        max = 0;

      originalData.forEach((item) => {
        const itemPrice = parseFloat(item.price);
        if (itemPrice < min) {
          min = itemPrice;
        }
        if (itemPrice > max) {
          max = itemPrice;
        }
      });
      setSliderRange([min, max]);
    }
  }, [originalData]);

  useEffect(() => {
    // This effect will trigger whenever minValue or maxValue changes
    if (minValue !== "" && maxValue !== "") filterDataByPrice();
    else setData(originalData);
  }, [minValue, maxValue]);

  const filterDataByPrice = () => {
    // Filter the data array based on the price range
    setData([]);
    const filteredData = originalData.filter((item) => {
      const itemPrice = parseFloat(item.price); // Assuming there's a 'price' property in your item object
      return itemPrice >= minValue && itemPrice <= maxValue;
    });
    setData(filteredData);
  };

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };
  const handleClick = (text) => {
    let newMinValue, newMaxValue;

    if (text.startsWith("All")) {
      newMinValue = 0;
      newMaxValue = Infinity;
    } else if (text.startsWith("Under")) {
      newMinValue = 0;
      newMaxValue = parseInt(text.replace("Under-$", ""));
    } else if (text.startsWith("Over")) {
      newMinValue = parseInt(text.replace("Over - $", ""));
      newMaxValue = Infinity;
    } else {
      const values = text.split(" - ");
      newMinValue = parseInt(values[0].replace("$", ""));
      newMaxValue = parseInt(values[1].replace("$", ""));
    }

    // Update state using the state updater function form
    setMinValue(newMinValue);
    setMaxValue(newMaxValue);

    if (mobileOpen) setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <Typography ml={8} variant="h6" gutterBottom>
        Price range
      </Typography>
      <List>
        {priceRanges?.map((price, index) => (
          <ListItem
            onClick={() => handleClick(price)}
            key={index}
            disablePadding
          >
            <ListItemButton>
              <ListItemIcon>
                <AttachMoneyIcon />
              </ListItemIcon>
              <ListItemText primary={price} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      {sliderRange.length > 0 && (
        <RangeSlider
          setMinValue={setMinValue}
          setMaxValue={setMaxValue}
          sliderRange={sliderRange}
        />
      )}
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <NavBar
        setData={setData}
        data={data}
        handleDrawerToggle={handleDrawerToggle}
        originalData={originalData}
        showSearchAndDrawer={true}
      />

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              marginTop: {
                lg: "4.1rem",
                md: "7.5rem",
                sm: "7.5rem",
                xs: "7.5rem",
              },
              zIndex: "1",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <div className="mt-28 justify-center items-center grid 2xl:grid-cols-4 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 x2l:gap-6 xl:gap-5 lg:gap-4 md:gap-3 sm:gap-2 ">
          {data?.map((productData) => (
            <DialogCard
              key={productData.id}
              user_id={currentUser?.uid}
              data={productData}
            />
          ))}
        </div>
        {loading ? (
          <PageLoader />
        ) : (
          data.length === 0 && <ItemNotFound />
        )}
      </Box>
    </Box>
  );
}

export default HomePage;
