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
const WORKER_HOME = new THREE.Vector3(0.55, 0, 0.45);
const SHOP_POS = new THREE.Vector3(2.6, 0, 0.5);
// Punkt vor der Markise, an dem das Paket am Ende abgestellt wird.
const SHOP_DROP_POS = new THREE.Vector3(SHOP_POS.x - 0.35, 0, SHOP_POS.z + 0.55);
const PACKAGE_CARRY_OFFSET = new THREE.Vector3(0, 0.3, 0);

// Phasenfenster (in Sekunden) innerhalb eines Zyklus
const PHASE = {
  flight: [0, 7] as const, // Flugzeug bringt das Paket zum Lager
  handoff: [7, 9.5] as const, // Übergabe ans Lager-Personal
  carry: [9.5, 14.5] as const, // Person trägt das Paket zum Laden
  reset: [14.5, 18] as const, // Person geht zurück, Paket bleibt stehen
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

// Zentrale Flug-Positionsberechnung – wird sowohl vom Flugzeug selbst als
// auch von der Kamera und dem Paket genutzt, damit alle exakt synchron
// bleiben (verhindert u.a., dass die Kamera das Flugzeug "verliert").
function getPlaneState(t: number) {
  const progress = phaseProgress(t, PHASE.flight);
  const pos = PLANE_START.clone().lerp(PLANE_ARRIVE, progress);
  pos.y += Math.sin(progress * Math.PI) * 0.9; // Sinkflugbogen
  return { pos, progress };
}

// Zentrale Positionsberechnung für die Lager-Person: steht zunächst am
// Lager, trägt das Paket dann zum Laden und geht leer zurück.
function getWorkerState(t: number) {
  if (t < PHASE.carry[0]) {
    return { pos: WORKER_HOME.clone(), walking: false };
  }
  if (t < PHASE.carry[1]) {
    const p = phaseProgress(t, PHASE.carry);
    return {
      pos: WORKER_HOME.clone().lerp(SHOP_DROP_POS, p),
      walking: p > 0.02 && p < 0.98,
    };
  }
  const p = phaseProgress(t, PHASE.reset);
  return {
    pos: SHOP_DROP_POS.clone().lerp(WORKER_HOME, p),
    walking: p > 0.02 && p < 0.98,
  };
}

// Klar erkennbares, vereinfachtes Flugzeug-Icon: spitz zulaufender Rumpf,
// gerade Tragflächen mittig, Seiten- und Höhenleitwerk am Heck.
function Plane() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = cycleTime(clock.elapsedTime);
    const { pos } = getPlaneState(t);
    const visible = t < PHASE.flight[1] + 0.15;

    ref.current.position.copy(pos);
    ref.current.scale.setScalar(visible ? 1 : 0);

    const dir = PLANE_ARRIVE.clone().sub(PLANE_START).normalize();
    ref.current.rotation.set(-0.12, Math.atan2(dir.x, dir.z), 0);
  });

  return (
    <group ref={ref}>
      <group scale={0.5} rotation={[0, 0, Math.PI / 2]}>
        {/* Rumpf */}
        <mesh>
          <cylinderGeometry args={[0.02, 0.1, 1.3, 10]} />
          <meshStandardMaterial color="#FAFAF8" />
        </mesh>
        {/* Tragflächen */}
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.85, 0.025, 0.22]} />
          <meshStandardMaterial color="#0F6E56" />
        </mesh>
        {/* Höhenleitwerk */}
        <mesh position={[0, -0.55, 0]}>
          <boxGeometry args={[0.34, 0.02, 0.12]} />
          <meshStandardMaterial color="#0F6E56" />
        </mesh>
        {/* Seitenleitwerk */}
        <mesh position={[0, -0.55, 0.08]}>
          <boxGeometry args={[0.02, 0.22, 0.14]} />
          <meshStandardMaterial color="#C1653F" />
        </mesh>
      </group>
    </group>
  );
}

// Braunes Paket: hängt während des Flugs am Flugzeug, wird am Lager
// übergeben, von der Person zum Laden getragen und dort abgestellt.
function Package() {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = cycleTime(clock.elapsedTime);
    let pos: THREE.Vector3;

    if (t < PHASE.flight[1]) {
      const { pos: planePos } = getPlaneState(t);
      pos = planePos.clone().add(new THREE.Vector3(0, -0.24, 0));
    } else if (t < PHASE.handoff[1]) {
      const p = phaseProgress(t, PHASE.handoff);
      const from = PLANE_ARRIVE.clone().add(new THREE.Vector3(0, -0.24, 0));
      const to = WORKER_HOME.clone().add(PACKAGE_CARRY_OFFSET);
      pos = from.lerp(to, p);
    } else if (t < PHASE.carry[1]) {
      const { pos: workerPos } = getWorkerState(t);
      pos = workerPos.clone().add(PACKAGE_CARRY_OFFSET);
    } else {
      pos = SHOP_DROP_POS.clone().add(new THREE.Vector3(0, 0.07, 0));
    }

    ref.current.position.copy(pos);
    ref.current.rotation.y = clock.elapsedTime * 0.4;
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.13, 0.11, 0.13]} />
        <meshStandardMaterial color="#A9754C" />
      </mesh>
      <mesh position={[0, 0.057, 0]}>
        <boxGeometry args={[0.135, 0.01, 0.025]} />
        <meshStandardMaterial color="#7C5334" />
      </mesh>
      <mesh position={[0, 0.057, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.135, 0.01, 0.025]} />
        <meshStandardMaterial color="#7C5334" />
      </mesh>
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
    const { pos, walking } = getWorkerState(t);
    const bob = walking ? Math.abs(Math.sin(clock.elapsedTime * 8)) * 0.035 : 0;
    ref.current.position.set(pos.x, pos.y + bob, pos.z);

    if (walking) {
      const toShop = t < PHASE.carry[1];
      const dir = toShop
        ? SHOP_DROP_POS.clone().sub(WORKER_HOME).normalize()
        : WORKER_HOME.clone().sub(SHOP_DROP_POS).normalize();
      ref.current.rotation.y = Math.atan2(dir.x, dir.z);
    }
  });

  return (
    <group ref={ref} position={WORKER_HOME}>
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

function Shop() {
  // Markisen-Streifen (Café-/Ladenlokal-Look) über dem Eingang
  const stripeCount = 5;
  const stripeWidth = 0.9 / stripeCount;

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
      {/* Fenster/Tür */}
      <mesh position={[0, 0.2, 0.41]}>
        <boxGeometry args={[0.4, 0.36, 0.02]} />
        <meshStandardMaterial color="#0F6E56" />
      </mesh>

      {/* Markise mit Streifen, geneigt über dem Eingang */}
      <group position={[0, 0.44, 0.42]} rotation={[0.5, 0, 0]}>
        {Array.from({ length: stripeCount }).map((_, i) => (
          <mesh key={i} position={[-0.45 + stripeWidth * (i + 0.5), 0, 0]}>
            <boxGeometry args={[stripeWidth, 0.02, 0.26]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#C1653F" : "#FAFAF8"} />
          </mesh>
        ))}
      </group>

      {/* Gestapelte Liefer-Kisten neben dem Eingang (Handel/Großhandel) */}
      <mesh position={[0.58, 0.09, 0.3]}>
        <boxGeometry args={[0.16, 0.16, 0.16]} />
        <meshStandardMaterial color="#5DCAA5" />
      </mesh>
      <mesh position={[0.58, 0.25, 0.3]}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#E8A377" />
      </mesh>
      <mesh position={[0.42, 0.09, 0.34]}>
        <boxGeometry args={[0.14, 0.14, 0.14]} />
        <meshStandardMaterial color="#C1653F" />
      </mesh>

      {/* Kleiner Tisch mit Stuhl (Gastronomie-Terrasse) */}
      <group position={[-0.65, 0, 0.35]}>
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.32, 8]} />
          <meshStandardMaterial color="#073B2E" />
        </mesh>
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
          <meshStandardMaterial color="#FAFAF8" />
        </mesh>
        <mesh position={[0.22, 0.1, 0]}>
          <boxGeometry args={[0.02, 0.2, 0.14]} />
          <meshStandardMaterial color="#0F6E56" />
        </mesh>
      </group>
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

interface CameraKeyframe {
  time: number;
  pos: THREE.Vector3;
  look?: THREE.Vector3;
}

function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);

  const keyframes: CameraKeyframe[] = useMemo(
    () => [
      { time: 0, pos: new THREE.Vector3(-3.1, 2.6, 3.4) },
      { time: PHASE.flight[1], pos: new THREE.Vector3(-0.5, 1.7, 2.5) },
      { time: PHASE.handoff[1], pos: new THREE.Vector3(0.3, 1.05, 1.6), look: WORKER_HOME.clone().setY(0.3) },
      { time: PHASE.carry[1], pos: new THREE.Vector3(2.2, 1.3, 2.2), look: SHOP_DROP_POS.clone().setY(0.3) },
      { time: CYCLE, pos: new THREE.Vector3(-3.1, 2.6, 3.4) },
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = cycleTime(clock.elapsedTime);

    // Während der Flugphase folgt die Kamera live dem Flugzeug, statt über
    // eine unabhängige, potenziell abweichende Kurve zu schwenken – so
    // bleibt das Flugzeug garantiert im Bild.
    if (t <= PHASE.flight[1]) {
      const localT = easeInOutCubic(clamp01(t / PHASE.flight[1]));
      camera.position.lerpVectors(keyframes[0].pos, keyframes[1].pos, localT);
      const { pos: planePos } = getPlaneState(t);
      // Leicht Richtung Lager vorausschauen, damit die Ankunft im Bild bleibt.
      target.lerpVectors(planePos, WAREHOUSE_POS.clone().setY(0.5), 0.25);
      camera.lookAt(target);
      return;
    }

    let i = 1;
    while (i < keyframes.length - 2 && t > keyframes[i + 1].time) i++;
    const a = keyframes[i];
    const b = keyframes[i + 1];
    const span = b.time - a.time || 1;
    const localT = easeInOutCubic(clamp01((t - a.time) / span));

    camera.position.lerpVectors(a.pos, b.pos, localT);
    const aLook = a.look ?? WAREHOUSE_POS.clone().setY(0.5);
    const bLook = b.look ?? WAREHOUSE_POS.clone().setY(0.5);
    target.lerpVectors(aLook, bLook, localT);
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
    () => [WORKER_HOME.clone().setY(0.02), SHOP_DROP_POS.clone().setY(0.02)],
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
      <Package />
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
