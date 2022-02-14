import React, { useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as Sentry from "@sentry/react";
import * as tf from "@tensorflow/tfjs";
import CanvasDraw from "react-canvas-draw";

// const canvasProps = {
//   color: "#ffc600",
//   width: 400,
//   height: 400,
//   brushRadius: 10,
//   lazyRadius: 12,
//   backgroundImg:
//     "https://upload.wikimedia.org/wikipedia/commons/a/a1/Nepalese_Mhapuja_Mandala.jpg",
//   imgs: [
//     "https://upload.wikimedia.org/wikipedia/commons/a/a1/Nepalese_Mhapuja_Mandala.jpg",
//     "https://i.imgur.com/a0CGGVC.jpg",
//   ],
// };

function App() {
  const canvas = useRef(null);

  const handleClear = () => {
    canvas.current.clear();
  };

  const handleSaveData = () => {
    const ctx = canvas.current.canvas.drawing.getContext("2d");
    const img = ctx.getImageData(0, 0, 30, 30);
    const imgTensor = tf.browser.fromPixels(img);
    console.log(imgTensor);
  };

  const printProps = () => {
    console.log(canvas);
  };

  return (
    <div className="App">
      <header className="App-header">
        <CanvasDraw ref={canvas} hideGrid lazyRadius={0} catenaryColor="#444" />
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSaveData}>Save Data</button>
        <button onClick={printProps}>Print Props</button>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Sentry.withProfiler(App);
