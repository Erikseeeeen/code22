import { useContext } from "react";
import ModuleContent from "./ModuleContent";
import { AppContext } from "../context";
import { useForceUpdate } from "../hooks/forceUpdate";
import { Row, Module, Buoy, ModuleType } from "../types";
import "./RowOfModules.css";
import {
  FaPlus,
  FaTrash,
  FaEdit,
  FaArrowLeft,
  FaArrowRight,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import Loading from "./Loading";
import { useAutoAnimate } from "@formkit/auto-animate/react";

function RowOfModules({
  buoy,
  row,
  edit,
  forceUpdate,
}: {
  buoy: Buoy;
  row: Row;
  edit: boolean;
  forceUpdate: () => void;
}) {
  const context = useContext(AppContext);
  const [moduleAnimate] = useAutoAnimate<HTMLDivElement>();

  const removeRow = (row: Row) => {
    context.rows.set((rows: Row[]) => rows.filter((r) => r.id !== row.id));
  };

  const getNewId = (items: Row[] | Module[]) =>
    1 + Math.max(-1, ...items.map((row) => row.id));

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

  if (!buoy) return <Loading />;
  return (
    // Row
    <div className="row" key={row.id} ref={moduleAnimate}>
      {row.modules.map((module: Module) => (
        // Module
        <div className="module" key={"module" + module.id}>
          {edit && (
            <div className="module-edit">
              <button
                onClick={() => removeModule(row, module)}
                style={{ position: "absolute", right: 0 }}
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={() => editModule(row, module)}
                style={{ position: "absolute", left: 0 }}
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => moveItem(row.modules, module, -1)}
                style={{ position: "absolute", left: 0, bottom: 0 }}
              >
                <FaArrowLeft /> Move
              </button>
              <button
                onClick={() => moveItem(row.modules, module, 1)}
                style={{ position: "absolute", right: 0, bottom: 0 }}
              >
                Move <FaArrowRight />
              </button>
            </div>
          )}
          <ModuleContent module={module} buoy={buoy} />
        </div>
      ))}
      {edit && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={() => addModule(row)}>
            {" "}
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
  );
}

export default RowOfModules;
