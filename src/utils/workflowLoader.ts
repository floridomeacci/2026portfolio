import type { Node, Edge } from '@vue-flow/core';

export interface N8nNode {
  id: string;
  name: string;
  type: string;
  typeVersion?: number;
  position: [number, number];
  parameters?: Record<string, any>;
}

export interface N8nConnection {
  node: string;
  type: string;
  index: number;
}

export interface N8nWorkflow {
  name: string;
  nodes: N8nNode[];
  connections: Record<string, Record<string, N8nConnection[][]>>;
}

const nodeTypeIconMap: Record<string, string> = {
  'n8n-nodes-base.httpRequest': '/icons/http.svg',
  'n8n-nodes-base.code': '/icons/code.svg',
  'n8n-nodes-base.webhook': '/icons/webhook.svg',
  'n8n-nodes-base.telegram': '/icons/telegram.svg',
  'n8n-nodes-base.gmail': '/icons/gmail.svg',
  'n8n-nodes-base.googleSheets': '/icons/sheets.svg',
  'n8n-nodes-base.googleDrive': '/icons/drive.svg',
  'n8n-nodes-base.googleSlides': '/icons/slides.svg',
  'n8n-nodes-base.openAi': '/icons/openai.svg',
  'n8n-nodes-base.set': '/icons/set.svg',
  'n8n-nodes-base.filter': '/icons/filter.svg',
  'n8n-nodes-base.merge': '/icons/merge.svg',
  'n8n-nodes-base.switch': '/icons/switch.svg',
  'n8n-nodes-base.splitOut': '/icons/splitout.svg',
  'n8n-nodes-base.if': '/icons/switch.svg',
  'n8n-nodes-base.emailSend': '/icons/smtp.svg',
  'n8n-nodes-base.scheduleTrigger': '/icons/cron.svg',
  'n8n-nodes-base.manualTrigger': '/icons/mousetrigger.svg',
  'n8n-nodes-base.executeWorkflowTrigger': '/icons/onOff.svg',
  'n8n-nodes-base.facebook': '/icons/facebook.svg',
  'n8n-nodes-base.facebookGraphApi': '/icons/facebook.svg',
  'n8n-nodes-base.meta': '/icons/facebook.svg',
  'n8n-nodes-base.instagram': '/icons/facebook.svg',
  'n8n-nodes-base.stopAndError': '/icons/error.svg',
  'n8n-nodes-base.onOff': '/icons/onOff.svg',
  'n8n-nodes-base.limit': '/icons/limit.svg',
  'n8n-nodes-base.summarize': '/icons/image.svg',
  'n8n-nodes-base.readWriteFile': '/icons/readWrite.svg',
  'n8n-nodes-base.ssh': '/icons/ssh.svg',
  'n8n-nodes-base.extractFromFile': '/icons/extract.svg',
  'n8n-nodes-base.wait': '/icons/wait.svg',
  '@n8n/n8n-nodes-langchain.agent': '/icons/aiagent.svg',
  '@n8n/n8n-nodes-langchain.lmChatOpenAi': '/icons/openai.svg',
  '@n8n/n8n-nodes-langchain.openAi': '/icons/openai.svg',
  '@n8n/n8n-nodes-langchain.outputParserStructured': '/icons/json.svg',
  '@n8n/n8n-nodes-langchain.memoryBufferWindow': '/icons/memory.svg',
};

const nodeTypeDisplayMap: Record<string, string> = {
  'n8n-nodes-base.httpRequest': 'HTTP Request',
  'n8n-nodes-base.code': 'Code',
  'n8n-nodes-base.webhook': 'Webhook',
  'n8n-nodes-base.telegram': 'Telegram',
  'n8n-nodes-base.gmail': 'Gmail',
  'n8n-nodes-base.googleSheets': 'Google Sheets',
  'n8n-nodes-base.googleDrive': 'Google Drive',
  'n8n-nodes-base.googleSlides': 'Google Slides',
  'n8n-nodes-base.openAi': 'OpenAI',
  'n8n-nodes-base.set': 'Set',
  'n8n-nodes-base.filter': 'Filter',
  'n8n-nodes-base.merge': 'Merge',
  'n8n-nodes-base.switch': 'Switch',
  'n8n-nodes-base.splitOut': 'Split Out',
  'n8n-nodes-base.if': 'IF',
  'n8n-nodes-base.emailSend': 'Send Email',
  'n8n-nodes-base.scheduleTrigger': 'Schedule Trigger',
  'n8n-nodes-base.manualTrigger': 'Manual Trigger',
  'n8n-nodes-base.facebook': 'Facebook',
  'n8n-nodes-base.meta': 'Meta',
  'n8n-nodes-base.instagram': 'Instagram',
  'n8n-nodes-base.stopAndError': 'Stop and Error',
  'n8n-nodes-base.onOff': 'On/Off',
  'n8n-nodes-base.limit': 'Limit',
  'n8n-nodes-base.readWriteFile': 'Read/Write Files from Disk',
  'n8n-nodes-base.ssh': 'SSH',
  'n8n-nodes-base.extractFromFile': 'Extract from File',
  'n8n-nodes-base.wait': 'Wait',
  '@n8n/n8n-nodes-langchain.agent': 'AI Agent',
  '@n8n/n8n-nodes-langchain.lmChatOpenAi': 'OpenAI Chat Model',
  '@n8n/n8n-nodes-langchain.outputParserStructured': 'Structured Output Parser',
  '@n8n/n8n-nodes-langchain.memoryBufferWindow': 'Simple Memory',
};

function getNodeIcon(type: string, name?: string): string {
  if (type === 'n8n-nodes-base.set' && name && name.startsWith('PRESS ME')) {
    return '/icons/onOff.svg';
  }
  if (type === 'n8n-nodes-base.merge' && name && name.includes('combine')) {
    return '/icons/combine.svg';
  }
  return nodeTypeIconMap[type] || '/icons/webhook.svg';
}

function getNodeDisplayName(type: string, name: string): string {
  return nodeTypeDisplayMap[type] || name;
}

function isTriggerNode(type: string, name?: string): boolean {
  if (type === 'n8n-nodes-base.set' && name && name.startsWith('PRESS ME')) {
    return true;
  }
  return type.includes('Trigger') || type.includes('webhook');
}

function isStickyNote(type: string): boolean {
  return type === 'n8n-nodes-base.stickyNote';
}

function isAISubNode(type: string): boolean {
  return type.includes('langchain') && !type.includes('agent');
}

function isAIAgentNode(type: string): boolean {
  return type.includes('langchain.agent');
}

function getIconColorClass(type: string, name?: string): string | undefined {
  if (type === 'n8n-nodes-base.set' && name && name.startsWith('PRESS ME')) {
    return 'icon-green';
  }
  if (type === '@n8n/n8n-nodes-langchain.lmChatOpenAi' ||
      type === '@n8n/n8n-nodes-langchain.memoryBufferWindow' ||
      type === 'n8n-nodes-base.onOff') {
    return 'icon-gray';
  }
  if (type === '@n8n/n8n-nodes-langchain.outputParserStructured') {
    return 'icon-black';
  }
  if (type === 'n8n-nodes-base.set' ||
      type === 'n8n-nodes-base.filter' ||
      type === 'n8n-nodes-base.switch') {
    return 'icon-blue';
  }
  if (type === 'n8n-nodes-base.if' ||
      type === 'n8n-nodes-base.scheduleTrigger') {
    return 'icon-green';
  }
  if (type === 'n8n-nodes-base.stopAndError' ||
      type === 'n8n-nodes-base.limit') {
    return 'icon-red';
  }
  if (type === 'n8n-nodes-base.wait') {
    return 'icon-dark-red';
  }
  if (type === 'n8n-nodes-base.telegram' ||
      type === 'n8n-nodes-base.facebook' ||
      type === 'n8n-nodes-base.facebookGraphApi' ||
      type === 'n8n-nodes-base.meta' ||
      type === 'n8n-nodes-base.instagram') {
    return 'icon-natural';
  }
  return undefined;
}

export function loadWorkflow(workflow: N8nWorkflow): { nodes: Node[]; edges: Edge[]; startPosition?: { x: number; y: number } } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const nodeIdMap = new Map<string, string>();
  let startPosition: { x: number; y: number } | undefined;

  workflow.nodes.forEach((n8nNode, index) => {
    const nodeId = n8nNode.id || `node-${index}`;
    nodeIdMap.set(n8nNode.name, nodeId);

    const isAISub = isAISubNode(n8nNode.type);
    const isAgent = isAIAgentNode(n8nNode.type);
    const isSticky = isStickyNote(n8nNode.type);
    const isImagePreview = n8nNode.type === 'custom.imagePreview';

    if (isImagePreview) {
      nodes.push({
        id: nodeId,
        type: 'custom',
        position: {
          x: n8nNode.position[0],
          y: n8nNode.position[1]
        },
        data: {
          label: n8nNode.name,
          status: 'idle',
          isImagePreview: true,
          imagePath: n8nNode.parameters?.imagePath || '',
          imageWidth: n8nNode.parameters?.imageWidth || 300,
          imageHeight: n8nNode.parameters?.imageHeight || 400
        }
      });
    } else if (isSticky) {
      const content = n8nNode.parameters?.content || '';
      const isASCIISignature = content.includes('Florido Meacci') && content.includes('Creative Technologist');
      const isStartingPosition = content.includes('<STARTING POSITION>');

      if (isStartingPosition) {
        startPosition = {
          x: n8nNode.position[0],
          y: n8nNode.position[1]
        };
        return;
      }

      if (isASCIISignature) {
        nodes.push({
          id: nodeId,
          type: 'ascii',
          position: {
            x: n8nNode.position[0],
            y: n8nNode.position[1]
          },
          data: {},
          draggable: false,
          selectable: false,
        });
      } else {
        const content = n8nNode.parameters?.content || '';
        let width = n8nNode.parameters?.width || 360;
        let height = n8nNode.parameters?.height || 200;

        // Check if content has image with size and ratio parameters
        const imgMatch = content.match(/<IMG>(.+?)<IMG>/);
        if (imgMatch) {
          const sizeMatch = content.match(/<SIZE>([\d.]+)<SIZE>/);
          const ratioMatch = content.match(/<RATIO>(\d+):(\d+)<RATIO>/);

          if (sizeMatch && ratioMatch) {
            const size = parseFloat(sizeMatch[1]);
            const ratioW = parseInt(ratioMatch[1]);
            const ratioH = parseInt(ratioMatch[2]);

            // Calculate dimensions based on a base width
            const baseWidth = 400;
            width = baseWidth * size;
            height = width * (ratioH / ratioW);
          }
        } else {
          // Make height responsive to text content length
          const textLength = content.replace(/<[^>]+>/g, '').length;
          const lineCount = content.split('\n').length;
          const estimatedHeight = Math.max(200, Math.min(800, lineCount * 35 + textLength * 0.8 + 80));
          height = estimatedHeight;
        }

        const isTextMode = /<TEXT>[\s\S]*?<TEXT>/.test(content);

        nodes.push({
          id: nodeId,
          type: 'sticky',
          position: {
            x: n8nNode.position[0],
            y: n8nNode.position[1]
          },
          data: {
            content: content,
            width: width,
            height: height,
            color: n8nNode.parameters?.color || 4
          },
          style: {
            width: `${width}px`,
            height: 'auto',
            minHeight: '150px',
          },
          class: isTextMode ? 'text-overlay-node' : undefined,
          zIndex: isTextMode ? -1 : undefined
        });
      }
    } else {
      const isSummarizeNode = n8nNode.type === 'n8n-nodes-base.summarize';

      if (isSummarizeNode && n8nNode.notes) {
        const gameMatch = n8nNode.notes.match(/<GAME>COBRA<GAME>/);
        const imgMatch = n8nNode.notes.match(/<IMG>(.+?)<IMG>/);
        const videoMatch = n8nNode.notes.match(/<VIDEO>(.+?)<VIDEO>/);
        const sizeMatch = n8nNode.notes.match(/<SIZE>([\d.]+)<SIZE>/);
        const ratioMatch = n8nNode.notes.match(/<RATIO>(\d+):(\d+)<RATIO>/);

        if (gameMatch) {
          nodes.push({
            id: nodeId,
            type: 'cobraGame',
            position: {
              x: n8nNode.position[0],
              y: n8nNode.position[1]
            },
            data: {
              isCobraGame: true
            }
          });
          return;
        } else if ((imgMatch || videoMatch) && sizeMatch && ratioMatch) {
          const mediaName = imgMatch ? imgMatch[1] : videoMatch![1];
          const isVideo = !!videoMatch;
          const size = parseFloat(sizeMatch[1]);
          const ratioW = parseInt(ratioMatch[1]);
          const ratioH = parseInt(ratioMatch[2]);

          const baseWidth = 400;
          const width = baseWidth * size;
          const height = width * (ratioH / ratioW);

          console.log(`Creating ${isVideo ? 'video' : 'image'} preview node:`, {
            name: n8nNode.name,
            mediaName,
            width,
            height,
            mediaPath: `/images/${mediaName}`
          });

          nodes.push({
            id: nodeId,
            type: isVideo ? 'videoPreview' : 'custom',
            position: {
              x: n8nNode.position[0],
              y: n8nNode.position[1]
            },
            data: {
              label: n8nNode.name.replace(/_\d*$/, ''),
              icon: getNodeIcon(n8nNode.type, n8nNode.name),
              description: '',
              status: 'idle',
              isTrigger: false,
              isCircular: true,
              isAgent: false,
              isImagePreview: !isVideo,
              isVideoPreview: isVideo,
              imagePath: isVideo ? undefined : `/images/${mediaName}`,
              videoPath: isVideo ? `/images/${mediaName}` : undefined,
              imageWidth: width,
              imageHeight: height,
              iconColorClass: undefined,
              handles: [],
              hasMultipleOutputs: false
            },
            parameters: n8nNode.parameters || {},
          });
          return;
        } else {
          const hasMultipleOutputs = n8nNode.type === 'n8n-nodes-base.if' || n8nNode.type === 'n8n-nodes-base.switch';

          nodes.push({
            id: nodeId,
            type: 'custom',
            position: {
              x: n8nNode.position[0],
              y: n8nNode.position[1]
            },
            data: {
              label: (n8nNode.type === 'n8n-nodes-base.set' || n8nNode.name.startsWith('PRESS ME'))
                ? n8nNode.name.replace(/_\d+$/, '').replace(/_$/, '')
                : n8nNode.name.replace(/_\d*$/, ''),
              icon: getNodeIcon(n8nNode.type, n8nNode.name),
              description: '',
              status: 'idle',
              isTrigger: isTriggerNode(n8nNode.type, n8nNode.name),
              isCircular: isAISub,
              isAgent: isAgent,
              iconColorClass: getIconColorClass(n8nNode.type, n8nNode.name),
              handles: isAISub ? [] : undefined,
              hasMultipleOutputs: hasMultipleOutputs,
              isExecuteButton: n8nNode.type === 'n8n-nodes-base.set' && n8nNode.name.startsWith('PRESS ME')
            },
            parameters: n8nNode.parameters || {},
          });
        }
      } else {
        const hasMultipleOutputs = n8nNode.type === 'n8n-nodes-base.if' || n8nNode.type === 'n8n-nodes-base.switch';

        nodes.push({
          id: nodeId,
          type: 'custom',
          position: {
            x: n8nNode.position[0],
            y: n8nNode.position[1]
          },
          data: {
            label: n8nNode.name,
            icon: getNodeIcon(n8nNode.type, n8nNode.name),
            description: '',
            status: 'idle',
            isTrigger: isTriggerNode(n8nNode.type, n8nNode.name),
            isCircular: isAISub,
            isAgent: isAgent,
            iconColorClass: getIconColorClass(n8nNode.type, n8nNode.name),
            handles: isAISub ? [] : undefined,
            hasMultipleOutputs: hasMultipleOutputs,
            isExecuteButton: n8nNode.type === 'n8n-nodes-base.set' && n8nNode.name.startsWith('PRESS ME'),
            notes: (n8nNode as any).notes || ''
          },
          parameters: n8nNode.parameters || {},
        });
      }
    }
  });

  Object.entries(workflow.connections).forEach(([sourceName, outputs]) => {
    const sourceId = nodeIdMap.get(sourceName);
    if (!sourceId) return;

    Object.entries(outputs).forEach(([outputType, connectionGroups]) => {
      connectionGroups.forEach((connections, groupIndex) => {
        connections.forEach((connection) => {
          const targetId = nodeIdMap.get(connection.node);
          if (!targetId) return;

          const edgeId = `e-${sourceId}-${targetId}-${outputType}-${groupIndex}`;
          const isAIConnection = outputType.startsWith('ai_');

          let edgeLabel = '';
          let sourceHandle = undefined;

          if (outputType === 'main' && connectionGroups.length > 1) {
            edgeLabel = groupIndex === 0 ? 'true' : 'false';
            sourceHandle = `output-${groupIndex}`;
          } else if (!isAIConnection && outputType !== 'main') {
            sourceHandle = outputType;
          }

          edges.push({
            id: edgeId,
            source: sourceId,
            target: targetId,
            type: isAIConnection ? 'ai' : 'smoothstep',
            sourceHandle: isAIConnection ? null : sourceHandle,
            targetHandle: isAIConnection ? outputType : (connection.type !== 'main' ? connection.type : undefined),
            style: isAIConnection ? { strokeDasharray: '5,5', stroke: '#8B5CF6' } : undefined,
            label: edgeLabel || undefined,
          });
        });
      });
    });
  });

  return { nodes, edges, startPosition };
}

export async function loadWorkflowFromFile(filePath: string): Promise<{ nodes: Node[]; edges: Edge[]; startPosition?: { x: number; y: number } }> {
  const response = await fetch(filePath);
  const workflow: N8nWorkflow = await response.json();
  return loadWorkflow(workflow);
}
