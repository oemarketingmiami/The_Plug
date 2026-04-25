import { useEffect, useRef } from 'react';

const glowColorMap = {
  green:  { base: 120, spread: 80 },
  blue:   { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
};

const beforeAfterStyles = `
  [data-glow]::before,
  [data-glow]::after {
    pointer-events: none;
    content: "";
    position: absolute;
    inset: calc(var(--border-size) * -1);
    border: var(--border-size) solid transparent;
    border-radius: calc(var(--radius-px));
    background-attachment: fixed;
    background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
    background-repeat: no-repeat;
    background-position: 50% 50%;
    mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
    mask-clip: padding-box, border-box;
    mask-composite: intersect;
  }
  [data-glow]::before {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 120) calc(var(--saturation, 80) * 1%) calc(var(--lightness, 45) * 1%) / var(--border-spot-opacity, 1)), transparent 100%
    );
    filter: brightness(1.6);
  }
  [data-glow]::after {
    background-image: radial-gradient(
      calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(0 100% 100% / var(--border-light-opacity, 0.6)), transparent 100%
    );
  }
  [data-glow] [data-glow] {
    position: absolute;
    inset: 0;
    will-change: filter;
    opacity: var(--outer, 1);
    border-radius: calc(var(--radius-px));
    border-width: calc(var(--border-size) * 20);
    filter: blur(calc(var(--border-size) * 10));
    background: none;
    pointer-events: none;
    border: none;
  }
  [data-glow] > [data-glow]::before {
    inset: -10px;
    border-width: 10px;
  }
`;

let stylesInjected = false;

export function GlowCard({ children, className = '', glowColor = 'green', onMouseEnter, onMouseLeave }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (stylesInjected) return;
    const style = document.createElement('style');
    style.textContent = beforeAfterStyles;
    document.head.appendChild(style);
    stylesInjected = true;
  }, []);

  useEffect(() => {
    const syncPointer = (e) => {
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', e.clientX.toFixed(2));
        cardRef.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', e.clientY.toFixed(2));
        cardRef.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
      }
    };
    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor] || glowColorMap.green;

  const inlineStyles = {
    '--base': base,
    '--spread': spread,
    '--radius-px': '12px',
    '--border': '2',
    '--size': '200',
    '--outer': '1',
    '--border-size': 'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 200) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px),
      hsl(var(--hue, 120) 60% 35% / 0.1), transparent
    )`,
    backgroundColor: 'var(--card)',
    backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
    backgroundPosition: '50% 50%',
    backgroundAttachment: 'fixed',
    border: '1px solid var(--border)',
    position: 'relative',
    touchAction: 'none',
  };

  return (
    <div
      ref={cardRef}
      data-glow
      style={inlineStyles}
      className={`rounded-xl relative shadow-[0_4px_24px_rgba(0,0,0,0.3)] ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div data-glow />
      {children}
    </div>
  );
}
