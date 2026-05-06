'use client';

import { useEffect, useState, type ReactNode } from 'react';

type FadeInProps = {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
};

export default function FadeIn({
    children,
    delay = 0,
    duration = 1000,
    className = '',
}: FadeInProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [delay]);

    return (
        <div
            className={[
                'transition-opacity',
                isVisible ? 'opacity-100' : 'opacity-0',
                className,
            ].filter(Boolean).join(' ')}
            style={{ transitionDuration: `${duration}ms` }}
        >
            {children}
        </div>
    );
}
