'use client';

type ProgressiveBlurProps = {
  direction?: 'left' | 'right' | 'top' | 'bottom';
  blurIntensity?: number;
  className?: string;
};

export function ProgressiveBlur({
  direction = 'left',
  blurIntensity = 1,
  className,
}: ProgressiveBlurProps) {
  const gradientDir = {
    left: 'to right',
    right: 'to left',
    top: 'to bottom',
    bottom: 'to top',
  }[direction];

  const steps = 8;
  const masks = Array.from({ length: steps }, (_, i) => {
    const start = (i / steps) * 100;
    const end = ((i + 1) / steps) * 100;
    const blur = ((steps - i) / steps) * blurIntensity * 8;
    return { start, end, blur };
  });

  return (
    <div
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
      aria-hidden
    >
      {masks.map((m, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            backdropFilter: `blur(${m.blur}px)`,
            WebkitBackdropFilter: `blur(${m.blur}px)`,
            maskImage: `linear-gradient(${gradientDir}, transparent ${m.start}%, black ${m.start}%, black ${m.end}%, transparent ${m.end}%)`,
            WebkitMaskImage: `linear-gradient(${gradientDir}, transparent ${m.start}%, black ${m.start}%, black ${m.end}%, transparent ${m.end}%)`,
          }}
        />
      ))}
    </div>
  );
}
