import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Cube } from "./components";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Button, Grid, Slider, Typography } from "@mui/material";
import { useState } from "react";

const DEFAULT_CAMERA_POSITION = [5, 5, 10];

// TODO: Idea -> expand camera far enough to see entire cube when cube dimension grows
// const { x, y, z } = { ...cameraRef.current.position };
// cameraRef.current.position.set(
//   x + dimension,
//   y + dimension,
//   z + dimension
// );

export const ThreeJS = () => {
  const [cubeDimension, setCubeDimension] = useState(1);
  const [cubeSpacing, setCubeSpacing] = useState(0);
  const cameraRef = useRef();

  const onChangeCubeDimension = (_event, dimension) => {
    if (typeof dimension === "number") {
      setCubeDimension(dimension);
    }
  };

  const onChangeSpacing = (_event, spacing) => {
    if (typeof spacing === "number") setCubeSpacing(spacing);
  };

  const onClickResetCamera = () => {
    cameraRef.current.position.set(...DEFAULT_CAMERA_POSITION);
  };

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          marginTop: "40px",
          marginLeft: "20px",
        }}
      >
        <Grid sx={{ display: "flex" }}>
          <Slider
            sx={{ minWidth: "300px", width: "300px", color: "orange" }}
            valueLabelDisplay="auto"
            min={1}
            max={20}
            value={cubeDimension}
            onChange={onChangeCubeDimension}
          />
          <Typography
            sx={{ marginLeft: "10px", whitespace: "nowrap", color: "white" }}
          >
            {`Cube dimension (${cubeDimension})`}
          </Typography>
        </Grid>
        <Grid sx={{ display: "flex" }}>
          <Slider
            sx={{ minWidth: "300px", width: "300px", color: "orange" }}
            valueLabelDisplay="auto"
            min={0}
            max={50}
            value={cubeSpacing}
            onChange={onChangeSpacing}
          />
          <Typography sx={{ marginLeft: "10px", color: "white" }}>
            {`Spacing (${cubeSpacing})`}
          </Typography>
        </Grid>
        <Grid>
          <Button onClick={onClickResetCamera}>Reset Camera</Button>
        </Grid>
      </Grid>
      <Canvas>
        <PerspectiveCamera
          makeDefault
          position={DEFAULT_CAMERA_POSITION}
          near={0.1}
          far={15}
          ref={cameraRef}
        />
        <OrbitControls />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Cube
          position={[0, 0, 0]}
          dimension={cubeDimension}
          spacing={cubeSpacing}
        />
      </Canvas>
    </>
  );
};