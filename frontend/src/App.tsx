import { useState } from 'react';
import './App.css';

function App() {
  const [hello, setHello] = useState('hi');
  // use javascript functions

  // return html component
  return (
    <>
      <h1> hi </h1>
    </>
  );
}

// javascript -> .js
// typescript -> .ts
// typescript + react -> .tsx

export default App;
