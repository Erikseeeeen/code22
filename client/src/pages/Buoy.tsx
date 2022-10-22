import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ModuleContent from '../components/ModuleContent';
import { AppContext } from '../context';
import { useForceUpdate } from '../hooks/forceUpdate';
import { Row, Module, Buoy, ModuleType } from '../types';
import './Buoy.css';
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
} from 'react-icons/fa';
import { formatName } from '../utils';
import Loading from '../components/Loading';
import { ColoredCircle } from '../components/Warnings';

function BuoyPage() {
  const context = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [buoy, setBuoy] = useState<Buoy | null>(null);
  const [presets, setPresets] = useState<string[]>([]);
  const forceUpdate = useForceUpdate();
  const params = useParams();
  const navigate = useNavigate();

  const removeRow = (row: Row) => {
    context.rows.set((rows: Row[]) => rows.filter((r) => r.id !== row.id));
  };

  const getNewId = (items: Row[] | Module[]) =>
    1 + Math.max(-1, ...items.map((row) => row.id));

  const addRow = () => {
    context.rows.set((rows: Row[]) => [
      ...rows,
      {
        id: getNewId(rows),
        modules: [
          {
            id: 0,
            type: ModuleType.None,
          },
        ],
      },
    ]);
  };

  const savePreset = (name: string) => {
    axios.post(import.meta.env.VITE_API_URL + '/presets/' + name, {
      setup: context.rows.value,
    });
  };

  const loadPreset = (name: string) => {
    axios
      .get(import.meta.env.VITE_API_URL + '/presets/' + name)
      .then((response) => context.rows.set(response.data['setup']));
  };

  const addModule = (row: Row) => {
    row.modules.push({
      id: getNewId(row.modules),
      type: ModuleType.None,
    });
    forceUpdate();
  };

  const removeModule = (row: Row, module: Module) => {
    row.modules = row.modules.filter((m: Module) => m.id !== module.id);
    if (row.modules.length == 0) {
      removeRow(row);
    }
    forceUpdate();
  };

  const editModule = (row: Row, module: Module) => {};
  const moveItem = (list: any[], item: any, offset: number) => {
    const index = list.indexOf(item);
    if (index !== -1) {
      const otherIndex = (index + offset + list.length) % list.length;
      [list[index], list[otherIndex]] = [list[otherIndex], list[index]];
      forceUpdate();
    }
  };
  const moveRow = (
    rows: { value: Row[]; set: (list: any[]) => void },
    item: any,
    offset: number
  ) => {
    const list = rows.value;
    moveItem(list, item, offset);
    rows.set(list);
  };

  const toggleEdit = () => {
    setEdit((edit) => !edit);
    savePreset(prompt() ?? 'name');
  };

  const navigateBuoy = (offset: number) => {
    if (!buoy) return;
    const index = context.buoys.value.findIndex((b) => b.name === buoy.name);
    if (index == -1) return;
    const nextIndex =
      (index + offset + context.buoys.value.length) %
      context.buoys.value.length;
    console.log(index, nextIndex);
    const nextBuoy = context.buoys.value[nextIndex];
    navigate('/buoy/' + nextBuoy.name);
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
    axios
      .get(import.meta.env.VITE_API_URL + '/presets')
      .then((response) => setPresets(response.data['presets']));
  }, []);

  if (!buoy) return <Loading />;
  return (
    <div className="pageContainer">
      <Link to="/">Overview</Link>
      <div
        style={{
          margin: 'auto',
          width: '50vw',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1em',
        }}
      >
        <button onClick={() => navigateBuoy(-1)}>
          <FaArrowLeft />
        </button>
        <ColoredCircle status={buoy.status} />
        <h1>{formatName(buoy.name)}</h1>
        <button onClick={() => navigateBuoy(1)}>
          <FaArrowRight />
        </button>
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'start',
        }}
      >
        <button onClick={toggleEdit}>
          {edit ? <FaEdit /> : <FaSave />}
          {edit ? 'Save' : 'Edit'}
        </button>
        {edit && (
          <div>
            <span>Change preset: </span>
            <select onChange={(e) => loadPreset(e.target.value)}>
              {presets.map((preset: string) => (
                <option label={preset} key={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="col">
        {context.rows.value.map((row: Row) => (
          // Row
          <div className="row" key={row.id}>
            {row.modules.map((module: Module) => (
              // Module
              <div className="module" key={module.id}>
                {edit && (
                  <div className="module-edit">
                    <button
                      onClick={() => removeModule(row, module)}
                      style={{ position: 'absolute', right: 0 }}
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() => editModule(row, module)}
                      style={{ position: 'absolute', left: 0 }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => moveItem(row.modules, module, -1)}
                      style={{ position: 'absolute', left: 0, bottom: 0 }}
                    >
                      <FaArrowLeft /> Move
                    </button>
                    <button
                      onClick={() => moveItem(row.modules, module, 1)}
                      style={{ position: 'absolute', right: 0, bottom: 0 }}
                    >
                      Move <FaArrowRight />
                    </button>
                  </div>
                )}
                <ModuleContent module={module} key={module.type} buoy={buoy} />
              </div>
            ))}
            {edit && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button onClick={() => addModule(row)}>
                  {' '}
                  <FaPlus />
                  Module
                </button>
                <button onClick={() => removeRow(row)}>
                  <FaTrash /> Row
                </button>
                <button onClick={() => moveRow(context.rows, row, -1)}>
                  <FaArrowUp /> Move
                </button>
                <button onClick={() => moveRow(context.rows, row, 1)}>
                  <FaArrowDown /> Move
                </button>
              </div>
            )}
          </div>
        ))}
        {edit && (
          <button onClick={addRow}>
            <FaPlus /> Row
          </button>
        )}
      </div>
    </div>
  );
}

export default BuoyPage;
