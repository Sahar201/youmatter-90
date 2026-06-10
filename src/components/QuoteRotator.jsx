import { useState, useEffect, useCallback, useRef } from 'react';
import quotes from '../data/quotes.js';
import styles from '../styles/QuoteRotator.module.css';

const ROTATE_MS = 20000; // each quote shows for 20 seconds
const FADE_MS = 500;

/**
 * Rotating inspirational quotes on a dark teal background.
 * Auto-advances every 20s with a smooth fade/slide. Subtle Prev/Next arrows
 * allow manual navigation; autoplay pauses on hover and resumes on leave.
 */
const QuoteRotator = () => {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const transitioning = useRef(false);

  // Fade out, swap to the target quote, fade back in.
  const goTo = useCallback((updater) => {
    if (transitioning.current) return;
    transitioning.current = true;
    setVisible(false);
    window.setTimeout(() => {
      setIndex((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        return (next + quotes.length) % quotes.length;
      });
      setVisible(true);
      transitioning.current = false;
    }, FADE_MS);
  }, []);

  const next = useCallback(() => goTo((i) => i + 1), [goTo]);
  const prev = useCallback(() => goTo((i) => i - 1), [goTo]);

  // Auto-rotate unless paused.
  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(next, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, next, index]);

  const quote = quotes[index];

  return (
    <section className={styles.section} aria-label="Inspirational quotes">
      <div
        className={`container ${styles.inner}`}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <span className={styles.marks} aria-hidden="true">
          &ldquo;
        </span>

        <div className={styles.stage}>
          <button
            className={styles.arrow}
            onClick={prev}
            aria-label="Previous quote"
          >
            <i className="fa-solid fa-chevron-left" />
          </button>

          <div
            className={`${styles.content} ${visible ? styles.visible : styles.hidden}`}
          >
            <p className={styles.text}>{quote.text}</p>
            <p className={styles.author}>— {quote.author}</p>
          </div>

          <button
            className={styles.arrow}
            onClick={next}
            aria-label="Next quote"
          >
            <i className="fa-solid fa-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuoteRotator;
