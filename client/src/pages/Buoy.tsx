import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ModuleContent from '../components/ModuleContent';
import { AppContext } from '../context';
import { useForceUpdate } from '../hooks/forceUpdate';
import { Row, Module, Buoy, ModuleType } from '../types';
import './Buoy.css';
import { FaPlus, FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import { formatName } from '../utils';
import Loading from '../components/Loading';

function BuoyPage() {
  const context = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [buoy, setBuoy] = useState<Buoy | null>(null);
  const [presets, setPresets] = useState<string[]>([]);
  const forceUpdate = useForceUpdate();
  const params = useParams();

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

  const savePreset = (name: string) => {
    axios.post(import.meta.env.VITE_API_URL + '/presets/' + name, {setup: context.rows.value});
  }

  const loadPreset = (name: string) => {
    axios.get(import.meta.env.VITE_API_URL + '/presets/' + name).then((response) => context.rows.set(response.data["setup"]));
  }

  const addModule = (row: Row) => {
    row.modules.push({
      id: getNewId(row.modules),
      type: ModuleType.None,
    });
    forceUpdate();
  };

  const removeModule = (row: Row, id: number) => {
    row.modules = row.modules.filter((m: Module) => m.id !== id);
    forceUpdate();
  };

  useEffect(() => {
    if (!params.name) return;
    axios
      .get(import.meta.env.VITE_API_URL + '/buoy/' + params.name)
      .then((res) => {
        setBuoy(res.data);
      });
  }, [params.name]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_API_URL + '/presets').then((response) => setPresets(response.data["presets"]));
  }, [])

  if (!buoy) return <Loading />;
  return (
    <div className="pageContainer">
      <Link to="/">Overview</Link>
      <h1>Buoy: {buoy && formatName(buoy.name)}</h1>
      <p>Status: {['Ok', 'Warning', 'Error'][buoy?.status ?? 0]}</p>
      <p>Sensors: {buoy?.sensors.length}</p>
      <p>Warnings: {JSON.stringify(buoy?.warnings)}</p>

      <button className="button" onClick={() => setEdit((edit) => !edit)}>
        {edit ? <FaEdit /> : <FaSave />}
        {edit ? 'Save' : 'Edit'}
      </button>
      <button className="button" onClick={() => savePreset("name")}>Save preset</button>
      <select onChange={(e) => loadPreset(e.target.value)}>
        {presets.map((preset: string) => <option label={preset}>{preset}</option>)}
      </select>
      <div className="col">
        {context.rows.value.map((row: Row) => (
          // Row
          <div className="row" key={row.id}>
            {edit && (
              <button
                className="button"
                onClick={() => removeRow(row.id)}
                style={{ position: 'absolute', zIndex: 1 }}
              >
                <FaTrash /> row
              </button>
            )}
            {row.modules.map((module: Module) => (
              // Module
              <div className="module" key={module.id}>
                {edit && (
                  <div className="module-edit">
                    <button
                      className="button"
                      onClick={() => removeModule(row, module.id)}
                      style={{ position: 'absolute', right: 0 }}
                    >
                      <FaTrash /> module
                    </button>
                  </div>
                )}
                <ModuleContent module={module} buoy={buoy} />
              </div>
            ))}
            {edit && (
              <button onClick={() => addModule(row)}>
                {' '}
                <FaPlus />
                module
              </button>
            )}
          </div>
        ))}
        {edit && (
          <button className="add-row" onClick={addRow}>
            <FaPlus /> row
          </button>
        )}
      </div>
    </div>
  );
}

export default BuoyPage;
