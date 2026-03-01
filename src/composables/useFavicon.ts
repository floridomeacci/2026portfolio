import { onMounted, onUnmounted } from 'vue'

const P_MIN = -15
const P_MAX = 15
const STEP = 3
const SIZE = 32

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function quantize(val: number) {
  const raw = P_MIN + (val + 1) * (P_MAX - P_MIN) / 2
  const snapped = Math.round(raw / STEP) * STEP
  return clamp(snapped, P_MIN, P_MAX)
}

function sanitize(val: number) {
  return val.toFixed(1).replace('-', 'm').replace('.', 'p')
}

export function useFavicon() {
  const canvas = document.createElement('canvas')
  canvas.width = SIZE
  canvas.height = SIZE
  const ctx = canvas.getContext('2d')!

  let linkEl: HTMLLinkElement | null = null
  let lastSrc = ''
  let rafId = 0
  let pendingSrc = ''

  function ensureLink() {
    if (linkEl) return linkEl
    linkEl = document.querySelector('link[rel="icon"]') as HTMLLinkElement
    if (!linkEl) {
      linkEl = document.createElement('link')
      linkEl.rel = 'icon'
      linkEl.type = 'image/png'
      document.head.appendChild(linkEl)
    }
    return linkEl
  }

  function updateFavicon(src: string) {
    if (src === lastSrc) return
    lastSrc = src

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      ctx.drawImage(img, 0, 0, SIZE, SIZE)
      const link = ensureLink()
      link.type = 'image/png'
      link.href = canvas.toDataURL('image/png')
    }
    img.src = src
  }

  function onMouseMove(e: MouseEvent) {
    const nx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1)
    const ny = clamp(1 - (e.clientY / window.innerHeight) * 2, -1, 1)
    const px = quantize(nx)
    const py = quantize(ny)
    pendingSrc = `/faces/gaze_px${sanitize(px)}_py${sanitize(py)}_256.webp`

    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        updateFavicon(pendingSrc)
        rafId = 0
      })
    }
  }

  onMounted(() => {
    // Set initial centered face
    updateFavicon('/faces/gaze_px0p0_py0p0_256.webp')
    window.addEventListener('mousemove', onMouseMove, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    if (rafId) cancelAnimationFrame(rafId)
  })
}
