import React from 'react';

export default function AccessDenied() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f9fafb, #f3f4f6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ maxWidth: '28rem', width: '100%' }}>
        {/* Card Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '3rem 2rem',
          textAlign: 'center'
        }}>
          {/* Icon Lock */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '6rem',
            height: '6rem',
            backgroundColor: '#fee2e2',
            borderRadius: '50%',
            marginBottom: '1.5rem'
          }}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#dc2626" 
              strokeWidth="2"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          
          {/* Status Code */}
          <h1 style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '0.5rem'
          }}>
            403
          </h1>
          
          {/* Main Message */}
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: '600',
            color: '#1f2937',
            marginBottom: '1rem'
          }}>
            Akses Ditolak
          </h2>
          
          {/* Description */}
          <p style={{
            color: '#6b7280',
            marginBottom: '2rem',
            lineHeight: '1.625'
          }}>
            Maaf, Anda tidak memiliki akses ke halaman ini. Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
          </p>
          
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            justifyContent: 'center'
          }}>
            <button 
              onClick={() => window.history.back()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#e5e7eb',
                color: '#1f2937',
                fontWeight: '500',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d1d5db'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Kembali
            </button>
            
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: '500',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              Ke Beranda
            </button>
          </div>
        </div>
        
        {/* Additional Info */}
        <p style={{
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#6b7280',
          marginTop: '1.5rem'
        }}>
          Kode Error: <span style={{ fontFamily: 'monospace' }}>FORBIDDEN_ACCESS</span>
        </p>
      </div>
    </div>
  );
}