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
  fixedSize = null,
}) {
  const isFixed = fixedSize !== null;
  const scale = isFixed ? (fixedSize.width / 1000) : 1;

  const styles = {
    container: {
      backgroundColor: '#000',
      padding: `${40 * scale}px`,
      width: isFixed ? `${fixedSize.width}px` : '100%',
      height: isFixed ? `${fixedSize.height}px` : undefined,
      aspectRatio: isFixed ? undefined : (ratio === 'landscape' ? '16 / 9' : '1 / 1'),
      boxSizing: 'border-box',
    },
    tierSection: {
      marginBottom: `${32 * scale}px`,
    },
    tierLabel: {
      color: '#fff',
      fontSize: `${14 * scale}px`,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: `${2 * scale}px`,
      marginBottom: `${16 * scale}px`,
      paddingBottom: `${8 * scale}px`,
      borderBottom: '1px solid rgba(255,255,255,0.2)',
    },
    logoGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${150 * scale}px, 1fr))`,
      gap: `${24 * scale}px ${16 * scale}px`,
      alignItems: 'center',
      justifyItems: 'start',
    },
    logoGridTopTier: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: `${24 * scale}px ${40 * scale}px`,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    logoItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
      maxHeight: `${40 * scale}px`,
      maxWidth: `${120 * scale}px`,
      objectFit: 'contain',
    },
    logoImgLarge: {
      maxHeight: `${48 * scale}px`,
      maxWidth: `${144 * scale}px`,
      objectFit: 'contain',
    },
    logoPlaceholder: {
      color: '#fff',
      fontSize: `${14 * scale}px`,
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

    return (
      <div style={styles.container}>
        {tierOrder.map(tier => {
          const tierMembers = grouped[tier];
          if (!tierMembers || tierMembers.length === 0) return null;
          const isLarge = largeTiers.includes(tier);
          const isSingleRow = singleRowTiers.includes(tier);

          return (
            <div key={tier} style={styles.tierSection}>
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
