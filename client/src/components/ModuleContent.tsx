import { Buoy, Module, ModuleType } from "../types";
import "./ModuleContent.css";
import ThreeScene from "./three/ThreeScene";
import GraphModule from "./GraphModule";
import VideoModule from "./VideoModule";
import MapModule from "./MapModule";
import HealthModule from "./HealthModule";
import SonarModule from "./SonarModule";
import Sonar2DModule from "./Sonar2DModule";
import MerdeModule from "./MerdeModule";

function ModuleContent({ module, buoy }: { module: Module; buoy: Buoy }) {
  if (module.type === ModuleType.Three) {
    return (
      <div className="moduleContent">
        <ThreeScene buoy={buoy} />
      </div>
    );
  } else if (module.type === ModuleType.Chart && buoy.sensors.length > 0) {
    return <GraphModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Video) {
    return <VideoModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Map) {
    console.log("inside map");

    return <MapModule buoy={buoy} />;
  } else if (module.type === ModuleType.Health) {
    return <HealthModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Merde) {
    return <MerdeModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Sonar) {
    return <SonarModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Sonar2D) {
    console.log("Inside sonar2d");

    return <Sonar2DModule buoy={buoy} />;
  } else {
    return (
      <div className="moduleContent">
        <h2 style={{ textAlign: "center", padding: "2em" }}>no data</h2>
      </div>
    );
  }
}

export default ModuleContent;
