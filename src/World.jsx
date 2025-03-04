import { useGLTF } from "@react-three/drei";

export default function World() {
  const { nodes } = useGLTF("./models/new room/world.glb");

  return (
    <>
      <group
        position={[0, -17, 0]}
        rotation={[0, 0, 0]}
        scale={[12.5, 12.5, 12.5]}
      >
        {Object.keys(nodes).map((key) => {
          const node = nodes[key];
          if (node.isMesh) {
            return (
              <mesh
                key={key}
                scale={node.scale}
                position={node.position}
                rotation={node.rotation}
                geometry={node.geometry}
                material={node.material}
              >
                {/* <meshStandardMaterial map={modelMaterial} /> */}
              </mesh>
            );
          }
          return null;
        })}
        <pointLight intensity={90} position={[0, 5, 0]} />
      </group>
    </>
  );
}
