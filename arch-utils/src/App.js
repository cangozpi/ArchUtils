import "./App.css";
import Banner from "./components/Banner/Banner";
import Svg2DispMap from "./components/Svg2DispMap/Svg2DispMap";

function App() {
  let title = "ArchUtils";
  return (
    <div className="App">
      <Banner title={title}></Banner>
      <Svg2DispMap></Svg2DispMap>
      {/* <UtilitiesBar></UtilitiesBar>
      <DisplayedContent></DisplayedContent>       */}
    </div>
  );
}

export default App;
