"use client";
import { useEffect } from "react";

export default function ScrollArrowEffect() {
  useEffect(() => {
    function updateScrollArrows() {
      document.querySelectorAll('.prose .overflow-x-auto').forEach(el => {
        el.classList.remove('show-scroll-arrow');
        if ((el as HTMLElement).scrollWidth > (el as HTMLElement).clientWidth + 2) {
          el.classList.add('show-scroll-arrow');
        }
      });
    }
    updateScrollArrows();
    window.addEventListener('resize', updateScrollArrows);
    return () => window.removeEventListener('resize', updateScrollArrows);
  }, []);
  return null;
}
