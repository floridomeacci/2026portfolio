<template>
  <div v-if="isTextMode" class="ascii-text-overlay" :class="{ 'dark-mode': isDark?.value }">
    <pre class="ascii-content">{{ glitchedTextContent }}</pre>
  </div>
  <CobraGame v-else-if="isGameMode" />
  <div v-else :class="['sticky-note', colorClass]">
    <div class="sticky-content" v-html="formattedContent"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, type Ref } from 'vue';
import { textToASCII } from '../utils/asciiFont';
import CobraGame from './CobraGame.vue';

interface Props {
  data: {
    content: string;
    width?: number;
    height?: number;
    color?: number;
  };
}

const props = defineProps<Props>();

const isDark = inject<Ref<boolean>>('isDarkMode');

const isTextMode = computed(() => {
  const content = props.data.content || '';
  return /<TEXT>[\s\S]*?<TEXT>/.test(content);
});

const isGameMode = computed(() => {
  const content = props.data.content || '';
  return /<GAME>COBRA<GAME>/.test(content);
});

const textContent = computed(() => {
  if (!isTextMode.value) return '';
  const content = props.data.content || '';
  const match = content.match(/<TEXT>([\s\S]*?)<TEXT>/);
  if (!match) return '';

  const rawText = match[1].trim();
  return textToASCII(rawText);
});

const glitchedTextContent = computed(() => {
  if (!textContent.value) return '';

  const lines = textContent.value.split('\n');

  return lines.map((line, index) => {
    const shouldShift = index % 3 === 1;
    const shift = shouldShift ? '\u2009' : '';
    return shift + line;
  }).join('\n');
});

const colorClass = computed(() => {
  const colorMap: Record<number, string> = {
    1: 'color-yellow',
    2: 'color-blue',
    3: 'color-red',
    4: 'color-green',
    5: 'color-purple',
    6: 'color-orange',
    7: 'color-pink',
  };
  return colorMap[props.data.color || 4] || 'color-green';
});

const formattedContent = computed(() => {
  let html = props.data.content || '';

  const imgMatch = html.match(/<IMG>(.+?)<IMG>/);
  if (imgMatch) {
    const imagePath = imgMatch[1];

    // Extract ratio parameter (default 1:1)
    const ratioMatch = html.match(/<RATIO>(\d+):(\d+)<RATIO>/);
    let aspectRatio = '1 / 1';
    if (ratioMatch) {
      aspectRatio = `${ratioMatch[1]} / ${ratioMatch[2]}`;
    }

    return `<div class="sticky-image-wrapper" style="aspect-ratio: ${aspectRatio};"><img src="/images/${imagePath}" alt="${imagePath}" class="sticky-image" /></div>`;
  }

  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');

  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/gs, '<ul>$&</ul>');

  html = html.replace(/^  ○ (.+)$/gm, '<li class="sub-item">$1</li>');

  html = html.replace(/\n\n/g, '<br><br>');
  html = html.replace(/\n/g, '<br>');

  return html;
});
</script>

<style scoped>
.ascii-text-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  position: relative;
}

.ascii-content {
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  line-height: 1.2;
  white-space: pre;
  margin: 0;
  padding: 0;
  transform-origin: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.6);
  color: rgba(0, 0, 0, 0.7);
  font-weight: 300;
}

.dark-mode .ascii-content {
  color: rgba(255, 255, 255, 0.7);
}


.sticky-note {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  overflow: visible;
  height: auto;
  min-height: 100%;
}

.color-yellow {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFF59D 100%);
}

.color-blue {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.color-red {
  background: #94A3B8;
}

.color-green {
  background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
}

.color-purple {
  background: linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%);
}

.color-orange {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
}

.color-pink {
  background: linear-gradient(135deg, #FCE4EC 0%, #F8BBD0 100%);
}

.sticky-content {
  line-height: 1.6;
  color: #2C3E50;
  padding: 20px;
  font-size: 13px;
}

.sticky-content:has(.sticky-image-wrapper) {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.sticky-content :deep(h2) {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1A1A1A;
  line-height: 1.2;
}

.sticky-content :deep(h3) {
  font-size: 22px;
  font-weight: 600;
  margin: 24px 0 16px 0;
  color: #1A1A1A;
}

.sticky-content :deep(ul) {
  margin: 8px 0;
  padding-left: 0;
  list-style: none;
}

.sticky-content :deep(li) {
  margin: 6px 0;
  padding-left: 0;
}

.sticky-content :deep(li)::before {
  content: "• ";
  color: #666;
  font-weight: bold;
  display: inline-block;
  width: 1em;
}

.sticky-content :deep(li.sub-item) {
  padding-left: 24px;
}

.sticky-content :deep(li.sub-item)::before {
  content: "○ ";
}

.sticky-content :deep(strong) {
  font-weight: 600;
  color: #1A1A1A;
  line-height: 1.3;
  display: inline-block;
}

.sticky-content :deep(a) {
  color: #FF6B6B;
  text-decoration: none;
  font-weight: 500;
}

.sticky-content :deep(a:hover) {
  text-decoration: underline;
}

.sticky-content :deep(.sticky-image-wrapper) {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  width: 100%;
  height: 100%;
}

.sticky-content :deep(.sticky-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
