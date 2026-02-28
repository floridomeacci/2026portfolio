import { useState } from 'react';
import Canvas from './components/Canvas';
import { Node, Connection } from './types/node';

function App() {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: '1',
      type: 'trigger',
      position: { x: 200, y: 300 },
      title: 'Workflow Trigger',
      description: 'Starts when webhook is called',
      primaryColor: 'bg-sky-500',
      ports: {
        inputs: [],
        outputs: [{ id: 'out-1', type: 'output', position: { x: 0, y: 0 } }],
      },
      status: 'active',
    },
    {
      id: '2',
      type: 'default',
      position: { x: 600, y: 200 },
      title: 'HTTP Request',
      description: 'Fetch data from API endpoint',
      primaryColor: 'bg-blue-600',
      ports: {
        inputs: [{ id: 'in-1', type: 'input', position: { x: 0, y: 0 } }],
        outputs: [{ id: 'out-1', type: 'output', position: { x: 0, y: 0 } }],
      },
      status: 'success',
    },
    {
      id: '3',
      type: 'default',
      position: { x: 600, y: 400 },
      title: 'Data Transform',
      description: 'Process and format response data',
      primaryColor: 'bg-purple-600',
      ports: {
        inputs: [{ id: 'in-1', type: 'input', position: { x: 0, y: 0 } }],
        outputs: [{ id: 'out-1', type: 'output', position: { x: 0, y: 0 } }],
      },
      status: 'idle',
    },
    {
      id: '4',
      type: 'suspended',
      position: { x: 1000, y: 300 },
      title: 'Send Email',
      description: 'Email notification not configured',
      primaryColor: 'bg-orange-500',
      ports: {
        inputs: [{ id: 'in-1', type: 'input', position: { x: 0, y: 0 } }],
        outputs: [],
      },
      status: 'idle',
    },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'c1',
      sourceNodeId: '1',
      sourcePortId: 'out-1',
      targetNodeId: '2',
      targetPortId: 'in-1',
      status: 'success',
    },
    {
      id: 'c2',
      sourceNodeId: '1',
      sourcePortId: 'out-1',
      targetNodeId: '3',
      targetPortId: 'in-1',
      status: 'idle',
    },
  ]);

  const handleNodeUpdate = (nodeId: string, updates: Partial<Node>) => {
    setNodes(prev =>
      prev.map(node => (node.id === nodeId ? { ...node, ...updates } : node))
    );
  };

  const handleConnectionCreate = (connection: Omit<Connection, 'id'>) => {
    const newConnection: Connection = {
      ...connection,
      id: `c${Date.now()}`,
    };
    setConnections(prev => [...prev, newConnection]);
  };

  const handleNodeSelect = (nodeId: string, multiSelect: boolean) => {
    setNodes(prev =>
      prev.map(node => ({
        ...node,
        selected: multiSelect ? (node.id === nodeId ? !node.selected : node.selected) : node.id === nodeId,
      }))
    );
  };

  const handleCanvasClick = () => {
    setNodes(prev => prev.map(node => ({ ...node, selected: false })));
    setConnections(prev => prev.map(conn => ({ ...conn, selected: false })));
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <Canvas
        nodes={nodes}
        connections={connections}
        onNodeUpdate={handleNodeUpdate}
        onConnectionCreate={handleConnectionCreate}
        onNodeSelect={handleNodeSelect}
        onCanvasClick={handleCanvasClick}
      />
    </div>
  );
}

export default App;
