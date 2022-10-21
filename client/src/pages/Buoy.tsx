import { useContext, useState } from 'react';
import ModuleContent from '../components/ModuleContent';
import { AppContext } from '../context';
import { useForceUpdate } from '../hooks/forceUpdate';
import { Row, Module } from '../types';
import './Buoy.css';

function Buoy() {
  const context = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const forceUpdate = useForceUpdate();

  const removeRow = (id: number) => {
    context.rows.set((rows: Row[]) => rows.filter((row) => row.id !== id));
  };

  const getNewId = (items: Row[] | Module[]) =>
    1 + Math.max(-1, ...items.map((row) => row.id));

  const addRow = () => {
    context.rows.set((rows: Row[]) => [
      ...rows,
      {
        id: getNewId(rows),
        modules: [],
      },
    ]);
  };

  const addModule = (row: Row) => {
    row.modules.push({
      id: getNewId(row.modules),
    });
    forceUpdate();
  };

  const removeModule = (row: Row, id: number) => {
    row.modules = row.modules.filter((m: Module) => m.id !== id);
    forceUpdate();
  };

  return (
    <div>
      <h1>Buoy</h1>
      <button onClick={() => setEdit((edit) => !edit)}>
        {edit ? 'Save' : 'Edit'}
      </button>
      <div className="col">
        {context.rows.value.map((row: Row) => (
          // Row
          <div className="row" key={row.id}>
            {edit && (
              <button
                onClick={() => removeRow(row.id)}
                style={{ position: 'absolute', zIndex: 1 }}
              >
                X row
              </button>
            )}
            {row.modules.map((module: Module) => (
              // Module
              <div className="module" key={module.id}>
                {edit && (
                  <button
                    onClick={() => removeModule(row, module.id)}
                    style={{ position: 'absolute', right: 0 }}
                  >
                    X module
                  </button>
                )}
                <ModuleContent />
              </div>
            ))}
            {edit && <button onClick={() => addModule(row)}>Add module</button>}
          </div>
        ))}
        {edit && <button onClick={addRow}>Add row</button>}
      </div>
    </div>
  );
}

export default Buoy;
