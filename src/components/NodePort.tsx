import { useRef, useState } from 'react';
import { NodePort as NodePortType } from '../types/node';

interface NodePortProps {
  port: NodePortType;
  nodeId: string;
  onDragStart: (nodeId: string, portId: string, position: { x: number; y: number }) => void;
  onDrop: (nodeId: string, portId: string) => void;
  isConnecting: boolean;
}

export default function NodePort({ port, nodeId, onDragStart, onDrop, isConnecting }: NodePortProps) {
  const portRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (port.type === 'output') {
      const rect = portRef.current?.getBoundingClientRect();
      if (rect) {
        const parent = portRef.current?.offsetParent as HTMLElement;
        const parentRect = parent?.getBoundingClientRect();
        if (parentRect) {
          onDragStart(nodeId, port.id, {
            x: rect.left - parentRect.left + rect.width / 2,
            y: rect.top - parentRect.top + rect.height / 2,
          });
          setIsActive(true);
        }
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (port.type === 'input' && isConnecting) {
      onDrop(nodeId, port.id);
    }
    setIsActive(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      ref={portRef}
      className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-150 ${
        isActive || isHovered
          ? 'bg-blue-700 scale-120 shadow-[0_0_0_2px_rgba(37,99,235,0.3)]'
          : 'bg-blue-700'
      } ${!isActive && !isHovered ? 'bg-slate-300' : ''}`}
      style={{
        position: 'absolute',
        left: port.position.x,
        top: port.position.y,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}
