<template>
  <div class="w-full h-screen relative" :class="{ 'dark-mode': isDarkMode }">

    <!-- Back button -->
    <router-link to="/" class="sandbox-back-btn" title="Home">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </router-link>

    <VueFlow
      v-model:nodes="nodes"
      v-model:edges="edges"
      :default-viewport="{ zoom: 2, x: -1000, y: -600 }"
      :min-zoom="0.2"
      :max-zoom="4"
      class="vue-flow-canvas"
      @connect="onConnect"
      @node-drag-start="onNodeDragStart"
      @node-drag="onNodeDrag"
      @node-drag-stop="onNodeDragStop"
      :edges-updatable="true"
      :edges-deletable="true"
    >
      <Background
        :pattern-color="isDarkMode ? '#ffffff' : '#0F172A'"
        :gap="16"
        :size="1"
        :pattern-stroke-width="0.5"
      />
      <Controls :show-fit-view="false" :show-interactive="false">
        <button
          @click="toggleDarkMode"
          class="vue-flow__controls-button vue-flow__controls-interactive"
          :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <svg v-if="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
        <button
          @click="toggleWorkflow"
          class="vue-flow__controls-button vue-flow__controls-interactive"
          :title="isCleanedUp ? 'Show Full Portfolio' : 'Show Clean Portfolio'"
        >
          <svg v-if="isCleanedUp" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: block;">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </button>
      </Controls>

      <template #node-custom="nodeProps">
        <CustomNode
          :data="nodeProps.data"
          :label="nodeProps.data.label"
          :id="nodeProps.id"
          @node-click="handleNodeClick"
        />
      </template>

      <template #node-sticky="nodeProps">
        <StickyNote :data="nodeProps.data" />
      </template>

      <template #node-ascii="nodeProps">
        <ASCIIOverlay />
      </template>

      <template #node-videoPreview="nodeProps">
        <VideoPreviewNode
          :data="nodeProps.data"
          :id="nodeProps.id"
          @node-click="handleNodeClick"
        />
      </template>

      <template #node-cobraGame="nodeProps">
        <CobraGame
          :all-nodes="allNodes"
          :node-id="nodeProps.id"
          :data="nodeProps.data"
          :id="nodeProps.id"
          @node-click="handleNodeClick"
        />
      </template>

      <template #node-bullet="nodeProps">
        <BulletNode />
      </template>

      <template #edge-ai="edgeProps">
        <AIEdge v-bind="edgeProps" />
      </template>

      <template #edge-smoothstep="edgeProps">
        <AnimatedEdge v-bind="edgeProps" />
      </template>
    </VueFlow>

    <NodeSettingsPanel
      :is-open="isSettingsPanelOpen"
      :node="selectedNode"
      @close="closeSettingsPanel"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, provide, nextTick } from 'vue';
import { VueFlow, useVueFlow, type Node, type Edge } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { defineAsyncComponent } from 'vue';
import CustomNode from '../components/CustomNode.vue';
import StickyNote from '../components/StickyNote.vue';
import AIEdge from '../components/AIEdge.vue';
import AnimatedEdge from '../components/AnimatedEdge.vue';
import ASCIIOverlay from '../components/ASCIIOverlay.vue';
import NodeSettingsPanel from '../components/NodeSettingsPanel.vue';
import ContactForm from '../components/ContactForm.vue';
import BulletNode from '../components/BulletNode.vue';

const VideoPreviewNode = defineAsyncComponent(() => import('../components/VideoPreviewNode.vue'));
const CobraGame = defineAsyncComponent(() => import('../components/CobraGame.vue'));
import { loadWorkflowFromFile } from '../utils/workflowLoader';
import {
  enableNodePhysics,
  disableNodePhysics,
  startNodeDrag,
  updateNodeDrag,
  endNodeDrag,
  applyPhysicsToNode,
  updateAllNodes
} from '../utils/nodePhysics';
const nodes = ref<Node[]>([]);
const edges = ref<Edge[]>([]);
const { setViewport, updateNode } = useVueFlow();

const allNodes = nodes;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
const ENABLE_PHYSICS = !isMobile;

const isSettingsPanelOpen = ref(false);
const selectedNodeId = ref<string | null>(null);
const activeAnimations = new Map<string, number[]>();
const isDarkMode = ref(false);
const isContactFormOpen = ref(false);
const isCleanedUp = ref(false);

const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null;
  return nodes.value.find(node => node.id === selectedNodeId.value) || null;
});

const handleNodeClick = (nodeId: string) => {
  const node = nodes.value.find(n => n.id === nodeId);

  if (node?.data.isExecuteButton) {
    startFlowAnimation(nodeId);
    return;
  }

  selectedNodeId.value = nodeId;
  isSettingsPanelOpen.value = true;
};

const closeSettingsPanel = () => {
  isSettingsPanelOpen.value = false;
  selectedNodeId.value = null;
};

const openContactForm = () => {
  isContactFormOpen.value = true;
};

const closeContactForm = () => {
  isContactFormOpen.value = false;
};

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
};

provide('isDarkMode', isDarkMode);

const onConnect = (params: any) => {
  const newEdge: Edge = {
    id: `edge-${params.source}-${params.target}`,
    source: params.source,
    target: params.target,
    type: 'smoothstep',
    animated: false,
    data: { isAnimating: false },
    style: { stroke: '#94A3B8', strokeWidth: 2 }
  };
  edges.value.push(newEdge);
};

const startFlowAnimation = (startNodeId?: string) => {
  if (!startNodeId) return;

  if (activeAnimations.has(startNodeId)) {
    stopFlowAnimation(startNodeId);
    return;
  }

  const workflowTimeouts: number[] = [];
  activeAnimations.set(startNodeId, workflowTimeouts);

  const edgeMap = new Map<string, string[]>();
  edges.value.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source)!.push(edge.target);
  });

  const animatedNodes = new Set<string>();

  const animateNode = (nodeId: string, delay: number = 0) => {
    if (animatedNodes.has(nodeId)) return;
    animatedNodes.add(nodeId);

    const nodeIndex = allNodes.value.findIndex(n => n.id === nodeId);
    const node = nodeIndex !== -1 ? allNodes.value[nodeIndex] : null;
    const isVideoNode = node?.data.isVideoPreview;

    const spinCount = Math.floor(Math.random() * 3) + 2;
    const nodeDuration = isVideoNode ? 0 : spinCount * 1000;

    const timeout = window.setTimeout(() => {
      if (nodeIndex !== -1) {
        allNodes.value[nodeIndex].data.status = 'active';
      }

      const outgoingEdges = edges.value.filter(e => e.source === nodeId);
      outgoingEdges.forEach(edge => {
        const edgeIndex = edges.value.findIndex(e => e.id === edge.id);
        if (edgeIndex !== -1) {
          if (!edges.value[edgeIndex].data) {
            edges.value[edgeIndex].data = {};
          }
          edges.value[edgeIndex].data.isAnimating = true;
        }
      });

      if (isVideoNode) {
        setTimeout(() => {
          const videoElement = document.querySelector(`[data-id="${nodeId}"] video`) as HTMLVideoElement;
          if (videoElement) {
            videoElement.currentTime = 0;
            const playPromise = videoElement.play();

            if (playPromise !== undefined) {
              playPromise.catch(error => {
                console.log('Video play failed:', error);
              });
            }

            const handleVideoEnd = () => {
              if (nodeIndex !== -1) {
                allNodes.value[nodeIndex].data.status = 'success';
              }

              outgoingEdges.forEach(edge => {
                const edgeIndex = edges.value.findIndex(e => e.id === edge.id);
                if (edgeIndex !== -1) {
                  if (!edges.value[edgeIndex].data) {
                    edges.value[edgeIndex].data = {};
                  }
                  edges.value[edgeIndex].data.isAnimating = false;
                }
              });

              const targets = edgeMap.get(nodeId);
              if (targets) {
                targets.forEach(targetId => animateNode(targetId, 0));
              }

              videoElement.removeEventListener('ended', handleVideoEnd);
            };

            videoElement.addEventListener('ended', handleVideoEnd);
          }
        }, 100);
        return;
      }

      const completionTimeout = window.setTimeout(() => {
        if (nodeIndex !== -1) {
          const node = allNodes.value[nodeIndex];
          if (node.data.isImagePreview) {
            node.data.status = 'success';
          } else {
            node.data.status = 'idle';
          }
        }

        outgoingEdges.forEach(edge => {
          const edgeIndex = edges.value.findIndex(e => e.id === edge.id);
          if (edgeIndex !== -1) {
            if (!edges.value[edgeIndex].data) {
              edges.value[edgeIndex].data = {};
            }
            edges.value[edgeIndex].data.isAnimating = false;
          }
        });

        const targets = edgeMap.get(nodeId);
        if (targets) {
          targets.forEach(targetId => animateNode(targetId, 0));
        } else {
          const checkCompletion = window.setTimeout(() => {
            activeAnimations.delete(startNodeId);
          }, 100);
          workflowTimeouts.push(checkCompletion);
        }
      }, nodeDuration);

      workflowTimeouts.push(completionTimeout);
    }, delay);

    workflowTimeouts.push(timeout);
  };

  const hasOutgoingEdges = edges.value.some(e => e.source === startNodeId);
  if (hasOutgoingEdges) {
    animateNode(startNodeId);
  } else {
    activeAnimations.delete(startNodeId);
  }
};

const stopFlowAnimation = (workflowStartNodeId: string) => {
  const timeouts = activeAnimations.get(workflowStartNodeId);
  if (!timeouts) return;

  timeouts.forEach(timeout => clearTimeout(timeout));
  activeAnimations.delete(workflowStartNodeId);

  const edgeMap = new Map<string, string[]>();
  edges.value.forEach(edge => {
    if (!edgeMap.has(edge.source)) {
      edgeMap.set(edge.source, []);
    }
    edgeMap.get(edge.source)!.push(edge.target);
  });

  const workflowNodes = new Set<string>();
  const collectNodes = (nodeId: string) => {
    if (workflowNodes.has(nodeId)) return;
    workflowNodes.add(nodeId);
    const targets = edgeMap.get(nodeId);
    if (targets) {
      targets.forEach(targetId => collectNodes(targetId));
    }
  };
  collectNodes(workflowStartNodeId);

  workflowNodes.forEach(nodeId => {
    const nodeIndex = allNodes.value.findIndex(n => n.id === nodeId);
    if (nodeIndex !== -1) {
      allNodes.value[nodeIndex].data.status = 'idle';
    }
  });

  edges.value.forEach((edge, index) => {
    if (workflowNodes.has(edge.source)) {
      if (!edges.value[index].data) {
        edges.value[index].data = {};
      }
      edges.value[index].data.isAnimating = false;
    }
  });
};

const onNodeDragStart = (event: any) => {
  if (!ENABLE_PHYSICS) return;
  const node = event.node;
  startNodeDrag(node.id, node.position.x, node.position.y);
};

const onNodeDrag = (event: any) => {
  if (!ENABLE_PHYSICS) return;
  const node = event.node;
  updateNodeDrag(node.id, node.position.x, node.position.y);
};

const onNodeDragStop = (event: any) => {
  if (!ENABLE_PHYSICS) return;
  const node = event.node;
  endNodeDrag(node.id);
};

let physicsAnimationFrame: number | null = null;


const updatePhysicsLoop = () => {
  if (!ENABLE_PHYSICS) return;

  updateAllNodes(allNodes.value);

  allNodes.value.forEach(node => {
    applyPhysicsToNode(node, (nodeId, position, rotation) => {
      const nodeInAllNodes = allNodes.value.find(n => n.id === nodeId);
      if (nodeInAllNodes) {
        nodeInAllNodes.position = position;
        if (!nodeInAllNodes.data) nodeInAllNodes.data = {};
        nodeInAllNodes.data.rotation = rotation;
      }

      updateNode(nodeId, {
        position,
        data: {
          ...node.data,
          rotation
        }
      });
    });
  });

  physicsAnimationFrame = requestAnimationFrame(updatePhysicsLoop);
};

const loadWorkflow = async (isCleanVersion: boolean) => {
  const workflowPath = isCleanVersion ? '/workflows/portfolio_cleaned_up.json' : '/workflows/Portfolio.json';
  const workflow = await loadWorkflowFromFile(workflowPath);
  const signature = await loadWorkflowFromFile('/workflows/Signature.json');

  const pressButtonNode = workflow.nodes.find(n => n.data.label === 'PRESS ME');
  if (pressButtonNode) {
    pressButtonNode.data.isExecuteButton = true;
  }

  nodes.value = [...workflow.nodes, ...signature.nodes];
  edges.value = workflow.edges.map(edge => ({
    ...edge,
    data: { isAnimating: false }
  }));

  if (workflow.startPosition) {
    await nextTick();
    const isMobile = window.innerWidth < 768;
    const zoomLevel = isMobile ? 0.6 : 1.2;
    setViewport({
      x: -workflow.startPosition.x * zoomLevel + window.innerWidth / 2,
      y: -workflow.startPosition.y * zoomLevel + window.innerHeight / 2,
      zoom: zoomLevel
    });
  }
};

const toggleWorkflow = async () => {
  isCleanedUp.value = !isCleanedUp.value;
  await loadWorkflow(isCleanedUp.value);
};

onMounted(async () => {
  if (ENABLE_PHYSICS) {
    enableNodePhysics();
    physicsAnimationFrame = requestAnimationFrame(updatePhysicsLoop);
  }
  try {
    await loadWorkflow(isCleanedUp.value);
  } catch (error) {
    console.error('Failed to load workflow:', error);
  }
});

onUnmounted(() => {
  if (ENABLE_PHYSICS) {
    disableNodePhysics();
    if (physicsAnimationFrame !== null) {
      cancelAnimationFrame(physicsAnimationFrame);
    }
  }
});
</script>

<style>
.vue-flow-canvas {
  background-color: #F5F7FB;
  transition: background-color 0.3s ease;
}

.dark-mode .vue-flow-canvas {
  background-color: #2D2D30;
}

.vue-flow__edge-path {
  stroke: #94A3B8;
  stroke-width: 2px;
}

.vue-flow__edge.selected .vue-flow__edge-path {
  stroke: #2563EB;
  stroke-width: 2.5px;
}

.vue-flow__edge-textbg {
  fill: white;
}

.vue-flow__edge-text {
  font-size: 12px;
  font-weight: 600;
  fill: #64748B;
}


.vue-flow__controls-button {
  width: 32px !important;
  height: 32px !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e2e8f0 !important;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important;
  color: #262626;
}

.vue-flow__controls-button svg {
  width: 16px !important;
  height: 16px !important;
}

.vue-flow__controls-button svg path,
.vue-flow__controls-button svg line,
.vue-flow__controls-button svg polyline {
  stroke: #262626;
}

.vue-flow__controls-button:hover {
  background: #f5f5f5;
  border-color: #d4d4d4 !important;
}

.dark-mode .vue-flow__controls-button {
  background: #404040 !important;
  border-color: #525252 !important;
}

.dark-mode .vue-flow__controls-button:hover {
  background: #525252 !important;
  border-color: #737373 !important;
}

.dark-mode .vue-flow__controls-button svg path,
.dark-mode .vue-flow__controls-button svg line,
.dark-mode .vue-flow__controls-button svg polyline,
.dark-mode .vue-flow__controls-button svg rect {
  stroke: #ffffff !important;
  fill: #ffffff !important;
}

.dark-mode .vue-flow__controls-button img {
  filter: invert(95%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(90%);
}

.vue-flow__controls-button[title*="toggle interactivity"],
.vue-flow__controls-button[title*="lock"],
.vue-flow__controls-button[title*="unlock"] {
  display: none !important;
}

.sandbox-back-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0F172A;
  text-decoration: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.sandbox-back-btn:hover {
  background: #f5f5f5;
  border-color: #d4d4d4;
}

.dark-mode .sandbox-back-btn {
  background: #404040;
  border-color: #525252;
  color: #e5e5e5;
}

.dark-mode .sandbox-back-btn:hover {
  background: #525252;
  border-color: #737373;
}

</style>
