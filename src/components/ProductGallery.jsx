import { motion } from 'framer-motion';

const CONTAINER = {
  maxWidth: '1180px',
  margin: '0 auto',
  paddingLeft: 'clamp(1rem, 4vw, 3rem)',
  paddingRight: 'clamp(1rem, 4vw, 3rem)',
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 12 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 220, damping: 22 },
  },
};

export default function ProductGallery({
  images = [],
  eyebrow = 'Showcase',
  title = 'AVAILABLE FROM THIS VENDOR',
  subtitle = 'A peek at what your vendor is shipping right now. Reorder anything, anytime, with your discount code.',
}) {
  if (!images || images.length === 0) return null;

  return (
    <section
      style={{
        ...CONTAINER,
        paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
        paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--primary)',
            margin: 0,
          }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-['Anton']"
          style={{
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            letterSpacing: '0.02em',
            margin: '0.5rem 0 0',
            color: 'var(--foreground)',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            color: 'var(--muted-foreground)',
            maxWidth: '36rem',
            margin: '1rem auto 0',
            lineHeight: 1.6,
            fontSize: '0.95rem',
          }}
        >
          {subtitle}
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-3 gap-3 sm:gap-4"
      >
        {images.map((src, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            whileHover={{ y: -6, scale: 1.04, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
            style={{
              position: 'relative',
              aspectRatio: '1 / 1',
              borderRadius: '0.85rem',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              background: 'var(--card-image-bg)',
              cursor: 'zoom-in',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(52,211,153,0.4)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0,0,0,0.4), 0 0 0 1px rgba(52,211,153,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
            }}
          >
            <img
              src={src}
              alt=""
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
