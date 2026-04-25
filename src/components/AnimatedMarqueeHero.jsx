import { motion } from 'framer-motion';

const FADE_IN = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

function ActionButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="mt-8 font-['Anton'] tracking-[0.15em] text-sm uppercase rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      style={{
        padding: '0.85rem 2rem',
        background: 'var(--primary)',
        color: 'var(--primary-foreground)',
        boxShadow: '0 8px 32px rgba(52,211,153,0.25)',
        cursor: 'pointer',
        border: 'none',
      }}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedMarqueeHero({
  tagline,
  title,
  description,
  ctaText,
  images,
  onCtaClick,
  className = '',
}) {
  const duplicated = [...images, ...images];

  return (
    <section
      className={`relative w-full overflow-hidden flex flex-col items-center justify-start text-center px-4 ${className}`}
      style={{
        minHeight: '100vh',
        background: 'var(--background)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl mx-auto pt-12 md:pt-20 pb-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          className="mb-6 inline-flex items-center gap-2 rounded-full backdrop-blur-md"
          style={{
            padding: '0.4rem 0.95rem',
            border: '1px solid var(--border)',
            background: 'rgba(26,26,34,0.6)',
            color: 'var(--muted-foreground)',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--primary)',
              boxShadow: '0 0 10px var(--primary)',
              display: 'inline-block',
            }}
          />
          {tagline}
        </motion.div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="font-['Anton'] tracking-tight"
          style={{
            color: 'var(--foreground)',
            fontSize: 'clamp(2.75rem, 7vw, 5.25rem)',
            lineHeight: 0.95,
            margin: 0,
          }}
        >
          {typeof title === 'string'
            ? title.split(' ').map((word, i) => (
                <motion.span key={i} variants={FADE_IN} className="inline-block">
                  {word}&nbsp;
                </motion.span>
              ))
            : title}
        </motion.h1>

        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.45 }}
          className="mt-6 max-w-xl"
          style={{
            color: 'var(--muted-foreground)',
            fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)',
            lineHeight: 1.6,
          }}
        >
          {description}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.6 }}
        >
          <ActionButton onClick={onCtaClick}>{ctaText}</ActionButton>
        </motion.div>
      </div>

      {/* Animated marquee strip at the bottom */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: 'clamp(180px, 38vh, 320px)',
          maskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent), linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 8%, black 92%, transparent), linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      >
        <motion.div
          className="flex gap-4 h-full items-end pb-6"
          style={{ width: 'max-content' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ ease: 'linear', duration: 45, repeat: Infinity }}
        >
          {duplicated.map((src, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 overflow-hidden"
              style={{
                aspectRatio: '3 / 4',
                height: 'clamp(160px, 28vh, 260px)',
                borderRadius: '1rem',
                transform: `rotate(${index % 2 === 0 ? -2 : 4}deg)`,
                boxShadow:
                  '0 16px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)',
              }}
            >
              <img
                src={src}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
