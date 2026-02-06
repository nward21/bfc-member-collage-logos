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
  const isFixed = fixedSize !== null;
  const width = fixedSize?.width || (ratio === 'landscape' ? 1600 : 1500);
  const height = fixedSize?.height || (ratio === 'landscape' ? 900 : 1500);

  // Scale factors based on container size
  const scaleFactor = isFixed ? width / 1200 : 1;

  const styles = {
    container: {
      backgroundColor: '#000',
      padding: `${40 * scaleFactor}px`,
      width: isFixed ? `${width}px` : '100%',
      height: isFixed ? `${height}px` : 'auto',
      aspectRatio: isFixed ? undefined : (ratio === 'landscape' ? '16 / 9' : '1 / 1'),
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    tierSection: {
      marginBottom: isFixed ? 0 : `${24 * scaleFactor}px`,
      flex: mode === 'tiered' ? 1 : undefined,
      display: 'flex',
      flexDirection: 'column',
    },
    tierLabel: {
      color: '#fff',
      fontSize: `${14 * scaleFactor}px`,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: `${2 * scaleFactor}px`,
      marginBottom: `${12 * scaleFactor}px`,
      paddingBottom: `${8 * scaleFactor}px`,
      borderBottom: '1px solid rgba(255,255,255,0.2)',
      flexShrink: 0,
    },
    logoRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: `${16 * scaleFactor}px`,
      alignItems: 'center',
      justifyContent: 'flex-start',
      flex: 1,
      alignContent: 'center',
    },
    logoRowSpread: {
      display: 'flex',
      flexWrap: 'wrap',
      rowGap: `${20 * scaleFactor}px`,
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
      alignContent: 'center',
    },
    logoItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoImg: {
      maxHeight: `${40 * scaleFactor}px`,
      maxWidth: `${120 * scaleFactor}px`,
      objectFit: 'contain',
    },
    logoImgLarge: {
      maxHeight: `${50 * scaleFactor}px`,
      maxWidth: `${150 * scaleFactor}px`,
      objectFit: 'contain',
    },
    logoPlaceholder: {
      color: '#fff',
      fontSize: `${14 * scaleFactor}px`,
      fontWeight: '500',
      whiteSpace: 'nowrap',
    },
    alphabeticalGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: `${20 * scaleFactor}px`,
      alignItems: 'center',
      justifyContent: 'space-between',
      alignContent: 'space-between',
      flex: 1,
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
              <div style={isSingleRow ? styles.logoRow : styles.logoRowSpread}>
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
      <div style={styles.alphabeticalGrid}>
        {sortedMembers.map(m => renderLogo(m, m.is_founding))}
      </div>
    </div>
  );
}

export default BfcLogoGrid;
