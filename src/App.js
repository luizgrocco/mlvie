import React, { useRef, useState, useEffect, useCallback } from "react";
import "./App.css";
import * as Sentry from "@sentry/react";
import * as tf from "@tensorflow/tfjs";
import { useDebounce } from "react-use";
import CanvasDraw from "react-canvas-draw";
import { CircularProgress, Typography, Badge, Grid } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Box } from "@mui/system";

function App() {
  const [model, setModel] = useState(null);
  const canvasDraw = useRef(null);
  const [predictionValue, setPredictionValue] = useState(null);
  const [rankTwoPrediction, setRankTwoPrediction] = useState(null);
  const [rankThreePrediction, setRankThreePrediction] = useState(null);

  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleDraw = () => {
    // Convert the canvas pixels to a Tensor of the model's input shape
    let imgTensor = tf.browser.fromPixels(canvasDraw.current.canvas.drawing, 1);
    imgTensor = tf.image.resizeBilinear(imgTensor, [28, 28]);
    imgTensor = imgTensor.reshape([-1, 28, 28, 1]);
    imgTensor = tf.cast(imgTensor, "float32");
    imgTensor = tf.div(imgTensor, tf.scalar(255));
    setImage(imgTensor);
    setIsLoading(true);
  };

  // Hooks
  const predict = useCallback(async () => {
    await tf.tidy(() => {
      const output = model.predict(image);
      const outputArray = Array.from(output.dataSync())
        .map((el, index) => ({
          number: index,
          confidence: el,
        }))
        .sort((a, b) => b.confidence - a.confidence);
      setPredictionValue(outputArray[0].number);
      setRankTwoPrediction(outputArray[1].number);
      setRankThreePrediction(outputArray[2].number);
    });
    const imgTensor = tf.browser.fromPixels(
      canvasDraw.current.canvas.drawing,
      1
    );
    tf.browser.toPixels(
      tf.image
        .resizeBilinear(imgTensor, [28, 28])
        .cast("float32")
        .div(tf.scalar(255)),
      document.getElementsByClassName("pre-processing-canvas")[0]
    );
    canvasDraw.current.clear();
    setIsLoading(false);
  }, [model, image]);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel(
          process.env.PUBLIC_URL + "/assets/models/my-model/model.json"
        );
        setModel(model);
        console.log("Model Loaded.");
      } catch (e) {
        console.log("Failed to load model! Error: ", e);
      }
    };

    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  useDebounce(
    () => {
      if (model && image) {
        setIsLoading(true);
        predict();
      }
    },
    1000,
    [image]
  );

  return (
    <Grid className="App">
      <Grid className="App-header">
        <Grid className="header-container">
          <img src="assets/images/tagview_logo.webp" alt="tagview-logo" />
          <Typography className="meets">meets</Typography>
          <img
            src="assets/images/tensorflow-01.png"
            alt="tensorflow-logo+text"
            width={150}
            height={150}
          />
        </Grid>
      </Grid>
      <Grid className="canvases-container">
        <Grid className="drawing-canvas">
          <CanvasDraw
            ref={canvasDraw}
            hideGrid
            lazyRadius={0}
            brushColor="#FFF"
            backgroundColor="#000"
            onChange={handleDraw}
          />
        </Grid>
        <canvas className="pre-processing-canvas"></canvas>
      </Grid>
      <Grid className="prediction-container">
        <Grid className="prediction-header">
          <Box
            component="img"
            src="assets/images/tensorflow_logo.png"
            alt="tensorflow-logo"
            className="tf-logo"
          />
          <Typography className="predict">Prediction:</Typography>
          {isLoading && (
            <CircularProgress className="circular-progress" color="inherit" />
          )}
        </Grid>
        <Grid className="prediction-rank">
          <Grid className="prediction-winner-container">
            <Badge badgeContent={1} className="rank-one">
              <EmojiEventsIcon sx={{ color: "gold" }} />
            </Badge>
            <Typography className="prediction-winner">
              {predictionValue === null ? "N/A" : predictionValue}
            </Typography>
          </Grid>
          <Grid className="prediction-losers">
            <Grid className="loser-container">
              <Badge badgeContent={2} className="rank-two">
                <EmojiEventsIcon sx={{ color: "silver" }} />
              </Badge>
              <Typography className="loser-text">
                {rankTwoPrediction === null ? "N/A" : rankTwoPrediction}
              </Typography>
            </Grid>
            <Grid className="loser-container">
              <Badge badgeContent={3} className="rank-three">
                <EmojiEventsIcon sx={{ color: "#CD7F32" }} />
              </Badge>
              <Typography className="loser-text">
                {rankThreePrediction === null ? "N/A" : rankThreePrediction}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Sentry.withProfiler(App);
