import { Module, ModuleType } from '../types';
import './EditModulePopup.css';

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

export default function EditModulePopup({
  module,
  close,
}: {
  module: Module;
  close: () => void;
}) {
  const types: string[] = enumKeys(ModuleType);

  const setType = (type: ModuleType) => {
    module.type = type;
    close();
  };

  return (
    <div className="popup-card-container">
      <div className="popup-card">
        <b>Select a module type</b>
        <br />
        <br />
        <div className="select-type-container">
          {types.map((type: string, i: ModuleType) => (
            <div className="select-type" onClick={() => setType(i)} key={i}>
              {type}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
