import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageLayout({ children }) {
  const { pathname } = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Trigger "loading" bar simulation on route change
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {loading && <div className="loading-bar"></div>}
      {children}
      
      <style>{`
        /* Local overrides for the loading bar animation if needed */
        .loading-bar {
           animation: routeLoad 0.8s ease-in-out forwards;
        }
        @keyframes routeLoad {
          0% { width: 0%; opacity: 1; }
          90% { width: 100%; opacity: 1; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
