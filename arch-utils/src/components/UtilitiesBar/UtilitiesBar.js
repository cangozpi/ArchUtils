import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import "./UtilitiesBar.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* <Typography>{children}</Typography> */}
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  let [previouslyGeneratedFileState, setPreviouslyGeneratedFileState] =
    React.useState();

  function getPreviouslyGeneratedFileState() {
    return previouslyGeneratedFileState;
  }

  // =======================
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // handle window resizing
  let [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  React.useLayoutEffect(() => {
    window.addEventListener("resize", handleResize, false);
    return () => window.removeEventListener("resize", handleResize);
  }, [windowWidth]);

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          orientation={windowWidth <= 640 ? "vertical" : "horizontal"}
          className="tabs"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab className="tab" label="Convert dxf to svg" {...a11yProps(0)} />
          <Tab
            className="tab"
            label="Generate Displacement Map from svg"
            {...a11yProps(1)}
          />
          <Tab
            className="tab"
            label="Generate Mesh from Displacement Map"
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {/* Item One */}
        {/* {props.children[0]} */}
        {React.cloneElement(props.children[0], {
          handleChangeTabs: handleChange,
          setPreviouslyGeneratedFileState: setPreviouslyGeneratedFileState,
        })}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* Item Two */}
        {/* {props.children[1]} */}
        {React.cloneElement(props.children[1], {
          handleChangeTabs: handleChange,
          setPreviouslyGeneratedFileState: setPreviouslyGeneratedFileState,
          getPreviouslyGeneratedFileState: getPreviouslyGeneratedFileState,
        })}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {/* Item Three */}
        {props.children[2]}
      </TabPanel>
    </Box>
  );
}
