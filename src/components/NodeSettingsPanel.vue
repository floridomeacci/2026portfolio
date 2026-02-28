<template>
  <div v-if="isOpen" class="settings-overlay" @click="handleOverlayClick">
    <div class="settings-panel" @click.stop>
      <div class="settings-header">
        <div class="header-left">
          <img v-if="node?.data.icon" :src="node.data.icon" alt="" class="header-icon" />
          <h2 class="header-title">{{ node?.data.label || 'Node Settings' }}</h2>
        </div>
        <button class="close-button" @click="closePanel">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="settings-tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'parameters' }"
          @click="activeTab = 'parameters'"
        >
          Parameters
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'settings' }"
          @click="activeTab = 'settings'"
        >
          Settings
        </button>
      </div>

      <div class="settings-content">
        <div v-if="activeTab === 'parameters'" class="parameters-section">
          <div v-if="parameters && parameters.length > 0" class="parameter-list">
            <div v-for="(param, index) in parameters" :key="index" class="parameter-item">
              <label class="parameter-label">{{ param.label }}</label>
              <div
                class="parameter-value"
                :class="{ 'is-boolean': param.type === 'boolean', 'is-json': param.type === 'json' || param.type === 'array' }"
              >
                {{ formatValue(param.value, param.type) }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <p>No parameters configured</p>
          </div>
        </div>

        <div v-if="activeTab === 'settings'" class="settings-section">
          <div class="parameter-item">
            <label class="parameter-label">Node Type</label>
            <div class="parameter-value">{{ node?.type || 'custom' }}</div>
          </div>
          <div class="parameter-item">
            <label class="parameter-label">Node ID</label>
            <div class="parameter-value mono">{{ node?.id }}</div>
          </div>
          <div v-if="node?.position" class="parameter-item">
            <label class="parameter-label">Position</label>
            <div class="parameter-value">X: {{ node.position.x }}, Y: {{ node.position.y }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Node } from '@vue-flow/core';

interface Props {
  isOpen: boolean;
  node: Node | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const activeTab = ref<'parameters' | 'settings'>('parameters');

interface ParsedParameter {
  label: string;
  value: any;
  type: 'text' | 'number' | 'boolean' | 'json' | 'array';
}

const parameters = computed((): ParsedParameter[] => {
  const params = props.node?.parameters;
  if (!params || typeof params !== 'object') return [];

  const parsed: ParsedParameter[] = [];

  for (const [key, value] of Object.entries(params)) {
    parsed.push({
      label: formatLabel(key),
      value: value,
      type: detectType(value)
    });
  }

  return parsed;
});

const detectType = (value: any): 'text' | 'number' | 'boolean' | 'json' | 'array' => {
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object' && value !== null) return 'json';
  return 'text';
};

const formatLabel = (key: string): string => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const formatValue = (value: any, type: string): string => {
  if (value === null || value === undefined) return '-';

  if (type === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (type === 'json' || type === 'array') {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
};

const closePanel = () => {
  emit('close');
};

const handleOverlayClick = () => {
  closePanel();
};
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.15s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.settings-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.2s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #E5E7EB;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6B7280;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.close-button:hover {
  background: #F3F4F6;
  color: #111827;
}

.settings-tabs {
  display: flex;
  gap: 0;
  padding: 0 24px;
  border-bottom: 1px solid #E5E7EB;
}

.tab-button {
  background: none;
  border: none;
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #6B7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.15s ease;
  position: relative;
  top: 1px;
}

.tab-button:hover {
  color: #111827;
}

.tab-button.active {
  color: #FF6D5A;
  border-bottom-color: #FF6D5A;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.parameter-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.parameter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parameter-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  text-transform: capitalize;
}

.parameter-value {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  color: #111827;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.parameter-value.mono {
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
}

.parameter-value.is-json {
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  background: #F3F4F6;
}

.parameter-value.is-boolean {
  display: inline-block;
  padding: 6px 12px;
  background: #ECFDF5;
  color: #047857;
  font-weight: 600;
  border-color: #D1FAE5;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #9CA3AF;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.parameters-section,
.settings-section {
  animation: fadeIn 0.2s ease-out;
}

.dark-mode .settings-panel {
  background: #262626;
}

.dark-mode .settings-header {
  border-bottom-color: #525252;
}

.dark-mode .header-icon {
  filter: brightness(0) invert(1);
}

.dark-mode .header-title {
  color: #e5e5e5;
}

.dark-mode .close-button {
  color: #e5e5e5;
}

.dark-mode .close-button:hover {
  background: #404040;
  color: #ffffff;
}

.dark-mode .settings-tabs {
  border-bottom-color: #525252;
}

.dark-mode .tab-button {
  color: #a3a3a3;
}

.dark-mode .tab-button:hover {
  color: #d4d4d4;
}

.dark-mode .tab-button.active {
  color: #e5e5e5;
  border-bottom-color: #e5e5e5;
}

.dark-mode .parameter-label {
  color: #d4d4d4;
}

.dark-mode .parameter-value {
  background: #171717;
  border-color: #525252;
  color: #e5e5e5;
}

.dark-mode .parameter-value.is-json {
  background: #171717;
}

.dark-mode .parameter-value.is-boolean {
  background: #166534;
  color: #86efac;
  border-color: #14532d;
}

.dark-mode .empty-state {
  color: #737373;
}
</style>
