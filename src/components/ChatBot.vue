<template>
  <div class="chatbot-wrap">
    <button class="chatbot-toggle" @click="open = !open" :aria-label="open ? 'Close chat' : 'Open chat'">
      <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>

    <Transition name="panel">
      <div v-if="open" class="chatbot-panel" ref="panelRef">
        <div class="chatbot-header">
          <span>Ask about Florido</span>
        </div>
        <div class="chatbot-msgs" ref="msgsRef">
          <div v-for="(msg, i) in messages" :key="i" class="msg" :class="msg.role">
            <div class="msg-bubble">{{ msg.content }}</div>
          </div>
          <div v-if="loading" class="msg assistant">
            <div class="msg-bubble typing"><span class="dot-pulse"></span></div>
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

const open = ref(false)
const input = ref('')
const loading = ref(false)
const messages = ref([
  { role: 'assistant', content: 'Hi! Ask me anything about Florido, his work, or this website.' }
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

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return
  input.value = ''
  messages.value.push({ role: 'user', content: text })
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
    messages.value.push({ role: 'assistant', content: reply })
  } catch {
    messages.value.push({ role: 'assistant', content: "Sorry, I couldn't reach the server. Try again later." })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.chatbot-wrap {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.chatbot-toggle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #0a0a09;
  color: #f7f5f2;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0,0,0,.2);
  transition: background .15s, transform .15s;
}
.chatbot-toggle:hover {
  background: #2a2a29;
  transform: scale(1.05);
}

.chatbot-panel {
  width: 360px;
  max-height: 480px;
  background: #f7f5f2;
  border: 1px solid #ccc9c6;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0,0,0,.12);
}

.chatbot-header {
  padding: 14px 16px;
  font-family: var(--font-ui);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: #0a0a09;
  border-bottom: 1px solid #ccc9c6;
  background: #f7f5f2;
}

.chatbot-msgs {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.msg {
  display: flex;
}
.msg.user {
  justify-content: flex-end;
}
.msg.assistant {
  justify-content: flex-start;
}

.msg-bubble {
  max-width: 280px;
  padding: 8px 12px;
  border-radius: 10px;
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.5;
  color: #0a0a09;
}
.msg.user .msg-bubble {
  background: #0a0a09;
  color: #f7f5f2;
  border-bottom-right-radius: 4px;
}
.msg.assistant .msg-bubble {
  background: #e8e5e2;
  border-bottom-left-radius: 4px;
}

.typing {
  padding: 10px 14px;
}
.dot-pulse {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0a0a09;
  animation: pulse 1s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: .3; }
  50% { opacity: 1; }
}

.chatbot-input {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid #ccc9c6;
  background: #f7f5f2;
}

.chatbot-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc9c6;
  border-radius: 8px;
  background: #fff;
  font-family: var(--font-body);
  font-size: 13px;
  color: #0a0a09;
  outline: none;
}
.chatbot-input input:focus {
  border-color: #0a0a09;
}
.chatbot-input input:disabled {
  opacity: .5;
}

.chatbot-input button {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: #0a0a09;
  color: #f7f5f2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: opacity .15s;
}
.chatbot-input button:disabled {
  opacity: .3;
  cursor: not-allowed;
}
.chatbot-input button:not(:disabled):hover {
  opacity: .8;
}

.panel-enter-active,
.panel-leave-active {
  transition: all .2s ease;
}
.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(.96);
}
</style>
