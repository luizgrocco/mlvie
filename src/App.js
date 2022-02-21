import React, { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";
import * as Sentry from "@sentry/react";
import * as tf from "@tensorflow/tfjs";
import { useDebounce } from "react-use";
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
  const [model, setModel] = useState(null);
  const canvasDraw = useRef(null);
  const [predictionValue, setPredictionValue] = useState(null);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleClear = () => {
    canvasDraw.current.clear();
  };

  const handleDraw = () => {
    // Convert the canvas pixels to a Tensor of the model's input shape
    let imgTensor = tf.browser.fromPixels(canvasDraw.current.canvas.drawing, 1);
    imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [28, 28]);
    imgTensor = imgTensor.reshape([-1, 28, 28, 1]);
    imgTensor = tf.cast(imgTensor, "float32");
    imgTensor = tf.div(imgTensor, tf.scalar(255));
    setImage(imgTensor);
  };

  const loadModel = useCallback(async () => {
    try {
      const model = await tf.loadLayersModel(
        // eslint-disable-next-line no-undef
        process.env.PUBLIC_URL + "/assets/models/my-model/model.json"
      );
      setModel(model);
      console.log("Model Loaded.");
      // console.log(model);
    } catch (e) {
      console.log("Failed to load model! Error: ", e);
    }
  }, []);

  const predict = useCallback(async () => {
    await tf.tidy(() => {
      // Make and format predictions
      const output = model.predict(image);
      const outputArray = Array.from(output.dataSync());
      const prediction = Math.max(...outputArray);
      setPredictionValue(outputArray.indexOf(prediction));
    });
  }, [model, image]);

  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, [loadModel]);

  useDebounce(
    () => {
      if (model && image) predict();
    },
    1000,
    [image]
  );

  const handlePreviewData = () => {
    const imgTensor = tf.browser.fromPixels(
      canvasDraw.current.canvas.drawing,
      1
    );
    tf.browser.toPixels(
      tf.image
        .resizeBilinear(imgTensor, [28, 28])
        // .resizeNearestNeighbor(imgTensor, [28, 28])
        .cast("float32")
        .div(tf.scalar(255)),
      document.getElementsByClassName("secondary-canvas")[0]
    );
    // const test2 = tf.browser.fromPixels(document.getElementById("canvas2"), 4);
    // console.log(test2.dataSync());
  };

  // const printProps = () => {
  //   console.log(canvasDraw);
  // };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-container">
          <img src="assets/images/tagview_logo.webp" alt="tagview-logo" />
          <div className="meets">meets</div>
          <img
            src="assets/images/tensorflow-01.png"
            alt="tensorflow-logo+text"
            width={150}
            height={150}
          />
        </div>
        <div className="canvases-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ border: "5px solid orange" }}>
              <CanvasDraw
                ref={canvasDraw}
                hideGrid
                lazyRadius={0}
                // catenaryColor="#FFF"
                brushColor="#FFF"
                backgroundColor="#000"
                onChange={handleDraw}
              />
            </div>
            <button onClick={handleClear}>Clear</button>
          </div>
          <div className="prep-data-container">
            <button onClick={handlePreviewData}>Pré-visualizar</button>
            <canvas className="secondary-canvas"></canvas>
          </div>
        </div>
        <div className="prediction-container">
          <img
            src="assets/images/tensorflow_logo.png"
            alt="tensorflow-logo"
            width="50"
            height="50"
          />
          <input
            readOnly
            className="prediction"
            value={predictionValue === null ? "N/A" : predictionValue}
          />
        </div>
      </header>
    </div>
  );
}

export default Sentry.withProfiler(App);
