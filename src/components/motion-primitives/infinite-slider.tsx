'use client';
import { useRef, useState } from 'react';
import {
    animate,
    motion,
    useMotionValue,
    useReducedMotion,
} from 'motion/react';

type InfiniteSliderProps = {
    children: React.ReactNode;
    gap?: number;
    speed?: number;
    speedOnHover?: number;
    direction?: 'horizontal' | 'vertical';
    reverse?: boolean;
    className?: string;
};

export function InfiniteSlider({
    children,
    gap = 16,
    speed = 30,
    speedOnHover,
    direction = 'horizontal',
    reverse = false,
    className,
}: InfiniteSliderProps) {
    const [currentSpeed, setCurrentSpeed] = useState(speed);
    const translation = useMotionValue(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const isHorizontal = direction === 'horizontal';

    function startAnimation(overrideSpeed?: number) {
        const container = containerRef.current;
        const inner = innerRef.current;
        if (!container || !inner) return;

        const containerSize = isHorizontal
            ? container.offsetWidth
            : container.offsetHeight;
        const innerSize = isHorizontal
            ? inner.scrollWidth / 2
            : inner.scrollHeight / 2;

        const usedSpeed = overrideSpeed ?? currentSpeed;
        const duration = innerSize / usedSpeed;

        const from = reverse ? -innerSize : 0;
        const to = reverse ? 0 : -innerSize;

        animate(translation, [from, to], {
            duration,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
        });
    }

    return (
        <div
            ref={containerRef}
            className={`overflow-hidden ${className ?? ''}`}
            onMouseEnter={() => {
                if (speedOnHover !== undefined) {
                    setCurrentSpeed(speedOnHover);
                    startAnimation(speedOnHover);
                }
            }}
            onMouseLeave={() => {
                setCurrentSpeed(speed);
                startAnimation(speed);
            }}
        >
            <motion.div
                ref={innerRef}
                className={`flex w-max ${isHorizontal ? 'flex-row' : 'flex-col'}`}
                style={isHorizontal ? { x: translation } : { y: translation }}
                onViewportEnter={() => {
                    if (!prefersReducedMotion) startAnimation();
                }}
            >
                {[children, children].map((child, i) => (
                    <div
                        key={i}
                        className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'}`}
                        style={
                            isHorizontal
                                ? { gap: `${gap}px` }
                                : { gap: `${gap}px` }
                        }
                    >
                        {child}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
