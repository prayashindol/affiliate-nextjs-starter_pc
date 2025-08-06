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

    // Listen for user scroll on each .overflow-x-auto
    const elements = document.querySelectorAll('.prose .overflow-x-auto');
    function scrollListener(this: HTMLElement) {
      if (this.scrollLeft > 10) {
        this.classList.add('user-has-scrolled');
      } else {
        this.classList.remove('user-has-scrolled');
      }
    }
    elements.forEach(el => {
      el.addEventListener('scroll', scrollListener);
    });

    // Clean up listeners
    return () => {
      window.removeEventListener('resize', updateScrollArrows);
      elements.forEach(el => {
        el.removeEventListener('scroll', scrollListener);
      });
    };
  }, []);
  return null;
}
