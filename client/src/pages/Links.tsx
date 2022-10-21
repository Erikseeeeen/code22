import { Link } from 'react-router-dom';

function Links() {
  return (
    <div>
      <h1>Hello world!</h1>
      <Link to="/dashboard">Dashboard!</Link>
      <br />
      <Link to="/three">Three!</Link>
    </div>
  );
}

export default Links;
