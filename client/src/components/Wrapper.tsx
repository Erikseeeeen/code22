import axios from "axios";
import { useContext, useEffect } from "react";
import { AppContext } from "../context";
import { Buoy, Project } from "../types";

const Wrapper = ({ children }: { children: JSX.Element }) => {
  const context = useContext(AppContext);

  const fetchProjects = async () => {
    let projects: Project[] = [];
    await axios.get(import.meta.env.VITE_API_URL + "/projects").then((res) => {
      for (const project of res.data) {
        if (!project.preset) {
          project.preset = "default";
        }
      }
      projects = res.data;
    });

    if (projects.length == 0) return;
    let project: Project = projects[0];
    const url = window.location.href;
    if (url.includes("/buoy/")) {
      const buoyName = url.split("/buoy/")[1];
      const p = projects.find(
        (p) => p.buoyNames.includes(buoyName) && p.name !== "all"
      );
      if (p) {
        project = p;
      }
    }
    context.projects.set(projects);
    context.project.set(project);
  };

  const fetchBuoys = async () => {
    if (!context.project.value) return;
    await axios
      .get(
        import.meta.env.VITE_API_URL + "/buoys/" + context.project.value.name
      )
      .then((res) => {
        const x = res.data;
        x.sort((a: Buoy, b: Buoy) => b.status - a.status);
        context.buoys.set(x);
      });
  };

  const loadPreset = async () => {
    const response = await axios.get(
      import.meta.env.VITE_API_URL + "/presets/" + context.project.value?.preset
    );
    if (response.data["setup"]) {
      context.rows.set(response.data["setup"]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!context.project.value) return;
    fetchBuoys();
    loadPreset();
  }, [context.project.value]);

  useEffect(() => {
    switch (context.fetchRequest.value) {
      case "":
        return;
      case "buoys":
        fetchBuoys();
        break;
    }
    context.fetchRequest.set("");
  }, [context.fetchRequest.value]);

  return <>{children}</>;
};

export default Wrapper;
