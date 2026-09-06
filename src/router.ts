import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingPage
    },
    {
      path: '/sandbox',
      name: 'sandbox',
      component: () => import('./pages/SandboxPage.vue')
    },
    {
      path: '/cases',
      name: 'cases',
      component: () => import('./pages/CasesV2Page.vue')
    },
    {
      path: '/websites',
      name: 'websites',
      component: () => import('./pages/WebsitesPage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/AboutPage.vue')
    },
    {
      path: '/cases-v2',
      name: 'cases-v2',
      component: () => import('./pages/CasesV2Page.vue')
    }
  ]
})

export default router
