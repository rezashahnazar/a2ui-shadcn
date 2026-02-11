import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'a2ui-shadcn - A2UI Protocol Renderer for shadcn/ui';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
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
            backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.03) 2%, transparent 0%), 
                            radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.03) 2%, transparent 0%)`,
            backgroundSize: '100px 100px',
          }}
        />
        
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
          {/* Logo placeholder - stylized A2 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              fontSize: '64px',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
            }}
          >
            A2
          </div>
          
          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #fff 0%, #888 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              a2ui-shadcn
            </div>
            <div
              style={{
                fontSize: '32px',
                color: 'rgba(255, 255, 255, 0.7)',
                fontWeight: 'normal',
                letterSpacing: '0.05em',
              }}
            >
              A2UI Protocol Renderer
            </div>
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: '24px',
              color: 'rgba(255, 255, 255, 0.6)',
              maxWidth: '800px',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
          >
            Build agent-driven UIs with React & shadcn/ui
          </div>
          
          {/* Tech badges */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '24px',
            }}
          >
            {['React', 'TypeScript', 'shadcn/ui', 'Tailwind'].map((tech) => (
              <div
                key={tech}
                style={{
                  padding: '8px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  fontSize: '18px',
                  color: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                {tech}
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
