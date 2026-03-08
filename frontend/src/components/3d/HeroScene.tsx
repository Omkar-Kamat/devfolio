'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeroScene() {
    const pointsRef = useRef<THREE.Points>(null);
    const { mouse, viewport } = useThree();

    const particleCount = 2000;

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // Create soft cyan/blue galaxy
        const colorA = new THREE.Color('#3B82F6');
        const colorB = new THREE.Color('#06B6D4');

        for (let i = 0; i < particleCount; i++) {
            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            const r = Math.cbrt(Math.random()) * 8; // Random radius max 8

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            // Mix colors
            const mixedColor = colorA.clone().lerp(colorB, Math.random());
            colors[i * 3] = mixedColor.r;
            colors[i * 3 + 1] = mixedColor.g;
            colors[i * 3 + 2] = mixedColor.b;
        }
        return [positions, colors];
    }, [particleCount]);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += delta * 0.05;
            pointsRef.current.rotation.x += delta * 0.02;

            // Slight interaction with mouse
            const targetX = (mouse.x * viewport.width) / 20;
            const targetY = (mouse.y * viewport.height) / 20;

            pointsRef.current.rotation.x += 0.01 * (targetY - pointsRef.current.rotation.x);
            pointsRef.current.rotation.y += 0.01 * (targetX - pointsRef.current.rotation.y);
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
                <bufferAttribute
                    attach="attributes-color"
                    args={[colors, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
}
