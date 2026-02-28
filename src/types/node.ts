export interface NodePosition {
  x: number;
  y: number;
}

export interface NodePort {
  id: string;
  type: 'input' | 'output';
  position: { x: number; y: number };
}

export interface Node {
  id: string;
  type: 'default' | 'trigger' | 'error' | 'suspended';
  position: NodePosition;
  title: string;
  description?: string;
  primaryColor: string;
  ports: {
    inputs: NodePort[];
    outputs: NodePort[];
  };
  status?: 'idle' | 'active' | 'success' | 'error';
  selected?: boolean;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  status?: 'idle' | 'success' | 'error';
  selected?: boolean;
  isAnimating?: boolean;
}

export interface CanvasState {
  zoom: number;
  pan: { x: number; y: number };
  isDragging: boolean;
  isConnecting: boolean;
}
