/* eslint-disable react/prop-types */
import { useFrame } from "@react-three/fiber";
import React, { forwardRef } from "react";
import { useMemo } from "react";
import { BoxGeometry, MeshLambertMaterial } from "three";
import { Cubie } from "../components";

const RubikCube = ({ position = [0, 0, 0], dimension = 1 }, cubeRef) => {
  console.log("Cube was re-rendered");
  const axisLimit = useMemo(() => (dimension - 1) / 2, [dimension]);

  const boxGeometry = useMemo(() => {
    const geometry = new BoxGeometry(1, 1, 1);
    return geometry;
  }, []);

  const materials = useMemo(
    () => [
      new MeshLambertMaterial({ color: "red" }),
      new MeshLambertMaterial({ color: "chocolate" }),
      new MeshLambertMaterial({ color: "white" }),
      new MeshLambertMaterial({ color: "gold" }),
      new MeshLambertMaterial({ color: "green" }),
      new MeshLambertMaterial({ color: "blue" }),
    ],
    []
  );

  const selectedMaterial = useMemo(
    () => new MeshLambertMaterial({ color: "hotpink" }),
    []
  );

  const cubies = useMemo(() => {
    console.log("Cubies were re-created");
    const arr = [];
    for (let x = -axisLimit; x <= axisLimit; x++) {
      for (let y = -axisLimit; y <= axisLimit; y++) {
        for (let z = -axisLimit; z <= axisLimit; z++) {
          // Check if cubie is visible --> Refactor into util function?
          if ([x, y, z].some((coord) => Math.abs(coord) === axisLimit)) {
            arr.push(
              <Cubie
                position={[x, y, z]}
                geometry={boxGeometry}
                material={materials}
                selectionMaterial={selectedMaterial}
              />
            );
          }
        }
      }
    }
    return arr;
  }, [axisLimit]);

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

export const Cube = forwardRef(RubikCube);
