import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context';
import { useForceUpdate } from '../hooks/forceUpdate';
import { Row, Module, Buoy, ModuleType } from '../types';
import './Buoy.css';
import {
  FaPlus,
  FaEdit,
  FaSave,
  FaArrowLeft,
  FaArrowRight,
} from 'react-icons/fa';
import { formatName } from '../utils';
import Loading from '../components/Loading';
import { ColoredCircle } from '../components/Warnings';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import RowOfModules from '../components/RowOfModules';

function BuoyPage() {
  const context = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [buoy, setBuoy] = useState<Buoy | null>(null);
  const [presets, setPresets] = useState<string[]>([]);
  const [currentPreset, setCurrentPreset] = useState('default');
  const params = useParams();
  const navigate = useNavigate();
  const [rowAnimate] = useAutoAnimate<HTMLDivElement>();
  const forceUpdate = useForceUpdate();

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

  const savePreset = (name: string) =>
    axios.post(import.meta.env.VITE_API_URL + '/presets/' + name, {
      setup: context.rows.value,
    });

  const loadPreset = async (name: string) => {
    setCurrentPreset(name);
    const response = await axios.get(
      import.meta.env.VITE_API_URL + '/presets/' + name
    );
    return context.rows.set(response.data['setup']);
  };

  const newPreset = async () => {
    const name = prompt();
    if (!name) return;
    setCurrentPreset(name);
    await savePreset(name);
    await loadAllPresets();
    await loadPreset(name);
  };

  const toggleEdit = () => {
    if (edit) {
      savePreset(currentPreset);
    }
    setEdit((edit) => !edit);
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

  const loadAllPresets = () =>
    axios
      .get(import.meta.env.VITE_API_URL + '/presets')
      .then((response) => setPresets(response.data['presets']));

  useEffect(() => {
    loadAllPresets();
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
        <h1 className="buoyName">{formatName(buoy.name)}</h1>
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
            <select
              value={currentPreset}
              onChange={(e) => loadPreset(e.target.value)}
            >
              {presets.map((preset: string) => (
                <option label={preset} key={preset}>
                  {preset}
                </option>
              ))}
            </select>
            <button onClick={newPreset}>
              <FaPlus /> Copy this preset
            </button>
          </div>
        )}
      </div>
      <div className="col" ref={rowAnimate}>
        {context.rows.value.map((row: Row) => (
          // Row
          <RowOfModules
            buoy={buoy}
            row={row}
            edit={edit}
            forceUpdate={forceUpdate}
            key={'row' + row.id}
          />
        ))}
        {edit && (
          <button onClick={addRow} key="addRowButton">
            <FaPlus /> Row
          </button>
        )}
      </div>
    </div>
  );
}

export default BuoyPage;
