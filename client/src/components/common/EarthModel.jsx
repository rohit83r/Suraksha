import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const Earth = () => (
  <mesh>
    <sphereGeometry args={[2, 64, 64]} />
    <meshStandardMaterial
      map={new THREE.TextureLoader().load("/textures/earth.jpg")}
    />
  </mesh>
);

const EarthModel = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-800 via-slate-900 to-black">
      <Canvas className="brightness-125 contrast-110 saturate-125 drop-shadow-xl">
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Earth />
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default EarthModel;
