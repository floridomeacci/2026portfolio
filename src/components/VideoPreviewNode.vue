<template>
  <div class="video-preview-container" @click="handleNodeClick">
    <div v-if="data.status === 'idle'" class="video-preview-placeholder" :style="{ width: data.imageWidth + 'px', height: data.imageHeight + 'px' }">
      <div class="placeholder-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      </div>
      <Handle type="target" :position="Position.Left" class="node-handle handle-target video-preview-handle" />
      <Handle type="source" :position="Position.Right" class="node-handle handle-source video-preview-handle" />
    </div>

    <div v-else class="video-preview-wrapper" :class="{ 'is-visible': data.status !== 'idle' }" :style="{ width: data.imageWidth + 'px', height: data.imageHeight + 'px' }">
      <video
        :src="data.videoPath"
        class="preview-video"
        muted
      />
      <Handle type="target" :position="Position.Left" class="node-handle handle-target video-preview-handle" />
      <Handle type="source" :position="Position.Right" class="node-handle handle-source video-preview-handle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

const props = defineProps<{
  data: {
    label: string;
    status?: 'idle' | 'success' | 'error' | 'active';
    isVideoPreview?: boolean;
    videoPath?: string;
    imageWidth?: number;
    imageHeight?: number;
  };
  id: string;
}>();

const emit = defineEmits<{
  nodeClick: [nodeId: string];
}>();

const handleNodeClick = () => {
  emit('nodeClick', props.id);
};
</script>

<style scoped>
.video-preview-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.video-preview-placeholder {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 3px dashed #CBD5E1;
  background: #F8FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.dark-mode .video-preview-placeholder {
  background: #525252;
  border-color: #6b6b6b;
}

.video-preview-placeholder:hover {
  border-color: #94A3B8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.placeholder-icon {
  width: 80px;
  height: 80px;
  opacity: 0.4;
  color: #64748B;
}

.placeholder-icon svg {
  width: 100%;
  height: 100%;
}

.video-preview-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid #E2E8F0;
  opacity: 0;
  transform: scale(0.95);
  animation: fadeInScale 0.3s ease-out forwards;
  background: #000;
}

.dark-mode .video-preview-wrapper {
  border-color: #6b6b6b;
}

.video-preview-wrapper:hover {
  border-color: #94A3B8;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.preview-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.node-handle {
  width: 12px;
  height: 12px;
  border: 2px solid white;
  background: #94A3B8;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.video-preview-handle.handle-target {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.video-preview-handle.handle-source {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.node-handle:hover {
  background: #3B82F6;
  transform: translateY(-50%) scale(1.2);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}
</style>
