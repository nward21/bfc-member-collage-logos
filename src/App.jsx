import React, { useState, useEffect } from 'react';
import { BfcLogoGrid } from './BfcLogoGrid';
import membersData from '../members.json';

const styles = {
  dashboard: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    color: '#fff',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    padding: '24px 40px',
    borderBottom: '1px solid #333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    marginTop: '4px',
  },
  controls: {
    padding: '20px 40px',
    backgroundColor: '#222',
    display: 'flex',
    gap: '32px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  label: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#888',
  },
  buttonGroup: {
    display: 'flex',
    gap: '4px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: '#333',
    color: '#fff',
  },
  buttonActive: {
    backgroundColor: '#f7931a',
    color: '#000',
  },
  previewSection: {
    padding: '40px',
  },
  previewLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: '#888',
    marginBottom: '16px',
  },
  previewContainer: {
    border: '1px solid #333',
    borderRadius: '8px',
    overflow: 'hidden',
    maxWidth: '1200px',
  },
  embedSection: {
    padding: '0 40px 40px',
  },
  embedHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  copyButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#f7931a',
    color: '#000',
    transition: 'all 0.2s ease',
  },
  codeBlock: {
    backgroundColor: '#0d0d0d',
    border: '1px solid #333',
    borderRadius: '8px',
    padding: '20px',
    fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#e0e0e0',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  },
  tag: {
    color: '#f7931a',
  },
  attr: {
    color: '#9cdcfe',
  },
  string: {
    color: '#ce9178',
  },
  comment: {
    color: '#6a9955',
  },
  statsBar: {
    display: 'flex',
    gap: '24px',
  },
  stat: {
    fontSize: '13px',
    color: '#888',
  },
  statValue: {
    color: '#fff',
    fontWeight: '600',
  },
};

function App() {
  const [ratio, setRatio] = useState('landscape');
  const [mode, setMode] = useState('tiered');
  const [copied, setCopied] = useState(false);

  const members = membersData.members;

  const hostUrl = 'https://nward21.github.io/bfc-member-collage-logos';

  const embedCode = `<!-- BFC Logo Grid Embed -->
<script src="${hostUrl}/bfc-logo-grid.js"></script>
<bfc-logo-grid
  ratio="${ratio}"
  mode="${mode}"
  data-url="${hostUrl}/members.json">
</bfc-logo-grid>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tierCounts = {
    founding: members.filter(m => m.tier === 'founding').length,
    chairmans_circle: members.filter(m => m.tier === 'chairmans_circle').length,
    executive: members.filter(m => m.tier === 'executive').length,
    premier: members.filter(m => m.tier === 'premier').length,
    industry: members.filter(m => m.tier === 'industry').length,
  };

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>BFC Logo Grid Workbench</h1>
          <p style={styles.subtitle}>Preview and generate embed codes for member logos</p>
        </div>
        <div style={styles.statsBar}>
          <span style={styles.stat}>Total: <span style={styles.statValue}>{members.length}</span></span>
          <span style={styles.stat}>Founding: <span style={styles.statValue}>{tierCounts.founding}</span></span>
          <span style={styles.stat}>Chairman's: <span style={styles.statValue}>{tierCounts.chairmans_circle}</span></span>
          <span style={styles.stat}>Executive: <span style={styles.statValue}>{tierCounts.executive}</span></span>
          <span style={styles.stat}>Premier: <span style={styles.statValue}>{tierCounts.premier}</span></span>
          <span style={styles.stat}>Industry: <span style={styles.statValue}>{tierCounts.industry}</span></span>
        </div>
      </header>

      <div style={styles.controls}>
        <div style={styles.controlGroup}>
          <span style={styles.label}>Layout</span>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.button,
                ...(ratio === 'landscape' ? styles.buttonActive : {}),
              }}
              onClick={() => setRatio('landscape')}
            >
              Landscape (16:9)
            </button>
            <button
              style={{
                ...styles.button,
                ...(ratio === 'square' ? styles.buttonActive : {}),
              }}
              onClick={() => setRatio('square')}
            >
              Square (1:1)
            </button>
          </div>
        </div>

        <div style={styles.controlGroup}>
          <span style={styles.label}>Mode</span>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.button,
                ...(mode === 'tiered' ? styles.buttonActive : {}),
              }}
              onClick={() => setMode('tiered')}
            >
              Tiered
            </button>
            <button
              style={{
                ...styles.button,
                ...(mode === 'alphabetical' ? styles.buttonActive : {}),
              }}
              onClick={() => setMode('alphabetical')}
            >
              Alphabetical
            </button>
          </div>
        </div>
      </div>

      <section style={styles.previewSection}>
        <div style={styles.previewLabel}>Live Preview</div>
        <div style={styles.previewContainer}>
          <BfcLogoGrid
            ratio={ratio}
            mode={mode}
            members={members}
            baseUrl=""
          />
        </div>
      </section>

      <section style={styles.embedSection}>
        <div style={styles.embedHeader}>
          <span style={styles.previewLabel}>Embed Code</span>
          <button style={styles.copyButton} onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy to Clipboard'}
          </button>
        </div>
        <pre style={styles.codeBlock}>
          <code>{embedCode}</code>
        </pre>
      </section>
    </div>
  );
}

export default App;
