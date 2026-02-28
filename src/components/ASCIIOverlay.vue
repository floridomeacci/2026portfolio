<template>
  <div class="ascii-node" :class="{ 'dark-mode': isDark?.value }">
    <pre class="ascii-text">
███████╗██╗      ██████╗ ██████╗ ██╗██████╗  ██████╗
██╔════╝██║     ██╔═══██╗██╔══██╗██║██╔══██╗██╔═══██╗
█████╗  ██║     ██║   ██║██████╔╝██║██║  ██║██║   ██║
██╔══╝  ██║     ██║   ██║██╔══██╗██║██║  ██║██║   ██║
██║     ███████╗╚██████╔╝██║  ██║██║██████╔╝╚██████╔╝
╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═════╝  ╚═════╝

███╗   ███╗███████╗ █████╗  ██████╗ ██████╗██╗
████╗ ████║██╔════╝██╔══██╗██╔════╝██╔════╝██║
██╔████╔██║█████╗  ███████║██║     ██║     ██║
██║╚██╔╝██║██╔══╝  ██╔══██║██║     ██║     ██║
██║ ╚═╝ ██║███████╗██║  ██║╚██████╗╚██████╗██║
╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝╚═╝

 ██████╗██████╗ ███████╗ █████╗ ████████╗██╗██╗   ██╗███████╗
██╔════╝██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║██║   ██║██╔════╝
██║     ██████╔╝█████╗  ███████║   ██║   ██║██║   ██║█████╗
██║     ██╔══██╗██╔══╝  ██╔══██║   ██║   ██║╚██╗ ██╔╝██╔══╝
╚██████╗██║  ██║███████╗██║  ██║   ██║   ██║ ╚████╔╝ ███████╗
 ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝

████████╗███████╗ ██████╗██╗  ██╗
╚══██╔══╝██╔════╝██╔════╝██║  ██║
   ██║   █████╗  ██║     ███████║
   ██║   ██╔══╝  ██║     ██╔══██║
   ██║   ███████╗╚██████╗██║  ██║
   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝
    </pre>

    <pre class="ascii-signature">
                                        @ TBWA\
    </pre>

    <div class="controls-section">
      <div class="controls-grid">
        <dotlottie-player
          src="/icons/scroll2.lottie"
          class="lottie-icon scroll-icon"
          autoplay
          loop
        ></dotlottie-player>

        <div class="control-text-lines">
          <div>SCROLL</div>
          <div>TO ZOOM</div>
        </div>

        <dotlottie-player
          src="/icons/drag.lottie"
          class="lottie-icon"
          autoplay
          loop
        ></dotlottie-player>

        <div class="control-text-lines">
          <div>DRAG</div>
          <div>TO PAN</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, inject, type Ref } from 'vue';

const isDark = inject<Ref<boolean>>('isDarkMode');

onMounted(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs';
  script.type = 'module';
  document.head.appendChild(script);
});
</script>

<style scoped>
.ascii-node {
  pointer-events: none;
  user-select: none;
}

.ascii-text {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.40);
  font-weight: 700;
  text-align: center;
  white-space: pre;
  margin: 0;
}

.dark-mode .ascii-text {
  color: rgba(255, 255, 255, 0.7);
}

.controls-section {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.controls-grid {
  display: grid;
  grid-template-columns: auto auto auto auto;
  gap: 8px;
  align-items: center;
  column-gap: 8px;
  border: 2px double;
  border-color: rgba(0, 0, 0, 0.7);
  padding: 12px 16px;
}

.dark-mode .controls-grid {
  border-color: rgba(255, 255, 255, 0.7);
}

.controls-grid > :nth-child(2) {
  margin-right: 24px;
}

.lottie-icon {
  width: 32px;
  height: 32px;
  filter: brightness(0) saturate(100%) opacity(0.7);
}

.dark-mode .lottie-icon {
  filter: brightness(0) saturate(100%) invert(1) opacity(0.7);
}

.scroll-icon {
  transform: rotate(90deg);
}

.control-text-lines {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.7);
  letter-spacing: 0.05em;
  text-align: left;
}

.dark-mode .control-text-lines {
  color: rgba(255, 255, 255, 0.7);
}

.ascii-signature {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  line-height: 1;
  color: rgba(0, 0, 0, 0.56);
  font-weight: 700;
  text-align: center;
  white-space: pre;
  margin: 0;
  margin-top: 10px;
}

.dark-mode .ascii-signature {
  color: rgba(255, 255, 255, 0.56);
}
</style>
