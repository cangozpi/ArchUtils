import "./App.css";
import Banner from "./components/Banner/Banner";
import Svg2DispMap from "./components/Svg2DispMap/Svg2DispMap";
import RenderDispMapMesh from "./components/RenderDispMapMesh/RenderDispMapMesh";
import UtilitiesBar from "./components/UtilitiesBar/UtilitiesBar";
import Dxf2Svg from "./components/Dxf2Svg/Dxf2Svg";
import UserTutorial from "./components/UserTutorial/UserTutorial";
import { useEffect, useState } from "react";

function App() {
  let title = "ArchUtils";
  let [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    let stored_showTutorial = JSON.parse(
      window.localStorage.getItem("showTutorial")
    );
    if (stored_showTutorial != null) {
      setShowTutorial(stored_showTutorial);
    }
  }, []);

  return (
    <div className="App">
      {showTutorial && (
        <UserTutorial
          showTutorial={showTutorial}
          setShowTutorial={setShowTutorial}
        ></UserTutorial>
      )}
      <Banner
        showTutorial={showTutorial}
        setShowTutorial={setShowTutorial}
        title={title}
      ></Banner>
      <UtilitiesBar>
        <Dxf2Svg></Dxf2Svg>
        <Svg2DispMap></Svg2DispMap>
        <RenderDispMapMesh></RenderDispMapMesh>
      </UtilitiesBar>
    </div>
  );
}

export default App;
