<template>
  <div class="cv-page" @mousemove="onMouseMove">
    <header class="cv-header">
      <router-link to="/" class="back-link" title="Home">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </router-link>
      <span class="header-label">About</span>
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
            <div class="sec-hdr"><span>Bio</span><span class="idx">01</span></div>
            <p class="body-text">Creative Technologist with a passion for blending technology and creativity. I bring ideas to life through code, interactive installations, and digital experiences. From AI-driven campaigns to physical&#x2013;digital products, I thrive at the intersection where imagination meets engineering.</p>
            <p class="body-text">Born in Italy, educated at the Istituto Europeo di Design in Milan, and now based in Amsterdam working at TBWA\X &#x2014; the creative technology arm of TBWA\NEBOKO.</p>
          </section>

          <section>
            <div class="sec-hdr"><span>Experience</span><span class="idx">02</span></div>

            <div class="entry">
              <span class="date">2024.07 &#x2013; Present</span>
              <span class="company">TBWA\NEBOKO &#x2014; Creative Technologist</span>
              <span class="body-text">Architected AI automation frameworks enabling global campaign scalability. Built high-end 3D and interactive web experiences pushing creative and technical boundaries.</span>
            </div>

            <div class="entry">
              <span class="date">2021.05 &#x2013; 2024.08</span>
              <span class="company">TBWA\NEBOKO &#x2014; Digital Designer</span>
              <span class="body-text">Pioneered AI and emerging-tech integration across digital design workflows. Produced high-impact social content and interactive brand experiences, owning projects from concept through final delivery.</span>
            </div>

            <div class="entry">
              <span class="date">2020.04 &#x2013; 2021.03</span>
              <span class="company">Key Agency</span>
              <span class="body-text">Developed photorealistic 3D visuals using Cinema 4D, Arnold, and Substance Painter. Created campaign-ready renders and texture workflows for social and digital channels.</span>
            </div>

            <div class="entry">
              <span class="date">2016.04 &#x2013; 2020.03</span>
              <span class="company">ACT.agency</span>
              <span class="body-text">Promoted from Visual Designer to Lead Designer. Managed the full design lifecycle &#x2014; UI/UX, data dashboards, infographics, and comprehensive brand books. Designed large-format print including transit wraps, banners, and posters.</span>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Personal</span><span class="idx">03</span></div>

            <div class="entry">
              <span class="date">2017.07 &#x2013; Present</span>
              <span class="company">Sabatoka</span>
              <span class="body-text">Co-founded a creative studio specialising in bespoke AI solutions and brand strategy. Drive client acquisition and deliver end-to-end projects for brands including Humdrum and New Amsterdam Surf.</span>
            </div>

            <div class="entry">
              <span class="date">2023 &#x2013; Present</span>
              <span class="company">Creative Technology Collective</span>
              <span class="body-text">Active member of CTC &#x2014; a community of creative technologists exploring the intersection of art, design, and emerging technology.</span>
            </div>
          </section>
        </div>

        <div class="col-side">

          <section>
            <div class="sec-hdr"><span>Contact</span><span class="idx">04</span></div>
            <div class="contact-list">
              <a href="mailto:florido@sbtk.nl">florido@sbtk.nl</a>
              <a href="https://www.linkedin.com/in/florido-jan-meacci" target="_blank" rel="noopener">linkedin.com/in/florido-jan-meacci</a>
              <a href="https://www.floridomeacci.xyz" target="_blank" rel="noopener">floridomeacci.xyz</a>
              <a href="https://github.com/floridomeacci" target="_blank" rel="noopener">github.com/floridomeacci</a>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Skills</span><span class="idx">05</span></div>
            <div class="skills-grid">
              <div class="sk-row"><span class="l">Python</span><span class="r">AI / ML</span></div>
              <div class="sk-row"><span class="l">n8n / Docker</span><span class="r">Cloud Infra</span></div>
              <div class="sk-row"><span class="l">Creative Dir.</span><span class="r">Brand Strategy</span></div>
              <div class="sk-row"><span class="l">3D / C4D</span><span class="r">UI / UX</span></div>
              <div class="sk-row"><span class="l">Web Dev</span><span class="r">Automation</span></div>
              <div class="sk-row"><span class="l">Vue / React</span><span class="r">TypeScript</span></div>
            </div>
          </section>

          <section>
            <div class="sec-hdr"><span>Languages</span><span class="idx">06</span></div>
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

          <section>
            <div class="sec-hdr"><span>Awards</span><span class="idx">08</span></div>
            <div class="award">
              <span class="a-title">McDonald's The Hidden Campaign</span>
              <span class="a-meta">Webby Honoree &#xb7; 2025</span>
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
  --bg: #f8f8f8;
  --ink: #0f0f0f;
  width: 100%;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
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
  max-width: 800px;
  margin: 0 auto;
  padding: 48px 32px 100px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-bottom: 48px;
}

.profile-pic {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 20%;
  flex-shrink: 0;
  border: 2px solid rgba(0,0,0,.08);
}

.face-tracker-wrap {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid rgba(0,0,0,.08);
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
  font-family: 'Space Grotesk', system-ui, sans-serif;
  font-weight: 300;
  font-size: 32px;
  line-height: 1.2;
  color: #000;
  margin: 0;
}

.two-cols {
  display: flex;
  gap: 48px;
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
  opacity: .15;
}
.sec-hdr .idx {
  font-size: 10px;
  opacity: .4;
}

.body-text {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 170%;
  color: #222;
  margin: 0 0 10px;
}
.body-text:last-child { margin-bottom: 0; }

.entry {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 20px;
}
.entry:last-child { margin-bottom: 0; }

.entry .date {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 400;
  color: #888;
}

.entry .company {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ink);
}

.entry .body-text {
  margin-top: 2px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-list a {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--ink);
  text-decoration: none;
  transition: opacity .2s;
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
  gap: 8px;
}
.sk-row .l,
.sk-row .r {
  width: 50%;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #333;
}

.lang-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lg-row {
  display: flex;
  gap: 8px;
}
.lg-row .n {
  width: 60%;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #333;
}
.lg-row .lv {
  width: 40%;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: #777;
}

.edu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 16px;
}
.edu:last-child { margin-bottom: 0; }

.edu .date {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 400;
  color: #888;
}
.edu .school {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--ink);
}
.edu .field {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 400;
  color: #555;
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
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: var(--ink);
}
.a-meta {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 400;
  color: #777;
}

@media (max-width: 640px) {
  .cv-header { padding: 14px 18px; }
  .cv-body { padding: 24px 18px 60px; }

  .name-row {
    flex-direction: column;
    gap: 16px;
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

  .body-text { font-size: 11px; }
  .entry .company { font-size: 12px; }

  .sk-row .l,
  .sk-row .r { font-size: 10px; }

  .lg-row .n,
  .lg-row .lv { font-size: 10px; }

  .edu .school { font-size: 11px; }
}
</style>
