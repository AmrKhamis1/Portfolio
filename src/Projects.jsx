import { useRef, useMemo, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GRID_SIZE = 20;
const TOTAL = GRID_SIZE * GRID_SIZE;
const SIZE = 0.18;
const SPACING = 0.24;
const RADIUS = 4;
const BOUNCE_SPEED = 0.02;
const LOGO_HEIGHT_OFFSET = 4;

// react logo component
function ReactLogo({ position, rotation }) {
  const groupRef = useRef();

  // materials
  const materials = useMemo(
    () => ({
      orbit: new THREE.MeshStandardMaterial({
        color: "blue",
        metalness: 0,
        roughness: 1,
      }),
      nucleus: new THREE.MeshStandardMaterial({
        color: "blue",
        metalness: 0,
        roughness: 1,
        emissive: "blue",
        emissiveIntensity: 0.3,
      }),
    }),
    []
  );

  // geometries
  const geometries = useMemo(
    () => ({
      sphere: new THREE.SphereGeometry(0.7, 32, 32),
      torus: new THREE.TorusGeometry(2, 0.2, 16, 64),
    }),
    []
  );

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      scale={[0.5, 0.5, 0.5]}
    >
      <mesh geometry={geometries.sphere} material={materials.nucleus} />

      <group rotation={[0, 0, 0]}>
        <mesh geometry={geometries.torus} material={materials.orbit} />
      </group>

      <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh geometry={geometries.torus} material={materials.orbit} />
      </group>

      <group rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <mesh geometry={geometries.torus} material={materials.orbit} />
      </group>
    </group>
  );
}

export default function Projects() {
  const logoRef = useRef();
  const pointRef = useRef();
  const meshRef = useRef();

  // avoiding recreation
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );
  const mousePos = useRef(new THREE.Vector3());
  const waveHeight = useRef(0);

  // positions array
  const positions = useMemo(() => {
    const pos = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const px = (x - GRID_SIZE / 2) * SPACING;
        const pz = (z - GRID_SIZE / 2) * SPACING;
        pos.push({ x: px, z: pz, y: 0 });
      }
    }
    return pos;
  }, []);

  // mesh position
  const MESH_POSITION = useMemo(() => new THREE.Vector3(-5.55, -16.5, 5.6), []);

  // material
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: 0x441111,
        roughness: 0.8,
        metalness: 0.0,
        transparent: true,
      }),
    []
  );

  // geometry
  const geometry = useMemo(
    () => new THREE.BoxGeometry(SIZE, SIZE * 10, SIZE),
    []
  );

  const { camera, size } = useThree();

  // plane to match the mesh position
  useEffect(() => {
    plane.constant = -MESH_POSITION.y;
  }, [plane, MESH_POSITION]);

  // mouse move handler
  const handleMouseMove = useCallback(
    (e) => {
      const mouse = new THREE.Vector2(
        (e.clientX / size.width) * 2 - 1,
        -(e.clientY / size.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      const intersection = raycaster.ray.intersectPlane(
        plane,
        new THREE.Vector3()
      );

      if (intersection) {
        mousePos.current.copy(intersection).sub(MESH_POSITION);
      }
    },
    [camera, raycaster, plane, size, MESH_POSITION]
  );

  // mouse movement
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // frame update
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    let maxHeight = 0;
    const mouseX = mousePos.current.x;
    const mouseZ = mousePos.current.z;

    // batch matrix updates
    for (let i = 0; i < TOTAL; i++) {
      const pos = positions[i];
      const dx = pos.x - mouseX;
      const dz = pos.z - mouseZ;
      const distSq = dx * dx + dz * dz;
      const dist = Math.sqrt(distSq);

      const strength = Math.max(0, 0.5 - dist / RADIUS);
      const targetY = strength * 4;
      pos.y += (targetY - pos.y) * BOUNCE_SPEED;

      // track max height near mouse
      if (dist < 0.5 && pos.y > maxHeight) {
        maxHeight = pos.y;
      }

      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    waveHeight.current = maxHeight;
    mesh.instanceMatrix.needsUpdate = true;

    // Update logo and light positions
    if (logoRef.current && pointRef.current) {
      const halfGrid = (GRID_SIZE * SPACING) / 2;
      const clampedX = THREE.MathUtils.clamp(mouseX, -halfGrid, halfGrid);
      const clampedZ = THREE.MathUtils.clamp(mouseZ, -halfGrid, halfGrid);

      const targetPos = new THREE.Vector3(
        clampedX + MESH_POSITION.x,
        waveHeight.current + LOGO_HEIGHT_OFFSET + MESH_POSITION.y,
        clampedZ + MESH_POSITION.z
      );

      logoRef.current.position.lerp(targetPos, 0.1);

      const logoPos = logoRef.current.position;
      pointRef.current.position.set(logoPos.x, logoPos.y - 2, logoPos.z);
    }
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, TOTAL]}
        position={MESH_POSITION.toArray()}
        frustumCulled={false}
      />

      <group ref={logoRef} position={MESH_POSITION.toArray()}>
        {/* <ReactLogo position={[0, 0, 0]} rotation={[0, 0, 0]} /> */}
      </group>

      {/* <pointLight color="blue" intensity={100} ref={pointRef} /> */}

      <rectAreaLight
        position={[-5.55, -18, 5.6]}
        color={"#ffaa00"}
        rotation={[Math.PI / 2, 0, 0]}
        intensity={5}
      />
    </>
  );
}
