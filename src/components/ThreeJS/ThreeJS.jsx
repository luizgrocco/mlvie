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
import { Matrix4, Object3D } from "three";

const DEFAULT_CAMERA_POSITION = [5, 5, 10];
const tempObject = new Object3D();
const tempMatrix = new Matrix4();
const DEFAULT_CUBE_DIMENSION = 3;
const DEFAULT_CUBE_SPACING = 0;

const cubeSurfaceFormula = (dimension) => {
  if (dimension === 1) return 1;
  return 6 * dimension * dimension - 12 * dimension + 8;
};

const valueLabelFormat = (value) => `${value * 2}%`;

// TODO: Idea -> expand camera far enough to see entire cube when cube dimension grows
// const { x, y, z } = { ...cameraRef.current.position };
// cameraRef.current.position.set(
//   x + dimension,
//   y + dimension,
//   z + dimension
// );

export const ThreeJS = () => {
  const cubeDimensionRef = useRef(DEFAULT_CUBE_DIMENSION);
  const cubeDimensionTypography = useRef();
  const cubeSpacingRef = useRef(DEFAULT_CUBE_SPACING);
  const cubeSpacingTypography = useRef();
  const cameraRef = useRef();
  const cubeRef = useRef();
  const rotationButtonRef = useRef(false);

  const onChangeCubeDimension = (_event, dimension) => {
    if (typeof dimension === "number") {
      cubeDimensionTypography.current.innerHTML = `Cube dimension (${dimension})`;
      cubeRef.current.count = cubeSurfaceFormula(dimension);
      const axisLimit = (dimension - 1) / 2;
      const adjustedCubeSpacing = 1 + cubeSpacingRef.current / 50;
      cubeDimensionRef.current = dimension;

      // TODO: Refactor to only loop from 0 to cubeDimensionRef.current instead of triple loop
      // console.time("Optimized performance");
      // for (let i = 0; i <= cubeRef.current.count; i++) {
      //   cubeRef.current.getMatrixAt(i, tempMatrix);
      //   tempObject.position.setFromMatrixPosition(tempMatrix);
      //   tempObject.position.set();
      //   tempObject.updateMatrix();
      //   cubeRef.current.setMatrixAt(i, tempObject.matrix);
      // }
      // console.timeEnd("Optimized performance");

      // console.time("Non-Optimized performance");
      let i = 0;
      for (let x = -axisLimit; x <= axisLimit; x++) {
        for (let y = -axisLimit; y <= axisLimit; y++) {
          for (let z = -axisLimit; z <= axisLimit; z++) {
            if ([x, y, z].some((coord) => Math.abs(coord) === axisLimit)) {
              const id = i++;
              tempObject.position.set(
                x * adjustedCubeSpacing,
                y * adjustedCubeSpacing,
                z * adjustedCubeSpacing
              );
              tempObject.updateMatrix();
              cubeRef.current.setMatrixAt(id, tempObject.matrix);
            }
          }
        }
      }
      // console.timeEnd("Non-Optimized performance");

      cubeRef.current.instanceMatrix.needsUpdate = true;
    }
  };

  const onChangeSpacing = (_event, spacing) => {
    if (typeof spacing === "number") {
      cubeSpacingTypography.current.innerHTML = `Spacing (${2 * spacing})%`;

      const cubesVisible = cubeSurfaceFormula(cubeDimensionRef.current);
      const adjustedSpacing = 1 + spacing / 50;
      const adjustedCubeSpacing = 1 + cubeSpacingRef.current / 50;
      cubeSpacingRef.current = spacing;

      for (let i = 0; i <= cubesVisible; i++) {
        cubeRef.current.getMatrixAt(i, tempMatrix);
        tempObject.position.setFromMatrixPosition(tempMatrix);
        tempObject.position.set(
          (tempObject.position.x / adjustedCubeSpacing) * adjustedSpacing,
          (tempObject.position.y / adjustedCubeSpacing) * adjustedSpacing,
          (tempObject.position.z / adjustedCubeSpacing) * adjustedSpacing
        );
        tempObject.updateMatrix();
        cubeRef.current.setMatrixAt(i, tempObject.matrix);
      }
      cubeRef.current.instanceMatrix.needsUpdate = true;
    }
  };

  const onClickResetCamera = () => {
    cameraRef.current.position.set(...DEFAULT_CAMERA_POSITION);
  };

  const onClickTurnOffRotation = () => {
    rotationButtonRef.current = !rotationButtonRef.current;
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
            defaultValue={DEFAULT_CUBE_DIMENSION}
            onChange={onChangeCubeDimension}
          />
          <Typography
            ref={cubeDimensionTypography}
            sx={{ marginLeft: "10px", whitespace: "nowrap", color: "white" }}
          >
            {`Cube dimension (${DEFAULT_CUBE_DIMENSION})`}
          </Typography>
        </Grid>
        <Grid sx={{ display: "flex" }}>
          <Slider
            sx={{ minWidth: "300px", width: "300px", color: "orange" }}
            valueLabelDisplay="auto"
            min={0}
            max={100}
            valueLabelFormat={valueLabelFormat}
            onChange={onChangeSpacing}
          />
          <Typography
            ref={cubeSpacingTypography}
            sx={{ marginLeft: "10px", color: "white" }}
          >
            {`Spacing (${DEFAULT_CUBE_SPACING * 2}%)`}
          </Typography>
        </Grid>
        <Grid>
          <Button onClick={onClickResetCamera}>Reset Camera</Button>
          <Button onClick={onClickTurnOffRotation}>Toggle Rotation</Button>
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
        <ambientLight intensity={0.3} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <React.Suspense fallback={null}>
          <Environment background={true} preset="forest" />
          <Cube
            position={[0, 0, 0]}
            dimension={DEFAULT_CUBE_DIMENSION}
            ref={cubeRef}
            cubeDimensionRef={cubeDimensionRef}
            toggleRotationRef={rotationButtonRef}
          />
        </React.Suspense>
      </Canvas>
    </>
  );
};
