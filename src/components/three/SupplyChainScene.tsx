"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const GLOBE_RADIUS = 1.6;

// Grobe, illustrative Koordinaten zur Veranschaulichung der Lieferkette –
// keine exakte Kartografie oder Aussage über tatsächliche Herkunftsländer.
const PRODUCER = { lat: 13, lon: 101 };
const HUB = { lat: 51.2, lon: 6.7 }; // Neuss / NRW
const RETAIL = { lat: 50.1, lon: 8.7 };

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildArc(start: THREE.Vector3, end: THREE.Vector3, lift: number) {
  const mid = start.clone().lerp(end, 0.5);
  mid.normalize().multiplyScalar(GLOBE_RADIUS + lift);
  return new THREE.QuadraticBezierCurve3(start, mid, end);
}

interface StopMarkerProps {
  position: THREE.Vector3;
  color: string;
  pulseOffset: number;
}

// Textlabels (3D-Text bzw. Html-Overlay) verursachten in Testumgebungen mit
// eingeschränktem WebGL (z.B. Software-Rendering) einen Kontextverlust bzw.
// React-19-Renderfehler. Die Stationen sind daher als pulsierende Marker
// dargestellt; die zugehörigen Beschriftungen stehen als barrierefreier
// Text direkt unter der Animation (siehe SupplyChain.tsx).
function StopMarker({ position, color, pulseOffset }: StopMarkerProps) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = (clock.elapsedTime * 0.6 + pulseOffset) % 1;
    const scale = 1 + t * 1.8;
    ringRef.current.scale.setScalar(scale);
    const material = ringRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, 0.5 - t * 0.5);
  });

  return (
    <group position={position.clone().multiplyScalar(1.03)}>
      <mesh>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.115, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

interface VehicleProps {
  curve: THREE.QuadraticBezierCurve3;
  speed: number;
  offset: number;
  color: string;
  shape: "plane" | "truck";
}

function Vehicle({ curve, speed, offset, color, shape }: VehicleProps) {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = (((clock.elapsedTime * speed + offset) % 1) + 1) % 1;
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    ref.current.position.copy(point);
    ref.current.up.copy(point.clone().normalize());
    ref.current.lookAt(point.clone().add(tangent));
  });

  return (
    <group ref={ref}>
      {shape === "plane" ? (
        <group rotation={[0, Math.PI / 2, 0]} scale={0.1}>
          <mesh>
            <capsuleGeometry args={[0.3, 1.3, 4, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.08, 1.6, 0.45]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[-0.65, 0.18, 0]}>
            <boxGeometry args={[0.08, 0.45, 0.28]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      ) : (
        <group scale={0.09}>
          <mesh>
            <boxGeometry args={[1.2, 0.6, 0.6]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <mesh position={[0.55, 0.12, 0]}>
            <boxGeometry args={[0.35, 0.4, 0.55]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Globe() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const producerPos = useMemo(() => latLonToVector3(PRODUCER.lat, PRODUCER.lon, GLOBE_RADIUS), []);
  const hubPos = useMemo(() => latLonToVector3(HUB.lat, HUB.lon, GLOBE_RADIUS), []);
  const retailPos = useMemo(() => latLonToVector3(RETAIL.lat, RETAIL.lon, GLOBE_RADIUS), []);

  const mainArc = useMemo(() => buildArc(producerPos, hubPos, 1.1), [producerPos, hubPos]);
  const lastMileArc = useMemo(() => buildArc(hubPos, retailPos, 0.25), [hubPos, retailPos]);

  const mainArcPoints = useMemo(() => mainArc.getPoints(64), [mainArc]);
  const lastMileArcPoints = useMemo(() => lastMileArc.getPoints(32), [lastMileArc]);

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[GLOBE_RADIUS, 3]} />
        <meshStandardMaterial color="#0F6E56" roughness={0.75} metalness={0.05} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[GLOBE_RADIUS + 0.004, 3]} />
        <meshBasicMaterial color="#5DCAA5" wireframe transparent opacity={0.35} />
      </mesh>

      <Line points={mainArcPoints} color="#E8A377" lineWidth={2.5} dashed dashSize={0.08} gapSize={0.05} />
      <Vehicle curve={mainArc} speed={0.09} offset={0} color="#FAFAF8" shape="plane" />

      <Line points={lastMileArcPoints} color="#C1653F" lineWidth={2.5} dashed dashSize={0.06} gapSize={0.04} />
      <Vehicle curve={lastMileArc} speed={0.18} offset={0.5} color="#C1653F" shape="truck" />

      <StopMarker position={producerPos} color="#E8A377" pulseOffset={0} />
      <StopMarker position={hubPos} color="#5DCAA5" pulseOffset={0.33} />
      <StopMarker position={retailPos} color="#C1653F" pulseOffset={0.66} />
    </group>
  );
}

export default function SupplyChainCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 1.4, 4.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 5, 3]} intensity={1.1} />
      <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#C1653F" />
      <Globe />
    </Canvas>
  );
}
