'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    magneticPull?: number; // How strongly it pulls toward cursor (0.1 to 0.5)
}

export default function MagneticButton({
    children,
    className = '',
    magneticPull = 0.3,
    ...props
}: MagneticButtonProps) {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const button = buttonRef.current;
        if (!button) return;

        const xTo = gsap.quickTo(button, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
        const yTo = gsap.quickTo(button, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });

        let textXTo: any, textYTo: any;
        if (textRef.current) {
            textXTo = gsap.quickTo(textRef.current, 'x', { duration: 1, ease: 'elastic.out(1, 0.3)' });
            textYTo = gsap.quickTo(textRef.current, 'y', { duration: 1, ease: 'elastic.out(1, 0.3)' });
        }

        const mouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = button.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);

            xTo(x * magneticPull);
            yTo(y * magneticPull);

            if (textXTo && textYTo) {
                textXTo(x * (magneticPull * 0.5));
                textYTo(y * (magneticPull * 0.5));
            }
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
            if (textXTo && textYTo) {
                textXTo(0);
                textYTo(0);
            }
        };

        button.addEventListener('mousemove', mouseMove);
        button.addEventListener('mouseleave', mouseLeave);

        return () => {
            button.removeEventListener('mousemove', mouseMove);
            button.removeEventListener('mouseleave', mouseLeave);
        };
    }, [magneticPull]);

    return (
        <button
            ref={buttonRef}
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-medium transition-colors ${className}`}
            {...props}
        >
            <div ref={textRef} className="relative z-10 pointer-events-none">
                {children}
            </div>
        </button>
    );
}
