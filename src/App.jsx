import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { BfcLogoGrid } from './BfcLogoGrid';
import { MemberEditor } from './MemberEditor';
import membersData from '../members.json';

const PNG_SIZES = {
  landscape: { width: 1600, height: 900 },
  square: { width: 1500, height: 1500 },
};

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
  editButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: '#3b82f6',
    color: '#fff',
    marginLeft: 'auto',
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
  statsBar: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  stat: {
    fontSize: '13px',
    color: '#888',
  },
  statValue: {
    color: '#fff',
    fontWeight: '600',
  },
  pngSection: {
    padding: '0 40px 40px',
  },
  pngGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    maxWidth: '600px',
  },
  pngButton: {
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #444',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  pngButtonLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  pngButtonDesc: {
    fontSize: '12px',
    color: '#888',
  },
  hiddenRender: {
    position: 'fixed',
    left: '-9999px',
    top: 0,
    pointerEvents: 'none',
    zIndex: -1,
  },
};

function App() {
  const [ratio, setRatio] = useState('landscape');
  const [mode, setMode] = useState('tiered');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [members, setMembers] = useState(membersData.members);
  const [pngRender, setPngRender] = useState(null);

  const pngRef = useRef(null);

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

  const generatePNG = async (targetRatio, targetMode) => {
    const key = `${targetRatio}-${targetMode}`;
    setGenerating(key);

    const size = PNG_SIZES[targetRatio];

    // Set up the hidden render
    setPngRender({ ratio: targetRatio, mode: targetMode, size });

    // Wait for render and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (pngRef.current) {
      try {
        const canvas = await html2canvas(pngRef.current, {
          backgroundColor: '#000',
          scale: 1,
          width: size.width,
          height: size.height,
          useCORS: true,
          allowTaint: true,
        });

        const link = document.createElement('a');
        link.download = `bfc-members-${targetRatio}-${targetMode}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error('Failed to generate PNG:', err);
      }
    }

    setPngRender(null);
    setGenerating(null);
  };

  const handleSaveMembers = (updatedMembers) => {
    setMembers(updatedMembers);
    setEditMode(false);
  };

  const tierCounts = {
    founding: members.filter(m => m.tier === 'founding').length,
    chairmans_circle: members.filter(m => m.tier === 'chairmans_circle').length,
    executive: members.filter(m => m.tier === 'executive').length,
    premier: members.filter(m => m.tier === 'premier').length,
    industry: members.filter(m => m.tier === 'industry').length,
  };

  const pngOptions = [
    { ratio: 'landscape', mode: 'tiered', label: 'Landscape Tiered', desc: '1600×900 with tier labels' },
    { ratio: 'landscape', mode: 'alphabetical', label: 'Landscape Alphabetical', desc: '1600×900 sorted A-Z' },
    { ratio: 'square', mode: 'tiered', label: 'Square Tiered', desc: '1500×1500 with tier labels' },
    { ratio: 'square', mode: 'alphabetical', label: 'Square Alphabetical', desc: '1500×1500 sorted A-Z' },
  ];

  if (editMode) {
    return (
      <div style={styles.dashboard}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>BFC Logo Grid Workbench</h1>
            <p style={styles.subtitle}>Drag and drop to reorganize members</p>
          </div>
        </header>
        <MemberEditor
          members={members}
          tiers={membersData.tiers}
          onSave={handleSaveMembers}
          onCancel={() => setEditMode(false)}
        />
      </div>
    );
  }

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

        <button
          style={styles.editButton}
          onClick={() => setEditMode(true)}
        >
          Edit Members
        </button>
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

      <section style={styles.pngSection}>
        <div style={styles.previewLabel}>Download PNG</div>
        <div style={styles.pngGrid}>
          {pngOptions.map(opt => (
            <button
              key={`${opt.ratio}-${opt.mode}`}
              style={styles.pngButton}
              onClick={() => generatePNG(opt.ratio, opt.mode)}
              disabled={generating !== null}
            >
              <span style={styles.pngButtonLabel}>
                {generating === `${opt.ratio}-${opt.mode}` ? 'Generating...' : opt.label}
              </span>
              <span style={styles.pngButtonDesc}>{opt.desc}</span>
            </button>
          ))}
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

      {/* Hidden render target for PNG generation */}
      {pngRender && (
        <div style={styles.hiddenRender} ref={pngRef}>
          <BfcLogoGrid
            ratio={pngRender.ratio}
            mode={pngRender.mode}
            members={members}
            baseUrl=""
            fixedSize={pngRender.size}
          />
        </div>
      )}
    </div>
  );
}

export default App;
