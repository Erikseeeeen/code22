import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import { Buoy, Project } from '../types';

const Wrapper = ({ children }: { children: JSX.Element }) => {
  const context = useContext(AppContext);

  useEffect(() => {
    const fetchProjectsAndBuoys = async () => {
      let projects: Project[] = [];
      await axios
        .get(import.meta.env.VITE_API_URL + '/projects')
        .then((res) => {
          projects = res.data;
        });

      if (projects.length == 0) return;
      const project = projects[0];

      context.projects.set(projects);
      context.project.set(project);

      await axios
        .get(import.meta.env.VITE_API_URL + '/buoys/' + project.name)
        .then((res) => {
          const x = res.data;
          x.sort((a: Buoy, b: Buoy) => b.status - a.status);
          context.buoys.set(x);
        });
    };
    fetchProjectsAndBuoys();
  }, []);

  useEffect(() => {
    const fetchProjectsAndBuoys = async () => {
      if (!context.project.value) return;
      await axios
        .get(
          import.meta.env.VITE_API_URL + '/buoys/' + context.project.value.name
        )
        .then((res) => {
          const x = res.data;
          x.sort((a: Buoy, b: Buoy) => b.status - a.status);
          context.buoys.set(x);
        });
    };
    fetchProjectsAndBuoys();
  }, [context.project.value]);

  return <>{children}</>;
};

export default Wrapper;
