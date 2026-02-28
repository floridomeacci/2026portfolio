interface GridBackgroundProps {
  pan: { x: number; y: number };
  zoom: number;
}

export function GridBackground({ pan, zoom }: GridBackgroundProps) {
  const gridSize = 16 * zoom;
  const offsetX = pan.x % gridSize;
  const offsetY = pan.y % gridSize;

  return (
    <>
      <div className="absolute inset-0 bg-slate-50" />

      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        <defs>
          <pattern
            id="grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke="rgba(15, 23, 42, 0.05)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.03)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#vignette)" />
      </svg>
    </>
  );
}
