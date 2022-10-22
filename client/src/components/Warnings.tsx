import { useEffect, useContext } from 'react';
import { AppContext } from '../context';
import { BuoySimple, Status } from '../types';
import { useNavigate } from 'react-router-dom';
import './warnings.css';
import { formatName } from '../utils';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export function ColoredCircle({ status }: { status: Status }) {
  const color = ['green', 'orange', 'red'][status];

  return <div className={'circle ' + color}></div>;
}

function WarningItem({ buoy }: { buoy: BuoySimple }) {
  const navigate = useNavigate();

  return (
    <div
      className="warning-item-container"
      onClick={() => navigate(`/buoy/${buoy.name}`)}
    >
      <div className="circle-container">
        <ColoredCircle status={buoy.status} />
      </div>

      <div className={'warning-item'}>
        <div>
          <strong>{formatName(buoy.name)}</strong>
        </div>
        {buoy.status > 0 && (
          <div className="sensor-warnings">
            <div>
              <strong>Warnings:</strong>
            </div>
            <ul>
              {buoy.warnings.map((warning, i) =>
                warning.rows.length > 0 ||
                warning.diffs.length > 0 ||
                warning.threshold.length > 0 ||
                warning.warning.length > 0 ? (
                  <li key={i}>{formatName(warning.name)}</li>
                ) : (
                  ''
                )
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function Warnings() {
  const context = useContext(AppContext);
  const [animate] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="warning-container" ref={animate}>
      {context.buoys.value.map((buoy, i) => {
        return <WarningItem key={i} buoy={buoy} />;
      })}
    </div>
  );
}

export default Warnings;
