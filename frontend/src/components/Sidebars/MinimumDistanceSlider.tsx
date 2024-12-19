import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const minDistance = 20;
const maxForMinThumb = 130; // Maximum value the minimum thumb can reach

interface MinimumDistanceSliderProps {
  onPriceChange: (priceRange: number[]) => void; // Callback for price range changes
  priceRange: number[]; // Initial price range
}

export default function MinimumDistanceSlider({
  onPriceChange,
  priceRange,
}: MinimumDistanceSliderProps) {
  const [value, setValue] = React.useState<number[]>(priceRange);

  // Handle changes while dragging the slider
  const handleChange = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    if (!Array.isArray(newValue)) return;

    let updatedValue = [...value];
    if (activeThumb === 0) {
      // Adjust minimum thumb with minDistance constraint and max limit
      updatedValue = [
        Math.min(newValue[0], Math.min(value[1] - minDistance, maxForMinThumb)),
        value[1],
      ];
    } else {
      // Adjust maximum thumb with minDistance constraint and interpret 150 as Infinity
      const maxValue = newValue[1] === 150 ? Infinity : newValue[1];
      updatedValue = [
        value[0],
        Math.max(maxValue, value[0] + minDistance), // Ensure max respects minDistance from min
      ];
    }

    setValue(updatedValue);
  };

  // Handle committed changes (when the user stops interacting with the slider)
  const handleChangeCommitted = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    if (!Array.isArray(newValue)) return;

    // Enforce constraints on commit
    const adjustedValue = [
      Math.min(newValue[0], Math.min(value[1] - minDistance, maxForMinThumb)), // Ensure min respects minDistance and maxForMinThumb
      newValue[1] === 150 ? Infinity : Math.max(newValue[1], value[0] + minDistance), // Interpret 150 as Infinity
    ];

    setValue(adjustedValue); // Update state
    onPriceChange(adjustedValue); // Trigger callback with adjusted values
  };

  return (
    <Box sx={{ width: 200 }}>
      <h3 className="text-black font-normal text-sm">Set Price Range</h3>
      <Slider
        sx={{
          color: "#CCD5AE",
          "& .MuiSlider-thumb": {
            backgroundColor: "#7F6145",
            borderRadius: "0px",
            width: 14,
            height: 14,
            "&::after": { display: "none" },
            "&:hover": { backgroundColor: "#7F6145", boxShadow: "none" },
            "&:focus, &:focus-visible": { outline: "none", boxShadow: "none" },
            "&.Mui-active": { boxShadow: "none" },
            "&:not(:hover):not(:active)": { boxShadow: "none" },
          },
          "& .MuiSlider-track": { backgroundColor: "#CCD5AE", height: 8 },
          "& .MuiSlider-rail": {
            opacity: 0.7,
            height: 8,
            backgroundColor: "#D4A373",
          },
        }}
        value={[
          value[0],
          value[1] === Infinity ? 150 : value[1], // Display 150 for Infinity in the slider
        ]}
        min={0}
        max={150}
        step={10}
        onChange={handleChange} // Updates state while dragging
        onChangeCommitted={handleChangeCommitted} // Fires only on release
        valueLabelDisplay="off"
        disableSwap
      />
      <div className="flex justify-between mt-0 -mt-2 -mx-2 text-black font-normal text-sm">
        <span>${value[0]}</span>
        <span>{value[1] === Infinity ? "$150+" : `$${value[1]}`}</span>
      </div>
    </Box>
  );
}