import axios from 'axios';
import { useContext, useEffect } from 'react';
import { AppContext } from '../context';
import { Buoy, Project } from '../types';

const Wrapper = ({ children }: { children: JSX.Element }) => {
  const context = useContext(AppContext);

  const fetchProjects = async () => {
    let projects: Project[] = [];
    await axios.get(import.meta.env.VITE_API_URL + '/projects').then((res) => {
      projects = res.data;
    });

    if (projects.length == 0) return;
    const project = projects[0];

    context.projects.set(projects);
    context.project.set(project);
  };

  const fetchBuoys = async () => {
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

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    fetchBuoys();
  }, [context.project.value]);

  useEffect(() => {
    switch (context.fetchRequest.value) {
      case '':
        return;
      case 'buoys':
        fetchBuoys();
        break;
    }
    context.fetchRequest.set('');
  }, [context.fetchRequest.value]);

  return <>{children}</>;
};

export default Wrapper;
