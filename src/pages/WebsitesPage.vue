<template>
  <div class="cv-page">
    <header class="cv-header">
      <router-link to="/" class="back-link" title="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span class="header-label">Websites</span>
      </router-link>
    </header>

    <main class="cv-body">
      <div class="sec-hdr"><span>Personal Projects</span><span class="idx">01</span></div>

      <div class="grid">
        <a
          v-for="(p, i) in projects"
          :key="i"
          :href="p.url"
          target="_blank"
          rel="noopener"
          class="card"
        >
          <div class="card-preview">
            <img v-if="p.thumb" :src="'/images/' + p.thumb" :alt="p.label" class="card-img" loading="lazy" decoding="async" />
            <div v-else class="card-placeholder" :style="{ background: p.gradient }">
              <span class="card-initial">{{ p.label[0] }}</span>
            </div>
          </div>
          <div class="card-body">
            <span class="card-title">{{ p.label }}</span>
            <p class="card-desc">{{ p.desc }}</p>
            <span class="card-cta">Visit <span class="arrow">&rarr;</span></span>
          </div>
        </a>
      </div>
    </main>
  </div>
</template>

<script setup>
const projects = [
  {
    label: 'tlguide.com',
    url: 'https://tlguide.com',
    desc: 'A review site for Figma plugins and widgets. The reviews and outreach are mostly automated with AI.',
    gradient: 'linear-gradient(135deg, #1a1a2e, #16213e)'
  },
  {
    label: 'jobs.floridomeacci.xyz',
    url: 'https://jobs.floridomeacci.xyz',
    desc: 'A job board for AI, creative tech and design roles in Amsterdam.',
    gradient: 'linear-gradient(135deg, #0f3443, #34e89e)'
  },
  {
    label: 'Filters & Grain',
    url: 'https://www.figma.com/community/plugin/1626934504810261537',
    desc: 'A Figma plugin for color grading, film grain and vignette. No Photoshop needed.',
    thumb: 'figma.webp',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)'
  },
  {
    label: 'latentsearch.net',
    url: 'https://www.latentsearch.net',
    desc: 'Every search result is AI-generated. It looks normal, but the content is fake.',
    gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
  },
  {
    label: 'creditswap.app',
    url: 'https://creditswap.app',
    desc: 'A private marketplace for reselling AI API credits. Buyers pay less, sellers monetize unused capacity.',
    gradient: 'linear-gradient(135deg, #11998e, #38ef7d)'
  },
  {
    label: 'reddituser.info',
    url: 'https://reddituser.info',
    desc: 'Paste a Reddit username, get an AI-generated report with graphs. Activity, interests, posting habits.',
    thumb: 'reddituserinfo.webp',
    gradient: 'linear-gradient(135deg, #ff4500, #ff6a33)'
  }
]
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

.cv-body {
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

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 10px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform var(--dur-fast) var(--ease-out),
              box-shadow var(--dur-fast) var(--ease-out);
  background: var(--bg);
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px oklch(0% 0 0 / 0.08);
}

.card-preview {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  position: relative;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-initial {
  font-family: var(--font-ui);
  font-size: 48px;
  font-weight: 700;
  color: oklch(100% 0 0 / 0.85);
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.card-title {
  font-family: var(--font-ui);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  line-height: 1.55;
  color: var(--ink-muted);
  margin: 0;
  flex: 1;
}

.card-cta {
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  color: var(--ink);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: gap var(--dur-fast) var(--ease-out);
}

.card:hover .card-cta {
  gap: 8px;
}

.arrow {
  font-size: 12px;
  line-height: 1;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
