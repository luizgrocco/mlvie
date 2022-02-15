import React, { useRef } from "react";
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
  const canvasDraw = useRef(null);

  const handleClear = () => {
    canvasDraw.current.clear();
  };

  const handleSaveData = () => {
    const imgTensor = tf.browser.fromPixels(
      canvasDraw.current.canvas.drawing,
      4
    );
    // console.log(imgTensor.dataSync());
    tf.browser.toPixels(
      tf.image.resizeNearestNeighbor(imgTensor, [30, 30]).cast("int32"),
      document.getElementsByClassName("secondary-canvas")[0]
    );
    tf.browser.toPixels(
      tf.image.resizeNearestNeighbor(imgTensor, [30, 30]).cast("int32"),
      document.getElementsByClassName("secondary-canvas")[1]
    );
    // const test2 = tf.browser.fromPixels(document.getElementById("canvas2"), 4);
    // console.log(test2.dataSync());
  };

  const printProps = () => {
    console.log(canvasDraw);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ border: "5px solid orange" }}>
          <CanvasDraw
            ref={canvasDraw}
            hideGrid
            lazyRadius={0}
            catenaryColor="#444"
          />
        </div>
        <div style={{ display: "flex" }}>
          <canvas className="secondary-canvas"></canvas>
          <canvas className="secondary-canvas"></canvas>
        </div>
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSaveData}>Save Data</button>
        <button onClick={printProps}>Print Props</button>
      </header>
    </div>
  );
}

export default Sentry.withProfiler(App);
