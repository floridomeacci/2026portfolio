<template>
  <footer class="site-footer">
    <div class="footer-inner">

      <div class="footer-row">
        <span class="footer-label">CONTACT</span>
        <div class="footer-links">
          <a href="https://www.linkedin.com/in/florido-jan-meacci" target="_blank" rel="noopener">LINKEDIN</a>
          <a href="https://github.com/floridomeacci" target="_blank" rel="noopener">GITHUB</a>
          <a href="https://www.floridomeacci.xyz" target="_blank" rel="noopener">FLORIDOMEACCI.XYZ</a>
        </div>
      </div>

      <div class="footer-row">
        <span class="footer-label">PAGES</span>
        <div class="footer-links">
          <router-link to="/">HOME</router-link>
          <router-link to="/cases">CASES</router-link>
          <router-link to="/sandbox">SANDBOX</router-link>
          <router-link to="/about">ABOUT</router-link>
        </div>
      </div>

      <div class="footer-row footer-row--email">
        <a href="mailto:florido@sbtk.nl" class="footer-email">FLORIDO@SBTK.NL</a>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
</script>

<style scoped>
.site-footer {
  background: #f8f8f8;
  padding: 80px 48px 64px;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid rgba(15, 15, 15, 0.1);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.footer-row {
  display: flex;
  align-items: baseline;
  gap: 64px;
}

.footer-label {
  color: rgba(15, 15, 15, 0.4);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  min-width: 100px;
  flex-shrink: 0;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.footer-links a {
  color: #0f0f0f;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  transition: opacity 0.2s;
}

.footer-links a:hover {
  opacity: 0.45;
}

.footer-row--email {
  padding-top: 24px;
  justify-content: flex-start;
  padding-left: calc(100px + 64px);
}

.footer-email {
  color: #0f0f0f;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.03em;
  text-decoration: none;
  border-bottom: 1px solid #0f0f0f;
  padding-bottom: 2px;
  transition: opacity 0.2s;
}

.footer-email:hover {
  opacity: 0.45;
}

@media (max-width: 640px) {
  .site-footer {
    padding: 40px 18px 32px;
  }
  .footer-inner {
    gap: 24px;
  }
  .footer-row {
    flex-direction: column;
    gap: 12px;
  }
  .footer-label {
    min-width: unset;
  }
  .footer-row--email {
    padding-left: 0;
    padding-top: 12px;
  }
}
</style>
