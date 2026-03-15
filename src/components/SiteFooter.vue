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
          <router-link to="/sandbox">N8N SANDBOX</router-link>
          <router-link to="/about">ABOUT</router-link>
        </div>
      </div>

      <div class="footer-row">
        <span class="footer-label">PROJECTS</span>
        <div class="footer-links">
          <a href="https://reddituser.info" target="_blank" rel="noopener">REDDITUSER.INFO</a>
          <a href="https://www.latentsearch.net/" target="_blank" rel="noopener">LATENTSEARCH.NET</a>
          <a href="https://creditswap.app" target="_blank" rel="noopener">CREDITSWAP.APP</a>
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
  background: var(--bg-sub);
  padding: 80px var(--space-xl) 64px;
  font-family: var(--font-body);
  border-top: 1px solid var(--border);
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
  color: var(--ink-faint);
  font-family: var(--font-body);
  font-size: var(--text-xs);
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
  color: var(--ink);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  transition: color var(--duration-fast) var(--ease-out);
}

.footer-links a:hover {
  color: var(--ink-muted);
}

.footer-row--email {
  padding-top: var(--space-lg);
  justify-content: flex-start;
  padding-left: calc(100px + 64px);
}

.footer-email {
  color: var(--ink);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: 0.03em;
  text-decoration: none;
  border-bottom: 1px solid var(--ink);
  padding-bottom: 2px;
  transition: color var(--duration-fast) var(--ease-out),
              border-color var(--duration-fast) var(--ease-out);
}

.footer-email:hover {
  color: var(--ink-muted);
  border-color: var(--ink-muted);
}

@media (max-width: 640px) {
  .site-footer {
    padding: 40px 18px 32px;
  }
  .footer-inner {
    gap: var(--space-lg);
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
