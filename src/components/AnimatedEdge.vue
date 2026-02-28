<template>
  <g @mouseenter="hovering = true" @mouseleave="hovering = false">
    <path
      :id="`${id}-bg`"
      :style="bgStyle"
      class="vue-flow__edge-path"
      :d="edgePath[0]"
      :marker-end="markerEnd"
    />
    <path
      v-if="isAnimating"
      :id="id"
      :style="animatedStyle"
      class="vue-flow__edge-path animated-edge"
      :d="edgePath[0]"
      :marker-end="markerEnd"
    />
    <path
      v-else
      :id="id"
      :style="hovering ? hoverStyle : style"
      class="vue-flow__edge-path"
      :d="edgePath[0]"
      :marker-end="markerEnd"
    />

    <foreignObject
      v-if="hovering"
      :x="edgeCenterX - 20"
      :y="edgeCenterY - 20"
      width="40"
      height="40"
      class="edge-button-foreign-object"
      requiredExtensions="http://www.w3.org/1999/xhtml"
    >
      <div class="edge-delete-button" @click="deleteEdge">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 6h18M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2m3 0v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6h14z"/>
          <path d="M10 11v6M14 11v6"/>
        </svg>
      </div>
    </foreignObject>
  </g>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { getSmoothStepPath, type EdgeProps, useVueFlow } from '@vue-flow/core';

const props = defineProps<EdgeProps & { data?: { isAnimating?: boolean } }>();

const hovering = ref(false);
const { removeEdges } = useVueFlow();

const edgePath = computed(() => {
  return getSmoothStepPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    targetX: props.targetX,
    targetY: props.targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });
});

const isAnimating = computed(() => props.data?.isAnimating || false);

const bgStyle = computed(() => ({
  stroke: '#E2E8F0',
  strokeWidth: 3,
  fill: 'none',
}));

const style = computed(() => ({
  stroke: '#94A3B8',
  strokeWidth: 2,
  fill: 'none',
  ...props.style,
}));

const hoverStyle = computed(() => ({
  stroke: '#EF4444',
  strokeWidth: 3,
  fill: 'none',
  ...props.style,
}));

const animatedStyle = computed(() => ({
  stroke: '#3B82F6',
  strokeWidth: 3,
  fill: 'none',
  ...props.style,
}));

const edgeCenterX = computed(() => {
  return (props.sourceX + props.targetX) / 2;
});

const edgeCenterY = computed(() => {
  return (props.sourceY + props.targetY) / 2;
});

const deleteEdge = () => {
  removeEdges([props.id]);
};
</script>

<style scoped>
.edge-button-foreign-object {
  overflow: visible;
}

.edge-delete-button {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #94A3B8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #4B5563;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.edge-delete-button:hover {
  border-color: #64748B;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}
</style>
