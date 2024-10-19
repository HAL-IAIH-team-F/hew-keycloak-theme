import * as THREE from "three";
import {useMemo} from "react";
import {SimplexNoise} from "three/examples/jsm/math/SimplexNoise.js";
import {useFrame} from "@react-three/fiber";

const speedDef = 40
const spikesDef = 0.6
const processingDef = 1.3
export default function Foam(
  {}: {}
) {
  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 64, 64);
  }, []);
  const positionAttributeBase = useMemo(() => geometry?.getAttribute('position')?.clone(), [geometry])
  const vector = useMemo(() => new THREE.Vector3(), []);
  const simplex = useMemo(() => new SimplexNoise(), []);

  useFrame((state, delta, frame) => {
    let time = performance.now() * 0.00001 * speedDef * Math.pow(processingDef, 3),
      spikes = spikesDef * processingDef;
    const positionAttribute = geometry.getAttribute('position');
    for (let i = 0; i < positionAttributeBase.count; i++) {
      vector.fromBufferAttribute(positionAttributeBase, i);//頂点を取り出す
      const noise = simplex.noise3d(vector.x * spikes, vector.y * spikes, vector.z * spikes + time);
      const ratio = noise * 0.05 + 0.98;
      vector.multiplyScalar(ratio);//ベクトルの各要素をratio乗する
      positionAttribute.setXYZ(i, vector.x, vector.y, vector.z)//頂点座標を更新
    }
    // sphere.geometry.attributes.position.needsUpdate = true;//頂点座標が変更されたことをThree.jsに通知
    positionAttribute.needsUpdate = true;
  })

  const color = 0x91F0FFFF;
  return (
    <mesh geometry={geometry}>
      {/*<sphereGeometry args={[1.5, 128, 128]} />*/}
      <meshPhysicalMaterial args={[{
        color: color,
        transparent: true,
        side: THREE.DoubleSide,
        transmission: 1.8,//透過率
        metalness: 0,//金属製
        roughness: 0,//粗さ
        ior: 1.33,//屈折率
        specularIntensity: 1,//反射量
        specularColor: color,//反射色
      }]}/>
    </mesh>
  )
}