'use client';

import { ArrowUpIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  const [hasOverflowingTables, setHasOverflowingTables] = useState(false);

  useEffect(() => {
    function checkForOverflowingTables() {
      const tables = document.querySelectorAll('.prose .overflow-x-auto');
      let hasOverflow = false;
      
      tables.forEach(el => {
        if ((el as HTMLElement).scrollWidth > (el as HTMLElement).clientWidth + 2) {
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

    // Check for overflowing tables on load and when DOM changes
    checkForOverflowingTables();
    
    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      checkForOverflowingTables();
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkForOverflowingTables);

    // Initial check
    handleScroll();

    return () => {
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
      className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-50 opacity-90 hover:opacity-100"
      aria-label="Scroll to top"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
}