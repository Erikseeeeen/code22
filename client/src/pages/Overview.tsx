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

function Overview() {
  const context = useContext(AppContext);

  if (!context.buoys.value) return <Loading />;
  return (
    <div className="overview-container">
      <OverviewMap />
      <h1>{formatName(context.project.value?.name ?? 'Loading..')}</h1>
      <h2>{context.project.value?.preset}</h2>
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
          <button className="add-buoy">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                fill="currentColor"
                className="bi bi-plus-lg"
                viewBox="0 0 16 16"
                display="block"
              >
                <path
                  fillRule="evenodd"
                  d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                />
              </svg>
            </div>
          </button>
        }
      >
        <BuoyConfig />
      </CustomPopup>
    </div>
  );
}

export default Overview;
