import { useRef, useState, useCallback, useEffect } from 'react';
import { Node, Connection, CanvasState } from '../types/node';
import NodeComponent from './NodeComponent';
import ConnectionLine from './ConnectionLine';
import { GridBackground } from './GridBackground';

interface CanvasProps {
  nodes: Node[];
  connections: Connection[];
  onNodeUpdate: (nodeId: string, updates: Partial<Node>) => void;
  onConnectionCreate: (connection: Omit<Connection, 'id'>) => void;
  onNodeSelect: (nodeId: string, multiSelect: boolean) => void;
  onCanvasClick: () => void;
}

export default function Canvas({
  nodes,
  connections,
  onNodeUpdate,
  onConnectionCreate,
  onNodeSelect,
  onCanvasClick,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 1,
    pan: { x: 0, y: 0 },
    isDragging: false,
    isConnecting: false,
  });

  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connectingFrom, setConnectingFrom] = useState<{
    nodeId: string;
    portId: string;
    position: { x: number; y: number };
  } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newZoom = Math.min(Math.max(0.1, canvasState.zoom + delta), 3);

    setCanvasState(prev => ({
      ...prev,
      zoom: newZoom,
    }));
  }, [canvasState.zoom]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => canvas.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.target === canvasRef.current)) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasState.pan.x, y: e.clientY - canvasState.pan.y });
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });

    if (isPanning) {
      setCanvasState(prev => ({
        ...prev,
        pan: {
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        },
      }));
    }

    if (draggedNode) {
      const newX = (e.clientX - canvasState.pan.x) / canvasState.zoom - dragOffset.x;
      const newY = (e.clientY - canvasState.pan.y) / canvasState.zoom - dragOffset.y;

      onNodeUpdate(draggedNode, {
        position: { x: newX, y: newY },
      });
    }
  }, [isPanning, panStart, draggedNode, dragOffset, canvasState.pan, canvasState.zoom, onNodeUpdate]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggedNode(null);

    if (connectingFrom) {
      setConnectingFrom(null);
      setCanvasState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [connectingFrom]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const handleNodeDragStart = (nodeId: string, offsetX: number, offsetY: number) => {
    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
    setCanvasState(prev => ({ ...prev, isDragging: true }));
  };

  const handlePortDragStart = (nodeId: string, portId: string, position: { x: number; y: number }) => {
    setConnectingFrom({ nodeId, portId, position });
    setCanvasState(prev => ({ ...prev, isConnecting: true }));
  };

  const handlePortDrop = (targetNodeId: string, targetPortId: string) => {
    if (connectingFrom && connectingFrom.nodeId !== targetNodeId) {
      onConnectionCreate({
        sourceNodeId: connectingFrom.nodeId,
        sourcePortId: connectingFrom.portId,
        targetNodeId,
        targetPortId,
        status: 'idle',
      });
    }
    setConnectingFrom(null);
    setCanvasState(prev => ({ ...prev, isConnecting: false }));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.currentTarget === canvasRef.current) {
      onCanvasClick();
    }
  };

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-screen overflow-hidden bg-slate-50 cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onClick={handleCanvasClick}
      style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
    >
      <GridBackground pan={canvasState.pan} zoom={canvasState.zoom} />

      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${canvasState.pan.x}px, ${canvasState.pan.y}px) scale(${canvasState.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <svg className="absolute inset-0 pointer-events-none" style={{ width: '10000px', height: '10000px' }}>
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.sourceNodeId);
            const targetNode = nodes.find(n => n.id === connection.targetNodeId);
            const sourcePort = sourceNode?.ports.outputs.find(p => p.id === connection.sourcePortId);
            const targetPort = targetNode?.ports.inputs.find(p => p.id === connection.targetPortId);

            if (!sourceNode || !targetNode || !sourcePort || !targetPort) return null;

            return (
              <ConnectionLine
                key={connection.id}
                start={{
                  x: sourceNode.position.x + sourcePort.position.x,
                  y: sourceNode.position.y + sourcePort.position.y,
                }}
                end={{
                  x: targetNode.position.x + targetPort.position.x,
                  y: targetNode.position.y + targetPort.position.y,
                }}
                status={connection.status}
                selected={connection.selected}
              />
            );
          })}

          {connectingFrom && (
            <ConnectionLine
              start={connectingFrom.position}
              end={{
                x: (mousePosition.x - canvasState.pan.x) / canvasState.zoom,
                y: (mousePosition.y - canvasState.pan.y) / canvasState.zoom,
              }}
              status="idle"
              isTemporary
            />
          )}
        </svg>

        {nodes.map(node => (
          <NodeComponent
            key={node.id}
            node={node}
            onDragStart={handleNodeDragStart}
            onPortDragStart={handlePortDragStart}
            onPortDrop={handlePortDrop}
            onSelect={onNodeSelect}
            isDragging={draggedNode === node.id}
            isConnecting={canvasState.isConnecting}
          />
        ))}
      </div>

      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg px-4 py-2 text-sm text-slate-600 border border-slate-200">
        Zoom: {Math.round(canvasState.zoom * 100)}%
      </div>
    </div>
  );
}
