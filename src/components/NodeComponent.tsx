import { useRef } from 'react';
import { Node } from '../types/node';
import NodePort from './NodePort';

interface NodeComponentProps {
  node: Node;
  onDragStart: (nodeId: string, offsetX: number, offsetY: number) => void;
  onPortDragStart: (nodeId: string, portId: string, position: { x: number; y: number }) => void;
  onPortDrop: (nodeId: string, portId: string) => void;
  onSelect: (nodeId: string, multiSelect: boolean) => void;
  isDragging: boolean;
  isConnecting: boolean;
}

export default function NodeComponent({
  node,
  onDragStart,
  onPortDragStart,
  onPortDrop,
  onSelect,
  isDragging,
  isConnecting,
}: NodeComponentProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      e.stopPropagation();
      const rect = nodeRef.current?.getBoundingClientRect();
      if (rect) {
        const offsetX = (e.clientX - rect.left) / (rect.width / 280);
        const offsetY = (e.clientY - rect.top) / (rect.height / nodeRef.current!.offsetHeight);
        onDragStart(node.id, offsetX, offsetY);
      }
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(node.id, e.shiftKey || e.metaKey || e.ctrlKey);
  };

  const getNodeStyles = () => {
    const baseStyles = 'absolute transition-all duration-150';
    let borderStyle = 'border border-slate-300';
    let backgroundStyle = 'bg-gradient-to-b from-white to-slate-50';
    let shadowStyle = 'shadow-[0_4px_12px_rgba(15,23,42,0.08)]';
    let shapeStyle = 'rounded-lg';

    if (node.type === 'trigger') {
      shapeStyle = 'rounded-full';
      borderStyle = 'border-2 border-sky-500';
      backgroundStyle = 'bg-gradient-to-b from-sky-50 to-white';
    }

    if (node.type === 'error') {
      borderStyle = 'border-2 border-red-600 border-dashed';
      backgroundStyle = 'bg-gradient-to-b from-slate-50 to-slate-100';
    }

    if (node.type === 'suspended') {
      borderStyle = 'border-2 border-orange-500 border-dashed';
      backgroundStyle = 'bg-gradient-to-b from-slate-50 to-slate-100';
    }

    if (node.selected) {
      borderStyle = 'border-2 border-blue-600 ring-2 ring-blue-200';
    }

    if (isDragging) {
      shadowStyle = 'shadow-[0_8px_24px_rgba(15,23,42,0.16)] opacity-85';
      borderStyle += ' border-dotted border-blue-400';
    }

    return `${baseStyles} ${shapeStyle} ${borderStyle} ${backgroundStyle} ${shadowStyle}`;
  };

  const getHeaderColor = () => {
    if (node.status === 'error') return 'bg-red-600';
    if (node.status === 'success') return 'bg-green-500';
    return node.primaryColor;
  };

  return (
    <div
      ref={nodeRef}
      className={getNodeStyles()}
      style={{
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
        width: '280px',
        transform: isDragging ? 'translateY(-4px)' : 'none',
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      <div className={`h-0.5 ${getHeaderColor()} rounded-t-lg`} />

      {node.type === 'error' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 rounded-l-lg" />
      )}

      <div className="px-3.5 py-3 relative">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-sm leading-tight" style={{ color: '#000000', opacity: 0.25, fontWeight: 300 }}>{node.title}</h3>
          {node.status && (
            <div
              className={`w-2 h-2 rounded-full ml-2 mt-1 flex-shrink-0 ${
                node.status === 'success'
                  ? 'bg-green-500'
                  : node.status === 'error'
                  ? 'bg-red-600'
                  : node.status === 'active'
                  ? 'bg-blue-600 animate-pulse'
                  : 'bg-slate-400'
              }`}
            />
          )}
        </div>

        {node.description && (
          <p className="text-xs text-slate-600 leading-relaxed">{node.description}</p>
        )}

        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2">
          {node.ports.inputs.map(port => (
            <NodePort
              key={port.id}
              port={port}
              nodeId={node.id}
              onDragStart={onPortDragStart}
              onDrop={onPortDrop}
              isConnecting={isConnecting}
            />
          ))}
        </div>

        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          {node.ports.outputs.map(port => (
            <NodePort
              key={port.id}
              port={port}
              nodeId={node.id}
              onDragStart={onPortDragStart}
              onDrop={onPortDrop}
              isConnecting={isConnecting}
            />
          ))}
        </div>
      </div>

      {(node.type === 'error' || node.type === 'suspended') && (
        <div className="px-3.5 pb-3 pt-1">
          <div
            className={`text-xs px-2 py-1 rounded ${
              node.type === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-orange-50 text-orange-700 border border-orange-200'
            }`}
          >
            {node.type === 'error' ? 'Configuration Error' : 'Awaiting Configuration'}
          </div>
        </div>
      )}
    </div>
  );
}
