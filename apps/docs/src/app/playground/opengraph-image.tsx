import { ImageResponse } from 'next/og';

export const alt = 'a2ui-shadcn Interactive Playground - Try A2UI in action';
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
          background: 'linear-gradient(135deg, #1e3a8a 0%, #6366f1 100%)',
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
        
        {/* Code editor mockup */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '60px',
            width: '300px',
            height: '200px',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#00ff88',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div>{'{"version": "v0.9",'}</div>
          <div style={{ marginLeft: '20px' }}>{'"component": "Button",'}</div>
          <div style={{ marginLeft: '20px' }}>{'"text": "Click Me"'}</div>
          <div>{'}'}</div>
        </div>
        
        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            zIndex: 1,
            maxWidth: '700px',
          }}
        >
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
            }}
          >
            Interactive Playground
          </div>
          
          <div
            style={{
              fontSize: '28px',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Try a2ui-shadcn in action with live examples
          </div>
          
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            <div
              style={{
                padding: '12px 28px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              30+ Components
            </div>
            <div
              style={{
                padding: '12px 28px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                fontSize: '20px',
                backdropFilter: 'blur(10px)',
              }}
            >
              Live Editing
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
