import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function Hello() {
  const [text, setText] = useState('');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/text').then((res) => {
      setText(res.data.text);
    });
  }, []);

  return (
    <div className="App">
      <h1>Vite + React</h1>
      <p>{text}</p>
    </div>
  );
}

export default Hello;
