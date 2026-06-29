<template>
  <div class="chatbot-wrap">
    <button class="chatbot-toggle" @click="open = !open" :aria-label="open ? 'Close chat' : 'Open chat'">
      <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <Transition name="panel" @after-leave="onPanelClosed">
      <div v-if="open" class="chatbot-panel" ref="panelRef">
        <div class="chatbot-header">
          <span>Ask about Florido</span>
        </div>
        <div class="chatbot-msgs" ref="msgsRef">
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="msg"
            :class="msg.role"
            :style="{ '--idx': i }"
          >
            <div class="msg-wrap">
              <div class="msg-bubble">{{ msg.text }}</div>
              <div v-if="msg.links.length" class="msg-links">
                <a
                  v-for="(link, j) in msg.links"
                  :key="j"
                  :href="link.url"
                  class="msg-link"
                  @click.prevent="navigate(link.url)"
                >{{ link.label }} <span class="arrow">&rarr;</span></a>
              </div>
            </div>
          </div>
          <div v-if="loading" class="msg assistant">
            <div class="msg-bubble typing">
              <span class="dot-pulse"></span>
              <span class="dot-pulse" style="animation-delay: .15s"></span>
              <span class="dot-pulse" style="animation-delay: .3s"></span>
            </div>
          </div>
        </div>
        <form class="chatbot-input" @submit.prevent="send">
          <input
            v-model="input"
            type="text"
            placeholder="Ask anything..."
            :disabled="loading"
            ref="inputRef"
          />
          <button type="submit" :disabled="!input.trim() || loading">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const INTERNAL_DOMAIN = 'floridomeacci.xyz'

const open = ref(false)
const input = ref('')
const loading = ref(false)
function parseMsg(content) {
  const re = /\[\[([^|]+)\|([^\]]+)\]\]/g
  const links = []
  let match
  while ((match = re.exec(content)) !== null) {
    links.push({ label: match[1], url: match[2] })
  }
  const text = content.replace(re, '').trim()
  return { text, links }
}

const messages = ref([
  parseMsg('Hi! Ask me anything about Florido, his work, or this website.')
])

const msgsRef = ref(null)
const inputRef = ref(null)

function scrollBottom() {
  nextTick(() => {
    const el = msgsRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

watch(open, (v) => {
  if (v) {
    scrollBottom()
    nextTick(() => inputRef.value?.focus())
  }
})

watch(messages, scrollBottom, { deep: true })

function onPanelClosed() {
  scrollBottom()
}

function navigate(url) {
  try {
    const u = new URL(url)
    if (u.hostname === INTERNAL_DOMAIN || u.hostname === 'www.' + INTERNAL_DOMAIN) {
      router.push(u.pathname + u.search + u.hash)
      return
    }
  } catch {}
  window.location.href = url
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  messages.value.push({ role: 'user', text, links: [] })
  loading.value = true

  try {
    const history = messages.value.slice(1, -1).map(m => ({ role: m.role, content: m.content }))
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history })
    })
    const data = await res.json()
    const reply = data.reply || "I don't know."
    messages.value.push({ role: 'assistant', ...parseMsg(reply) })
  } catch {
    messages.value.push({ role: 'assistant', text: "Sorry, I couldn't reach the server. Try again later.", links: [] })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ─── Design system tokens ─── */
.chatbot-wrap {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --ease-out: cubic-bezier(0.25, 1, 0.5, 1);
  --dur-fast: 150ms;
  --dur-med: 250ms;
  --dur-slow: 400ms;

  position: fixed;
  bottom: var(--space-xl);
  right: var(--space-xl);
  z-index: 999;
}

/* ─── Toggle button ─── */
.chatbot-toggle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--bg);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 24px oklch(0% 0 0 / 0.18);
  transition: transform var(--dur-fast) var(--ease-out),
              background var(--dur-fast) var(--ease-out);
  min-width: 44px;
  min-height: 44px;
}
.chatbot-toggle:hover {
  transform: scale(1.06);
  background: oklch(18% 0.006 45);
}
.chatbot-toggle:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

/* ─── Panel ─── */
.chatbot-panel {
  position: absolute;
  bottom: calc(100% + var(--space-md));
  right: 0;
  width: min(360px, calc(100vw - 48px));
  max-height: min(520px, calc(100vh - 180px));
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 40px oklch(0% 0 0 / 0.1);
  transform-origin: bottom right;
}

/* ─── Header ─── */
.chatbot-header {
  padding: var(--space-md) var(--space-lg);
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink-muted);
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}

/* ─── Messages area ─── */
.chatbot-msgs {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-md) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  scroll-behavior: smooth;
}

.msg {
  display: flex;
  animation: msg-in var(--dur-slow) var(--ease-out) both;
  animation-delay: calc(var(--idx, 0) * 40ms);
}
@keyframes msg-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.msg.user {
  justify-content: flex-end;
}
.msg.assistant {
  justify-content: flex-start;
}

/* ─── Bubble ─── */
.msg-bubble {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.55;
  color: var(--ink);
  word-wrap: break-word;
}
.msg.user .msg-wrap {
  align-items: flex-end;
}
.msg.user .msg-bubble {
  background: var(--ink);
  color: var(--bg);
  border-bottom-right-radius: 4px;
}
.msg.assistant .msg-bubble {
  background: oklch(92% 0.004 65);
  border-bottom-left-radius: 4px;
}

/* ─── Message wrap (text + links) ─── */
.msg-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
  max-width: 280px;
}

/* ─── Link buttons ─── */
.msg-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  width: 100%;
}
.msg-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  border: 1px solid var(--ink);
  border-radius: var(--radius-sm);
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--ink);
  background: transparent;
  text-decoration: none;
  transition: background var(--dur-fast) var(--ease-out),
              color var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
  width: fit-content;
  cursor: pointer;
}
.msg-link:hover {
  background: var(--ink);
  color: var(--bg);
  transform: translateX(2px);
}
.msg-link:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}
.msg-link .arrow {
  font-size: 12px;
  line-height: 1;
}

/* ─── Typing indicator ─── */
.typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: var(--space-md) var(--space-lg);
}
.dot-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--ink-muted);
  animation: dot-pulse 1.2s var(--ease-out) infinite;
}
@keyframes dot-pulse {
  0%, 60%, 100% { opacity: 0.2; transform: scale(0.85); }
  30% { opacity: 0.8; transform: scale(1); }
}

/* ─── Input area ─── */
.chatbot-input {
  display: flex;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  border-top: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
}
.chatbot-input input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: oklch(100% 0 0);
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--ink);
  min-width: 0;
  transition: border-color var(--dur-fast) var(--ease-out);
}
.chatbot-input input:focus-visible {
  border-color: var(--ink);
  outline: none;
}
.chatbot-input input:disabled {
  opacity: 0.5;
}
.chatbot-input input::placeholder {
  color: var(--ink-faint);
}

.chatbot-input button {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--ink);
  color: var(--bg);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity var(--dur-fast) var(--ease-out),
              transform var(--dur-fast) var(--ease-out);
  min-width: 40px;
  min-height: 40px;
}
.chatbot-input button:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}
.chatbot-input button:not(:disabled):hover {
  opacity: 0.85;
  transform: scale(1.04);
}
.chatbot-input button:not(:disabled):active {
  transform: scale(0.96);
}
.chatbot-input button:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

/* ─── Panel transition ─── */
.panel-enter-active {
  transition: opacity var(--dur-med) var(--ease-out),
              transform var(--dur-med) var(--ease-out);
}
.panel-leave-active {
  transition: opacity calc(var(--dur-med) * 0.75) var(--ease-out),
              transform calc(var(--dur-med) * 0.75) var(--ease-out);
}
.panel-enter-from {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}
.panel-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.96);
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .chatbot-toggle,
  .msg-link,
  .chatbot-input button,
  .chatbot-input input {
    transition: none;
  }
  .msg {
    animation: none;
  }
  .panel-enter-active,
  .panel-leave-active {
    transition: opacity var(--dur-fast) ease;
  }
  .dot-pulse {
    animation: none;
    opacity: 0.4;
  }
}
</style>
