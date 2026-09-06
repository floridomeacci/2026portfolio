<template>
  <div class="cv-page">
    <header class="cv-header">
      <router-link to="/websites" class="header-link">Websites</router-link>
      <span class="header-sep">/</span>
      <router-link to="/cases" class="header-link">Cases</router-link>
      <span class="header-sep">/</span>
      <router-link to="/sandbox" class="header-link">N8N Sandbox</router-link>
      <span class="header-sep">/</span>
      <router-link to="/about" class="header-link">About</router-link>
    </header>

    <main class="cv-body">
      <div class="cases-list" ref="listRef">
        <div
          v-for="c in loopCases"
          :key="c.uid"
          class="case-entry"
          :class="{ open: expandedCase !== null && c.origIdx === expandedCase }"
          @click="toggleCase(c.origIdx)"
        >
          <div class="entry-bar">
            <div class="entry-text">
              <span class="entry-title">{{ c.title }}</span>
              <span class="entry-client">{{ c.client }}</span>
            </div>
            <div class="entry-tags">
              <span v-for="tag in c.tags" :key="tag" class="entry-tag">{{ tag }}</span>
            </div>
            <div class="entry-count" v-if="mediaItems(c)">{{ mediaItems(c) }}</div>
            <svg class="chevron" :class="{ rotated: expandedCase === c.origIdx }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>
    </main>

    <div v-if="overlayVisible" class="overlay-backdrop"></div>

    <Transition name="overlay">
      <div v-if="expandedCase !== null && !transitioning" class="case-overlay" @click.self="closeOverlay">
        <div class="overlay-hdr">
          <router-link to="/websites" class="header-link">Websites</router-link>
          <span class="header-sep">/</span>
          <router-link to="/cases" class="header-link">Cases</router-link>
          <span class="header-sep">/</span>
          <router-link to="/sandbox" class="header-link">N8N Sandbox</router-link>
          <span class="header-sep">/</span>
          <router-link to="/about" class="header-link">About</router-link>
        </div>

        <div class="overlay-body">
          <div class="overlay-text">
            <button class="overlay-close" @click="closeOverlay" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
            <h2 class="overlay-case-title">{{ cases[expandedCase].title }}</h2>
            <p class="overlay-client">{{ cases[expandedCase].client }}</p>
            <p class="overlay-desc">{{ cases[expandedCase].description }}</p>
            <div class="overlay-tags">
              <span v-for="tag in cases[expandedCase].tags" :key="tag" class="overlay-tag">{{ tag }}</span>
            </div>
            <a v-if="cases[expandedCase].projectUrl" :href="cases[expandedCase].projectUrl" target="_blank" rel="noopener" class="overlay-link">Open interactive map <span class="arrow">&rarr;</span></a>
          </div>

          <div class="overlay-media" ref="mediaRef">
            <template v-if="cases[expandedCase]">
              <div v-if="cases[expandedCase].youtube" class="entry-media">
                <iframe
                  :src="cases[expandedCase].youtube"
                  class="entry-youtube"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  loading="lazy"
                ></iframe>
              </div>

              <div v-if="cases[expandedCase].video" class="entry-media">
                <video :src="cases[expandedCase].video" :poster="posterFor(cases[expandedCase].video)" controls preload="metadata" class="entry-video"></video>
              </div>

              <div v-if="cases[expandedCase].videos && cases[expandedCase].videos.length" v-for="(vid, vi) in cases[expandedCase].videos" :key="'v'+vi" class="entry-media">
                <video :src="vid" :poster="posterFor(vid)" controls preload="metadata" class="entry-video"></video>
              </div>

              <div v-if="cases[expandedCase].images && cases[expandedCase].images.length" class="entry-images" :class="{ 'dark-bg': cases[expandedCase].darkBg }">
                <img
                  v-for="(src, j) in cases[expandedCase].images"
                  :key="j"
                  :src="src"
                  :alt="cases[expandedCase].title + ' - ' + (j + 1)"
                  class="entry-img"
                  loading="lazy"
                />
              </div>
            </template>

            <div ref="sentinelRef" class="scroll-sentinel"></div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expandedCase = ref<number | null>(null)
const transitioning = ref(false)
const mediaRef = ref<HTMLElement | null>(null)
const sentinelRef = ref<HTMLElement | null>(null)

const LOOP = 3
const listRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null
let canAutoAdvance = true

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const toggleCase = (i: number) => {
  if (expandedCase.value === i) {
    closeOverlay()
  } else {
    openCase(i)
  }
}

function lockOverlay(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

function resetListScroll() {
  if (listRef.value) listRef.value.scrollTop = 0
}

function openCase(i: number) {
  lockOverlay(true)
  resetListScroll()
  if (expandedCase.value !== null) {
    transitioning.value = true
    expandedCase.value = null
    setTimeout(() => {
      expandedCase.value = i
      nextTick(() => {
        transitioning.value = false
        scrollMediaTop()
        setupObserver()
      })
    }, 250)
  } else {
    expandedCase.value = i
    nextTick(() => {
      scrollMediaTop()
      setupObserver()
    })
  }
}

function closeOverlay() {
  expandedCase.value = null
  transitioning.value = false
  cleanupObserver()
  resetListScroll()
  lockOverlay(false)
}

function scrollMediaTop() {
  nextTick(() => {
    if (mediaRef.value) {
      mediaRef.value.scrollTop = 0
    }
  })
}

function advanceNext() {
  if (expandedCase.value === null || !canAutoAdvance) return
  canAutoAdvance = false
  const next = (expandedCase.value + 1) % totalCases.value
  transitioning.value = true
  expandedCase.value = null
  setTimeout(() => {
    expandedCase.value = next
    nextTick(() => {
      transitioning.value = false
      scrollMediaTop()
      canAutoAdvance = true
      nextTick(() => setupObserver())
    })
  }, 400)
}

function setupObserver() {
  cleanupObserver()
  if (!sentinelRef.value) return
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && canAutoAdvance && !transitioning.value) {
        autoAdvanceTimer = setTimeout(() => {
          advanceNext()
        }, 800)
      } else if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer)
        autoAdvanceTimer = null
      }
    },
    { rootMargin: '0px 0px 100px 0px' }
  )
  observer.observe(sentinelRef.value)
}

function cleanupObserver() {
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (autoAdvanceTimer) {
    clearTimeout(autoAdvanceTimer)
    autoAdvanceTimer = null
  }
}

onBeforeUnmount(() => {
  cleanupObserver()
  lockOverlay(false)
})

const overlayVisible = computed(() => expandedCase.value !== null || transitioning.value)

const totalCases = computed(() => cases.value.length)

interface CaseItem {
  title: string; client: string; description: string
  tags: string[]; video?: string; videos?: string[]; youtube?: string; images?: string[]; darkBg?: boolean; projectUrl?: string
}

const img = (name: string) => '/cases/images/' + name
const posterFor = (v: string) => v.replace('/cases/videos/', '/cases/videos/posters/').replace('.mp4', '.webp')
const range = (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => s + i)

const mediaItems = (c: CaseItem) => {
  const n = (c.images?.length || 0) + (c.video ? 1 : 0) + (c.videos?.length || 0) + (c.youtube ? 1 : 0)
  return n > 0 ? n + ' item' + (n > 1 ? 's' : '') : ''
}

const cases = ref<CaseItem[]>([
  {
    title: "McDonald's Fan Favorites",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Ran this three times — Netherlands, Portugal, Spain. I built the pipeline in Python. For each market I generated every product with AI (Flux, later ChatGPT), combined them into millions of menu combinations at scale, and handled all uploads and naming. Over 4 million unique combos. Design teams did post-editing for a week.",
    tags: ['AI', 'Pipeline', 'Generative'],
    darkBg: true,
    images: [img('fanfavorites.webp'), img('fanfavo1.webp'), img('fanfavo2.webp'), img('fanfavo3.webp'), img('fanfavo4.webp')]
  },
  {
    title: 'LG Radio Optimism',
    client: 'LG Electronics — Global',
    description: "I was in charge of the thumbnail album covers for each custom AI-generated song. Used Adobe Firefly to generate thousands of assets, stress-testing every language and prompt type. Built the pipeline in n8n with a custom testing frontend. Songs and covers were generated live — each listener got something unique. LG in collaboration with Adobe Firefly. Reached over a million users.",
    tags: ['AI', 'Real-time', 'Global Campaign'],
    images: [img('lg.webp'), '/images/lgradio1.webp', '/images/lgradio2.webp']
  },
  {
    title: "McDonald's Olifantenpaadjes",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Mapped unofficial footpath shortcuts across the Netherlands and cross-referenced them with McDonald's locations. I built the interactive map (React, Vercel) using OpenPath data and Google Street View to verify paths that pass McDonald's poles. Confirmed paths were photographed by interns.",
    tags: ['Interactive Map', 'React', 'Geo Data'],
    projectUrl: 'https://mcd-pad.vercel.app/',
    images: [
      '/images/olifantenpaadjes1.jpeg',
      '/images/olifantenpaadjes2.jpeg',
      '/images/olifantenpaadjes3.jpeg',
      '/images/olifantenpaadjes4.jpeg',
      '/images/olifantenpaadjes5.jpeg'
    ]
  },
  {
    title: "McDonald's Family Mode",
    client: "McDonald's Netherlands — TBWA\\NEBOKO",
    description: "I built the entire 3D world — all characters, items, clothing, all packaged in a .glb file. All animations in Cinema 4D and Blender. Over half a million avatars were made.",
    tags: ['3D', 'AR', 'App Feature', 'Webby Winner 2024'],
    video: '/cases/videos/AvatarCreator.mp4',
    images: [
      img('imgi_1_hero.webp'),
      img('imgi_2_family_mode2.webp'),
      img('imgi_3_scene1.webp'),
      img('imgi_4_family_mode3.webp'),
      img('imgi_5_room1.webp'),
      img('imgi_6_room2.webp'),
      img('imgi_7_scene2.webp'),
      img('familymode1.webp')
    ]
  },
  {
    title: "McDonald's Delivery Detector",
    client: "McDonald's Netherlands — TBWA\\NEBOKO",
    description: "A limited-edition 3D-printed smoke alarm shaped like a Big Mac that auto-ordered McDonald's when it detected smoke. I designed the full product as a printable device from concept to production files. Covered by Adweek, Highsnobiety and B&T.",
    tags: ['3D Product Design', '3D Printing', 'Campaign', 'ADCN Nominated'],
    video: '/cases/videos/mcdeliverydetector.mp4',
    images: [img('mcdeliverydetector.avif'), img('burger1.webp'), img('burger2.webp'), img('burger3.webp')]
  },
  {
    title: 'SS26 New Amsterdam Surf Association',
    client: 'New Amsterdam Surf Association — Sabatoka',
    description: "A mobile web app for Paris Fashion Week 2025: upload a selfie and get dropped into a Palm Beach scene. I built the entire thing end-to-end. Backend on n8n with Replicate for AI, AWS for NSFW detection. Frontend in React. Cloudflare Workers, R2 storage, Hetzner server scaling to 500 concurrent executions.",
    tags: ['AI', 'React', 'n8n', 'Fashion', 'Web App'],
    video: '/cases/videos/nasa_ss26.mp4',
    images: [img('nasa1.webp'), img('nasa2.webp')]
  },
  {
    title: 'Abdulla Al Ghurair Foundation',
    client: 'Abdulla Al Ghurair Foundation — We Are Anatomy / Sabatoka',
    description: "Built the software for an interactive touchscreen installation at an exhibition. Users selected options and the screen displayed AI-generated videos. The full app ran locally without internet. React frontend, custom offline video pipeline. UI/UX by Rex Amesbury.",
    tags: ['AI', 'React', 'Video Gen', 'Installation'],
    videos: ['/cases/videos/abdul_ui.mp4', '/cases/videos/abdul_ai.mp4'],
    images: [img('abdul_thumb.webp')]
  },
  {
    title: 'New Care Supplements',
    client: 'New Care — Sabatoka',
    description: "Created social content and animations for New Care over several years. Built a 3D + AI pipeline: AI generation (nano-banana, seedream) composited with 3D product renders in Cinema 4D. Modelled the entire product catalog — over 100 products — in 3D.",
    tags: ['3D', 'AI', 'Social', 'Animation', 'Content Pipeline'],
    videos: ['/cases/videos/newcare1.mp4', '/cases/videos/newcare2.mp4', '/cases/videos/newcare3.mp4', '/cases/videos/newcare4.mp4', '/cases/videos/newcare5.mp4', '/cases/videos/newcare6.mp4', '/cases/videos/newcare7.mp4'],
    images: [img('newcare1.webp'), img('newcare2.webp'), img('newcare3.webp')]
  },
  {
    title: "McDonald's The Hidden Campaign",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "McDonald's hid easter eggs across games, Twitch streams and its app — including a custom Moonlander arcade game. I created all 3D assets and animations in Cinema 4D: the spaceship, holograms, stair sequences and light animations.",
    tags: ['3D', 'Animation', 'Gaming', 'Webby Honoree 2025'],
    video: '/cases/videos/spaceship_horizontal.mp4',
    images: [img('imgi_4_image_ui.webp'), img('imgi_6_footer_bg.webp')]
  },
  {
    title: 'McNificents',
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Created the 3D character models in Cinema 4D and rendered the visuals used on McDonald's placemats printed nationwide.",
    tags: ['3D', 'Print', 'Character Design'],
    images: [img('mcnificents0.webp'), ...range(1, 10).map(n => img('mcnificents' + n + '.webp'))]
  },
  {
    title: 'TOTO Tactics',
    client: 'Koning TOTO — TBWA\\NEBOKO',
    description: "Animated the full banner set in Cinema 4D: cloth banners that roll out and wave in the wind, featuring Wesley Sneijder as Koning Toto.",
    tags: ['3D Animation', 'Banner', 'Sports'],
    video: '/cases/videos/koningtoto.mp4'
  },
  {
    title: 'Odido Brand Launch',
    client: 'Odido (formerly T-Mobile NL) — TBWA\\NEBOKO',
    description: "Oversaw the entire HTML5 banner development for the Odido (formerly T-Mobile) rebrand launch. Created the banner animations and guided dev teams on final delivery across HPTO and IAB formats. The campaign won a Gold Dutch PR Award 2024.",
    tags: ['Rebrand', 'Digital', 'Gold Dutch PR Award'],
    video: '/cases/videos/odidobanner.mp4'
  },
  {
    title: 'Schiphol World of Gifts',
    client: 'Schiphol Airport — TBWA\\NEBOKO',
    description: "Designed and rendered the 3D gift boxes in Cinema 4D. The visuals were used across Schiphol Airport's Christmas campaign for three consecutive years.",
    tags: ['3D', 'Installation', 'Holiday'],
    video: '/cases/videos/schipholkerst.mp4',
    images: [img('schiphol.webp'), img('schiphol2.webp')]
  },
  {
    title: 'Food Token Soup (NFT)',
    client: "Branca's Kitchen — Personal",
    description: "10,000 procedurally generated 3D soup cans from the 2021 NFT wave. Created the generative pipeline in Cinema 4D. This project kicked off my journey into coding and Python.",
    tags: ['NFT', '3D', 'Generative', 'Coding'],
    video: '/cases/videos/foodtokensoup.mp4',
    images: range(1, 14).map(n => img('soup' + n + '.webp'))
  },
  {
    title: 'TBWA\\X Custom Arcade',
    client: 'TBWA\\X',
    description: "Hand-built a full arcade cabinet for the TBWA\\X office. MDF frame, lasercut panels, hand-painted finish. All wiring and electronics. Runs RetroPie on a Raspberry Pi 4. Also created the intro video in Cinema 4D.",
    tags: ['Hardware', 'Craftsmanship', 'Design'],
    images: range(1, 3).map(n => img('arcade' + n + '.webp'))
  }
])

const loopCases = computed(() => {
  const total = cases.value.length
  const items: Array<CaseItem & { uid: string; origIdx: number }> = []
  for (let r = 0; r < LOOP; r++) {
    for (let i = 0; i < total; i++) {
      items.push({ ...cases.value[i], uid: `c${i}-r${r}`, origIdx: i })
    }
  }
  return items
})

function openCaseFromHash(hash: string | undefined | null) {
  if (!hash) return
  const caseSlug = hash.replace(/^case-/, '')
  const idx = cases.value.findIndex(c => slugify(c.title) === caseSlug)
  if (idx >= 0) {
    expandedCase.value = idx
    nextTick(() => {
      scrollMediaTop()
      setupObserver()
    })
  }
}

onMounted(() => {
  openCaseFromHash(route.hash?.replace('#', ''))
})

watch(() => route.hash, (hash) => {
  openCaseFromHash(hash?.replace('#', ''))
})
</script>

<style scoped>
.cv-page {
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
}

/* ─── Nav header (same as homepage) ─── */
.cv-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 16px 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--border);
}

.header-link {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--ink);
  text-decoration: none;
  opacity: 0.5;
  transition: opacity var(--duration-fast) var(--ease-out);
}
.header-link:hover { opacity: 1; }

.header-sep {
  opacity: 0.2;
  font-size: var(--text-xs);
}

/* ─── Body ─── */
.cv-body {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 53px);
  overflow: hidden;
}

/* ─── Accordion list ─── */
.cases-list {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.case-entry {
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}
.case-entry:hover {
  background: oklch(15% 0.008 45 / 0.015);
}
.case-entry.open {
  background: oklch(15% 0.008 45 / 0.02);
  cursor: default;
}

.entry-bar {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: 22px 32px;
}

.entry-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.entry-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
}

.entry-client {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: var(--ink-faint);
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.entry-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 4px 12px;
  border-radius: 3px;
  background: oklch(15% 0.008 45 / 0.04);
  color: var(--ink-muted);
  white-space: nowrap;
}

.entry-count {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 300;
  color: var(--ink-faint);
  white-space: nowrap;
}

.chevron {
  flex-shrink: 0;
  color: var(--ink-faint);
  transition: transform var(--duration-mid) var(--ease-out);
}
.chevron.rotated {
  transform: rotate(180deg);
}

/* ─── Overlay backdrop ─── */
.overlay-backdrop {
  position: fixed;
  inset: 0;
  z-index: 39;
  background: var(--bg);
}

/* ─── Overlay ─── */
.case-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.overlay-hdr {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}

.overlay-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-faint);
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color var(--duration-fast) var(--ease-out);
  margin-bottom: var(--space-sm);
}
.overlay-close:hover { color: var(--ink); }
.overlay-close:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.overlay-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.overlay-text {
  width: 33.33%;
  flex-shrink: 0;
  padding: 40px 28px 40px 32px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.overlay-case-title {
  font-family: var(--font-body);
  font-size: 24px;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
  color: var(--ink);
}

.overlay-client {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: var(--ink-faint);
  margin: 0;
}

.overlay-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 170%;
  color: var(--ink-muted);
  margin: 0;
}

.overlay-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.overlay-tag {
  font-family: var(--font-body);
  font-size: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 4px 10px;
  border-radius: 2px;
  background: oklch(15% 0.008 45 / 0.04);
  color: var(--ink-muted);
  white-space: nowrap;
}

.overlay-link {
  display: inline-block;
  color: var(--ink);
  text-decoration: none;
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 1.2px;
  transition: opacity var(--duration-fast) var(--ease-out);
  margin-top: auto;
}
.overlay-link:hover { opacity: 0.7; }

.overlay-media {
  width: 66.67%;
  padding: 40px 32px 40px 28px;
  overflow-y: auto;
}

/* ─── Media ─── */
.entry-media {
  margin-bottom: var(--space-md);
}

.entry-video {
  width: 100%;
  max-width: 100%;
  border-radius: 3px;
  background: var(--ink);
}

.entry-youtube {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 3px;
  background: var(--ink);
}

.entry-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.entry-img {
  width: 100%;
  display: block;
  border-radius: 3px;
}

.entry-images.dark-bg .entry-img {
  background: oklch(25% 0.008 45);
  padding: 20px;
  border-radius: 6px;
}

.arrow {
  display: inline-block;
  transition: transform 0.2s ease;
}

.scroll-sentinel {
  height: 8px;
}

/* ─── Overlay transition ─── */
.overlay-enter-active {
  transition: opacity 300ms var(--ease-out),
              transform 400ms var(--ease-out);
}
.overlay-leave-active {
  transition: opacity 200ms var(--ease-out),
              transform 250ms var(--ease-out);
}
.overlay-enter-from {
  opacity: 0;
  transform: translateY(100%);
}
.overlay-leave-to {
  opacity: 0;
  transform: translateY(-15%);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 150ms ease;
  }
  .overlay-enter-from {
    opacity: 0;
    transform: none;
  }
  .overlay-leave-to {
    opacity: 0;
    transform: none;
  }
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .overlay-body {
    flex-direction: column;
    overflow-y: auto;
  }
  .overlay-text {
    width: 100%;
    flex-shrink: 0;
    padding: 24px 20px 16px;
    overflow-y: visible;
  }
  .overlay-media {
    width: 100%;
    padding: 0 20px 40px;
    overflow-y: visible;
  }
  .overlay-hdr {
    padding: 12px 18px;
  }
  .overlay-case-title {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .cv-header { padding: 12px 18px; gap: 6px; }
  .header-link { font-size: 10px; letter-spacing: 1px; }
  .cv-body { height: calc(100vh - 45px); }
  .entry-tags { display: none; }
  .entry-bar { padding: 16px 18px; gap: var(--space-sm); }
  .entry-title { font-size: var(--text-sm); }
  .entry-client { font-size: var(--text-xs); }
  .entry-images.dark-bg .entry-img { padding: 12px; }
}
</style>
