import React from 'react';

export default function RecipeSkeleton() {
  return (
    <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
      <div className="skeleton" style={{ height: '200px', width: '100%' }}></div>
      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div className="skeleton" style={{ height: '14px', width: '60px', borderRadius: '99px' }}></div>
          <div className="skeleton" style={{ height: '14px', width: '40px', borderRadius: '4px' }}></div>
        </div>
        <div className="skeleton" style={{ height: '24px', width: '80%', marginBottom: '0.8rem', borderRadius: '4px' }}></div>
        <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '0.4rem', borderRadius: '2px' }}></div>
        <div className="skeleton" style={{ height: '16px', width: '90%', marginBottom: '1.5rem', borderRadius: '2px' }}></div>
        
        <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div className="skeleton" style={{ height: '14px', width: '30%', borderRadius: '2px' }}></div>
          <div className="skeleton" style={{ height: '14px', width: '30%', borderRadius: '2px' }}></div>
        </div>
      </div>
      
      <style>{`
        .skeleton {
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }

        @keyframes shine {
          to {
            background-position-x: -200%;
          }
        }
      `}</style>
    </div>
  );
}
