/* eslint-disable react/prop-types */
import React, { useRef, useState } from "react";
import { Box, Edges } from "@react-three/drei";

export const Cubie = ({ ...props }) => {
  const cubieRef = useRef();
  const [hovered, hover] = useState(false);

  // console.log("cubie was re-rendered");

  return (
    <Box
      {...props}
      ref={cubieRef}
      onPointerOver={(event) => {
        event.stopPropagation();
        hover(true);
      }}
      onPointerOut={() => hover(false)}
    >
      <meshPhongMaterial color={hovered ? "hotpink" : "orange"} />
      <Edges />
    </Box>
  );
};
