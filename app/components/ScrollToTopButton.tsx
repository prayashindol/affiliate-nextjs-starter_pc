'use client';

import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  const [hasOverflowingTables, setHasOverflowingTables] = useState(false);

  useEffect(() => {
    function checkForOverflowingTables() {
      // Look for overflow-x-auto divs anywhere in the prose content, not just direct children
      const tables = document.querySelectorAll('.prose .overflow-x-auto, .overflow-x-auto');
      let hasOverflow = false;
      
      tables.forEach(el => {
        const element = el as HTMLElement;
        // Check if element has horizontal scroll
        if (element.scrollWidth > element.clientWidth + 2) {
          hasOverflow = true;
        }
      });
      
      setHasOverflowingTables(hasOverflow);
    }

    function handleScroll() {
      // Show button when scrolled down AND there are overflowing tables
      const shouldShow = window.scrollY > 300 && hasOverflowingTables;
      setShowButton(shouldShow);
    }

    // Initial check when component mounts
    const initialCheck = () => {
      checkForOverflowingTables();
      handleScroll();
    };

    // Use setTimeout to ensure DOM is fully rendered
    const timeoutId = setTimeout(initialCheck, 100);
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      setTimeout(checkForOverflowingTables, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', () => {
      setTimeout(checkForOverflowingTables, 100);
    });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkForOverflowingTables);
      observer.disconnect();
    };
  }, [hasOverflowingTables]);

  if (!showButton) {
    return null;
  }

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="scroll-to-top-button fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50 opacity-90 hover:opacity-100 transform hover:scale-110"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}