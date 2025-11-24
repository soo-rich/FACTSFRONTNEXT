import { Node3D } from "./Node3D";

export function Tree3D({ node, depth = 0, angle = 0, radius = 4 }: { node: any; depth?: number; angle?: number; radius?: number }) {
  const x = Math.cos(angle) * radius;
  const y = -depth * 2;
  const z = Math.sin(angle) * radius;

  return (
    <group>
      <Node3D node={node} position={[x, y, z]} />

      {node.children?.map((child: any, i: number) => {
        const step = (Math.PI * 2) / node.children.length;
        const childAngle = angle + i * step;

        return (
          <Tree3D
            key={child.id}
            node={child}
            depth={depth + 1}
            angle={childAngle}
            radius={radius + 2}
          />
        );
      })}
    </group>
  );
}
