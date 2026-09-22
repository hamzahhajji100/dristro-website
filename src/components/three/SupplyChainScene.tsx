"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

// Textlabels (3D-Text bzw. Html-Overlay) verursachten in Testumgebungen mit
// eingeschränktem WebGL (z.B. Software-Rendering) einen Kontextverlust bzw.
// React-19-Renderfehler. Die Szene verzichtet daher bewusst auf beides und
// nutzt ausschließlich einfache Mesh-Primitives, deren Position/Sichtbarkeit
// jeweils direkt im eigenen useFrame aus der Three.js-Clock berechnet wird
// (kein React-State pro Frame – das würde 60 Re-Renders/Sekunde bedeuten).
// Die Beschriftungen der Stationen stehen als barrierefreier Text unter der
// Animation (siehe SupplyChain.tsx).

const CYCLE = 18; // Sekunden für einen vollständigen Durchlauf

const PLANE_START = new THREE.Vector3(-4.4, 2.6, -2.6);
const PLANE_ARRIVE = new THREE.Vector3(0, 1.05, -1.15);
const WAREHOUSE_POS = new THREE.Vector3(0, 0, -0.3);
const SHELF_POS = new THREE.Vector3(0.25, 0.42, 0.35);
const WORKER_POS = new THREE.Vector3(0.55, 0, 0.45);
const SHOP_POS = new THREE.Vector3(2.6, 0, 0.5);

// Phasenfenster (in Sekunden) innerhalb eines Zyklus
const PHASE = {
  flight: [0, 7] as const,
  unload: [7, 9.5] as const,
  delivery: [9.5, 14.5] as const,
  reset: [14.5, 18] as const,
};

function easeInOutCubic(x: number) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function clamp01(x: number) {
  return Math.min(1, Math.max(0, x));
}

function phaseProgress(t: number, [start, end]: readonly [number, number]) {
  return easeInOutCubic(clamp01((t - start) / (end - start)));
}

function cycleTime(elapsed: number) {
  return elapsed % CYCLE;
}

function Plane() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = cycleTime(clock.elapsedTime);
    const progress = phaseProgress(t, PHASE.flight);
    const visible = t < PHASE.unload[0] + 0.3;

    const pos = PLANE_START.clone().lerp(PLANE_ARRIVE, progress);
    pos.y += Math.sin(progress * Math.PI) * 0.9; // Sinkflugbogen
    ref.current.position.copy(pos);

    const scale = visible ? 1 - progress * 0.55 : 0;
    ref.current.scale.setScalar(scale);

    const dir = PLANE_ARRIVE.clone().sub(PLANE_START).normalize();
    ref.current.rotation.set(-0.15, Math.atan2(dir.x, dir.z), 0);
  });

  return (
    <group ref={ref}>
      <group scale={0.32}>
        <mesh>
          <capsuleGeometry args={[0.3, 1.3, 4, 8]} />
          <meshStandardMaterial color="#FAFAF8" />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.08, 1.7, 0.5]} />
          <meshStandardMaterial color="#FAFAF8" />
        </mesh>
        <mesh position={[-0.68, 0.2, 0]}>
          <boxGeometry args={[0.08, 0.5, 0.3]} />
          <meshStandardMaterial color="#FAFAF8" />
        </mesh>
        <mesh position={[0.72, 0, 0]}>
          <boxGeometry args={[0.1, 0.16, 0.16]} />
          <meshStandardMaterial color="#C1653F" />
        </mesh>
      </group>
    </group>
  );
}

function Warehouse() {
  return (
    <group position={WAREHOUSE_POS}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.9, 1.1]} />
        <meshStandardMaterial color="#0B5643" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.94, 0]}>
        <boxGeometry args={[1.6, 0.08, 1.2]} />
        <meshStandardMaterial color="#5DCAA5" roughness={0.6} />
      </mesh>
      {/* Tor/Öffnung */}
      <mesh position={[0, 0.28, 0.56]}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
        <meshStandardMaterial color="#073B2E" />
      </mesh>
      {/* Regal mit Kisten */}
      <mesh position={[0.3, 0.42, 0.4]}>
        <boxGeometry args={[0.55, 0.03, 0.28]} />
        <meshStandardMaterial color="#FAFAF8" />
      </mesh>
      <mesh position={[0.15, 0.34, 0.42]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#E8A377" />
      </mesh>
      <mesh position={[0.36, 0.34, 0.42]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#5DCAA5" />
      </mesh>
    </group>
  );
}

function Worker() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = cycleTime(clock.elapsedTime);
    const active = t >= PHASE.unload[0] && t <= PHASE.unload[1] ? 1 : 0;
    const bob = active ? Math.sin(clock.elapsedTime * 6) * 0.03 : 0;
    ref.current.position.set(WORKER_POS.x, WORKER_POS.y + bob, WORKER_POS.z);
    ref.current.rotation.y = -0.4 + active * 0.5;
  });

  return (
    <group ref={ref} position={WORKER_POS}>
      <mesh position={[0, 0.16, 0]}>
        <capsuleGeometry args={[0.07, 0.2, 4, 8]} />
        <meshStandardMaterial color="#0F6E56" />
      </mesh>
      <mesh position={[0, 0.34, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#E8A377" />
      </mesh>
    </group>
  );
}

function DeliveryCrate() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = cycleTime(clock.elapsedTime);
    const progress = phaseProgress(t, PHASE.unload);
    const start = PLANE_ARRIVE.clone().setY(0.12);
    const pos = start.lerp(SHELF_POS.clone().setY(0.5), progress);
    ref.current.position.copy(pos);
    ref.current.visible = progress > 0.01 && progress < 0.99;
    ref.current.rotation.y = progress * Math.PI;
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.16, 0.16, 0.16]} />
      <meshStandardMaterial color="#C1653F" />
    </mesh>
  );
}

function Shop() {
  return (
    <group position={SHOP_POS}>
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[0.9, 0.64, 0.8]} />
        <meshStandardMaterial color="#FAFAF8" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[1, 0.1, 0.9]} />
        <meshStandardMaterial color="#C1653F" />
      </mesh>
      <mesh position={[0, 0.2, 0.41]}>
        <boxGeometry args={[0.4, 0.36, 0.02]} />
        <meshStandardMaterial color="#0F6E56" />
      </mesh>
    </group>
  );
}

function Truck() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = cycleTime(clock.elapsedTime);
    const progress = phaseProgress(t, PHASE.delivery);
    const visible = t >= PHASE.unload[1] - 0.5 && t < PHASE.reset[0] + 0.3;

    const pos = WAREHOUSE_POS.clone()
      .setY(0.14)
      .lerp(SHOP_POS.clone().setY(0.14), progress);
    ref.current.position.copy(pos);
    ref.current.scale.setScalar(visible ? 0.24 : 0);
    ref.current.rotation.y = -Math.PI / 2.4;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[1.2, 0.6, 0.6]} />
        <meshStandardMaterial color="#0F6E56" />
      </mesh>
      <mesh position={[0.58, 0.1, 0]}>
        <boxGeometry args={[0.3, 0.4, 0.55]} />
        <meshStandardMaterial color="#5DCAA5" />
      </mesh>
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <circleGeometry args={[4.4, 48]} />
      <meshStandardMaterial color="#0B5643" roughness={0.95} />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  const keyframes = useMemo(
    () => [
      { time: 0, pos: new THREE.Vector3(-2.6, 3.1, 4.4), look: new THREE.Vector3(-1.2, 1, -0.4) },
      { time: PHASE.flight[1], pos: new THREE.Vector3(-0.5, 1.7, 2.5), look: WAREHOUSE_POS.clone().setY(0.5) },
      { time: PHASE.unload[1], pos: new THREE.Vector3(0.3, 1.05, 1.6), look: SHELF_POS.clone().setY(0.45) },
      { time: PHASE.delivery[1], pos: new THREE.Vector3(1.7, 1.6, 3.1), look: WAREHOUSE_POS.clone().lerp(SHOP_POS, 0.6).setY(0.4) },
      { time: CYCLE, pos: new THREE.Vector3(-2.6, 3.1, 4.4), look: new THREE.Vector3(-1.2, 1, -0.4) },
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = cycleTime(clock.elapsedTime);
    let i = 0;
    while (i < keyframes.length - 2 && t > keyframes[i + 1].time) i++;
    const a = keyframes[i];
    const b = keyframes[i + 1];
    const span = b.time - a.time || 1;
    const localT = easeInOutCubic(clamp01((t - a.time) / span));

    camera.position.lerpVectors(a.pos, b.pos, localT);
    target.lerpVectors(a.look, b.look, localT);
    camera.lookAt(target);
  });

  return null;
}

function Scene() {
  const routePoints = useMemo(
    () => [PLANE_START, PLANE_ARRIVE.clone().lerp(PLANE_START, 0.35), PLANE_ARRIVE],
    []
  );
  const roadPoints = useMemo(
    () => [WAREHOUSE_POS.clone().setY(0.02), SHOP_POS.clone().setY(0.02)],
    []
  );

  return (
    <>
      <CameraRig />
      <Ground />
      <Line points={routePoints} color="#E8A377" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.05} />
      <Line points={roadPoints} color="#5DCAA5" lineWidth={1.5} dashed dashSize={0.06} gapSize={0.04} />
      <Warehouse />
      <Shop />
      <Worker />
      <Plane />
      <DeliveryCrate />
      <Truck />
    </>
  );
}

export default function SupplyChainCanvas() {
  return (
    <Canvas
      camera={{ position: [-2.6, 3.1, 4.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} />
      <directionalLight position={[-4, -1, -3]} intensity={0.3} color="#C1653F" />
      <Scene />
    </Canvas>
  );
}
