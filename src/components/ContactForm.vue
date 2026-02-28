<template>
  <div v-if="isOpen" class="settings-overlay" @click="handleOverlayClick">
    <div class="settings-panel" @click.stop>
      <div class="settings-header">
        <div class="header-left">
          <img src="/icons/smtp.svg" alt="" class="header-icon" />
          <h2 class="header-title">Contact</h2>
        </div>
        <button class="close-button" @click="closePanel">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <div class="settings-tabs">
        <button
          class="tab-button active"
        >
          Parameters
        </button>
      </div>

      <div class="settings-content">
        <div class="parameters-section">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="parameter-item">
              <label class="parameter-label">Name</label>
              <input
                v-model="formData.name"
                type="text"
                class="parameter-input"
                placeholder="Your name"
                required
              />
            </div>

            <div class="parameter-item">
              <label class="parameter-label">Email</label>
              <input
                v-model="formData.email"
                type="email"
                class="parameter-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div class="parameter-item">
              <label class="parameter-label">Message</label>
              <textarea
                v-model="formData.message"
                class="parameter-input parameter-textarea"
                placeholder="Your message..."
                rows="6"
                required
              />
            </div>

            <div class="form-actions">
              <button
                type="submit"
                class="submit-button"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Sending...' : 'Send Message' }}
              </button>
            </div>

            <div v-if="submitStatus" class="submit-status" :class="submitStatus">
              {{ submitMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const formData = ref({
  name: '',
  email: '',
  message: ''
});

const isSubmitting = ref(false);
const submitStatus = ref<'success' | 'error' | null>(null);
const submitMessage = ref('');

const closePanel = () => {
  emit('close');
};

const handleOverlayClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    closePanel();
  }
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitStatus.value = null;
  submitMessage.value = '';

  try {
    const response = await fetch('https://n8nfjm.org/webhook/portfolio-mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData.value),
    });

    if (response.ok) {
      submitStatus.value = 'success';
      submitMessage.value = 'Message sent successfully!';
      formData.value = { name: '', email: '', message: '' };
      setTimeout(() => {
        closePanel();
      }, 2000);
    } else {
      submitStatus.value = 'error';
      submitMessage.value = 'Failed to send message. Please try again.';
    }
  } catch (error) {
    submitStatus.value = 'error';
    submitMessage.value = 'Failed to send message. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.settings-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dark-mode .settings-panel {
  background: #1a1a1a;
  color: #e5e5e5;
}

.settings-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.dark-mode .settings-header {
  border-bottom-color: #404040;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  filter: brightness(0) saturate(100%);
}

.dark-mode .header-icon {
  filter: brightness(0) saturate(100%) invert(1);
}

.header-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.dark-mode .header-title {
  color: #e5e5e5;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #737373;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.dark-mode .close-button {
  color: #e5e5e5;
}

.dark-mode .close-button:hover {
  background: #404040;
  color: #ffffff;
}

.settings-tabs {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 24px;
  background: #f5f5f5;
}

.dark-mode .settings-tabs {
  background: #0a0a0a;
  border-bottom-color: #404040;
}

.tab-button {
  padding: 12px 20px;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-weight: 500;
  color: #737373;
  transition: all 0.2s ease;
}

.tab-button.active {
  color: #525252;
  border-bottom-color: #525252;
}

.dark-mode .tab-button {
  color: #a3a3a3;
}

.dark-mode .tab-button.active {
  color: #e5e5e5;
  border-bottom-color: #e5e5e5;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.dark-mode .settings-content {
  background: #1a1a1a;
}

.parameters-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.parameter-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.parameter-label {
  font-size: 14px;
  font-weight: 600;
  color: #525252;
}

.dark-mode .parameter-label {
  color: #d4d4d4;
}

.parameter-input {
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  background: white;
  color: #0a0a0a;
  transition: all 0.2s ease;
}

.parameter-input:focus {
  outline: none;
  border-color: #737373;
  box-shadow: 0 0 0 3px rgba(115, 115, 115, 0.1);
}

.dark-mode .parameter-input {
  background: #0a0a0a;
  border-color: #404040;
  color: #e5e5e5;
}

.dark-mode .parameter-input:focus {
  border-color: #737373;
  box-shadow: 0 0 0 3px rgba(115, 115, 115, 0.1);
}

.parameter-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

.submit-button {
  padding: 12px 24px;
  background: #525252;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #737373;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(115, 115, 115, 0.3);
}

.dark-mode .submit-button {
  background: #737373;
}

.dark-mode .submit-button:hover:not(:disabled) {
  background: #a3a3a3;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-status {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  text-align: center;
  font-weight: 500;
}

.submit-status.success {
  background: #dcfce7;
  color: #166534;
}

.dark-mode .submit-status.success {
  background: #14532d;
  color: #86efac;
}

.submit-status.error {
  background: #fee2e2;
  color: #991b1b;
}

.dark-mode .submit-status.error {
  background: #7f1d1d;
  color: #fca5a5;
}
</style>
