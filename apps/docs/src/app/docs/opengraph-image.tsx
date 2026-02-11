import { ImageResponse } from 'next/og';

export const alt = 'a2ui-shadcn Documentation - Complete Guide';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), 
                            radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.05) 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
          }}
        />
        
        {/* Book icon */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '80px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100px',
            height: '100px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            fontSize: '64px',
            backdropFilter: 'blur(10px)',
          }}
        >
          📚
        </div>
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
            }}
          >
            Documentation
          </div>
          
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              lineHeight: 1.4,
              maxWidth: '800px',
            }}
          >
            Complete guide to a2ui-shadcn
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {['Installation', 'Components', 'Theming', 'API', 'RTL'].map((section) => (
              <div
                key={section}
                style={{
                  padding: '10px 24px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  fontSize: '20px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {section}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
