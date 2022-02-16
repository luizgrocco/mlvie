import React, { useRef, useState } from "react";
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
  const [model, setModel] = useState();
  const canvasDraw = useRef(null);

  const handleClear = () => {
    canvasDraw.current.clear();
  };

  const loadModel = async () => {
    // const uploadJSONInput = document.getElementById("upload-json");
    // const uploadWeightsInput = document.getElementById("upload-weights");
    // console.log(uploadJSONInput.files);
    try {
      // const model = await tf.loadLayersModel(
      //   tf.io.browserFiles([
      //     uploadJSONInput.files[0],
      //     ...uploadWeightsInput.files,
      //   ])
      // );
      const model = await tf.loadLayersModel(
        // eslint-disable-next-line no-undef
        process.env.PUBLIC_URL + "/assets/model.json"
      );
      setModel(model);
      console.log("set loaded Model");
      console.log(model);
    } catch (e) {
      console.log("Failed to load model! Error: ", e);
    }
  };

  const predict = async () => {
    await tf.tidy(() => {
      // Convert the canvas pixels to a Tensor of the matching shape
      let imgTensor = tf.browser.fromPixels(
        canvasDraw.current.canvas.drawing,
        1
      );
      imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [28, 28]);
      imgTensor = imgTensor.reshape([1, 28, 28, 1]);
      imgTensor = tf.cast(imgTensor, "float32");
      // imgTensor = tf.div(imgTensor, tf.scalar(255));
      imgTensor.print();
      console.log(model);

      // Make and format the predications
      const output = model.predict(imgTensor);

      // Save predictions on the component
      console.log(Array.from(output.dataSync()));
    });
  };

  // useEffect(() => {
  //   tf.ready().then(() => {
  //     loadModel();
  //   });
  // }, []);

  // const predict = async (imageData) => {
  //   const pred = await tf.tidy(() => {
  //     // Convert the canvas pixels to
  //     let img = tf.fromPixels(imageData, 1);
  //     img = img.reshape([1, 28, 28, 1]);
  //     img = tf.cast(img, "float32");

  //     // Make and format the predications
  //     const output = this.model.predict(img);

  //     // Save predictions on the component
  //     this.predictions = Array.from(output.dataSync());
  //   });
  // };

  const handleSaveData = () => {
    const imgTensor = tf.browser.fromPixels(
      canvasDraw.current.canvas.drawing,
      1
    );

    // imgTensor.print(true);
    // console.log(
    //   tf.image.resizeNearestNeighbor(imgTensor, [28, 28]).cast("int32")
    // );
    // console.log(imgTensor.dataSync());
    tf.browser.toPixels(
      tf.image
        .resizeNearestNeighbor(imgTensor, [28, 28])
        .cast("float32")
        .div(tf.scalar(255)),
      document.getElementsByClassName("secondary-canvas")[0]
    );
    tf.browser.toPixels(
      tf.image
        .resizeNearestNeighbor(imgTensor, [28, 28])
        .cast("float32")
        .div(tf.scalar(255)),
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
        <div style={{ display: "flex" }}>
          <button onClick={handleClear}>Clear</button>
          <button onClick={handleSaveData}>Save Data</button>
          <button onClick={printProps}>Print Props</button>
          <button onClick={predict}>Predict!</button>
        </div>
        {/* <div style={{ display: "flex" }}>
          <button onClick={loadModel}>Load Model</button>
          <input type="file" id="upload-json" />
          <input type="file" multiple id="upload-weights" />
        </div> */}
      </header>
    </div>
  );
}

export default Sentry.withProfiler(App);
