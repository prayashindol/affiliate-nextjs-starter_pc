'use client'
/**
 * Dev-only helper to surface malformed anchor hrefs like /tools/[object Object].
 * Add conditionally in layout or a specific page. Safe to remove anytime.
 */
import { useEffect } from 'react'

export default function DevAnchorInspector() {
  useEffect(() => {
    const bad: HTMLAnchorElement[] = []
    document.querySelectorAll('a').forEach(a => {
      const href = a.getAttribute('href')
      if (href && href.includes('[object')) bad.push(a)
    })
    if (bad.length) {
      // eslint-disable-next-line no-console
      console.warn('[DevAnchorInspector] Malformed anchors detected:', bad.map(b => ({
        href: b.getAttribute('href'),
        text: b.textContent?.trim()
      })))
    }
  }, [])
  return null
}