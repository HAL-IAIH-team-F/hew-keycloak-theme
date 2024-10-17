import {MutableRefObject, useEffect, useMemo, useRef, useState} from "react";
import * as THREE from 'three';
import {MeshPhysicalMaterial, Scene, WebGLRenderer} from 'three';
import {useWindowSize, WindowSize} from "../util/hooks/useWindowSize.ts";
import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise";

const speed = 15
const spikesDef = 0.61
const processing = 0.9
export default function Loaded(
  {
    ...props
  }: LoadingProps,
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const windowSize = useWindowSize()
  const camera = useCamera(windowSize)
  const scene = useMemo(() => new THREE.Scene(), [])
  const renderer = useRenderer(canvasRef, windowSize)
  const geometry = useMemo(() => new THREE.SphereGeometry(1.5, 128, 128), [])
  const positionAttributeBase = useMemo(() => geometry.getAttribute('position').clone(), [geometry])
  const material = useMeshPhysicalMaterial()
  const topLight = useLight(0, 40, -50, scene)
  const bottomLight = useLight(0, 0, 400, scene)
  const sphere = useMesh(geometry, material, scene);
  const simplex = useMemo(() => new SimplexNoise(), []);
  const vector = useMemo(() => new THREE.Vector3(), []);
  useAnimationFrame(() => {
    if (renderer === undefined) return

    let time = performance.now() * 0.00001 * speed * Math.pow(processing, 3),
      spikes = spikesDef * processing;
    const positionAttribute = geometry.getAttribute('position');
    for (let i = 0; i < positionAttributeBase.count; i++) {
      vector.fromBufferAttribute(positionAttributeBase, i);//頂点を取り出す
      const noise = simplex.noise3d(vector.x * spikes, vector.y * spikes, vector.z * spikes + time);
      const ratio = noise * 0.05 + 0.98;
      vector.multiplyScalar(ratio);//ベクトルの各要素をratio乗する
      positionAttribute.setXYZ(i, vector.x, vector.y, vector.z)//頂点座標を更新
    }
    sphere.geometry.attributes.position.needsUpdate = true;//頂点座標が変更されたことをThree.jsに通知
    sphere.geometry.computeVertexNormals();
    renderer.render(scene, camera);
  }, [renderer, camera, scene, geometry, positionAttributeBase, sphere, simplex, vector])

  console.log("return", canvasRef)
  return (
    <canvas
      {...props}
      ref={canvasRef}
      style={{
        background: "#4be5fc",
        position: "fixed",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    />
  )
}

function useMesh(geometry: THREE.SphereGeometry, material: MeshPhysicalMaterial, scene: Scene) {
  return useMemo(() => {
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    return mesh
  }, [])
}

function useCamera(windowSize: WindowSize) {
  return useMemo(() => {
    const camera = new THREE.PerspectiveCamera(
      75,
      windowSize.width / windowSize.height,
      0.1,
      1000
    );
    camera.position.z = 3;
    return camera
  }, [])

}

function useAnimationFrame(func: () => void, deps: any[]) {
  const [obj, _] = useState<{ fn: (() => void) | undefined }>({fn: undefined})
  useMemo(() => {
    const isNew = obj.fn == undefined
    obj.fn = () => {
      func()
      const fn = obj.fn
      if (fn === undefined) return
      window.requestAnimationFrame(fn)
    }
    if (isNew) window.requestAnimationFrame(obj.fn)
  }, deps);
}

function useLight(x: number, y: number, z: number, scene: Scene) {
  return useMemo(() => {
    let lightTop = new THREE.DirectionalLight(0xffffff, .8);
    lightTop.position.set(x, y, z);
    scene.add(lightTop);
    return lightTop
  }, [scene])
}

function useMeshPhysicalMaterial() {
  return useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      // wireframe: true,
      color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide,
      transmission: 1,//透過率
      metalness: 0,//金属製
      roughness: 0,//粗さ
      ior: 1.2,//屈折率
      specularIntensity: 0.1,//反射量
      specularColor: 0xffffff,//反射色
    })
  }, [])
}

function useRenderer(canvasRef: MutableRefObject<HTMLCanvasElement | null>, windowSize: WindowSize) {
  const [renderer, setRenderer] = useState<WebGLRenderer | undefined>(undefined)
  useEffect(() => {
    if (canvasRef.current === null) return undefined
    if (renderer) return

    const newRenderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true//背景を透明にする
      }
    )
    newRenderer.shadowMap.enabled = true;
    setRenderer(newRenderer)
  }, [canvasRef.current]);

  useMemo(() => {
    if (renderer === undefined) return
    renderer.setSize(windowSize.width, windowSize.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  }, [renderer, windowSize]);

  return renderer
}

export interface LoadingProps {
}

 