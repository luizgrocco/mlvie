/* eslint-disable react/prop-types */
import { useFrame } from "@react-three/fiber";
import React, { forwardRef, useMemo } from "react";
import { BoxGeometry, MeshLambertMaterial, Color } from "three";
import { Instances, Instance } from "@react-three/drei";

const CUBE_COLORS = ["red", "chocolate", "white", "gold", "green", "blue"];
const MATERIAL = new MeshLambertMaterial();
const SELECTION_MATERIAL = MATERIAL.clone();
SELECTION_MATERIAL.color = new Color("hotpink");
const BOX_GEOMETRY = new BoxGeometry(1, 1, 1);
const FACE_MATERIALS = CUBE_COLORS.map((color) => {
  const material = MATERIAL.clone();
  material.color = new Color(color);
  return material;
});

const RubikCube = ({ position = [0, 0, 0], dimension = 1 }, cubeRef) => {
  console.log("Cube was re-rendered");
  const positions = useMemo(() => {
    console.log("Cubies were re-created");
    const axisLimit = (dimension - 1) / 2;
    const arr = [];
    for (let x = -axisLimit; x <= axisLimit; x++) {
      for (let y = -axisLimit; y <= axisLimit; y++) {
        for (let z = -axisLimit; z <= axisLimit; z++) {
          // Check if cubie is visible --> Refactor into util function?
          if ([x, y, z].some((coord) => Math.abs(coord) === axisLimit)) {
            arr.push([x, y, z]);
          }
        }
      }
    }
    // console.log("oldArray: ", positions, "newARRAY:", arr);
    return arr;
  }, [dimension]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    cubeRef.current.rotation.y = Math.sin(time / 2);
  });

  // useFrame((state) => {
  //   const time = state.clock.getElapsedTime();
  //   // cubeRef.current.rotation.x = Math.sin(time / 4)
  //   // cubeRef.current.rotation.y = Math.sin(time / 2)
  //   let i = 0;
  //   for (let x = 0; x < 10; x++)
  //     for (let y = 0; y < 10; y++)
  //       for (let z = 0; z < 10; z++) {
  //         const id = i++;
  //         tempObject.position.set(tempObject.position);
  //         tempObject.rotation.y = Math.sin(time / 2 + time);
  //         // tempObject.rotation.z = tempObject.rotation.y * 2;
  //         // if (hovered !== prevRef.Current) {
  //         //   (id === hovered
  //         //     ? tempColor.setRGB(10, 10, 10)
  //         //     : tempColor.set(data[id].color)
  //         //   ).toArray(colorArray, id * 3);
  //         //   meshRef.current.geometry.attributes.color.needsUpdate = true;
  //         // }
  //         tempObject.updateMatrix();
  //         cubeRef.current.setMatrixAt(id, tempObject.matrix);
  //       }
  //   cubeRef.current.instanceMatrix.needsUpdate = true;
  // });

  // console.log({ cubeRef });

  return (
    // <instancedMesh
    //   ref={cubeRef}
    //   geometry={BOX_GEOMETRY}
    //   material={FACE_MATERIALS}
    //   args={[null, null, 1000]}
    // ></instancedMesh>

    <Instances
      position={position}
      limit={50000} // Optional: max amount of items (for calculating buffer size)
      range={50000} // Optional: draw-range
      geometry={BOX_GEOMETRY}
      material={FACE_MATERIALS}
      ref={cubeRef}
    >
      {positions.map((pos, i) => (
        <Instance position={pos} key={i} />
      ))}
    </Instances>
  );
};

export const Cube = forwardRef(RubikCube);
