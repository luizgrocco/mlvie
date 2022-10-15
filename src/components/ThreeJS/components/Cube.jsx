/* eslint-disable react/prop-types */
// import { useFrame } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import React, { forwardRef, useEffect } from "react";
import { useQueue } from "react-use";
import {
  BoxGeometry,
  MeshLambertMaterial,
  Color,
  Object3D,
  NearestFilter,
  NearestMipmapNearestFilter,
  Matrix4,
  Vector3,
} from "three";
import {
  redFace10pxTexture,
  orangeFace10pxTexture,
  blueFace10pxTexture,
  greenFace10pxTexture,
  whiteFace10pxTexture,
  yellowFace10pxTexture,
} from "../../../images/textures";
const cubeSurfaceFormula = (dimension) => {
  if (dimension === 1) return 1;
  return 6 * dimension * dimension - 12 * dimension + 8;
};

const tempObject = new Object3D();
const tempMatrix = new Matrix4();

const CUBE_TEXTURES = [
  redFace10pxTexture,
  orangeFace10pxTexture,
  whiteFace10pxTexture,
  yellowFace10pxTexture,
  greenFace10pxTexture,
  blueFace10pxTexture,
];
const MATERIAL = new MeshLambertMaterial();
const SELECTION_MATERIAL = MATERIAL.clone();
SELECTION_MATERIAL.color = new Color("hotpink");
const BOX_GEOMETRY = new BoxGeometry(1, 1, 1);
redFace10pxTexture.magFilter = NearestFilter;
redFace10pxTexture.minFilter = NearestMipmapNearestFilter;
redFace10pxTexture.anisotropy = 32;
const FACE_MATERIALS = CUBE_TEXTURES.map((texture) => {
  const material = MATERIAL.clone();
  material.map = texture;
  return material;
});
const FRONT = 0;
const RIGHT = 1;
const BACK = 2;
const LEFT = 3;
const TOP = 4;
const BOTTOM = 5;

const FACE_NORMALS = [];
FACE_NORMALS[FRONT] = new Vector3(0, 0, 1);
FACE_NORMALS[RIGHT] = new Vector3(1, 0, 0);
FACE_NORMALS[BACK] = new Vector3(0, 0, -1);
FACE_NORMALS[LEFT] = new Vector3(-1, 0, 0);
FACE_NORMALS[TOP] = new Vector3(0, 1, 0);
FACE_NORMALS[BOTTOM] = new Vector3(0, -1, 0);

const RubikCube = (
  { position = [0, 0, 0], dimension = 1, cubeDimensionRef, toggleRotationRef },
  cubeRef
) => {
  const { add, remove, first, size } = useQueue();
  console.log("Cube was re-rendered");

  useEffect(() => {
    const axisLimit = (dimension - 1) / 2;
    let i = 0;
    for (let x = -axisLimit; x <= axisLimit; x++) {
      for (let y = -axisLimit; y <= axisLimit; y++) {
        for (let z = -axisLimit; z <= axisLimit; z++) {
          if ([x, y, z].some((coord) => Math.abs(coord) === axisLimit)) {
            const id = i++;
            tempObject.position.set(x, y, z);
            tempObject.updateMatrix();
            cubeRef.current.setMatrixAt(id, tempObject.matrix);
            // lineSegmentsRef.current.setMatrixAt(id, tempObject.matrix);
          }
        }
      }
    }
    cubeRef.current.instanceMatrix.needsUpdate = true;
    // lineSegmentsRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (!toggleRotationRef.current) return;
    // if (size === 0) return;

    // if (first.stopCondition()) {
    //   first.incrementalStep();
    // }
    const cubesVisible = cubeSurfaceFormula(cubeDimensionRef.current);
    const axisLimit = (cubeDimensionRef.current - 1) / 2;

    for (let i = 0; i <= cubesVisible; i++) {
      cubeRef.current.getMatrixAt(i, tempMatrix);
      tempObject.position.setFromMatrixPosition(tempMatrix);
      if (
        tempObject.position.z >= -axisLimit - 0.01 &&
        tempObject.position.z <= -axisLimit + 0.01
      ) {
        tempObject.position.sub(FACE_NORMALS[FRONT]);
        tempObject.position.applyAxisAngle(
          FACE_NORMALS[FRONT],
          cubeDimensionRef.current / 100
        );
        tempObject.position.add(FACE_NORMALS[FRONT]);
        tempObject.rotateOnAxis(
          FACE_NORMALS[FRONT],
          1 / (cubeDimensionRef.current * 100)
        );
        tempObject.updateMatrix();
        cubeRef.current.setMatrixAt(i, tempObject.matrix);
      }
    }
    cubeRef.current.instanceMatrix.needsUpdate = true;
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

  return (
    <>
      {/* CUBES */}
      <instancedMesh
        ref={cubeRef}
        position={position}
        geometry={BOX_GEOMETRY}
        material={FACE_MATERIALS}
        args={[null, null, 16000]}
        count={cubeSurfaceFormula(dimension)}
      />

      {/* <Instances
        position={position}
        limit={50000} // Optional: max amount of items (for calculating buffer size)
        range={50000} // Optional: draw-range
        geometry={BOX_GEOMETRY}
        material={FACE_MATERIALS}
        ref={cubeRef}
      >
        {positions.map((pos, i) => (
          <>
            <Instance position={pos} key={i} />
          </>
        ))}
      </Instances> */}

      {/* LINES */}
      {/* <mesh
        // ref={lineSegmentsRef}
        position={position}
        geometry={EDGES_GEOMETRY}
        // material={EDGE_MATERIAL}
        args={[null, null, 16000]}
        count={cubeSurfaceFormula(dimension)}
      /> */}
      {/* {positions.map((pos, i) => (
        <lineSegments
          key={i}
          geometry={EDGES_GEOMETRY}
          material={EDGES_MATERIAL}
          position={pos}
        />
      ))} */}
      {/* <lineSegments material={EDGE_MATERIAL}>
        <instancedBufferGeometry geometry>
          <instancedBufferAttribute
            attach="attributes-offset"
            args={[new Float32Array(), 3]}
          />
        </instancedBufferGeometry>
        <lineBasicMaterial color={"black"} />
      </lineSegments> */}
      {/* <Instances
        position={position}
        limit={50000} // Optional: max amount of items (for calculating buffer size)
        range={50000} // Optional: draw-range
        geometry={LINES_GEOMETRY}
        material={EDGES_MATERIAL}
        ref={cubeRef}
      >
        {positions.map((pos, i) => (
          <Instance position={pos} key={i} />
        ))}
      </Instances> */}
    </>
  );
};

export const Cube = forwardRef(RubikCube);
