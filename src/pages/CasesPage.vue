<template>
  <div class="cv-page">
    <header class="cv-header">
      <router-link to="/" class="back-link" title="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </router-link>
      <span class="header-label">Selected Work</span>
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
            <span class="entry-count" v-if="mediaCount(c)">{{ mediaCount(c) }}</span>
            <svg class="chevron" :class="{ rotated: expandedCase === i }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <div v-if="expandedCase === i" class="entry-expand" @click.stop>
            <p class="entry-desc">{{ c.description }}</p>

            <div v-if="c.youtube" class="entry-media">
              <iframe
                :src="c.youtube"
                class="entry-youtube"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div v-if="c.video" class="entry-media">
              <video :src="c.video" controls preload="metadata" class="entry-video"></video>
            </div>

            <div v-if="c.videos && c.videos.length" v-for="(vid, vi) in c.videos" :key="'v'+vi" class="entry-media">
              <video :src="vid" controls preload="metadata" class="entry-video"></video>
            </div>

            <div v-if="c.images && c.images.length" class="entry-images" :class="{ 'dark-bg': c.darkBg }">
              <img
                v-for="(src, j) in c.images"
                :key="j"
                :src="src"
                :alt="c.title + ' - ' + (j + 1)"
                class="entry-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const expandedCase = ref<number | null>(null)
const toggleCase = (i: number) => { expandedCase.value = expandedCase.value === i ? null : i }

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

interface CaseItem {
  title: string; client: string; description: string
  tags: string[]; video?: string; videos?: string[]; youtube?: string; images?: string[]; darkBg?: boolean
}

const mediaCount = (c: CaseItem) => {
  const n = (c.images?.length || 0) + (c.video ? 1 : 0) + (c.videos?.length || 0) + (c.youtube ? 1 : 0)
  return n > 0 ? n + ' item' + (n > 1 ? 's' : '') : ''
}

const img = (name: string) => '/cases/images/' + name
const range = (s: number, e: number) => Array.from({ length: e - s + 1 }, (_, i) => s + i)

const cases = ref<CaseItem[]>([
  {
    title: "McDonald's Fan Favorites",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "Helped fans across Spain, Portugal, and the Netherlands create their own personalised McDonald's menu and bring it to life using AI. Led the entire AI asset-generation pipeline, pre-producing 4M+ unique visual outputs at scale.",
    tags: ['AI', 'Pipeline', 'Generative'],
    darkBg: true,
    images: [img('fanfavorites.webp'), img('fanfavo1.webp'), img('fanfavo2.webp'), img('fanfavo3.webp'), img('fanfavo4.webp')]
  },
  {
    title: 'LG Radio Optimism',
    client: 'LG Electronics — Global',
    description: "A global campaign turning real user stories into AI-generated songs and album covers, powered by Adobe Firefly. Owned the real-time album-cover generation flow — live AI visuals at global scale.",
    tags: ['AI', 'Real-time', 'Global Campaign'],
    youtube: 'https://www.youtube.com/embed/1y2SWAntro8',
    images: [img('lg.webp')]
  },
  {
    title: "McDonald's Family Mode",
    client: "McDonald's Netherlands — TBWA\\NEBOKO",
    description: "An in-app feature that turns physical placemats into AR board games, complete with personalised family avatars and AI-generated stories. Responsible for all 3D character design, rigging, animation, and web-ready asset production. 1M+ avatars created by users.",
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
    description: "A limited-edition 3D-printed smoke alarm shaped like a Big Mac — when it detected smoke, it ordered McDonald's. I handled the full 3D product design, from concept through production-ready files. Covered by Adweek, Highsnobiety, and B&T.",
    tags: ['3D Product Design', 'Campaign', 'ADCN Nominated'],

    video: '/cases/videos/mcdeliverydetector.mp4',
    images: [img('mcdeliverydetector.avif'), img('burger1.webp'), img('burger2.webp'), img('burger3.webp')]
  },
  {
    title: 'SS26 New Amsterdam Surf Association',
    client: 'New Amsterdam Surf Association — Sabatoka',
    description: "Built a genAI-powered experience for Paris Fashion Week 2025 to present the new SS26 collection. Users upload a selfie and get transported to Palm Beach using AI image-to-image models and faceswap tech. OpenAI Vision describes the image to generate a base prompt, the latest AI models create the scene, and a dedicated n8n server handles processing, threading, and queuing. Rapidly prototyped and deployed with bolt.new and n8n.",
    tags: ['AI', 'GenAI', 'Fashion', 'Web App'],
    video: '/cases/videos/nasa_ss26.mp4',
    images: [img('nasa1.webp'), img('nasa2.webp')]
  },
  {
    title: 'Abdulla Al Ghurair Foundation',
    client: 'Abdulla Al Ghurair Foundation — We Are Anatomy / Sabatoka',
    description: "For the Abdulla Al Ghurair Foundation in Dubai, I developed a custom UX/UI interface and an AI video generator. Launched in honour of Emirati Education Day, the project aims to inspire how AI and technology elevates education and empowers communities across the UAE. One of the biggest challenges was managing the massive volume of assets — sifting through thousands of images and generating hundreds of videos for final selection. I built custom tooling to streamline the review process and ensure offline reliability, so the app could run without fail.",
    tags: ['AI', 'UX/UI', 'Video Gen', 'Installation'],
    videos: ['/cases/videos/abdul_ui.mp4', '/cases/videos/abdul_ai.mp4'],
    images: [img('abdul_thumb.webp')]
  },
  {
    title: 'New Care Supplements',
    client: 'New Care — Sabatoka',
    description: "For the Dutch brand New Care Supplements, I create all social and campaign assets throughout the year. Along the way, I developed a custom 3D and AI content production pipeline — combining Cinema 4D, AI generation, and animation to deliver high-volume visual content at speed.",
    tags: ['3D', 'AI', 'Social', 'Animation', 'Content Pipeline'],
    videos: ['/cases/videos/newcare1.mp4', '/cases/videos/newcare2.mp4', '/cases/videos/newcare3.mp4', '/cases/videos/newcare4.mp4', '/cases/videos/newcare5.mp4', '/cases/videos/newcare6.mp4', '/cases/videos/newcare7.mp4'],
    images: [img('newcare1.webp'), img('newcare2.webp'), img('newcare3.webp')]
  },
  {
    title: "McDonald's The Hidden Campaign",
    client: "McDonald's — TBWA\\NEBOKO",
    description: "McDonald's re-entered gaming culture by hiding easter eggs across popular games, Twitch streams, and the McDonald's app — featuring a custom Moonlander arcade game. Responsible for all 3D design and 3D animation.",
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
    description: "A personal project born from the 2021 NFT wave — 10,000 procedurally generated 3D soup cans. A deep dive into generative art, smart contracts, and learning that most people don't really care about soup.",
    tags: ['NFT', '3D', 'Generative', 'Coding'],
    video: '/cases/videos/foodtokensoup.mp4',
    images: range(1, 14).map(n => img('soup' + n + '.webp'))
  },
  {
    title: 'TBWA\\X Custom Arcade',
    client: 'TBWA\\X',
    description: "Designed and handbuilt a fully working arcade cabinet for the TBWA\\X office, inspired by the brand's backslash identity.",
    tags: ['Hardware', 'Craftsmanship', 'Design'],

    images: range(1, 3).map(n => img('arcade' + n + '.webp'))
  }
])

onMounted(() => {
  const hash = route.hash?.replace('#', '')
  if (!hash) return
  const idx = cases.value.findIndex(c => slugify(c.title).includes(hash))
  if (idx >= 0) {
    expandedCase.value = idx
    nextTick(() => {
      const el = document.getElementById('case-' + slugify(cases.value[idx].title))
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }
})
</script>

<style scoped>
.cv-page {
  --bg: #f8f8f8;
  --ink: #0f0f0f;
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.cv-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 32px;
  background: var(--bg);
  border-bottom: 1px solid rgba(0,0,0,.08);
}

.back-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  opacity: .5;
  transition: opacity .2s;
  text-decoration: none;
}
.back-link:hover { opacity: 1; }

.header-label {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 300;
  font-size: 14px;
  letter-spacing: .3px;
}

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
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 300;
  font-size: 11px;
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
  opacity: .15;
}
.sec-hdr .idx {
  font-size: 10px;
  opacity: .4;
}

.cases-list {
  display: flex;
  flex-direction: column;
}

.case-entry {
  border-bottom: 1px solid rgba(0,0,0,.06);
  cursor: pointer;
  transition: background .15s;
}
.case-entry:hover {
  background: rgba(0,0,0,.015);
}
.case-entry.open {
  background: rgba(0,0,0,.02);
  cursor: default;
}

.entry-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 4px;
}

.entry-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.entry-title {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--ink);
}

.entry-client {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: .5px;
  color: #777;
}

.entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.entry-tag {
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .4px;
  padding: 3px 8px;
  border-radius: 2px;
  background: rgba(0,0,0,.04);
  color: #555;
  white-space: nowrap;
}

.entry-count {
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-size: 9px;
  font-weight: 300;
  color: #999;
  white-space: nowrap;
}

.chevron {
  flex-shrink: 0;
  color: #999;
  transition: transform .25s ease;
}
.chevron.rotated {
  transform: rotate(180deg);
}

.entry-expand {
  padding: 0 4px 28px;
  animation: fadeSlide .25s ease;
}

@keyframes fadeSlide {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.entry-desc {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 170%;
  color: #333;
  margin: 0 0 20px;
  max-width: 560px;
}

.entry-media {
  margin-bottom: 16px;
}

.entry-video {
  width: 100%;
  max-width: 640px;
  border-radius: 3px;
  background: #000;
}

.entry-youtube {
  width: 100%;
  max-width: 640px;
  aspect-ratio: 16 / 9;
  border-radius: 3px;
  background: #000;
}

.entry-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.entry-img {
  width: 100%;
  max-width: 640px;
  display: block;
  border-radius: 3px;
}

.entry-images.dark-bg .entry-img {
  background: #2c2c2c;
  padding: 20px;
  border-radius: 6px;
}

@media (max-width: 640px) {
  .cv-header { padding: 14px 18px; }
  .cv-body { padding: 28px 18px 60px; }
  .entry-tags { display: none; }
  .entry-bar { padding: 14px 2px; gap: 10px; }
  .entry-title { font-size: 13px; }
  .entry-client { font-size: 8px; }
  .entry-desc { font-size: 11px; max-width: 100%; }
  .entry-video,
  .entry-youtube,
  .entry-img { max-width: 100%; }
  .entry-images.dark-bg .entry-img { padding: 12px; }
}
</style>
