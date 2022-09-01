/* eslint-disable react/prop-types */
import { useFrame } from "@react-three/fiber";
import React, { useEffect } from "react";
import { useMemo, useRef } from "react";
import { Cubie } from "../components";

export const Cube = ({ position = [0, 0, 0], dimension = 1, spacing = 0 }) => {
  // console.log("Cube was re-rendered");
  const cubeRef = useRef();
  const axisLimit = useMemo(() => (dimension - 1) / 2, [dimension]);
  const prevSpacing = useRef(spacing);

  const cubies = useMemo(() => {
    // console.log("Cubies were re-created");
    const arr = [];
    for (let x = -axisLimit; x <= axisLimit; x++) {
      for (let y = -axisLimit; y <= axisLimit; y++) {
        for (let z = -axisLimit; z <= axisLimit; z++) {
          // Check if cubie is visible --> Refactor into util function?
          if ([x, y, z].some((coord) => Math.abs(coord) === axisLimit)) {
            arr.push(<Cubie position={[x, y, z]} />);
          }
        }
      }
    }
    return arr;
  }, [axisLimit]);

  // console.log({ cubies });
  // console.log({ cubeRef });
  // console.log({ spacing });

  useEffect(() => {
    const adjustedSpacing = 1 + spacing / 50;
    const adjustedPrevSpacing = 1 + prevSpacing.current / 50;
    cubeRef.current.children?.forEach((cubie) => {
      cubie.position.set(
        (cubie.position.x / adjustedPrevSpacing) * adjustedSpacing,
        (cubie.position.y / adjustedPrevSpacing) * adjustedSpacing,
        (cubie.position.z / adjustedPrevSpacing) * adjustedSpacing
      );
    });
    prevSpacing.current = spacing;
  }, [spacing]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // cubeRef.current.rotation.x = Math.sin(time / 4);
    cubeRef.current.rotation.y = Math.sin(time / 2);
  });

  return (
    <object3D position={position} ref={cubeRef}>
      {cubies}
    </object3D>
  );
};
