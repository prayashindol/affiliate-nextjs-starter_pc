"use client";
import { useEffect } from "react";

export default function ScrollArrowEffect() {
  useEffect(() => {
    function updateScrollArrows() {
      document.querySelectorAll('.prose .overflow-x-auto, .overflow-x-auto').forEach(el => {
        // Remove any previous arrow button
        el.querySelectorAll('.scroll-arrow-btn').forEach(btn => btn.remove());

        el.classList.remove('show-scroll-arrow');
        el.classList.remove('user-has-scrolled');

        // Only show arrow if scrollable - use improved detection logic
        // More robust check for horizontal scroll with larger tolerance
        const scrollDifference = (el as HTMLElement).scrollWidth - (el as HTMLElement).clientWidth;
        
        // Only consider it overflowing if there's a significant difference (>15px)
        if (scrollDifference > 15) {
          // Additional verification: try to scroll slightly to confirm scrollability
          const originalScrollLeft = (el as HTMLElement).scrollLeft;
          (el as HTMLElement).scrollLeft = Math.min(1, scrollDifference);
          const didScroll = (el as HTMLElement).scrollLeft !== originalScrollLeft;
          (el as HTMLElement).scrollLeft = originalScrollLeft; // Reset to original position
          
          // Only show arrow if both conditions are met:
          // 1. Significant size difference (>15px)
          // 2. Element actually scrolled when we tried to scroll it
          if (didScroll) {
            el.classList.add('show-scroll-arrow');

            // Create the clickable button
            const btn = document.createElement('button');
            btn.type = "button";
            btn.className = 'scroll-arrow-btn';
            btn.setAttribute("aria-label", "Scroll table right");
            btn.style.position = "absolute";
            btn.style.right = "1rem";
            btn.style.top = "50%";
            btn.style.transform = "translateY(-50%)";
            btn.style.width = "2.2em";
            btn.style.height = "2.2em";
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.fontSize = "1.2em";
            btn.style.fontWeight = "bold";
            btn.style.color = "#fff";
            btn.style.background = "rgba(24, 24, 28, 0.98)";
            btn.style.border = "none";
            btn.style.borderRadius = "50%";
            btn.style.boxShadow = "0 2px 12px 0 rgba(0,0,0,0.18)";
            btn.style.zIndex = "4";
            btn.style.opacity = "0.93";
            btn.style.cursor = "pointer";
            btn.style.transition = "opacity 0.25s";
            btn.innerText = "→";

            btn.onclick = (e) => {
              e.stopPropagation();
              (el as HTMLElement).scrollBy({ left: (el as HTMLElement).clientWidth * 0.7, behavior: "smooth" });
            };

            el.appendChild(btn);
          }
        }
      });
    }
    updateScrollArrows();
    window.addEventListener('resize', updateScrollArrows);

    // Listen for user scroll on each .overflow-x-auto
    function onScroll(this: HTMLElement) {
      // Hide button and arrow when user scrolls right
      if (this.scrollLeft > 10) {
        this.classList.add('user-has-scrolled');
        this.querySelectorAll('.scroll-arrow-btn').forEach(btn => {
          (btn as HTMLElement).style.opacity = "0";
          (btn as HTMLElement).style.pointerEvents = "none";
        });
      } else {
        this.classList.remove('user-has-scrolled');
        this.querySelectorAll('.scroll-arrow-btn').forEach(btn => {
          (btn as HTMLElement).style.opacity = "0.93";
          (btn as HTMLElement).style.pointerEvents = "auto";
        });
      }
    }
    const elements = document.querySelectorAll('.prose .overflow-x-auto, .overflow-x-auto');
    elements.forEach(el => {
      el.addEventListener('scroll', onScroll);
    });

    // Clean up listeners and remove arrows
    return () => {
      window.removeEventListener('resize', updateScrollArrows);
      elements.forEach(el => {
        el.removeEventListener('scroll', onScroll);
        el.querySelectorAll('.scroll-arrow-btn').forEach(btn => btn.remove());
      });
    };
  }, []);
  return null;
}
