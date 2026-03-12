(() => {
  const root = document.documentElement
  let ticking = false
  let cleanup = null

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

  const applyProgress = progress => {
    const blur = 18 * progress
    const scale = 1.08 + 0.06 * progress
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const brightness = isDark ? 0.72 - 0.18 * progress : 0.98 - 0.12 * progress
    const saturate = isDark ? 0.92 - 0.08 * progress : 1 - 0.08 * progress
    const overlayTop = isDark
      ? `rgba(9, 11, 16, ${0.12 + 0.18 * progress})`
      : `rgba(255, 255, 255, ${0.08 + 0.14 * progress})`
    const overlayBottom = isDark
      ? `rgba(9, 11, 16, ${0.26 + 0.22 * progress})`
      : `rgba(255, 255, 255, ${0.18 + 0.18 * progress})`
    const overlaySolid = isDark
      ? `rgba(9, 11, 16, ${0.1 + 0.14 * progress})`
      : `rgba(236, 240, 244, ${0.08 + 0.14 * progress})`

    root.style.setProperty('--home-bg-blur', `${blur.toFixed(2)}px`)
    root.style.setProperty('--home-bg-scale', scale.toFixed(3))
    root.style.setProperty('--home-bg-brightness', brightness.toFixed(3))
    root.style.setProperty('--home-bg-saturate', saturate.toFixed(3))
    root.style.setProperty('--home-bg-overlay-top', overlayTop)
    root.style.setProperty('--home-bg-overlay-bottom', overlayBottom)
    root.style.setProperty('--home-bg-overlay-solid', overlaySolid)
  }

  const resetBackground = () => {
    applyProgress(0)
  }

  const initHomeBackground = () => {
    cleanup && cleanup()

    const pageType = window.GLOBAL_CONFIG_SITE && GLOBAL_CONFIG_SITE.pageType
    const isHome = pageType === 'home'
    const header = document.getElementById('page-header')
    const wallpaper = document.getElementById('web_bg')

    if (!header || !wallpaper) {
      resetBackground()
      cleanup = null
      return
    }

    if (pageType === 'post') {
      applyProgress(1)
      cleanup = null
      return
    }

    if (!isHome) {
      resetBackground()
      cleanup = null
      return
    }

    const update = () => {
      ticking = false
      const viewportHeight = window.innerHeight || 1
      const headerHeight = header.offsetHeight || viewportHeight
      const startBlurAt = Math.max(0, headerHeight - viewportHeight * 0.5)
      const endBlurAt = Math.max(startBlurAt + 1, headerHeight)
      const progress = clamp((window.scrollY - startBlurAt) / (endBlurAt - startBlurAt), 0, 1)

      applyProgress(progress)
    }

    const requestUpdate = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    requestUpdate()

    cleanup = () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      ticking = false
      resetBackground()
    }
  }

  if (window.btf && typeof window.btf.addGlobalFn === 'function') {
    btf.addGlobalFn('pjaxComplete', initHomeBackground, 'homeBackgroundBlur')
    btf.addGlobalFn('themeChange', initHomeBackground, 'homeBackgroundBlurTheme')
  }

  window.addEventListener('load', initHomeBackground)
})()
