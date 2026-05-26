import Vue from 'vue'

const storageKey = 'epic-theme'

export const themeState = Vue.observable({
  dark: false
})

function getStoredTheme() {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(storageKey)
}

function applyTheme() {
  if (typeof document === 'undefined') return

  const method = themeState.dark ? 'add' : 'remove'
  document.documentElement.classList[method]('theme-dark')
  document.body.classList[method]('theme-dark')
}

export function initTheme() {
  const storedTheme = getStoredTheme()

  if (storedTheme) {
    themeState.dark = storedTheme === 'dark'
  } else if (typeof window !== 'undefined' && window.matchMedia) {
    themeState.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  applyTheme()
}

export function setTheme(dark) {
  themeState.dark = dark

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, dark ? 'dark' : 'light')
  }

  applyTheme()
}

export function toggleTheme() {
  setTheme(!themeState.dark)
}
