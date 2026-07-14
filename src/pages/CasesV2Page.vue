<template>
  <div class="cv-page">
    <header class="cv-header">
      <router-link to="/" class="back-link" title="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span class="header-label">Selected Work</span>
      </router-link>
    </header>

    <main class="cv-body">
      <div class="sec-hdr"><span>Cases</span><span class="idx">01</span></div>

      <div class="cases-list">
        <div
          v-for="(c, i) in cases"
          :key="i"
          :id="'case-' + slugify(c.title)"
          class="case-entry"
          :class="{ open: expandedCase === i }"
          @click="toggleCase(i)"
        >
          <div class="entry-bar">
            <div class="entry-text">
              <span class="entry-title">{{ c.title }}</span>
              <span class="entry-client">{{ c.client }}</span>
            </div>
            <div class="entry-tags">
              <span v-for="tag in c.tags" :key="tag" class="entry-tag">{{ tag }}</span>
            </div>
            <svg class="chevron" :class="{ rotated: expandedCase === i }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
        </div>
      </div>
    </main>

    <!-- Full-viewport overlay -->
    <Transition name="overlay">
      <div v-if="expandedCase !== null && !transitioning" class="case-overlay" @click.self="closeOverlay">
        <!-- Overlay header -->
        <div class="overlay-hdr">
          <button class="overlay-close" @click="closeOverlay" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <span class="overlay-title">{{ cases[expandedCase].title }}</span>
          <span class="overlay-idx">{{ padded(expandedCase + 1) }} / {{ cases.length }}</span>
        </div>

        <div class="overlay-body">
          <!-- Left 1/3 — text, fixed -->
          <div class="overlay-text">
            <h2 class="overlay-case-title">{{ cases[expandedCase].title }}</h2>
            <p class="overlay-client">{{ cases[expandedCase].client }}</p>
            <p class="overlay-desc">{{ cases[expandedCase].description }}</p>
            <div class="overlay-tags">
              <span v-for="tag in cases[expandedCase].tags" :key="tag" class="overlay-tag">{{ tag }}</span>
            </div>
            <a v-if="cases[expandedCase].projectUrl" :href="cases[expandedCase].projectUrl" target="_blank" rel="noopener" class="overlay-link">Open interactive map <span class="arrow">&rarr;</span></a>
          </div>

          <!-- Right 2/3 — media, scrollable -->
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
                <video :src="cases[expandedCase].video" :poster="posterFor(cases[expandedCase].video)" controls preload="metadata" class="entry-video" ref="videoRefs"></video>
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
import { ref, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expandedCase = ref<number | null>(null)
const transitioning = ref(false)
const mediaRef = ref<HTMLElement | null>(null)
const videoRefs = ref<HTMLElement[]>([])
const sentinelRef = ref<HTMLElement | null>(null)

let observer: IntersectionObserver | null = null
let autoAdvanceTimer: ReturnType<typeof setTimeout> | null = null
let canAutoAdvance = true

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const padded = (n: number) => String(n).padStart(2, '0')

const toggleCase = (i: number) => {
  if (expandedCase.value === i) {
    closeOverlay()
  } else {
    openCase(i)
  }
}

function openCase(i: number) {
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
  const next = (expandedCase.value + 1) % cases.length
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

onBeforeUnmount(cleanupObserver)

interface CaseItem {
  title: string; client: string; description: string
  tags: string[]; video?: string; videos?: string[]; youtube?: string; images?: string[]; darkBg?: boolean; projectUrl?: string
}

const img = (name: string) => '/cases/images/' + name
const posterFor = (v: string) => v.replace('/cases/videos/', '/cases/videos/posters/').replace('.mp4', '.webp')
const range = (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => s + i)

const cases = ref<CaseItem[]>([
  {
    title: "McDonald's Fan Favorites",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Fans across Spain, Portugal and the Netherlands built their own McDonald's menu with AI. I pre-rendered over 4 million unique combinations.",
    tags: ['AI', 'Pipeline', 'Generative'],
    darkBg: true,
    images: [img('fanfavorites.webp'), img('fanfavo1.webp'), img('fanfavo2.webp'), img('fanfavo3.webp'), img('fanfavo4.webp')]
  },
  {
    title: 'LG Radio Optimism',
    client: 'LG Electronics — Global',
    description: "User stories became AI-generated songs and album covers using Adobe Firefly. Albums and tracks were generated live, so each listener got a unique experience.",
    tags: ['AI', 'Real-time', 'Global Campaign'],
    images: [img('lg.webp'), '/images/lgradio1.webp', '/images/lgradio2.webp']
  },
  {
    title: "McDonald's Olifantenpaadjes",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "We mapped unofficial shortcuts in the Netherlands and counted how many pointed at McDonald's. I built the interactive map.",
    tags: ['Interactive Map', 'Geo Data', 'Creative Tech'],
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
    description: "An interactive feature in the McDonald's App that turned physical placemats into AR board games. Users made family avatars and read along with Happy Meal books. Over a million avatars were made.",
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
    description: "A Big Mac-shaped smoke alarm that ordered McDonald's when it detected smoke. I did the 3D design. Adweek, Highsnobiety and B&T wrote about it.",
    tags: ['3D Product Design', 'Campaign', 'ADCN Nominated'],
    video: '/cases/videos/mcdeliverydetector.mp4',
    images: [img('mcdeliverydetector.avif'), img('burger1.webp'), img('burger2.webp'), img('burger3.webp')]
  },
  {
    title: 'SS26 New Amsterdam Surf Association',
    client: 'New Amsterdam Surf Association — Sabatoka',
    description: "For Paris Fashion Week 2025, visitors uploaded a selfie and got dropped into a Palm Beach scene. Image-to-image models, face swap and an n8n queue. Prototyped in bolt.new.",
    tags: ['AI', 'GenAI', 'Fashion', 'Web App'],
    video: '/cases/videos/nasa_ss26.mp4',
    images: [img('nasa1.webp'), img('nasa2.webp')]
  },
  {
    title: 'Abdulla Al Ghurair Foundation',
    client: 'Abdulla Al Ghurair Foundation — We Are Anatomy / Sabatoka',
    description: "Custom interface and AI video generator for the Abdulla Al Ghurair Foundation in Dubai. The hard part was processing thousands of images and hundreds of videos offline. I built tools to handle the review queue and keep the installation running on site.",
    tags: ['AI', 'UX/UI', 'Video Gen', 'Installation'],
    videos: ['/cases/videos/abdul_ui.mp4', '/cases/videos/abdul_ai.mp4'],
    images: [img('abdul_thumb.webp')]
  },
  {
    title: 'New Care Supplements',
    client: 'New Care — Sabatoka',
    description: "Social and campaign assets for New Care Supplements year-round. I also built a 3D and AI pipeline in Cinema 4D to produce more visuals faster.",
    tags: ['3D', 'AI', 'Social', 'Animation', 'Content Pipeline'],
    videos: ['/cases/videos/newcare1.mp4', '/cases/videos/newcare2.mp4', '/cases/videos/newcare3.mp4', '/cases/videos/newcare4.mp4', '/cases/videos/newcare5.mp4', '/cases/videos/newcare6.mp4', '/cases/videos/newcare7.mp4'],
    images: [img('newcare1.webp'), img('newcare2.webp'), img('newcare3.webp')]
  },
  {
    title: "McDonald's The Hidden Campaign",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "McDonald's hid easter eggs in games, Twitch streams and its app, including a custom Moonlander arcade game. I did the 3D design and animation.",
    tags: ['3D', 'Animation', 'Gaming', 'Webby Honoree 2025'],
    video: '/cases/videos/spaceship_horizontal.mp4',
    images: [img('imgi_4_image_ui.webp'), img('imgi_6_footer_bg.webp')]
  },
  {
    title: 'McNificents',
    client: "McDonald's — TBWA\\NEBOKO",
    description: "3D character visualisation for McDonald's placemats, printed at scale across restaurants nationwide.",
    tags: ['3D', 'Print', 'Character Design'],
    images: [img('mcnificents0.webp'), ...range(1, 10).map(n => img('mcnificents' + n + '.webp'))]
  },
  {
    title: 'TOTO Tactics',
    client: 'Koning TOTO — TBWA\\NEBOKO',
    description: "3D banner animation introducing Wesley Sneijder as Koning Toto for the Dutch betting brand's campaign.",
    tags: ['3D Animation', 'Banner', 'Sports'],
    video: '/cases/videos/koningtoto.mp4'
  },
  {
    title: 'Odido Brand Launch',
    client: 'Odido (formerly T-Mobile NL) — TBWA\\NEBOKO',
    description: "Helped design the launch campaign and led the development team through production. The T-Mobile to Odido rebrand won a Gold Dutch PR Award in 2024.",
    tags: ['Rebrand', 'Digital', 'Gold Dutch PR Award'],
    video: '/cases/videos/odidobanner.mp4'
  },
  {
    title: 'Schiphol World of Gifts',
    client: 'Schiphol Airport — TBWA\\NEBOKO',
    description: "Designed the 3D gift box visuals for Schiphol Airport's holiday campaign, displayed across the terminal.",
    tags: ['3D', 'Installation', 'Holiday'],
    video: '/cases/videos/schipholkerst.mp4',
    images: [img('schiphol.webp'), img('schiphol2.webp')]
  },
  {
    title: 'Food Token Soup (NFT)',
    client: "Branca's Kitchen — Personal",
    description: "10,000 procedurally generated 3D soup cans from the 2021 NFT wave. A project to learn generative art and smart contracts. Most people do not care about soup.",
    tags: ['NFT', '3D', 'Generative', 'Coding'],
    video: '/cases/videos/foodtokensoup.mp4',
    images: range(1, 14).map(n => img('soup' + n + '.webp'))
  },
  {
    title: 'TBWA\\X Custom Arcade',
    client: 'TBWA\\X',
    description: "Hand-built a working arcade cabinet for the TBWA\\X office, based on their backslash identity.",
    tags: ['Hardware', 'Craftsmanship', 'Design'],
    images: range(1, 3).map(n => img('arcade' + n + '.webp'))
  }
])

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
  max-width: 740px;
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

/* ─── Accordion list ─── */
.cases-list {
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
  gap: var(--space-md);
  padding: 18px var(--space-xs);
}

.entry-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.entry-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
}

.entry-client {
  font-family: var(--font-body);
  font-size: var(--text-xs);
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
  font-size: 0.5rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 3px var(--space-sm);
  border-radius: 2px;
  background: oklch(15% 0.008 45 / 0.04);
  color: var(--ink-muted);
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
  gap: var(--space-md);
  padding: 18px 32px;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}

.overlay-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--ink-muted);
  padding: 4px;
  transition: color var(--duration-fast) var(--ease-out);
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.overlay-close:hover { color: var(--ink); }
.overlay-close:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

.overlay-title {
  flex: 1;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
}

.overlay-idx {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 300;
  color: var(--ink-faint);
}

/* ─── Overlay body split ─── */
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

/* ─── Media recs (reused from original) ─── */
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
  transition: opacity 250ms var(--ease-out),
              transform 250ms var(--ease-out);
}
.overlay-leave-active {
  transition: opacity 200ms var(--ease-out),
              transform 200ms var(--ease-out);
}
.overlay-enter-from {
  opacity: 0;
  transform: scale(0.97);
}
.overlay-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .overlay-enter-active,
  .overlay-leave-active {
    transition: opacity 150ms ease;
    transform: none;
  }
  .overlay-enter-from,
  .overlay-leave-to {
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
  .overlay-title {
    font-size: var(--text-xs);
  }
  .overlay-case-title {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .cv-header { padding: 14px 18px; }
  .cv-body { padding: 28px 18px 60px; }
  .entry-tags { display: none; }
  .entry-bar { padding: 14px 2px; gap: 10px; }
  .entry-title { font-size: var(--text-sm); }
  .entry-client { font-size: var(--text-xs); }
  .entry-images.dark-bg .entry-img { padding: 12px; }
}
</style>
