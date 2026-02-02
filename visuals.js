function getCharacterHTML(gender, armorId, weaponId) {
    const skinColor = "#ffdbac";
    const isFemale = gender === 'female';
    
    // Ranger / Knight Colors
    let armorFill = '#d6d3d1'; // Default tunic
    let armorStroke = '#78716c';
    
    if(armorId === 'leather') { armorFill = '#92400e'; armorStroke = '#451a03'; } 
    if(armorId === 'chain') { armorFill = '#94a3b8'; armorStroke = '#475569'; } 
    if(armorId === 'plate') { armorFill = '#e2e8f0'; armorStroke = '#64748b'; } 
    if(armorId === 'mithril') { armorFill = '#e0f2fe'; armorStroke = '#38bdf8'; } 
    if(armorId === 'dragon') { armorFill = '#1e293b'; armorStroke = '#000'; } 

    // Weapon Paths
    let weaponSvg = '';
    if(weaponId === 'knife') weaponSvg = '<path d="M16 42 L16 34 L18 32 L20 34 L20 42 Z" fill="#78716c" />'; 
    if(weaponId === 'sword') weaponSvg = '<g><path d="M18 42 L18 15 L20 12 L22 15 L22 42" fill="#cbd5e1" stroke="#475569" stroke-width="0.5" /><rect x="14" y="32" width="12" height="2" fill="#451a03"/></g>'; 
    if(weaponId === 'longsword') weaponSvg = '<path d="M18 45 L18 5" stroke="#94a3b8" stroke-width="2.5" /><path d="M14 35 L22 35" stroke="#451a03" stroke-width="2" />'; 
    if(weaponId === 'elven') weaponSvg = '<path d="M18 42 Q 12 25 24 10" stroke="#fbbf24" stroke-width="1.5" fill="none" />'; 
    if(weaponId === 'hammer') weaponSvg = '<g><rect x="17" y="15" width="2" height="30" fill="#451a03" /><rect x="12" y="10" width="12" height="8" fill="#57534e" /></g>'; 

    const bodyPath = isFemale 
        ? '<g><path d="M24 16 Q 32 4 40 16 L 42 30 Q 32 32 22 30 Z" fill="#166534" /></g>' 
        : '<path d="M24 16 Q 32 8 40 16 L 39 12 Q 32 6 25 12 Z" fill="#166534" />'; 

    return `
    <div style="position: relative; display: flex; justify-content: center; margin-bottom: 10px;">
      <svg width="120" height="140" viewBox="0 0 64 64" style="filter: drop-shadow(0 4px 4px rgba(0,0,0,0.2));">
        <ellipse cx="32" cy="55" rx="15" ry="3" fill="rgba(0,0,0,0.2)" />
        <rect x="26" y="40" width="5" height="20" fill="#292524" />
        <rect x="33" y="40" width="5" height="20" fill="#292524" />
        <path d="M22 22 L42 22 L40 42 L24 42 Z" fill="${armorFill}" stroke="${armorStroke}" stroke-width="1" />
        <circle cx="32" cy="18" r="7" fill="${skinColor}" />
        ${bodyPath}
        <rect x="29" y="17" width="2" height="2" fill="#292524" />
        <rect x="33" y="17" width="2" height="2" fill="#292524" />
        <circle cx="18" cy="34" r="3" fill="${skinColor}" />
        <g transform="translate(-2, -4) rotate(-10 18 34)">${weaponSvg}</g>
        <circle cx="46" cy="34" r="3" fill="${skinColor}" />
      </svg>
    </div>
    `;
}

function getEnemyPortraitHTML(name) {
    return `
    <div style="position: relative; display: flex; justify-content: center;">
        <div style="width: 100px; height: 120px; border-radius: 4px; border: 4px solid rgba(120, 53, 15, 0.4); background: #e5e5e5; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
            <div style="opacity: 0.6; color: #57534e;"><i data-lucide="skull" size="48"></i></div>
            <div style="position: absolute; bottom: 0; width: 100%; background: rgba(28, 25, 23, 0.9); padding: 4px 0; text-align: center; border-top: 1px solid #78350f;">
                <span style="font-size: 10px; font-weight: bold; color: #f59e0b; font-family: serif; text-transform: uppercase; letter-spacing: 1px;">${name}</span>
            </div>
        </div>
    </div>
    `;
}