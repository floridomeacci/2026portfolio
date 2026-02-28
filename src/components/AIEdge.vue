<template>
  <path
    :id="id"
    :style="style"
    class="vue-flow__edge-path"
    :d="path"
    :marker-end="markerEnd"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getBezierPath, type EdgeProps } from '@vue-flow/core';

const props = defineProps<EdgeProps>();

const path = computed(() => {
  const { sourceX, sourceY, targetX, targetY } = props;

  // Calculate control points for an upward curve
  const midY = sourceY + (targetY - sourceY) * 0.5;

  // Create a smooth upward curve
  return `M ${sourceX},${sourceY} C ${sourceX},${midY} ${targetX},${midY} ${targetX},${targetY}`;
});

const style = computed(() => ({
  stroke: '#8B5CF6',
  strokeWidth: 2,
  strokeDasharray: '5,5',
  fill: 'none',
  ...props.style,
}));
</script>
