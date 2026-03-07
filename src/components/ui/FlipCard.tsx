'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface FlipCardData {
    /** DiceBear icon URL */
    iconUrl: string;
    /** Service title */
    title: string;
    /** Short tagline shown on front */
    tagline: string;
    /** Detailed description on back */
    description: string;
    /** Feature list on back */
    features: string[];
    /** Gradient colors for accent */
    gradient: string;
    /** Accent color for highlights */
    accentColor: string;
}

interface FlipCardProps {
    data: FlipCardData;
    index: number;
}

export default function FlipCard({ data, index }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            className="flip-card-container"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* ── FRONT ── */}
                <div className="flip-card-face flip-card-front">
                    {/* Floating decorative circle */}
                    <div
                        className="flip-card-circle"
                        style={{ background: `${data.accentColor}12` }}
                    />

                    {/* DiceBear Icon */}
                    <div className="flip-card-icon-wrapper">
                        <Image
                            src={data.iconUrl}
                            alt={data.title}
                            width={72}
                            height={72}
                            className="flip-card-dicebear-icon"
                            unoptimized
                        />
                    </div>

                    {/* Title */}
                    <h3 className="flip-card-title">{data.title}</h3>

                    {/* Tagline */}
                    <p className="flip-card-tagline">{data.tagline}</p>

                    {/* Hover hint */}
                    <div className="flip-card-hint">
                        <span
                            className="flip-card-hint-dot"
                            style={{ background: data.accentColor }}
                        />
                        Lihat Detail
                    </div>
                </div>

                {/* ── BACK ── */}
                <div className="flip-card-face flip-card-back">
                    {/* Gradient background */}
                    <div
                        className="flip-card-back-gradient"
                        style={{ background: data.gradient }}
                    />

                    {/* Content */}
                    <div className="flip-card-back-content">
                        <div className="flip-card-back-icon-wrapper">
                            <Image
                                src={data.iconUrl}
                                alt={data.title}
                                width={40}
                                height={40}
                                className="flip-card-back-dicebear"
                                unoptimized
                            />
                        </div>

                        <h3 className="flip-card-back-title">{data.title}</h3>

                        <p className="flip-card-back-desc">{data.description}</p>

                        {/* Features */}
                        <div className="flip-card-features">
                            {data.features.map((feature, i) => (
                                <div key={i} className="flip-card-feature">
                                    <svg
                                        className="flip-card-check"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
