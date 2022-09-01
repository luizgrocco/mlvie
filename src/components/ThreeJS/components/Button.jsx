import React from "react";
import { Html } from "@react-three/drei";

export const Button = () => {
  return (
    <Html scale={1} position={[5, 1, 1]} transform occlude>
      <button className="annotation">6.550 $</button>
    </Html>
  );
};
