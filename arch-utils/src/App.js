import "./App.css";
import Banner from "./components/Banner/Banner";
import Svg2DispMap from "./components/Svg2DispMap/Svg2DispMap";
import RenderDispMapMesh from "./components/RenderDispMapMesh/RenderDispMapMesh";
import UtilitiesBar from "./components/UtilitiesBar/UtilitiesBar";

let renderSvg2HeightMap = false;
let renderDispMapMesh = false;

function App() {
  let title = "ArchUtils";
  return (
    <div className="App">
      <Banner title={title}></Banner>
      {renderSvg2HeightMap && <Svg2DispMap></Svg2DispMap>}
      {renderDispMapMesh && <RenderDispMapMesh></RenderDispMapMesh>}
      <UtilitiesBar>
        <>Yet To Be Implemented ...</>
        <Svg2DispMap></Svg2DispMap>
        <RenderDispMapMesh></RenderDispMapMesh>
      </UtilitiesBar>
      {/* <DisplayedContent></DisplayedContent>       */}
    </div>
  );
}

export default App;
