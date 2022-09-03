import React, { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Cube } from "./components";
import {
  OrbitControls,
  PerspectiveCamera,
  Stats,
  Environment,
} from "@react-three/drei";
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
  const cameraRef = useRef();
  const cubeRef = useRef();
  const cubeSpacingRef = useRef(0);

  const valueLabelFormat = (value) => `${value * 2}%`;

  const onChangeCubeDimension = (_event, dimension) => {
    // TODO: Optimize this
    if (typeof dimension === "number") {
      setCubeDimension(dimension);
      cubeSpacingRef.current = 0;
    }
  };

  const onChangeSpacing = (_event, spacing) => {
    if (typeof spacing === "number") {
      const adjustedSpacing = 1 + spacing / 50;
      const adjustedCubeSpacing = 1 + cubeSpacingRef.current / 50;

      // cubeRef.current.children?.forEach((cubie) => {
      //   cubie.position.x =
      //     (cubie.position.x / adjustedCubeSpacing) * adjustedSpacing;
      //   cubie.position.y =
      //     (cubie.position.y / adjustedCubeSpacing) * adjustedSpacing;
      //   cubie.position.z =
      //     (cubie.position.z / adjustedCubeSpacing) * adjustedSpacing;
      // });
      // cubeRef.current.instanceMatrix.needsUpdate = true;

      cubeRef.current.children?.forEach((cubie) => {
        cubie.position.set(
          (cubie.position.x / adjustedCubeSpacing) * adjustedSpacing,
          (cubie.position.y / adjustedCubeSpacing) * adjustedSpacing,
          (cubie.position.z / adjustedCubeSpacing) * adjustedSpacing
        );
      });

      cubeSpacingRef.current = spacing;
    }
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
            max={50}
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
            valueLabelFormat={valueLabelFormat}
            onChange={onChangeSpacing}
          />
          {/* <Typography sx={{ marginLeft: "10px", color: "white" }}>
            {`Spacing (${cubeSpacingRef.current * 2}%)`}
          </Typography> */}
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
          far={1000}
          ref={cameraRef}
        />
        <Stats />
        <OrbitControls />
        <ambientLight intensity={0.6} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <React.Suspense fallback={null}>
          <Environment background={true} preset="forest" />
          <Cube position={[0, 0, 0]} dimension={cubeDimension} ref={cubeRef} />
        </React.Suspense>
      </Canvas>
    </>
  );
};
