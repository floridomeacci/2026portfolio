<template>
  <div class="cv-page" @mousemove="onMouseMove">
    <header class="cv-header">
      <router-link to="/" class="back-link" title="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span class="header-label">About</span>
      </router-link>
    </header>

    <main class="cv-body">
      <div class="name-row">
        <!-- Desktop: interactive face tracker -->
        <div class="face-tracker-wrap desktop-only" ref="faceTrackerRef">
          <img :src="faceImgSrc" alt="Florido Jan Meacci" class="profile-pic face-pic" />
        </div>
        <!-- Mobile: static pic -->
        <img src="/picture.webp" alt="Florido Jan Meacci" class="profile-pic mobile-only" />
        <h1 class="titleline">Florido Jan Meacci,<br/>Creative Technologist</h1>
      </div>

      <div class="two-cols">
        <div class="col-main">

          <section>
            <div class="sec-hdr"><span>Experience</span><span class="idx">03</span></div>

            <div class="entry">
              <span class="date">2024.07 &#x2013; Present</span>
              <span class="company">TBWA\NEBOKO &#x2014; Creative Technologist</span>
              <span class="body-text">AI automation for global campaigns. 3D and interactive web experiences from concept to launch.</span>
            </div>

            <div class="entry">
              <span class="date">2021.05 &#x2013; 2024.08</span>
              <span class="company">TBWA\NEBOKO &#x2014; Digital Designer</span>
              <span class="body-text">AI and new tech in digital design workflows. Social content and interactive brand work, start to finish.</span>
            </div>

            <div class="entry">
              <span class="date">2020.04 &#x2013; 2021.03</span>
              <span class="company">Key Agency</span>
              <span class="body-text">Photorealistic 3D in Cinema 4D, Arnold and Substance Painter. Renders and texture workflows for social and digital.</span>
            </div>

            <div class="entry">
              <span class="date">2016.04 &#x2013; 2020.03</span>
              <span class="company">ACT.agency</span>
              <span class="body-text">Visual Designer to Lead Designer. UI/UX, dashboards, infographics and brand books. Large-format print: transit wraps, banners, posters. Style guides across accounts.</span>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Personal</span><span class="idx">06</span></div>

            <div class="entry">
              <span class="date">2017.07 &#x2013; Present</span>
              <span class="company">Sabatoka</span>
              <span class="body-text">Co-founded a creative studio for AI solutions and brand strategy. Client acquisition and end-to-end projects for Humdrum, New Amsterdam Surf and others.</span>
            </div>

            <div class="entry">
              <span class="date">2023 &#x2013; Present</span>
              <span class="company">Creative Technology Collective</span>
              <span class="body-text">Member of CTC, a group of creative technologists working across art, design and new tech.</span>
            </div>

            <div class="entry">
              <span class="company">Press &amp; Speaking</span>
              <span class="body-text">Featured on EenVandaag and the frontpage of de Volkskrant on the impact of AI. Speaker and workshop host at VIA Nederland on practical low-code AI.</span>
            </div>
          </section>
        </div>

        <div class="col-side">

          <section>
            <div class="sec-hdr"><span>Contact</span><span class="idx">01</span></div>
            <div class="contact-list">
              <a href="mailto:florido@sbtk.nl">florido@sbtk.nl</a>
              <a href="https://www.linkedin.com/in/florido-jan-meacci" target="_blank" rel="noopener">linkedin.com/in/florido-jan-meacci</a>
              <a href="https://www.floridomeacci.xyz" target="_blank" rel="noopener">floridomeacci.xyz</a>
              <a href="https://github.com/floridomeacci" target="_blank" rel="noopener">github.com/floridomeacci</a>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Awards</span><span class="idx">02</span></div>
            <div class="award">
              <span class="a-title">Purgatory Sandwich</span>
              <span class="a-meta">D&amp;AD Wood Pencil &#x2013; Independent Magazine &#xb7; 2026</span>
            </div>
            <div class="award">
              <span class="a-title">McDonald's Fan Favorites</span>
              <span class="a-meta">Webby Winner &#xb7; 2026</span>
            </div>
            <div class="award">
              <span class="a-title">McDonald's Magic Stories</span>
              <span class="a-meta">Webby Winner &#xb7; 2026</span>
            </div>
            <div class="award">
              <span class="a-title">McDonald's Maccie</span>
              <span class="a-meta">Cannes Lions Silver Lion &#x2013; Media / Mobile &#xb7; 2025</span>
            </div>
            <div class="award">
              <span class="a-title">McDonald's The Hidden Campaign</span>
              <span class="a-meta">Webby Honoree &#xb7; 2025</span>
            </div>
            <div class="award">
              <span class="a-title">Lipton Ice Tea &#x2013; Insurance</span>
              <span class="a-meta">Bronze Lamp in Advertising (Strategy &amp; Digital) &#xb7; 2025</span>
            </div>
            <div class="award">
              <span class="a-title">McDonald's Family Mode</span>
              <span class="a-meta">Webby Winner &#xb7; 2024</span>
            </div>
            <div class="award">
              <span class="a-title">Odido Launch / Rebrand</span>
              <span class="a-meta">Gold Dutch PR Award &#xb7; 2024</span>
            </div>
            <div class="award">
              <span class="a-title">McDelivery Detector</span>
              <span class="a-meta">ADCN &#x2014; 2x Nominated &#xb7; 2022</span>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Skills</span><span class="idx">04</span></div>
            <div class="skills-grid">
              <div class="sk-row"><span class="l">Python</span><span class="r">Machine Learning</span></div>
              <div class="sk-row"><span class="l">n8n / low-code</span><span class="r">Public Speaking</span></div>
              <div class="sk-row"><span class="l">Prototyping</span><span class="r">AI consultancy</span></div>
              <div class="sk-row"><span class="l">3D / C4D</span><span class="r">UI / UX</span></div>
              <div class="sk-row"><span class="l">Web Dev</span><span class="r">Automation</span></div>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Languages</span><span class="idx">05</span></div>
            <div class="lang-grid">
              <div class="lg-row"><span class="n">English</span><span class="lv">C2</span></div>
              <div class="lg-row"><span class="n">Dutch</span><span class="lv">C2</span></div>
              <div class="lg-row"><span class="n">Italian</span><span class="lv">C2</span></div>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Education</span><span class="idx">07</span></div>
            <div class="edu">
              <span class="date">2025 &#x2013; 2026</span>
              <span class="school">Hogeschool van Utrecht</span>
              <span class="field">Post-Bachelor, AI &amp; Machine Learning</span>
            </div>
            <div class="edu">
              <span class="date">2013 &#x2013; 2015</span>
              <span class="school">Istituto Europeo di Design</span>
              <span class="field">B.A. Photography &#x2014; Milan</span>
            </div>
            <div class="edu">
              <span class="date">2009 &#x2013; 2013</span>
              <span class="school">Mediacollege Amsterdam</span>
              <span class="field">MBO-4, Game &amp; Interactive Media Design</span>
            </div>
          </section>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const faceTrackerRef = ref<HTMLElement | null>(null)
const faceImgSrc = ref('/faces/gaze_px0p0_py0p0_256.webp')

const FACE_P_MIN = -15
const FACE_P_MAX = 15
const FACE_STEP = 3

function faceClamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function faceQuantize(val: number) {
  const raw = FACE_P_MIN + (val + 1) * (FACE_P_MAX - FACE_P_MIN) / 2
  const snapped = Math.round(raw / FACE_STEP) * FACE_STEP
  return faceClamp(snapped, FACE_P_MIN, FACE_P_MAX)
}

function faceSanitize(val: number) {
  const str = val.toFixed(1)
  return str.replace('-', 'm').replace('.', 'p')
}

const onMouseMove = (e: MouseEvent) => {
  const el = faceTrackerRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const nx = faceClamp((e.clientX - cx) / (rect.width / 2), -1, 1)
  const ny = faceClamp((cy - e.clientY) / (rect.height / 2), -1, 1)
  const px = faceQuantize(nx)
  const py = faceQuantize(ny)
  faceImgSrc.value = `/faces/gaze_px${faceSanitize(px)}_py${faceSanitize(py)}_256.webp`
}
</script>

<style scoped>
.cv-page {
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  font-feature-settings: 'liga' 1, 'kern' 1;
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
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-xl) 32px 100px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: var(--space-xl);
}

.profile-pic {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 20%;
  flex-shrink: 0;
  border: 2px solid var(--border);
}

.face-tracker-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--border);
}

.face-pic {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 0;
  border: none;
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.titleline {
  font-family: var(--font-ui);
  font-weight: 300;
  font-size: clamp(1.375rem, 1.2rem + 0.8vw, 2rem);
  line-height: 1.2;
  color: var(--ink);
  margin: 0;
}

.two-cols {
  display: flex;
  gap: var(--space-xl);
  align-items: flex-start;
}

.col-main {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.col-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 36px;
  min-width: 200px;
}

.sec-hdr {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 10px;
  margin-bottom: 18px;
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

.body-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 170%;
  color: var(--ink-muted);
  margin: 0 0 10px;
}
.body-text:last-child { margin-bottom: 0; }

.entry {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin-bottom: 20px;
}
.entry:last-child { margin-bottom: 0; }

.entry .date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink-faint);
}

.entry .company {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1.4;
  color: var(--ink);
}

.entry .body-text {
  margin-top: 2px;
}

.entry-projects {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 10px;
  padding-left: 12px;
  border-left: 2px solid var(--border);
}

.ep {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ep-client {
  font-family: var(--font-ui);
  font-size: var(--text-xs);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--ink-faint);
}

.ep-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--ink);
}

.ep-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--ink-muted);
  line-height: 1.65;
  margin-top: 2px;
}

.ep-role {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--ink-faint);
  line-height: 1.5;
  font-style: italic;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.contact-list a {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink);
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out);
}
.contact-list a:hover {
  text-decoration: underline;
}

.skills-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sk-row {
  display: flex;
  gap: var(--space-sm);
}
.sk-row .l,
.sk-row .r {
  width: 50%;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink-muted);
}

.lang-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lg-row {
  display: flex;
  gap: var(--space-sm);
}
.lg-row .n {
  width: 60%;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--ink-muted);
}
.lg-row .lv {
  width: 40%;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--ink-faint);
}

.edu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: var(--space-md);
}
.edu:last-child { margin-bottom: 0; }

.edu .date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink-faint);
}
.edu .school {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--ink);
}
.edu .field {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink-muted);
  line-height: 1.5;
}

.award {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 12px;
}
.award:last-child { margin-bottom: 0; }

.a-title {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--ink);
}
.a-meta {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--ink-faint);
}

@media (max-width: 640px) {
  .cv-header { padding: 14px 18px; }
  .cv-body { padding: var(--space-lg) 18px 60px; }

  .name-row {
    flex-direction: column;
    gap: var(--space-md);
    margin-bottom: 36px;
  }

  .profile-pic {
    width: 80px;
    height: 80px;
  }

  .face-tracker-wrap {
    width: 80px;
    height: 80px;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  .titleline {
    font-size: 22px;
    margin-bottom: 0;
  }

  .two-cols {
    flex-direction: column;
    gap: 32px;
  }

  .col-side { min-width: 0; }

  .body-text { font-size: var(--text-xs); }
  .entry .company { font-size: var(--text-sm); }

  .sk-row .l,
  .sk-row .r { font-size: var(--text-xs); }

  .lg-row .n,
  .lg-row .lv { font-size: var(--text-xs); }

  .edu .school { font-size: var(--text-xs); }
}
</style>
