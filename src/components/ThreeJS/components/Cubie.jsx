/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { Edges } from "@react-three/drei";

export const Cubie = ({ geometry, material, selectionMaterial, ...props }) => {
  const cubieRef = useRef();
  const [hovered, hover] = useState(false);

  return (
    <mesh
      {...props}
      ref={cubieRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        hover(true);
      }}
      onPointerOut={() => hover(false)}
      geometry={geometry}
      material={hovered ? selectionMaterial : material}
    >
      <Edges />
    </mesh>
  );
};
