'use client';

import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getGPUTier } from 'detect-gpu';

const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export default function ThreeCanvas() {
    const [dpr, setDpr] = useState(1);
    const [isSupported, setIsSupported] = useState(true);

    useEffect(() => {
        // Basic performance checking
        const checkGPU = async () => {
            try {
                const gpuTier = await getGPUTier();
                setDpr(Math.min(window.devicePixelRatio, 2));

                // Hide canvas entirely if on a really bad mobile device
                if ((gpuTier.fps && gpuTier.fps < 15) || gpuTier.tier === 0) {
                    setIsSupported(false);
                }
            } catch (err) {
                console.warn('GPU Detect failed, falling back to safe defaults.');
            }
        };
        checkGPU();
    }, []);

    if (!isSupported) return <div className="absolute inset-0 bg-base-primary -z-10" aria-hidden="true" />;

    return (
        <div className="fixed inset-0 pointer-events-none -z-10" aria-hidden="true">
            <Canvas dpr={dpr} camera={{ position: [0, 0, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <HeroScene />
                    <ambientLight intensity={0.5} />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
