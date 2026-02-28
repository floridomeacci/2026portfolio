interface ConnectionLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  status?: 'idle' | 'success' | 'error';
  selected?: boolean;
  isTemporary?: boolean;
}

export default function ConnectionLine({
  start,
  end,
  status = 'idle',
  selected = false,
  isTemporary = false,
}: ConnectionLineProps) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const controlPointOffset = Math.abs(dx) * 0.5;

  const path = `M ${start.x} ${start.y} C ${start.x + controlPointOffset} ${start.y}, ${
    end.x - controlPointOffset
  } ${end.y}, ${end.x} ${end.y}`;

  const getStrokeColor = () => {
    if (isTemporary) return '#94A3B8';
    if (status === 'success') return '#22C55E';
    if (status === 'error') return '#DC2626';
    return '#94A3B8';
  };

  const strokeWidth = selected ? 3 : 2;
  const opacity = isTemporary ? 0.5 : 1;

  return (
    <>
      <path
        d={path}
        fill="none"
        stroke={getStrokeColor()}
        strokeWidth={strokeWidth}
        opacity={opacity}
        strokeDasharray={selected ? '8 8' : 'none'}
        className={selected ? 'animate-dash' : ''}
        style={{
          pointerEvents: 'stroke',
        }}
      />
      {selected && (
        <path
          d={path}
          fill="none"
          stroke="transparent"
          strokeWidth={10}
          style={{ pointerEvents: 'stroke', cursor: 'pointer' }}
        />
      )}
    </>
  );
}
