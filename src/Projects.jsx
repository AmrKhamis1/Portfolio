import { useRef, useMemo, useEffect, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const GRID_SIZE = 20;
const TOTAL = GRID_SIZE * GRID_SIZE;
const SIZE = 0.18;
const SPACING = 0.24;
const RADIUS = 4;
const BOUNCE_SPEED = 0.02;

export default function Projects({ showWorld }) {
  const meshRef = useRef();

  // avoiding recreation
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
    []
  );
  const mousePos = useRef(new THREE.Vector3());

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

  // scale animation based on showWorld prop
  useEffect(() => {
    if (showWorld && meshRef.current) {
      gsap.to(meshRef.current.scale, { y: 0, x: 0, z: 0, duration: 0.5 });
    } else if (!showWorld && meshRef.current) {
      gsap.to(meshRef.current.scale, {
        y: 1,
        x: 1,
        z: 1,
        duration: 0.5,
      });
    }
  }, [showWorld]);

  // frame update
  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

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

      dummy.position.set(pos.x, pos.y, pos.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, TOTAL]}
        position={MESH_POSITION.toArray()}
        frustumCulled={false}
      />

      {!showWorld && (
        <rectAreaLight
          position={[-5.55, -18, 5.6]}
          color={"#ffaa00"}
          rotation={[Math.PI / 2, 0, 0]}
          intensity={5}
        />
      )}
    </>
  );
}
