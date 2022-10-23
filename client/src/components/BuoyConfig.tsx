import { useContext, useState } from "react";
import "./buoyConfig.css";
import axios from "axios";
import { AppContext } from "../context";

type SensorForm = {
  name: string;
  format: string;
  threshold_low?: number;
  threshold_high?: number;
};

type LatLongForm = {
  lat: string;
  long: string;
};

type Props = {
  toggleVisible?: () => void;
};

const BuoyConfig: React.FC<Props> = ({ toggleVisible }) => {
  const initSensor: SensorForm = {
    name: "",
    format: "csv",
    threshold_high: 0,
    threshold_low: 0,
  };
  const initLatLong: LatLongForm = {
    lat: "0.0",
    long: "0.0",
  };
  const latLongRe = new RegExp("^[0-9]+.{0,1}[0-9]*$");
  const [buoyName, setBuoyName] = useState("");
  const [anchor, setAnchor] = useState<LatLongForm>(initLatLong);
  const [sensors, setSensors] = useState<SensorForm[]>([]);
  const [currentSensor, setCurrentSensor] = useState<SensorForm>(initSensor);
  const [errors, setErrors] = useState<string[]>([]);
  const context = useContext(AppContext);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (sensors.length === 0) {
      addError("There is no sensors!");
      return;
    }
    if (buoyName === "") {
      addError("The sensor needs a name!");
    }
    const sensorsPre = sensors;
    sensorsPre.forEach((sensor) => {
      sensor.name = buoyName + "_" + sensor.name;
    });
    await axios.post(
      import.meta.env.VITE_API_URL +
        `/project/${context.project.value?.name}/add/${buoyName}`
    );
    if (context.project.value?.name !== "all") {
      await axios.post(
        import.meta.env.VITE_API_URL + `/project/all/add/${buoyName}`
      );
    }
    axios
      .post(
        import.meta.env.VITE_API_URL + "/new_buoy",
        {
          name: buoyName,
          status: 0,
          warnings: [],
          anchor: { lat: Number(anchor.lat), long: Number(anchor.long) },
          sensors: sensorsPre,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((_res) => {
        context.fetchRequest.set("buoys");
        if (toggleVisible) toggleVisible();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cleanCurrentSensor = () => {
    setCurrentSensor(initSensor);
  };

  const handleAddSensor = (e: any) => {
    e.preventDefault();
    if (currentSensor.name && currentSensor.format) {
      let sensor: SensorForm = {
        name: currentSensor.name,
        format: currentSensor.format,
      };
      if (currentSensor.threshold_low) {
        sensor = {
          ...sensor,
          threshold_low: currentSensor.threshold_low,
        };
      }
      if (currentSensor.threshold_high) {
        sensor = {
          ...sensor,
          threshold_high: currentSensor.threshold_high,
        };
      }
      setSensors([...sensors, sensor]);
      setErrors([]);
      cleanCurrentSensor();
    } else {
      addError("Sensor are missing fields!");
    }
  };

  const updateBuoyName = (target: string) => {
    setBuoyName(target.replace(" ", "_").toLowerCase());
  };

  const updateAnchorLat = (target: string) => {
    if (latLongRe.test(target) || target === "") {
      setAnchor((current) => {
        return {
          ...current,
          lat: target,
        };
      });
    }
  };

  const updateAnchorLong = (target: string) => {
    setAnchor((current) => {
      return {
        ...current,
        long: target,
      };
    });
  };

  const updateSensorName = (target: string) => {
    setCurrentSensor((last) => {
      return {
        ...last,
        name: target.replace(" ", "_").toLowerCase(),
      };
    });
  };

  const updateSensorFormat = (target: string) => {
    setCurrentSensor((last) => {
      return {
        ...last,
        format: target,
      };
    });
  };

  const updateSensorThresholdLow = (target: number) => {
    setCurrentSensor((last) => {
      return {
        ...last,
        threshold_low: target,
      };
    });
  };

  const updateSensorThresholdHigh = (target: number) => {
    setCurrentSensor((last) => {
      return {
        ...last,
        threshold_high: target,
      };
    });
  };

  const addError = (err: string) => {
    if (!errors.includes(err)) {
      setErrors([...errors, err]);
    }
  };

  const handleDeleteSensor = (event: any, name: string) => {
    event.preventDefault();
    setSensors(sensors.filter((sensor) => sensor.name !== name));
  };

  return (
    <div className="form">
      <form className="buoy-form" onSubmit={handleSubmit}>
        <div className="name-input w-100">
          <input
            type="text"
            value={buoyName}
            placeholder="Name of buoy"
            onChange={(e) => updateBuoyName(e.target.value)}
            className="input input-text w-100"
            required
          />
        </div>
        <div className="anchor-input-group w-100">
          <div className="latlng w-45">
            <h4>Lat</h4>
            <input
              type="text"
              value={anchor.lat}
              placeholder="Latitude"
              onChange={(e) => updateAnchorLat(e.target.value)}
              className="input input-number w-100"
              required
            />
          </div>
          <div className="latlng w-45">
            <h4>Long</h4>
            <input
              type="text"
              value={anchor.long}
              placeholder="Longitude"
              onChange={(e) => updateAnchorLong(e.target.value)}
              className="input input-number w-100"
              required
            />
          </div>
        </div>
        {sensors.length !== 0 && (
          <>
            <h3 style={{ margin: "0" }}>Current Sensors</h3>
            <div className="current-sensors w-100">
              {sensors &&
                sensors.map((sensor, i) => {
                  return (
                    <div
                      className={"sensor-item" + (i > 1 ? " mt-5" : "")}
                      key={i}
                      onClick={(e) => handleDeleteSensor(e, sensor.name)}
                    >
                      <span>{sensor.name}</span>
                      <span>{sensor.format}</span>
                    </div>
                  );
                })}
            </div>
          </>
        )}
        <div className="sensor-input-group w-100">
          <div className="flex-group">
            <input
              type="text"
              value={currentSensor.name}
              placeholder="Name of sensor"
              onChange={(e) => updateSensorName(e.target.value)}
              className="input input-text w-45"
            />
            <select
              value={currentSensor.format || "csv"}
              onChange={(e) => updateSensorFormat(e.target.value)}
              className="input input-select w-45"
            >
              <option value="csv">CSV</option>
              <option value="mp4">MP4</option>
              <option value="metadata">Metadata</option>
            </select>
          </div>
          <div className="flex-group">
            <input
              type="number"
              value={
                currentSensor.threshold_low !== 0
                  ? currentSensor.threshold_low
                  : ""
              }
              placeholder="Threshold Low"
              onChange={(e) => updateSensorThresholdLow(Number(e.target.value))}
              className="input input-number w-45"
            />
            <input
              type="number"
              value={
                currentSensor.threshold_high !== 0
                  ? currentSensor.threshold_high
                  : ""
              }
              placeholder="Threshold High"
              onChange={(e) =>
                updateSensorThresholdHigh(Number(e.target.value))
              }
              className="input input-number w-45"
            />
          </div>
        </div>
        <button className="add-sensor w-30" onClick={handleAddSensor}>
          Add Sensor
        </button>
        {errors.length !== 0 &&
          errors.map((err, i) => {
            return (
              <div className="buoy-form-error" key={i}>
                {err}
              </div>
            );
          })}
        <button type="submit" className="submit-button w-50">
          Submit
        </button>
      </form>
    </div>
  );
};

export default BuoyConfig;
