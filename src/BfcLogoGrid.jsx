import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    backgroundColor: '#000',
    padding: '40px',
    width: '100%',
  },
  landscape: {
    aspectRatio: '16 / 9',
  },
  square: {
    aspectRatio: '1 / 1',
  },
  tierSection: {
    marginBottom: '32px',
  },
  tierLabel: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '16px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  logoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '24px 16px',
    alignItems: 'center',
    justifyItems: 'start',
  },
  logoGridTopTier: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '24px 40px',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logoItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoItemFounding: {},
  logoImg: {
    maxHeight: '40px',
    maxWidth: '120px',
    objectFit: 'contain',
  },
  logoImgLarge: {
    maxHeight: '48px',
    maxWidth: '144px',
    objectFit: 'contain',
  },
  logoPlaceholder: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
};

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
  baseUrl = ''
}) {
  const containerStyle = {
    ...styles.container,
    ...(ratio === 'landscape' ? styles.landscape : styles.square),
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
      style={{
        ...styles.logoItem,
        ...(member.is_founding ? styles.logoItemFounding : {}),
      }}
      title={member.name}
    >
      {member.logo_url ? (
        <img
          src={getLogoUrl(member.logo_url)}
          alt={member.name}
          style={{
            ...styles.logoImg,
            ...(isLarge ? styles.logoImgLarge : {}),
          }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
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
      <div style={containerStyle}>
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
    <div style={containerStyle}>
      <div style={styles.logoGrid}>
        {sortedMembers.map(m => renderLogo(m, m.is_founding))}
      </div>
    </div>
  );
}

export default BfcLogoGrid;
