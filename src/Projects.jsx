import { useRef, useMemo, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GRID_SIZE = 20;
const TOTAL = GRID_SIZE * GRID_SIZE;
const SIZE = 0.18;
const SPACING = 0.24;
const RADIUS = 4;
const BOUNCE_SPEED = 0.02;
const LOGO_HEIGHT_OFFSET = 4; // Distance above the wave

// Simple React logo component (placeholder until you provide GLB)
function ReactLogo({ position, rotation }) {
  const groupRef = useRef();

  // Materials
  const orbitMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "blue",
        metalness: 0,
        roughness: 1,
      }),
    []
  );

  const nucleusMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "blue",
        metalness: 0,
        roughness: 1,
        emissive: "blue",
        emissiveIntensity: 0.3,
      }),
    []
  );

  // Animation
  useFrame((state) => {
    if (groupRef.current) {
      // Rotate the entire logo
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
      {/* Nucleus */}
      <mesh material={nucleusMaterial}>
        <sphereGeometry args={[0.7, 32, 32]} />
      </mesh>

      {/* Orbits */}
      <group rotation={[0, 0, 0]}>
        <mesh material={orbitMaterial}>
          <torusGeometry args={[2, 0.2, 16, 64]} />
        </mesh>
      </group>

      <group rotation={[Math.PI / 3, Math.PI / 6, 0]}>
        <mesh material={orbitMaterial}>
          <torusGeometry args={[2, 0.2, 16, 64]} />
        </mesh>
      </group>

      <group rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
        <mesh material={orbitMaterial}>
          <torusGeometry args={[2, 0.2, 16, 64]} />
        </mesh>
      </group>
    </group>
  );
}

export default function Projects() {
  const logoRef = useRef();
  const pointRef = useRef();
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
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

  // Define the mesh position as a constant
  const MESH_POSITION = useMemo(() => new THREE.Vector3(-5.55, -16.5, 5.6), []);

  const mousePos = useRef(new THREE.Vector3());
  const waveHeight = useRef(0);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );
  const { camera, size } = useThree();

  // Set up the plane to match the mesh position
  useEffect(() => {
    // Update the plane's position to match the mesh's position
    plane.constant = -MESH_POSITION.y;
  }, [plane, MESH_POSITION]);

  // UseEffect for mouse move
  useEffect(() => {
    function handleMouseMove(e) {
      const mouse = new THREE.Vector2(
        (e.clientX / size.width) * 2 - 1,
        -(e.clientY / size.height) * 2 + 1
      );
      raycaster.setFromCamera(mouse, camera);

      // Get intersection with the plane
      const intersection = raycaster.ray.intersectPlane(
        plane,
        new THREE.Vector3()
      );

      if (intersection) {
        // Adjust the intersection point by subtracting the mesh position
        // This transforms the world coordinates to local mesh coordinates
        mousePos.current.copy(intersection).sub(MESH_POSITION);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [camera, raycaster, plane, size, MESH_POSITION]);

  // Update the positions of the objects
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    let maxHeight = 0;

    for (let i = 0; i < TOTAL; i++) {
      const pos = positions[i];
      const dx = pos.x - mousePos.current.x;
      const dz = pos.z - mousePos.current.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const strength = Math.max(0, 0.5 - dist / RADIUS);
      const targetY = strength * 4;
      pos.y += (targetY - pos.y) * BOUNCE_SPEED;

      // Find the maximum height at the mouse position
      if (dist < 0.5 && pos.y > maxHeight) {
        maxHeight = pos.y;
      }

      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    // Update the wave height for logo positioning
    waveHeight.current = maxHeight;

    mesh.instanceMatrix.needsUpdate = true;
    if (logoRef.current && pointRef.current) {
      const halfGrid = (GRID_SIZE * SPACING) / 2;

      const clampedX = THREE.MathUtils.clamp(
        mousePos.current.x,
        -halfGrid,
        halfGrid
      );
      const clampedZ = THREE.MathUtils.clamp(
        mousePos.current.z,
        -halfGrid,
        halfGrid
      );

      logoRef.current.position.lerp(
        new THREE.Vector3(
          clampedX + MESH_POSITION.x,
          waveHeight.current + LOGO_HEIGHT_OFFSET + MESH_POSITION.y,
          clampedZ + MESH_POSITION.z
        ),
        0.1 // 10% toward the target each frame
      );
      const logoPos = logoRef.current.position;

      // Copy the logo's X and Z, but lower the Y by 2 meters
      pointRef.current.position.set(
        logoPos.x,
        logoPos.y - 2, // 2 meters under the logo
        logoPos.z
      );
    }
  });

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

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, TOTAL]}
        geometry={new THREE.BoxGeometry(SIZE, SIZE * 10, SIZE)}
        material={material}
        position={MESH_POSITION.toArray()}
      />

      {/* Position the React logo above the wave */}
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
