<template>
  <div class="node-wrapper" :class="{ 'is-agent': data.isAgent, 'is-circular': data.isCircular, 'is-image-preview': data.isImagePreview }">
    <div
      v-if="data.isImagePreview"
      class="image-preview-container"
      @click="handleNodeClick"
    >
      <div v-if="data.status === 'idle'" class="image-preview-placeholder" :style="{ width: data.imageWidth + 'px', height: data.imageHeight + 'px' }">
        <div class="placeholder-icon">
          <img src="/icons/image.svg" alt="" />
        </div>
        <Handle type="target" :position="Position.Left" class="node-handle handle-target image-preview-handle" />
        <Handle type="source" :position="Position.Right" class="node-handle handle-source image-preview-handle" />
      </div>

      <div v-else class="image-preview-wrapper" :class="{ 'is-visible': data.status !== 'idle' }" :style="{ width: data.imageWidth + 'px', height: data.imageHeight + 'px' }">
        <img :src="data.imagePath" alt="" class="preview-image" />
        <Handle type="target" :position="Position.Left" class="node-handle handle-target image-preview-handle" />
        <Handle type="source" :position="Position.Right" class="node-handle handle-source image-preview-handle" />
      </div>
    </div>

    <div
      v-else
      class="icon-container"
      :class="{
        'is-trigger': data.isTrigger,
        'is-agent': data.isAgent,
        'is-circular': data.isCircular
      }"
      @click="handleNodeClick"
    >
      <div
        v-if="data.isTrigger"
        class="trigger-badge"
      >
        <img src="/icons/lighting.svg" alt="" class="trigger-icon" />
      </div>

      <div class="icon-box" :class="{ 'is-executing': data.status === 'active' }">
        <div v-if="data.status === 'active'" class="spinner-overlay" :style="{ '--spin-count': spinCount, '--spin-duration': spinDuration + 's' }">
          <img src="/icons/load.svg" alt="" class="spinner-icon" />
        </div>
        <img
          v-if="data.icon"
          :src="data.icon"
          alt=""
          class="node-icon-img"
          :class="data.iconColorClass"
          :style="{ transform: `rotate(${data.rotation || 0}deg)`, transition: 'transform 0.1s ease-out' }"
        />
      </div>

      <div v-if="data.isAgent" class="agent-label">{{ data.label }}</div>

      <Handle v-if="!data.isTrigger && !data.isCircular" type="target" :position="Position.Left" class="node-handle handle-target" />
      <Handle v-if="data.isCircular" type="source" :position="Position.Top" class="node-handle handle-source handle-top" />

      <!-- Multiple outputs for IF nodes -->
      <template v-if="data.hasMultipleOutputs">
        <Handle type="source" :position="Position.Right" :id="'output-0'" class="node-handle handle-source handle-output-top" />
        <Handle type="source" :position="Position.Right" :id="'output-1'" class="node-handle handle-source handle-output-bottom" />
      </template>

      <!-- Single output for other nodes -->
      <Handle v-if="!data.isAgent && !data.isCircular && !data.hasMultipleOutputs && !data.isTrigger" type="source" :position="Position.Right" class="node-handle handle-source" />
      <Handle v-if="data.isTrigger || data.isAgent" type="source" :position="Position.Right" class="node-handle handle-source" />

      <!-- Bottom handles for AI Agent -->
      <Handle v-if="data.isAgent" type="target" :position="Position.Bottom" :id="'ai_languageModel'" class="node-handle handle-bottom handle-language-model" />
      <Handle v-if="data.isAgent" type="target" :position="Position.Bottom" :id="'ai_memory'" class="node-handle handle-bottom handle-memory" />
      <Handle v-if="data.isAgent" type="target" :position="Position.Bottom" :id="'ai_outputParser'" class="node-handle handle-bottom handle-output-parser" />
    </div>

    <div v-if="!data.isAgent && !data.isImagePreview" class="node-label">{{ data.label }}</div>
    <div v-if="data.description" class="node-description">{{ data.description }}</div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';
import { ref, watch } from 'vue';

const props = defineProps<{
  data: {
    label: string;
    icon: string;
    color?: string;
    description?: string;
    status?: 'idle' | 'success' | 'error' | 'active';
    outputs?: string[];
    isTrigger?: boolean;
    isAgent?: boolean;
    isCircular?: boolean;
    iconColor?: string;
    iconColorClass?: string;
    hasMultipleOutputs?: boolean;
    isImagePreview?: boolean;
    imagePath?: string;
    imageWidth?: number;
    imageHeight?: number;
    rotation?: number;
  };
  label: string;
  id: string;
}>();

const emit = defineEmits<{
  nodeClick: [nodeId: string];
}>();

const spinCount = ref(Math.floor(Math.random() * 3) + 2);
const spinDuration = ref(spinCount.value * 1);

if (props.data.isImagePreview) {
  console.log('Image preview node mounted:', {
    label: props.data.label,
    imagePath: props.data.imagePath,
    imageWidth: props.data.imageWidth,
    imageHeight: props.data.imageHeight,
    status: props.data.status
  });
}

watch(() => props.data.status, (newStatus) => {
  if (newStatus === 'active') {
    spinCount.value = Math.floor(Math.random() * 3) + 2;
    spinDuration.value = spinCount.value * 1;

    if (props.data.isImagePreview) {
      console.log('Image preview node activated:', props.data.label);
    }
  }
});

const nodeStatusClass = 'node-idle';

const handleNodeClick = () => {
  emit('nodeClick', props.id);
};
</script>

<style scoped>
.node-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 100px;
}

.icon-container {
  position: relative;
  background: white;
  border: 2px solid #CBD5E1;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dark-mode .icon-container {
  background: #525252;
  border-color: #6b6b6b;
}

.icon-container.is-trigger {
  background: white;
  border: 2px solid #CBD5E1;
  border-radius: 28px 12px 12px 28px;
  padding: 16px;
}

.dark-mode .icon-container.is-trigger {
  background: #525252;
  border-color: #6b6b6b;
}

.icon-container.is-agent {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 20px 32px;
  min-width: 300px;
  border-radius: 16px;
}

.dark-mode .icon-container.is-agent {
  background: #525252;
  border-color: #6b6b6b;
}

.agent-label {
  font-size: 24px;
  font-weight: 600;
  color: #1E293B;
  white-space: nowrap;
}

.dark-mode .agent-label {
  color: #e2e8f0;
}

.icon-container.is-circular {
  border-radius: 50%;
  padding: 32px;
  width: 96px;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F8FAFC;
  border-color: #E2E8F0;
}

.dark-mode .icon-container.is-circular {
  background: #525252;
  border-color: #6b6b6b;
}

.is-circular .icon-box {
  width: 56px;
  height: 56px;
}

.is-circular .node-icon-img {
  width: 48px;
  height: 48px;
  filter: none;
}

.is-circular .node-icon-img.icon-black {
  filter: invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%);
}

.dark-mode .is-circular .node-icon-img.icon-black {
  filter: invert(95%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(90%);
}

.icon-container:hover {
  border-color: #94A3B8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.is-trigger .icon-box {
  width: 48px;
  height: 48px;
}

.node-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.node-icon-img.icon-blue {
  filter: invert(47%) sepia(89%) saturate(1372%) hue-rotate(192deg) brightness(100%) contrast(91%);
}

.node-icon-img.icon-green {
  filter: invert(53%) sepia(95%) saturate(392%) hue-rotate(96deg) brightness(97%) contrast(87%);
}

.node-icon-img.icon-gray {
  filter: invert(24%) sepia(8%) saturate(937%) hue-rotate(182deg) brightness(94%) contrast(89%);
}

.node-icon-img.icon-purple {
  filter: invert(47%) sepia(52%) saturate(2178%) hue-rotate(236deg) brightness(97%) contrast(90%);
}

.node-icon-img.icon-purple-light {
  filter: invert(56%) sepia(48%) saturate(1826%) hue-rotate(236deg) brightness(98%) contrast(96%);
}

.node-icon-img.icon-red {
  filter: invert(26%) sepia(85%) saturate(3576%) hue-rotate(348deg) brightness(95%) contrast(95%);
}

.node-icon-img.icon-dark-red {
  filter: invert(14%) sepia(63%) saturate(4571%) hue-rotate(343deg) brightness(85%) contrast(95%);
}

.node-icon-img.icon-natural {
  filter: none;
}

.dark-mode .node-icon-img:not(.icon-blue):not(.icon-green):not(.icon-purple):not(.icon-purple-light):not(.icon-red):not(.icon-dark-red):not(.icon-natural) {
  filter: invert(95%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(90%);
}

.spinner-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: spin var(--spin-duration, 2s) linear, fadeInOut var(--spin-duration, 2s) ease-in-out;
}

.spinner-icon {
  width: 56px;
  height: 56px;
  filter: invert(75%) sepia(25%) saturate(1200%) hue-rotate(315deg) brightness(100%) contrast(95%);
}

@keyframes spin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(calc(360deg * var(--spin-count, 3)));
  }
}

@keyframes fadeInOut {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.is-trigger .node-icon-img {
  width: 40px;
  height: 40px;
}

.trigger-badge {
  position: absolute;
  top: 50%;
  left: -36px;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trigger-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  filter: invert(46%) sepia(85%) saturate(4943%) hue-rotate(346deg) brightness(96%) contrast(95%);
}

.node-label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #1E293B;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark-mode .node-label {
  color: #cbd5e1;
}

.node-description {
  margin-top: 2px;
  font-size: 11px;
  color: #64748B;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dark-mode .node-description {
  color: #94a3b8;
}

.node-handle {
  width: 12px;
  height: 12px;
  border: 2px solid white;
  background: #94A3B8;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.node-handle.handle-source {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.node-handle.handle-output-top {
  right: -6px;
  top: 30%;
  transform: translateY(-50%);
}

.node-handle.handle-output-bottom {
  right: -6px;
  top: 70%;
  transform: translateY(-50%);
}

.is-circular .node-handle.handle-source.handle-top {
  right: auto;
  left: 50%;
  top: -6px;
  transform: translateX(-50%);
  background: #8B5CF6;
}

.node-handle.handle-target {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.node-handle.handle-top {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: #8B5CF6;
}

.node-handle.handle-bottom {
  top: auto;
  bottom: -6px;
  transform: translateX(-50%);
  background: #8B5CF6;
}

.node-handle.handle-language-model {
  left: 25%;
}

.node-handle.handle-memory {
  left: 50%;
}

.node-handle.handle-output-parser {
  left: 75%;
}

.node-handle:hover {
  background: #3B82F6;
  transform: translateY(-50%) scale(1.2);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.is-circular .node-handle.handle-source:hover {
  transform: translateX(-50%) scale(1.2);
}

.node-handle.handle-bottom:hover {
  transform: translateX(-50%) scale(1.2);
}

.node-handle.handle-top:hover {
  transform: translateX(-50%) scale(1.2);
}

.vue-flow__node.selected .icon-container {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.image-preview-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.image-preview-placeholder {
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

.dark-mode .image-preview-placeholder {
  background: #525252;
  border-color: #6b6b6b;
}

.image-preview-placeholder:hover {
  border-color: #94A3B8;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.placeholder-icon {
  width: 64px;
  height: 64px;
  opacity: 0.4;
}

.placeholder-icon img {
  width: 100%;
  height: 100%;
  filter: invert(60%);
}

.image-preview-wrapper {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 3px solid #E2E8F0;
  opacity: 0;
  transform: scale(0.95);
  animation: fadeInScale 0.3s ease-out forwards;
}

.dark-mode .image-preview-wrapper {
  border-color: #6b6b6b;
}

.image-preview-wrapper:hover {
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

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.spinner-overlay-full {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  animation: fadeIn 0.2s ease-out;
}

.spinner-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: spin var(--spin-duration, 2s) linear;
}

.spinner-circle .spinner-icon {
  width: 48px;
  height: 48px;
  filter: invert(75%) sepia(25%) saturate(1200%) hue-rotate(315deg) brightness(100%) contrast(95%);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.image-preview-handle.handle-target {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
}

.image-preview-handle.handle-source {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
