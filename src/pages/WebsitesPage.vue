<template>
  <div class="cv-page" @mousemove="onMouseMove" @mouseleave="gridVisible = false" @mouseenter="gridVisible = true">
    <div class="grid-reveal" :class="{ active: gridVisible }" :style="{ '--mx': mouseX + 'px', '--my': mouseY + 'px' }"></div>
    <div class="grid-accents" :class="{ active: gridVisible }">
      <span v-for="(c, i) in accentCells" :key="i" class="accent-cell" :style="{ top: c.y + 'px', left: c.x + 'px' }"></span>
    </div>

    <header class="cv-header">
      <router-link to="/" class="back-link" title="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span class="header-label">Websites</span>
      </router-link>
    </header>

    <main class="cv-body">
      <div class="sec-hdr"><span>My Websites</span><span class="idx">01</span></div>

      <div class="grid">
        <a
          v-for="(p, i) in passionProjects"
          :key="i"
          :href="p.url"
          target="_blank"
          rel="noopener"
          class="passion-card"
        >
          <div class="passion-preview">
            <div v-if="p.noEmbed" class="passion-fallback">
              <img :src="'/images/' + p.thumb" :alt="p.label" class="passion-thumb" loading="lazy" decoding="async" />
            </div>
            <iframe
              v-else
              :src="p.url"
              class="passion-iframe"
              :title="p.label + ' Preview'"
              loading="lazy"
              scrolling="no"
            ></iframe>
            <div class="passion-overlay">
              <span class="passion-cta">Visit {{ p.label }} <span class="arrow">&rarr;</span></span>
            </div>
          </div>
          <p class="passion-desc">{{ p.desc }}</p>
        </a>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const G = 28
const accentCells = [
  { x: 3 * G, y: 8 * G }, { x: 3 * G, y: 9 * G },
  { x: 30 * G, y: 6 * G },
  { x: 18 * G, y: 14 * G }, { x: 19 * G, y: 14 * G }, { x: 18 * G, y: 15 * G },
  { x: 6 * G, y: 20 * G },
  { x: 35 * G, y: 24 * G },
  { x: 22 * G, y: 10 * G },
  { x: 12 * G, y: 28 * G }, { x: 13 * G, y: 28 * G },
  { x: 16 * G, y: 4 * G },
  { x: 38 * G, y: 18 * G },
]

const mouseX = ref(0)
const mouseY = ref(0)
const gridVisible = ref(true)

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
}

const passionProjects = [
  { url: 'https://tlguide.com', label: 'tlguide.com', desc: 'I made a review site for Figma plugins and widgets. The reviews and outreach are mostly automated with AI.' },
  { url: 'https://jobs.floridomeacci.xyz', label: 'jobs.floridomeacci.xyz', desc: 'A job board for AI, creative tech and design roles in Amsterdam. I built it because I got tired of seeing good people miss relevant jobs.' },
  { url: 'https://www.figma.com/community/plugin/1626934504810261537', label: 'Filters & Grain', desc: 'A Figma plugin for color grading, film grain and vignette. No Photoshop needed.', noEmbed: true, thumb: 'figma.webp' },
  { url: 'https://www.latentsearch.net/', label: 'latentsearch.net', desc: 'Every search result is AI-generated. It looks normal, but the content is fake.' },
  { url: 'https://creditswap.app', label: 'creditswap.app', desc: 'A private marketplace for reselling AI API credit. Buyers pay less, sellers monetize unused capacity.' },
  { url: 'https://reddituser.info', label: 'reddituser.info', desc: 'Paste a Reddit username, get an AI-generated report with graphs. Activity, interests, posting habits.', noEmbed: true, thumb: 'reddituserinfo.webp' },
  { url: 'https://colino.work', label: 'colino.work', desc: 'A job search that filters live openings down to the roles that actually match your CV. Upload your resume and it ranks the jobs that fit.' },
  { url: 'https://mlnpx.com', label: 'million.pixels', desc: 'A one-million-pixel canvas painted by AI agents and the people who direct them. A living demo of WebMCP.', noEmbed: true, thumb: 'millionpixels.webp' },
]
</script>

<style scoped>
.cv-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* ─── Grid overlay ─── */
.grid-reveal {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-image:
    linear-gradient(oklch(15% 0.008 45 / 0.1) 1px, transparent 1px),
    linear-gradient(90deg, oklch(15% 0.008 45 / 0.1) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
  mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
}
.grid-reveal.active { opacity: 1; }

.grid-accents {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 200%;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
  mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
}
.grid-accents.active { opacity: 1; }

.accent-cell {
  position: absolute;
  width: 28px;
  height: 28px;
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
}

/* ─── Header ─── */
.cv-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 32px;
  background: var(--bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.back-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--ink);
  opacity: .5;
  transition: opacity var(--duration-fast) var(--ease-out);
  text-decoration: none;
}
.back-link:hover { opacity: 1; }

.header-label {
  font-family: var(--font-ui);
  font-weight: 300;
  font-size: var(--text-sm);
  letter-spacing: .3px;
}

/* ─── Body ─── */
.cv-body {
  position: relative;
  z-index: 1;
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 32px 100px;
}

.sec-hdr {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 10px;
  margin-bottom: 32px;
  font-family: var(--font-ui);
  font-weight: 300;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink);
}
.sec-hdr::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid var(--border);
}
.sec-hdr .idx {
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

/* ─── Grid ─── */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

/* ─── Passion cards (same as homepage) ─── */
.passion-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: var(--ink);
  transition: transform var(--duration-fast) var(--ease-out);
}

.passion-card:hover {
  transform: translateY(-2px);
}

.passion-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--border-s);
  background: var(--ink);
}

.passion-fallback {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.passion-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.85);
  transition: transform var(--duration-slow) var(--ease-out), filter var(--duration-slow) var(--ease-out);
}

.passion-card:hover .passion-thumb {
  transform: scale(1.03);
  filter: brightness(1);
}

.passion-iframe {
  width: 200%;
  height: 200%;
  border: none;
  transform: scale(0.5);
  transform-origin: top left;
  pointer-events: none;
  filter: brightness(0.85);
  transition: transform var(--duration-slow) var(--ease-out);
}

.passion-card:hover .passion-iframe {
  transform: scale(0.55) translate(-4.5%, -4.5%);
}

.passion-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 70%, oklch(15% 0.008 45 / 0.2) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  cursor: pointer;
}

.passion-cta {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.7;
  color: oklch(97.5% 0.008 45);
  transition: opacity var(--duration-fast) var(--ease-out);
}

.passion-card:hover .passion-cta {
  opacity: 0.9;
}

.passion-card:hover .arrow {
  animation: arrow-nudge 0.8s var(--ease-out) infinite;
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

@keyframes arrow-nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

.passion-desc {
  font-size: var(--text-sm);
  line-height: 1.7;
  color: var(--ink-muted);
  margin: 14px 0 0;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .grid {
    gap: 16px;
  }
  .passion-preview {
    height: 180px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .passion-preview {
    height: 220px;
  }
}
</style>
