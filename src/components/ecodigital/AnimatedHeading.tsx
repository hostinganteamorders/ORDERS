'use client';

import { useEffect, useState } from 'react';

type AnimatedHeadingProps = {
    text: string;
    className?: string;
    initialDelay?: number;
    charDelay?: number;
    duration?: number;
};

export default function AnimatedHeading({
    text,
    className = '',
    initialDelay = 200,
    charDelay = 30,
    duration = 500,
}: AnimatedHeadingProps) {
    const [isVisible, setIsVisible] = useState(false);
    const lines = text.split('\n');

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setIsVisible(true);
        }, initialDelay);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [initialDelay]);

    return (
        <h1 className={className} style={{ letterSpacing: '-0.04em' }}>
            {lines.map((line, lineIndex) => (
                <span key={`${line}-${lineIndex}`} className="block">
                    {Array.from(line).map((char, charIndex) => {
                        const delay = (lineIndex * line.length * charDelay) + (charIndex * charDelay);

                        return (
                            <span
                                key={`${char}-${charIndex}`}
                                className="inline-block will-change-transform"
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateX(0)' : 'translateX(-18px)',
                                    transitionProperty: 'opacity, transform',
                                    transitionDuration: `${duration}ms`,
                                    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                                    transitionDelay: `${delay}ms`,
                                }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        );
                    })}
                </span>
            ))}
        </h1>
    );
}
