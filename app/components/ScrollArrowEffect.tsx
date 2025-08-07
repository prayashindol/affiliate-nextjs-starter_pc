"use client";
import { useEffect } from "react";

export default function ScrollArrowEffect() {
  useEffect(() => {
    // Debounce function for better performance
    function debounce<T extends (...args: unknown[]) => void>(func: T, wait: number) {
      let timeout: NodeJS.Timeout;
      return function executedFunction(...args: Parameters<T>) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

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

    // Initial update
    updateScrollArrows();
    
    // Debounced resize handler for better performance
    const debouncedUpdate = debounce(updateScrollArrows, 250);
    window.addEventListener('resize', debouncedUpdate);

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

    // Set up scroll listeners for existing elements
    function setupScrollListeners() {
      const elements = document.querySelectorAll('.prose .overflow-x-auto, .overflow-x-auto');
      elements.forEach(el => {
        // Remove existing listener to avoid duplicates
        el.removeEventListener('scroll', onScroll);
        el.addEventListener('scroll', onScroll);
      });
    }
    
    setupScrollListeners();

    // Set up MutationObserver to detect dynamically added tables
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        // Check if any nodes were added that might contain tables
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            // Check if the added node itself or its children contain overflow-x-auto elements
            if (element.classList?.contains('overflow-x-auto') || 
                element.querySelector?.('.overflow-x-auto')) {
              shouldUpdate = true;
            }
          }
        });
      });
      
      if (shouldUpdate) {
        // Use setTimeout to ensure DOM is fully updated
        setTimeout(() => {
          updateScrollArrows();
          setupScrollListeners();
        }, 100);
      }
    });

    // Start observing the document for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Clean up listeners and remove arrows
    return () => {
      window.removeEventListener('resize', debouncedUpdate);
      const elements = document.querySelectorAll('.prose .overflow-x-auto, .overflow-x-auto');
      elements.forEach(el => {
        el.removeEventListener('scroll', onScroll);
        el.querySelectorAll('.scroll-arrow-btn').forEach(btn => btn.remove());
      });
      observer.disconnect();
    };
  }, []);
  return null;
}
