import {Canvas} from "@react-three/fiber";
import Animation from "./Animation.tsx";
import FoamWithCircle from "./FoamWithCircle.tsx";

export default function Loaded(
  {}: LoadingProps,
) {
  return (
    <div
      style={{
        background: "#4be5fc",
        position: "fixed",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 3],
          fov: 75,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 1000,
        }}
        resize={{debounce: 0}}
        gl={{
          alpha: true,
        }}
        color={"#fff"}
      >
        <Animation>
          <directionalLight args={[0xffffff, 2]} position={[10, 400, -500]}/>
          <directionalLight args={[0xffffff, 3]} position={[5000, -5000, 400]}/>
          <FoamWithCircle/>
        </Animation>
      </Canvas>
    </div>
  )
}


export interface LoadingProps {
}

 