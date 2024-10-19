import Foam from "./Foam.tsx";
import {Vector3} from "@react-three/fiber";
import {useMemo} from "react";
import * as THREE from "three";
import setFoamNoise from "./setFoamNoise.ts";

export default function FoamWithCircle(
  {
    position,
  }: FoamWithCircleProps,
) {
  if (!position) position = [0, 0, 0]

  const geometry = useMemo(() => {
    return new THREE.CircleGeometry(1,64);
  }, []);
  const baseAttribute = useMemo(() => geometry?.getAttribute('position')?.clone(), [geometry])

  return (
    <>
      <Foam position={position}
            onFoamFrame={(time, spikes, simplex) => {
              setFoamNoise(baseAttribute, geometry, simplex, spikes, time)
            }}
      />
      <mesh position={position} geometry={geometry}>
      </mesh>
    </>
  )
}

export interface FoamWithCircleProps {
  position?: Vector3
}

 