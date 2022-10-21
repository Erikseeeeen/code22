import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <h1>Hello world!</h1>
      <Link to="/hello">Hello!</Link>
      <br />
      <Link to="/three">Three!</Link>
    </div>
  );
}

export default App;
