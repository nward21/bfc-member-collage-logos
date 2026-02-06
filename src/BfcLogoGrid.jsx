import React from 'react';

const tierOrder = ['founding', 'chairmans_circle', 'executive', 'premier', 'industry'];

const tierLabels = {
  founding: 'Founding Members',
  chairmans_circle: "Chairman's Circle",
  executive: 'Executive Members',
  premier: 'Premier Members',
  industry: 'Industry Members',
};

export function BfcLogoGrid({
  ratio = 'landscape',
  mode = 'tiered',
  members = [],
  baseUrl = '',
  fixedSize = null, // { width, height } for PNG export
}) {
  // Base scale for normal display
  const baseWidth = 1000;
  const scale = fixedSize ? (fixedSize.width / baseWidth) : 1;

  // For fixed size, we need tighter spacing to fit content
  const isFixed = !!fixedSize;
  const spacingMultiplier = isFixed ? 0.6 : 1;

  const styles = {
    container: {
      backgroundColor: '#000',
      padding: `${32 * scale * spacingMultiplier}px`,
      width: fixedSize ? `${fixedSize.width}px` : '100%',
      height: fixedSize ? `${fixedSize.height}px` : undefined,
      aspectRatio: fixedSize ? undefined : (ratio === 'landscape' ? '16 / 9' : '1 / 1'),
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
    tierSection: {
      marginBottom: `${20 * scale * spacingMultiplier}px`,
    },
    tierSectionLast: {
      marginBottom: 0,
    },
    tierLabel: {
      color: '#fff',
      fontSize: `${(isFixed ? 12 : 14) * scale}px`,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: `${1.5 * scale}px`,
      marginBottom: `${10 * scale * spacingMultiplier}px`,
      paddingBottom: `${6 * scale * spacingMultiplier}px`,
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    },
    logoGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${(isFixed ? 120 : 150) * scale}px, 1fr))`,
      gap: `${16 * scale * spacingMultiplier}px ${12 * scale * spacingMultiplier}px`,
      alignItems: 'center',
      justifyItems: 'start',
    },
    logoGridTopTier: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: `${16 * scale * spacingMultiplier}px ${30 * scale * spacingMultiplier}px`,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logoItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
      maxHeight: `${(isFixed ? 32 : 40) * scale}px`,
      maxWidth: `${(isFixed ? 100 : 120) * scale}px`,
      objectFit: 'contain',
    },
    logoImgLarge: {
      maxHeight: `${(isFixed ? 38 : 48) * scale}px`,
      maxWidth: `${(isFixed ? 120 : 144) * scale}px`,
      objectFit: 'contain',
    },
    logoPlaceholder: {
      color: '#fff',
      fontSize: `${(isFixed ? 11 : 14) * scale}px`,
      fontWeight: '500',
      whiteSpace: 'nowrap',
    },
  };

  const getLogoUrl = (logoPath) => {
    if (logoPath.startsWith('http')) return logoPath;
    return baseUrl ? `${baseUrl}/${logoPath}` : logoPath;
  };

  const sortMembers = (memberList) => {
    if (mode === 'alphabetical') {
      const founding = memberList.filter(m => m.is_founding);
      const nonFounding = memberList
        .filter(m => !m.is_founding)
        .sort((a, b) => a.name.localeCompare(b.name));
      return [...founding, ...nonFounding];
    }
    return memberList;
  };

  const groupByTier = (memberList) => {
    const groups = {};
    tierOrder.forEach(tier => {
      groups[tier] = memberList.filter(m => m.tier === tier);
    });
    return groups;
  };

  const renderLogo = (member, isLarge = false) => (
    <div
      key={member.name}
      style={styles.logoItem}
      title={member.name}
    >
      {member.logo_url ? (
        <img
          src={getLogoUrl(member.logo_url)}
          alt={member.name}
          style={isLarge ? styles.logoImgLarge : styles.logoImg}
          crossOrigin="anonymous"
          onError={(e) => {
            e.target.style.display = 'none';
            if (e.target.nextSibling) {
              e.target.nextSibling.style.display = 'block';
            }
          }}
        />
      ) : null}
      <span
        style={{
          ...styles.logoPlaceholder,
          display: member.logo_url ? 'none' : 'block',
        }}
      >
        {member.name}
      </span>
    </div>
  );

  if (mode === 'tiered') {
    const grouped = groupByTier(members);
    const largeTiers = ['founding', 'chairmans_circle'];
    const singleRowTiers = ['founding', 'chairmans_circle', 'premier', 'industry'];
    const activeTiers = tierOrder.filter(t => grouped[t]?.length > 0);

    return (
      <div style={styles.container}>
        {tierOrder.map((tier) => {
          const tierMembers = grouped[tier];
          if (!tierMembers || tierMembers.length === 0) return null;
          const isLarge = largeTiers.includes(tier);
          const isSingleRow = singleRowTiers.includes(tier);
          const isLast = tier === activeTiers[activeTiers.length - 1];

          return (
            <div key={tier} style={isLast ? styles.tierSectionLast : styles.tierSection}>
              <div style={styles.tierLabel}>{tierLabels[tier]}</div>
              <div style={isSingleRow ? styles.logoGridTopTier : styles.logoGrid}>
                {tierMembers.map(m => renderLogo(m, isLarge))}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Alphabetical mode
  const sortedMembers = sortMembers(members);

  return (
    <div style={styles.container}>
      <div style={styles.logoGrid}>
        {sortedMembers.map(m => renderLogo(m, m.is_founding))}
      </div>
    </div>
  );
}

export default BfcLogoGrid;
