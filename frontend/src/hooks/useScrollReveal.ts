'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (options: {
    yOffset?: number;
    duration?: number;
    delay?: number;
    stagger?: number
} = {}) => {
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const ctx = gsap.context(() => {
            gsap.from(el.children, {
                y: options.yOffset || 40,
                opacity: 0,
                duration: options.duration || 0.8,
                delay: options.delay || 0,
                stagger: options.stagger || 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });
        }, el);

        return () => ctx.revert();
    }, [options]);

    return ref;
};
