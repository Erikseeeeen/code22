import { Buoy, Module, ModuleType } from '../types';
import './ModuleContent.css';
import Three from './three/Three';
import GraphModule from './GraphModule';
import VideoModule from './VideoModule';
import MapModule from './MapModule';

function ModuleContent({ module, buoy }: { module: Module; buoy: Buoy }) {
  if (module.type === ModuleType.Three) {
    return (
      <div className="moduleContent">
        <Three />
      </div>
    );
  } else if (module.type === ModuleType.Chart && buoy.sensors.length > 0) {
    return <GraphModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Video) {
    return <VideoModule module={module} buoy={buoy} />;
  } else if (module.type === ModuleType.Map) {
    return <MapModule buoy={buoy} />;
  } else {
    return (
      <div className="moduleContent">
        <h2 style={{ textAlign: 'center', padding: '2em' }}>no data</h2>
      </div>
    );
  }
}

export default ModuleContent;
