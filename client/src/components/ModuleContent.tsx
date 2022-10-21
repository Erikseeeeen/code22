import { Module, ModuleType } from '../types';
import './ModuleContent.css';
import Three from './three/Three';

function ModuleContent({ module }: { module: Module }) {
  if (module.type === ModuleType.Three) {
    return (
      <div className="moduleContent">
        <Three />
      </div>
    );
  }
  return (
    <div className="moduleContent">
      <h1>Module</h1>
    </div>
  );
}

export default ModuleContent;
