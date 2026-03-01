<template>
  <div class="cv-page" @mousemove="onMouseMove" @mouseleave="gridVisible = false" @mouseenter="gridVisible = true">
    <!-- Grid overlay -->
    <div class="grid-reveal" :class="{ active: gridVisible }" :style="{ '--mx': mouseX + 'px', '--my': mouseY + 'px', 'background-position': '0 ' + (-scrollY) + 'px' }"></div>
    <!-- Red accent spots -->
    <div class="grid-accents" :class="{ active: gridVisible }" :style="{ '--mx': mouseX + 'px', '--my': mouseY + 'px', top: (-scrollY) + 'px' }">
      <span v-for="(c, i) in accentCells" :key="i" class="accent-cell" :style="{ top: c.y + 'px', left: c.x + 'px' }"></span>
    </div>
    <!-- Header -->
    <header class="cv-header">
      <router-link to="/about" class="header-link">About</router-link>
      <span class="header-sep">/</span>
      <router-link to="/cases" class="header-link">Cases</router-link>
      <span class="header-sep">/</span>
      <router-link to="/sandbox" class="header-link">Sandbox</router-link>
    </header>

    <main class="cv-body">
      <!-- Hero: Name + Profile Pic -->
      <section class="hero">
        <div class="hero-pic-wrap">
          <div class="hero-pic-inner">
            <img :src="heroPicSrc" alt="Florido Jan Meacci" class="hero-pic" :class="{ blurred: heroBlurred }" />
          </div>
          <span class="hero-pic-label">{{ heroLabelText }}<span class="type-cursor">|</span></span>
        </div>
        <pre class="titleline">
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
        </pre>
        <div class="hero-sub">
          <p class="role">Creative Technologist</p>
          <p class="intro">I build ideas from concept to code — blending design, technology and craft to create things that work and feel right.</p>
        </div>
      </section>

      <!-- Cases -->
      <section class="section" id="cases">
        <div class="sec-hdr">
          <span>Cases</span>
          <span class="idx">01</span>
        </div>
        <div
          class="cases-scroll-wrap"
          ref="scrollRef"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointerleave="onPointerUp"
        >
          <div class="cases-scroll">
            <div class="case-card" v-for="(c, i) in loopCases" :key="i" :data-slug="c.slug">
              <div class="case-card-img">
                <img :src="c.img" :alt="c.title" draggable="false" />
              </div>
              <div class="case-card-info">
                <span class="case-card-title">{{ c.title }}</span>
                <span class="case-card-client">{{ c.client }}</span>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/cases" class="cases-directory">View all cases <span class="arrow">&rarr;</span></router-link>
      </section>

      <!-- Sandbox Preview -->
      <section class="section">
        <div class="sec-hdr">
          <span>Sandbox</span>
          <span class="idx">02</span>
        </div>
        <router-link to="/sandbox" class="sandbox-card">
          <div class="sandbox-preview">
            <img
              src="/images/n8n.webp"
              alt="N8N Sandbox Preview"
              class="sandbox-img"
              loading="lazy"
            />
            <div class="sandbox-overlay">
              <span class="sandbox-cta">Open Interactive Sandbox <span class="arrow">&rarr;</span></span>
            </div>
          </div>
          <p class="sandbox-desc">Explore my interactive N8N-style workflow playground — drag nodes, connect ideas.</p>
        </router-link>
      </section>

      <!-- Quick About -->
      <section class="section">
        <div class="sec-hdr">
          <span>Passion Project</span>
          <span class="idx">03</span>
        </div>
        <a href="https://reddituser.info" target="_blank" rel="noopener" class="passion-card">
          <div class="passion-preview">
            <iframe
              src="https://reddituser.info"
              class="passion-iframe"
              title="reddituser.info Preview"
              loading="lazy"
              scrolling="no"
            ></iframe>
            <div class="passion-overlay">
              <span class="passion-cta">Visit reddituser.info <span class="arrow">&rarr;</span></span>
            </div>
          </div>
          <p class="passion-desc">A tool that generates AI assessments and graph reports on Reddit users — visualizing activity, interests and posting behaviour at a glance.</p>
        </a>
      </section>

      <!-- Quick About -->
      <section class="section">
        <div class="sec-hdr">
          <span>About</span>
          <span class="idx">04</span>
        </div>
        <router-link to="/about" class="about-card">
          <div class="about-content">
            <p class="about-text">Creative Technologist at TBWA\NEBOKO, bridging design and development. I build AI-driven campaigns, interactive installations, and digital products — turning ideas into things people can experience.</p>
            <span class="view-about">Read more <span class="arrow">&rarr;</span></span>
          </div>
        </router-link>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mouseX = ref(0)
const mouseY = ref(0)
const scrollY = ref(0)
const gridVisible = ref(false)

// Hero pic typewriter loop
const heroVariants = [
  { img: '/picture.webp', text: '...wearing a beanie and overcoat' },
  { img: '/astronaut.webp', text: '...dressed as an astronaut' },
  { img: '/bear.webp', text: '...dressed as a bear' },
  { img: '/samurai.webp', text: '...dressed as a samurai' },
]
const heroIndex = ref(0)
const heroLabelText = ref('')
const heroPicSrc = ref(heroVariants[0].img)
const heroBlurred = ref(false)
let heroTimer: ReturnType<typeof setTimeout> | null = null

function runTypewriter() {
  const variant = heroVariants[heroIndex.value]
  heroPicSrc.value = variant.img
  // unblur as typing begins
  requestAnimationFrame(() => { heroBlurred.value = false })
  const text = variant.text
  let i = 0

  function typeNext() {
    if (i <= text.length) {
      heroLabelText.value = text.slice(0, i)
      i++
      heroTimer = setTimeout(typeNext, 60)
    } else {
      // pause before backspacing
      heroTimer = setTimeout(() => {
        // start blurring as backspace begins
        heroBlurred.value = true
        backspaceNext()
      }, 1800)
    }
  }

  function backspaceNext() {
    if (heroLabelText.value.length > 0) {
      heroLabelText.value = heroLabelText.value.slice(0, -1)
      heroTimer = setTimeout(backspaceNext, 35)
    } else {
      // swap image while blurred, then start next
      heroIndex.value = (heroIndex.value + 1) % heroVariants.length
      heroTimer = setTimeout(runTypewriter, 300)
    }
  }

  typeNext()
}

// Red accent cells snapped to 28px grid
const G = 28
const accentCells = [
  // cluster top-left
  { x: 3 * G, y: 8 * G },
  { x: 3 * G, y: 9 * G },
  // solo mid-right
  { x: 30 * G, y: 6 * G },
  // L-shape center
  { x: 18 * G, y: 14 * G },
  { x: 19 * G, y: 14 * G },
  { x: 18 * G, y: 15 * G },
  // solo left
  { x: 6 * G, y: 20 * G },
  // solo far right
  { x: 35 * G, y: 24 * G },
  // solo center
  { x: 22 * G, y: 10 * G },
  // pair bottom-left
  { x: 12 * G, y: 28 * G },
  { x: 13 * G, y: 28 * G },
  // solo top center
  { x: 16 * G, y: 4 * G },
  // solo bottom-right
  { x: 38 * G, y: 18 * G },
]

const onMouseMove = (e: MouseEvent) => {
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  scrollY.value = window.scrollY
}

const topCases = [
  { title: "McDonald's Fan Favorites", client: "McDonald's — TBWA\\NEBOKO", img: '/cases/images/fan_favorites_hero.png', slug: 'fan-favorites' },
  { title: 'LG Radio Optimism', client: 'LG Electronics — Global', img: '/cases/images/lg_hero.png', slug: 'lg-radio-optimism' },
  { title: 'TBWA\\X Custom Arcade', client: 'TBWA\\X', img: '/cases/images/arcade_hero.png', slug: 'arcade' },
  { title: "McDonald's Delivery Detector", client: "McDonald's — TBWA\\NEBOKO", img: '/cases/images/mcdeliverydetector.avif', slug: 'delivery-detector' },
  { title: 'SS26 New Amsterdam Surf', client: 'New Amsterdam Surf Association', img: '/cases/images/nasa_thumb.webp', slug: 'ss26-new-amsterdam' },
  { title: 'Al Ghurair Foundation', client: 'Abdulla Al Ghurair Foundation', img: '/cases/images/abdul_thumb.webp', slug: 'abdulla-al-ghurair' },
  { title: 'New Care Supplements', client: 'New Care — Sabatoka', img: '/cases/images/newcare_thumb.webp', slug: 'new-care' },
  { title: 'Food Token Soup', client: "Branca's Kitchen — Personal", img: '/cases/images/food_token_soup_hero.png', slug: 'food-token-soup' },
  { title: "McDonald's Family Mode", client: "McDonald's — TBWA\\NEBOKO", img: '/cases/images/imgi_1_hero.webp', slug: 'family-mode' },
]

const loopCases = computed(() => [...topCases, ...topCases, ...topCases])

// Drag-to-scroll + infinite loop
const scrollRef = ref<HTMLElement | null>(null)
let isDragging = false
let hasDragged = false
let startX = 0
let scrollLeft = 0
let downTarget: HTMLElement | null = null

const onPointerDown = (e: PointerEvent) => {
  const el = scrollRef.value
  if (!el) return
  isDragging = true
  hasDragged = false
  downTarget = e.target as HTMLElement
  el.style.cursor = 'grabbing'
  startX = e.pageX - el.offsetLeft
  scrollLeft = el.scrollLeft
  el.setPointerCapture(e.pointerId)
}

const onPointerMove = (e: PointerEvent) => {
  if (!isDragging) return
  const el = scrollRef.value
  if (!el) return
  e.preventDefault()
  const x = e.pageX - el.offsetLeft
  const diff = Math.abs(x - startX)
  if (diff > 5) hasDragged = true
  el.scrollLeft = scrollLeft - (x - startX)
}

const onPointerUp = () => {
  isDragging = false
  const el = scrollRef.value
  if (el) el.style.cursor = 'grab'
  if (!hasDragged && downTarget) {
    const card = downTarget.closest('.case-card') as HTMLElement | null
    if (card) {
      const slug = card.dataset.slug
      if (slug) router.push('/cases#' + slug)
    }
  }
  downTarget = null
}

// Infinite loop: reset scroll when reaching clone boundaries
const onScroll = () => {
  const el = scrollRef.value
  if (!el) return
  const setWidth = el.scrollWidth / 3
  if (el.scrollLeft >= setWidth * 2) {
    el.scrollLeft -= setWidth
  } else if (el.scrollLeft <= 0) {
    el.scrollLeft += setWidth
  }
}

onMounted(() => {
  const el = scrollRef.value
  if (el) {
    // Start at middle set
    el.scrollLeft = el.scrollWidth / 3
    el.addEventListener('scroll', onScroll)
  }
  // Start typewriter loop
  runTypewriter()
})

onUnmounted(() => {
  const el = scrollRef.value
  if (el) el.removeEventListener('scroll', onScroll)
  if (heroTimer) clearTimeout(heroTimer)
})
</script>

<style scoped>
.cv-page {
  --bg: #f8f8f8;
  --ink: #0f0f0f;
  background: var(--bg);
  color: var(--ink);
  min-height: 100vh;
  overflow-x: hidden;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 13px;
  line-height: 1.6;
  position: relative;
}

.grid-reveal {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  background-image:
    linear-gradient(rgba(0,0,0,0.12) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,0,0,0.12) 1px, transparent 1px);
  background-size: 28px 28px;
  -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
  mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
}

.grid-reveal.active {
  opacity: 1;
}

.grid-accents {
  position: fixed;
  left: 0;
  width: 100%;
  height: 200%;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
  -webkit-mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
  mask-image: radial-gradient(circle 180px at var(--mx, 0) var(--my, 0), black 0%, transparent 100%);
}

.grid-accents.active {
  opacity: 1;
}

.accent-cell {
  position: absolute;
  width: 28px;
  height: 28px;
  background: rgba(220, 40, 40, 0.07);
  border: 1px solid rgba(220, 40, 40, 0.18);
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

@keyframes arrow-nudge {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(5px); }
}

/* Header nav */
.cv-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(248, 248, 248, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-link {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink);
  text-decoration: none;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.header-link:hover {
  opacity: 1;
}

.header-sep {
  opacity: 0.2;
  font-size: 11px;
}

/* Body */
.cv-body {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 32px 120px;
}

/* Hero */
.hero {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0 48px;
  margin-bottom: 72px;
}

.hero-pic-wrap {
  grid-column: 2;
  grid-row: 1 / 3;
  align-self: start;
  position: relative;
}

.hero-pic-inner {
  overflow: hidden;
  border-radius: 6px;
}

.hero-pic-label {
  position: absolute;
  bottom: -18px;
  left: calc(50% + 20px);
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #d0d0d0;
  border-radius: 20px;
  padding: 5px 14px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-style: italic;
  color: #666;
  white-space: nowrap;
  z-index: 1;
}

.type-cursor {
  display: inline-block;
  animation: blink-cursor 0.6s step-end infinite;
  font-style: normal;
  margin-left: 1px;
  color: #999;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.titleline {
  grid-column: 1;
  grid-row: 1;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1;
  color: transparent;
  background: linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.75) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  font-weight: 700;
  white-space: pre;
  margin: 0 0 32px;
  user-select: none;
}

.role {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--ink);
  opacity: 0.4;
  margin: 0 0 20px;
}

.intro {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink);
  opacity: 0.7;
  margin: 0;
  max-width: 400px;
}

.hero-sub {
  grid-column: 1;
  grid-row: 2;
}

.hero-pic {
  width: 180px;
  height: 220px;
  object-fit: cover;
  object-position: center 20%;
  border-radius: 6px;
  filter: grayscale(0.1) blur(0px);
  transition: filter 1.2s ease;
}

.hero-pic.blurred {
  filter: grayscale(0.1) blur(10px);
}

/* Section headers (CV style) */
.section {
  margin-bottom: 56px;
}

.sec-hdr {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 10px;
  margin-bottom: 20px;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 300;
  font-size: 10px;
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
  border-top: 1px solid #000;
  opacity: 0.15;
}

.sec-hdr .idx {
  font-size: 10px;
  opacity: 0.4;
}

/* Cases Carousel */
.cases-scroll-wrap {
  margin: 0 -32px 0 0;
  margin-right: calc(-50vw + 50%);
  padding-right: 60px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  -webkit-mask-image: linear-gradient(90deg, black 0%, black 80%, transparent 100%);
  mask-image: linear-gradient(90deg, black 0%, black 80%, transparent 100%);
}

.cases-scroll-wrap::-webkit-scrollbar {
  display: none;
}

.cases-scroll {
  display: flex;
  gap: 16px;
  padding-bottom: 4px;
}

.case-card {
  flex-shrink: 0;
  width: 260px;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.case-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.case-card-img {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.case-card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.case-card:hover .case-card-img img {
  transform: scale(1.04);
}

.case-card-info {
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.case-card-title {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
}

.case-card-client {
  font-size: 11px;
  opacity: 0.4;
  letter-spacing: 0.3px;
}

.cases-directory {
  display: inline-block;
  margin-top: 20px;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  color: var(--ink);
  opacity: 0.4;
  transition: opacity 0.2s;
}

.cases-directory:hover {
  opacity: 0.8;
}

.cases-directory:hover .arrow {
  animation: arrow-nudge 0.8s ease-in-out infinite;
}

/* Sandbox Preview */
.sandbox-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 6px;
  transition: transform 0.25s ease;
}

.sandbox-card:hover {
  transform: translateY(-2px);
}

.sandbox-preview {
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #0f0f0f;
}

.sandbox-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  pointer-events: none;
  filter: brightness(0.85);
  transition: transform 0.5s ease;
}

.sandbox-card:hover .sandbox-img {
  transform: scale(1.05);
}

.sandbox-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 70%, rgba(15,15,15,0.20) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  cursor: pointer;
}

.sandbox-cta {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.7;
  color: #fff;
  transition: opacity 0.2s;
}

.sandbox-card:hover .sandbox-cta {
  opacity: 0.8;
}

.sandbox-card:hover .arrow {
  animation: arrow-nudge 0.8s ease-in-out infinite;
}

.sandbox-desc {
  font-size: 13px;
  line-height: 1.7;
  opacity: 0.55;
  margin: 14px 0 0;
}

/* Passion Project Card */
.passion-card {
  display: block;
  text-decoration: none;
  color: var(--ink);
  transition: transform 0.2s;
}

.passion-card:hover {
  transform: translateY(-2px);
}

.passion-preview {
  position: relative;
  width: 100%;
  height: 340px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #0f0f0f;
}

.passion-iframe {
  width: 200%;
  height: 200%;
  border: none;
  transform: scale(0.5);
  transform-origin: top left;
  pointer-events: none;
  filter: brightness(0.85);
  transition: transform 0.5s ease;
}

.passion-card:hover .passion-iframe {
  transform: scale(0.55) translate(-4.5%, -4.5%);
}

.passion-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 70%, rgba(15,15,15,0.20) 100%);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  cursor: pointer;
}

.passion-desc {
  font-size: 13px;
  line-height: 1.7;
  opacity: 0.55;
  margin: 14px 0 0;
}

.passion-cta {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.7;
  color: #fff;
  transition: opacity 0.2s;
}

.passion-card:hover .passion-cta {
  opacity: 0.9;
}

.passion-card:hover .arrow {
  animation: arrow-nudge 0.8s ease-in-out infinite;
}

/* About Card */
.about-card {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.25s ease;
}

.about-card:hover {
  transform: translateY(-2px);
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.about-text {
  font-size: 15px;
  line-height: 1.8;
  opacity: 0.65;
  margin: 0;
  max-width: 640px;
}

.view-about {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  opacity: 0.4;
  transition: opacity 0.2s;
}

.about-card:hover .view-about {
  opacity: 0.8;
}

.about-card:hover .arrow {
  animation: arrow-nudge 0.8s ease-in-out infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .cv-header {
    padding: 14px 18px;
  }

  .cv-body {
    padding: 32px 18px 60px;
  }

  .hero {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 16px 16px;
    margin-bottom: 32px;
  }

  .hero-pic-wrap {
    grid-column: 1;
    grid-row: 1;
    align-self: center;
  }

  .hero-pic-label {
    bottom: -16px;
    left: calc(50% + 30px);
    font-size: 9px;
    padding: 4px 10px;
  }

  .titleline {
    grid-column: 2;
    grid-row: 1;
    align-self: center;
    font-size: 8px;
    margin-bottom: 0;
  }

  .hero-sub {
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: 20px;
  }

  .role {
    font-size: 11px;
    margin-bottom: 12px;
  }

  .intro {
    font-size: 13px;
    max-width: 100%;
  }

  .hero-pic {
    width: 90px;
    height: 115px;
  }

  .section {
    margin-bottom: 40px;
  }

  .cases-scroll-wrap {
    margin-right: -18px;
    padding-right: 40px;
  }

  .case-card {
    width: 200px;
  }

  .case-card-img {
    height: 240px;
  }

  .case-card-info {
    padding: 10px 12px 14px;
  }

  .case-card-title {
    font-size: 13px;
  }

  .case-card-client {
    font-size: 10px;
  }

  .sandbox-preview,
  .passion-preview {
    height: 220px;
  }

  .sandbox-desc,
  .passion-desc {
    font-size: 12px;
  }

  .about-text {
    font-size: 14px;
  }
}

@media (max-width: 400px) {
  .titleline {
    font-size: 7px;
  }

  .hero-pic {
    width: 70px;
    height: 90px;
  }

  .case-card {
    width: 170px;
  }

  .case-card-img {
    height: 200px;
  }
}
</style>
