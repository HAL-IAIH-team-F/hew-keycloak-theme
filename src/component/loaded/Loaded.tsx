import {Canvas} from "@react-three/fiber";
import Animation from "./Animation.tsx";
import FoamWithCircle from "./FoamWithCircle.tsx";

export default function Loaded(
  {}: LoadingProps,
) {
  return (
    <div
      style={{
        background: "#000",
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
          {/*<ambientLight args={[0xffffff, 2]} position={[10, 400, -500]}/>*/}
          <ambientLight args={[0xffffff, 0.001]} position={[0, 0, 500]}/>
          <FoamWithCircle/>
        </Animation>
      </Canvas>
    </div>
  )
}


export interface LoadingProps {
}

 