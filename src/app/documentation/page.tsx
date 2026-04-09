"use client";

import React, { useState } from 'react';
import styles from './page.module.css';

export default function WaveNationDocs() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('styles');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'WN2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Access denied.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <div className={styles.logoWrapper}>
            {/* Monogram placeholder */}
            <div className={styles.monogram}></div>
            <h1 className={styles.brandName}>WAVENATION</h1>
          </div>
          <h2 className={styles.loginTitle}>Design System Docs</h2>
          <form onSubmit={handleLogin} className={styles.form}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className={styles.input}
            />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.docContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>WAVENATION</h2>
          <p>Brand Docs v1.0</p>
        </div>
        <nav className={styles.nav}>
          <button 
            className={`${styles.navItem} ${activeSection === 'styles' ? styles.active : ''}`}
            onClick={() => setActiveSection('styles')}
          >
            Styles & Tokens
          </button>
          {/* Add future sections here */}
          <button className={styles.navItemDisabled}>Components (Coming Soon)</button>
          <button className={styles.navItemDisabled}>Layouts (Coming Soon)</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {activeSection === 'styles' && (
          <div className={styles.section}>
            <header className={styles.sectionHeader}>
              <h1 className={styles.sectionTitle}>Styles & Tokens</h1>
              <p className={styles.sectionDescription}>
                The foundational CSS architecture for WaveNation Media. Rooted in cinematic dark mode and neon accents.
              </p>
            </header>

            {/* Tokens CSS */}
            <div className={styles.codeBlockWrapper}>
              <div className={styles.codeBlockHeader}>
                <h3>tokens.css</h3>
                <span>CSS Variables</span>
              </div>
              <pre className={styles.codeBlock}>
                <code>{`/* styles/tokens.css */
:root {
  /* Primary Palette */
  --wn-color-black: #0B0D0F;
  --wn-color-white: #FFFFFF;
  --wn-color-electric-blue: #00B3FF;
  --wn-color-neon-green: #39FF14;
  --wn-color-magenta-pulse: #E92C63;
  --wn-color-charcoal-gray: #1F1F21;

  /* Typography */
  --wn-font-primary: 'Inter', sans-serif;
  --wn-font-display: 'Oswald', sans-serif;
  
  /* ... copy full tokens here ... */
}`}</code>
              </pre>
            </div>

            {/* Utilities CSS */}
            <div className={styles.codeBlockWrapper}>
              <div className={styles.codeBlockHeader}>
                <h3>utilities.css</h3>
                <span>Helper Classes</span>
              </div>
              <pre className={styles.codeBlock}>
                <code>{`/* styles/utilities.css */
@import './tokens.css';

body {
  background-color: var(--wn-color-black);
  color: var(--wn-text-primary);
  font-family: var(--wn-font-primary);
}

.text-display {
  font-family: var(--wn-font-display);
  font-weight: var(--wn-weight-extrabold);
  font-size: var(--wn-text-display-xl);
  letter-spacing: var(--wn-tracking-cinematic);
  text-transform: uppercase;
}

/* ... copy full utilities here ... */`}</code>
              </pre>
            </div>

            {/* Animations CSS */}
            <div className={styles.codeBlockWrapper}>
              <div className={styles.codeBlockHeader}>
                <h3>animations.css</h3>
                <span>Motion Identity</span>
              </div>
              <pre className={styles.codeBlock}>
                <code>{`/* styles/animations.css */
@import './tokens.css';

@keyframes cinematic-fade-in {
  from { opacity: 0; filter: blur(4px); }
  to { opacity: 1; filter: blur(0); }
}

.animate-fade-cinematic {
  animation: cinematic-fade-in var(--wn-duration-cinematic) var(--wn-ease-cinematic) forwards;
}

/* ... copy full animations here ... */`}</code>
              </pre>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}