import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";

function valuetext(value) {
  return `$${value}`;
}

export default function RangeSlider({ setMinValue, setMaxValue, sliderRange }) {
  const [value, setValue] = useState([sliderRange[0], sliderRange[1]]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setMinValue(value[0]);
    setMaxValue(value[1]);
  }, [value]);

  return (
    <Box sx={{ width: 205, marginBottom: "4rem" }}>
      <Typography ml={6} mt={4} mb={2} variant="h6" gutterBottom>
        Set price range
      </Typography>
      <Slider
        getAriaLabel={() => "Price range"}
        value={value}
        min={sliderRange[0]}
        max={sliderRange[1]}
        onChange={handleChange}
        valueLabelDisplay="auto"
        sx={{ marginLeft: "1rem" }}
        getAriaValueText={valuetext}
      />
      <div className="flex">
        <Typography ml={6} mt={4} mb={2} variant="h8" gutterBottom>
          {valuetext(value[0])}
        </Typography>
        <Typography ml={3} mt={4} mb={2} variant="h8" gutterBottom>
          --
        </Typography>
        <Typography ml={3} mt={4} mb={2} variant="h8" gutterBottom>
          {valuetext(value[1])}
        </Typography>
      </div>
    </Box>
  );
}
