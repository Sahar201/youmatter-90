import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

/**
 * Site footer: brand, navigation, a professional social section, a crisis note,
 * and a bottom bar with legal links + copyright.
 */
const Footer = () => {
  const year = new Date().getFullYear();

  const socials = [
    { icon: 'fa-instagram', label: 'Instagram', href: 'https://instagram.com', brand: true },
    { icon: 'fa-linkedin-in', label: 'LinkedIn', href: 'https://linkedin.com', brand: true },
    { icon: 'fa-github', label: 'GitHub', href: 'https://github.com', brand: true },
    { icon: 'fa-envelope', label: 'Email', href: 'mailto:hello@youmatter.app', brand: false },
  ];

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logo}>
            <i className="fa-solid fa-heart" />
            <span>
              You<span className={styles.accent}>Matter</span>
            </span>
          </Link>
          <p className={styles.tagline}>
            Your digital sanctuary for mental well-being. We provide the tools and
            support you need to find your inner peace and navigate life's journey
            with resilience.
          </p>
          <div className={styles.social}>
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                title={s.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className={`${s.brand ? 'fa-brands' : 'fa-solid'} ${s.icon}`} />
              </a>
            ))}
          </div>
        </div>

        <div className={styles.linkCol}>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/mood-tracker">Mood Tracker</Link></li>
            <li><Link to="/diary-card">Diary Card</Link></li>
            <li><Link to="/articles">Articles</Link></li>
            <li><Link to="/videos">Videos &amp; Exercises</Link></li>
          </ul>
        </div>

        <div className={styles.linkCol}>
          <h4>Account</h4>
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>

        <div className={styles.linkCol}>
          <h4>Need help now?</h4>
          <p className={styles.help}>
            If you are in crisis, please reach out to a local helpline or
            emergency services. You are not alone.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomInner}`}>
          <p>© {year} YouMatter. All rights reserved.</p>
          <div className={styles.legal}>
            <a href="#">Privacy Policy</a>
            <span aria-hidden="true">·</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
