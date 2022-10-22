import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ModuleContent from "../components/ModuleContent";
import { AppContext } from "../context";
import { useForceUpdate } from "../hooks/forceUpdate";
import { Row, Module, Buoy, ModuleType } from "../types";
import "./Buoy.css";
import { FaPlus, FaTrash, FaEdit, FaSave } from "react-icons/fa";
import { formatName } from "../utils";

function BuoyPage() {
  const context = useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [buoy, setBuoy] = useState<Buoy | null>(null);
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
      .get(import.meta.env.VITE_API_URL + "/buoy/update/" + params.name)
      .then((res) => {
        setBuoy(res.data);
      });
  }, [params.name]);

  return (
    <div className="pageContainer">
      <Link to="/">Overview</Link>
      <h1>Buoy: {formatName(buoy!.name)}</h1>
      <p>Status: {["Ok", "Warning", "Error"][buoy?.status ?? 0]}</p>
      <p>Sensors: {buoy?.sensors.length}</p>
      <p>Warnings: {JSON.stringify(buoy?.warnings)}</p>

      <button className="button" onClick={() => setEdit((edit) => !edit)}>
        {edit ? <FaEdit /> : <FaSave />}
        {edit ? "Save" : "Edit"}
      </button>
      <div className="col">
        {context.rows.value.map((row: Row) => (
          // Row
          <div className="row" key={row.id}>
            {edit && (
              <button
                className="button"
                onClick={() => removeRow(row.id)}
                style={{ position: "absolute", zIndex: 1 }}
              >
                <FaTrash /> row
              </button>
            )}
            {row.modules.map((module: Module) => (
              // Module
              <div className="module" key={module.id}>
                {edit && (
                  <button
                    className="button"
                    onClick={() => removeModule(row, module.id)}
                    style={{ position: "absolute", right: 0 }}
                  >
                    <FaTrash /> module
                  </button>
                )}
                {buoy && <ModuleContent module={module} buoy={buoy} />}
              </div>
            ))}
            {edit && (
              <button onClick={() => addModule(row)}>
                {" "}
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
