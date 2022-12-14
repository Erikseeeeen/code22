import { useContext } from 'react';
import OverviewMap from '../components/OverviewMap';
import Warnings from '../components/Warnings';
import { AppContext } from '../context';
import './Overview.css';
import { formatName } from '../utils';
import './Overview.css';
import Loading from '../components/Loading';
import CustomPopup from '../components/CustomPopup';
import BuoyConfig from '../components/BuoyConfig';
import { FaPlus } from 'react-icons/fa';

function Overview() {
  const context = useContext(AppContext);

  if (!context.buoys.value) return <Loading />;
  return (
    <div className="overview-container">
      <OverviewMap />
      <h1>{formatName(context.project.value?.name ?? 'Loading..')}</h1>
      <Warnings />
      <div style={{ position: 'fixed', top: '50vh', left: 0 }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5em',
            margin: '2em',
          }}
        >
          <b>Projects</b>
          <br />
          {context.projects.value.map((project) => (
            <div
              className={
                'select-project ' +
                (project.name === context.project.value?.name
                  ? 'selected-project'
                  : '')
              }
              key={project.name}
              onClick={() => context.project.set(project)}
            >
              {formatName(project.name)}
            </div>
          ))}
        </div>
      </div>
      <CustomPopup
        trigger={
          <button className="btn-outline">
            <FaPlus /> Buoy
          </button>
        }
      >
        <BuoyConfig />
      </CustomPopup>
    </div>
  );
}

export default Overview;
