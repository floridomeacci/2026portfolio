<template>
  <router-view />
  <SiteFooter v-if="showFooter" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteFooter from './components/SiteFooter.vue'

const route = useRoute()
const showFooter = computed(() => route.name !== 'sandbox')
</script>
