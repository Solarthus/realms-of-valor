console.log("Game.js has started loading...");

// --- GAME CONFIG & DATA ---
const WEAPONS = [
  { id: 'fists', name: 'Unarmed', power: 1, cost: 0 },
  { id: 'knife', name: 'Iron Dagger', power: 3, cost: 100 },
  { id: 'sword', name: 'Short Sword', power: 8, cost: 500 },
  { id: 'longsword', name: 'Ranger Longsword', power: 20, cost: 2500 },
  { id: 'elven', name: 'Elven Blade', power: 45, cost: 12000 },
  { id: 'hammer', name: 'Dwarven Hammer', power: 80, cost: 60000 },
];

const ARMOR = [
  { id: 'clothes', name: 'Travelers Tunic', defense: 1, cost: 0 },
  { id: 'leather', name: 'Boiled Leather', defense: 5, cost: 200 },
  { id: 'chain', name: 'Steel Chainmail', defense: 12, cost: 1000 },
  { id: 'plate', name: 'Knights Plate', defense: 25, cost: 5000 },
  { id: 'mithril', name: 'Mithril Mail', defense: 50, cost: 20000 },
  { id: 'dragon', name: 'Dragon Scale', defense: 90, cost: 100000 },
];

const ZONES = [
  { id: 'fields', name: 'Green Fields', minLvl: 1, enemies: [
      { name: 'Garden Rat', level: 1, hp: 15, str: 2, def: 0, exp: 5, gold: 5 },
      { name: 'Hungry Wolf', level: 3, hp: 35, str: 6, def: 2, exp: 15, gold: 15 },
      { name: 'Road Bandit', level: 5, hp: 50, str: 10, def: 5, exp: 30, gold: 40 }
  ]},
  { id: 'forest', name: 'Ancient Forest', minLvl: 11, enemies: [
      { name: 'Giant Spider', level: 12, hp: 120, str: 20, def: 10, exp: 80, gold: 100 },
      { name: 'Forest Troll', level: 15, hp: 200, str: 30, def: 15, exp: 120, gold: 180 },
      { name: 'Corrupted Ent', level: 18, hp: 250, str: 40, def: 25, exp: 160, gold: 250 }
  ]},
  { id: 'caves', name: 'Goblin Caves', minLvl: 21, enemies: [
      { name: 'Goblin Scout', level: 22, hp: 300, str: 45, def: 20, exp: 250, gold: 350 },
      { name: 'Cave Bat', level: 25, hp: 280, str: 55, def: 15, exp: 300, gold: 400 },
      { name: 'Goblin King', level: 28, hp: 450, str: 65, def: 35, exp: 450, gold: 600 }
  ]},
  { id: 'hills', name: 'Barrow Hills', minLvl: 31, enemies: [
      { name: 'Restless Spirit', level: 32, hp: 500, str: 70, def: 40, exp: 600, gold: 800 },
      { name: 'Barrow Wight', level: 35, hp: 650, str: 85, def: 50, exp: 750, gold: 1000 },
      { name: 'Ancient King', level: 38, hp: 800, str: 100, def: 60, exp: 900, gold: 1200 }
  ]},
  { id: 'mines', name: 'Deep Mines', minLvl: 41, enemies: [
      { name: 'Orc Grunt', level: 42, hp: 1000, str: 120, def: 80, exp: 1200, gold: 1500 },
      { name: 'Cave Troll', level: 45, hp: 1400, str: 150, def: 100, exp: 1500, gold: 2000 },
      { name: 'Balrog Shadow', level: 48, hp: 1800, str: 180, def: 120, exp: 2000, gold: 3000 }
  ]},
  { id: 'peaks', name: 'Snowy Peaks', minLvl: 51, enemies: [
      { name: 'Frost Wolf', level: 52, hp: 2000, str: 200, def: 140, exp: 2500, gold: 3500 },
      { name: 'Ice Giant', level: 55, hp: 2500, str: 240, def: 180, exp: 3000, gold: 4500 },
      { name: 'Wyvern', level: 58, hp: 2200, str: 280, def: 150, exp: 3500, gold: 5000 }
  ]},
  { id: 'swamp', name: 'Dead Marshes', minLvl: 61, enemies: [
      { name: 'Marsh Ghoul', level: 62, hp: 3000, str: 320, def: 200, exp: 4500, gold: 6000 },
      { name: 'Will-o-Wisp', level: 65, hp: 2800, str: 380, def: 100, exp: 5000, gold: 7000 },
      { name: 'Hydra', level: 68, hp: 4000, str: 350, def: 250, exp: 6000, gold: 8000 }
  ]},
  { id: 'fortress', name: 'Iron Fortress', minLvl: 71, enemies: [
      { name: 'Uruk Berserker', level: 72, hp: 4500, str: 450, def: 300, exp: 7500, gold: 9000 },
      { name: 'Dark Sorcerer', level: 75, hp: 3800, str: 550, def: 200, exp: 8500, gold: 10000 },
      { name: 'War Elephant', level: 78, hp: 6000, str: 500, def: 400, exp: 10000, gold: 12000 }
  ]},
  { id: 'volcano', name: 'Ash Plains', minLvl: 81, enemies: [
      { name: 'Magma Sprite', level: 82, hp: 5500, str: 600, def: 350, exp: 12000, gold: 15000 },
      { name: 'Fire Drake', level: 85, hp: 7000, str: 700, def: 450, exp: 15000, gold: 20000 },
      { name: 'Obsidian Golem', level: 88, hp: 8000, str: 650, def: 600, exp: 18000, gold: 25000 }
  ]},
  { id: 'spire', name: 'The Dark Spire', minLvl: 91, enemies: [
      { name: 'Nazgul', level: 92, hp: 9000, str: 800, def: 500, exp: 25000, gold: 35000 },
      { name: 'Dark Lord', level: 95, hp: 12000, str: 900, def: 600, exp: 35000, gold: 50000 },
      { name: 'The Eye', level: 100, hp: 20000, str: 1200, def: 800, exp: 50000, gold: 100000 }
  ]}
];

// --- STATE MANAGEMENT ---
const state = {
    user: null,
    player: null,
    screen: 'loading',
    selectedZone: null,
    combat: null,
    logs: ['Welcome, Ranger. The world needs you.'],
    authForm: { email: '', password: '', name: '', isRegistering: false, error: '' },
    loading: true
};

function updateState(updates) {
    Object.assign(state, updates);
    render();
}

function addLog(msg) {
    state.logs.unshift(msg);
    if (state.logs.length > 10) state.logs.pop();
    render();
}

// --- HELPER: GET PLAYER REF ---
function getPlayerRef(uid) {
    const { doc } = window.FB;
    // FIXED: Removed 'profile' from the end. Now it is an even 4 segments.
    return doc(window.db, 'artifacts', window.appId, 'users', uid);
}

// --- DEFINE ACTIONS GLOBALLY ---
window.actions = {
    setAuthMode: (isReg) => {
        state.authForm.isRegistering = isReg;
        state.authForm.error = '';
        render();
    },
    
    handleLogin: async (e) => {
        e.preventDefault();
        console.log("Login submitted. Mode:", state.authForm.isRegistering ? "Register" : "Login");

        if(!window.FB) {
            alert("Error: Firebase not loaded yet. Check your connection.");
            return;
        }

        const { signInWithEmailAndPassword, createUserWithEmailAndPassword, setDoc } = window.FB;
        const form = document.getElementById('authForm');
        const email = form.email.value;
        const password = form.password.value;
        
        try {
            if (state.authForm.isRegistering) {
                const name = form.charName.value;
                const gender = form.gender.value;
                console.log("Attempting to create user...");
                
                const cred = await createUserWithEmailAndPassword(window.auth, email, password);
                console.log("User created:", cred.user.uid);

                const initialProfile = {
                    name: name,
                    gender: gender,
                    level: 1, exp: 0, expToNext: 100,
                    hp: 30, maxHp: 30,
                    energy: 50, maxEnergy: 50,
                    gold: 50,
                    str: 5, def: 5, spd: 5,
                    weaponId: 'fists', armorId: 'clothes',
                    wins: 0, losses: 0
                };
                
                // FIXED: Using helper with correct path
                await setDoc(getPlayerRef(cred.user.uid), initialProfile);
                console.log("Profile created!");
            } else {
                console.log("Attempting login...");
                await signInWithEmailAndPassword(window.auth, email, password);
                console.log("Login successful!");
            }
        } catch (err) {
            console.error("Auth Error:", err);
            alert("Login Failed: " + err.message);
            state.authForm.error = err.message;
            render();
        }
    },

    navigate: (screen) => { updateState({ screen }); },

    enterZone: (zoneId) => {
        const zone = ZONES.find(z => z.id === zoneId);
        if (state.player.level < zone.minLvl) {
            alert("You are not experienced enough for this region.");
            return;
        }
        updateState({ screen: 'zone', selectedZone: zone });
    },

    startCombat: (enemyIdx) => {
        const enemyTemplate = state.selectedZone.enemies[enemyIdx];
        if (state.player.energy < 3) { alert("You are too exhausted (Low Energy)."); return; }
        
        const { setDoc } = window.FB;
        // FIXED: Using helper
        const playerRef = getPlayerRef(state.user.uid);
        setDoc(playerRef, { energy: state.player.energy - 3 }, { merge: true });

        updateState({
            screen: 'combat',
            combat: {
                enemy: { ...enemyTemplate, maxHp: enemyTemplate.hp },
                log: [`A wild ${enemyTemplate.name} appears!`],
                round: 1
            }
        });
    },

    combatRound: async (action) => {
        if(action === 'flee') {
            addLog("You retreated to the shadows.");
            updateState({ screen: 'zone', combat: null });
            return;
        }

        const { player, combat } = state;
        const enemy = combat.enemy;
        const weapon = WEAPONS.find(w => w.id === player.weaponId);
        
        let log = [...combat.log];
        let pDmg = Math.floor((player.str + weapon.power) - (enemy.def / 2));
        if (pDmg < 1) pDmg = 1;
        
        let eDmg = Math.floor(enemy.str - (player.def / 2));
        if (eDmg < 1) eDmg = 1;

        enemy.hp -= pDmg;
        log.unshift(`You struck the ${enemy.name} for ${pDmg}.`);

        if (enemy.hp <= 0) {
            const { setDoc } = window.FB;
            // FIXED: Using helper
            const playerRef = getPlayerRef(state.user.uid);
            
            let newExp = player.exp + enemy.exp;
            let newLevel = player.level;
            let newMaxHp = player.maxHp;
            let msg = `Victory! Looted ${enemy.gold} gold.`;

            if(newExp >= player.expToNext) {
                newLevel++;
                newExp = newExp - player.expToNext;
                newMaxHp += 15;
                msg += " LEVEL UP!";
            }

            await setDoc(playerRef, {
                gold: player.gold + enemy.gold,
                exp: newExp,
                level: newLevel,
                maxHp: newMaxHp,
                wins: player.wins + 1
            }, { merge: true });
            
            addLog(msg);
            updateState({ screen: 'zone', combat: null });
            return;
        }

        let newHp = player.hp - eDmg;
        log.unshift(`The ${enemy.name} attacks you for ${eDmg}.`);

        if (newHp <= 0) {
            const { setDoc } = window.FB;
            // FIXED: Using helper
            const playerRef = getPlayerRef(state.user.uid);
            await setDoc(playerRef, { hp: 0, losses: player.losses + 1 }, { merge: true });
            
            addLog("You have fallen in battle.");
            updateState({ screen: 'home', combat: null });
            return;
        }

        const { setDoc } = window.FB;
        // FIXED: Using helper
        const playerRef = getPlayerRef(state.user.uid);
        setDoc(playerRef, { hp: newHp }, { merge: true });

        updateState({
            combat: {
                ...combat,
                enemy,
                log
            }
        });
    },

    heal: async () => {
        const cost = state.player.maxHp - state.player.hp;
        if(state.player.gold < cost) return;
        
        const { setDoc } = window.FB;
        // FIXED: Using helper
        const playerRef = getPlayerRef(state.user.uid);
        await setDoc(playerRef, { hp: state.player.maxHp, gold: state.player.gold - cost }, { merge: true });
    },
    
    buyItem: async (type, itemId) => {
        const player = state.player;
        const list = type === 'weapon' ? WEAPONS : ARMOR;
        const item = list.find(i => i.id === itemId);
        
        if (player.gold < item.cost) { alert("Not enough gold."); return; }
        
        const { setDoc } = window.FB;
        // FIXED: Using helper
        const playerRef = getPlayerRef(state.user.uid);
        
        const updates = { gold: player.gold - item.cost };
        if (type === 'weapon') updates.weaponId = itemId;
        else updates.armorId = itemId;
        
        await setDoc(playerRef, updates, { merge: true });
        addLog(`Acquired: ${item.name}`);
    },

    logout: () => {
        window.FB.signOut(window.auth);
        window.location.reload();
    }
};

// --- FIREBASE LISTENERS ---
window.addEventListener('firebase-ready', () => {
    console.log("Firebase is ready in game.js");
    const { onAuthStateChanged, onSnapshot, setDoc } = window.FB;
    
    onAuthStateChanged(window.auth, (u) => {
        state.user = u;
        if (!u) {
            updateState({ screen: 'auth', loading: false });
        } else {
            console.log("User logged in:", u.uid);
            // FIXED: Using helper
            const docRef = getPlayerRef(u.uid);
            onSnapshot(docRef, (snap) => {
                if (snap.exists()) {
                    state.player = snap.data();
                    if(state.screen === 'loading' || state.screen === 'auth') {
                        state.screen = 'home';
                    }
                    updateState({ loading: false });
                    
                    if(!window.regenInterval) {
                        window.regenInterval = setInterval(() => {
                            if(state.player && state.player.energy < state.player.maxEnergy) {
                                const newEnergy = state.player.energy + 1;
                                setDoc(docRef, { energy: newEnergy }, { merge: true });
                            }
                        }, 10000);
                    }
                } else {
                    console.log("User exists, but profile not found.");
                    updateState({ player: null, screen: 'auth' });
                }
            });
        }
    });
});

// --- RENDER ---
function render() {
    const app = document.getElementById('app');
    
    if (state.screen === 'loading') {
        app.innerHTML = `<div class="loading-screen"><div class="loading-text">Forging Realm...</div></div>`;
        return;
    }

    if (state.screen === 'auth') {
        app.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <h1 style="margin-bottom:20px;">Realms of Valor</h1>
                <form id="authForm" onsubmit="window.actions.handleLogin(event)">
                    ${state.authForm.error ? `<div style="color:red; margin-bottom:10px;">${state.authForm.error}</div>` : ''}
                    <input name="email" type="email" placeholder="Email" required class="input-field">
                    <input name="password" type="password" placeholder="Password" required class="input-field">
                    
                    ${state.authForm.isRegistering ? `
                        <input name="charName" type="text" placeholder="Hero Name" required class="input-field">
                        <select name="gender" class="input-field">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    ` : ''}
                    
                    <button type="submit" class="btn btn-primary btn-full">
                        ${state.authForm.isRegistering ? 'Create Hero' : 'Load Game'}
                    </button>
                </form>
                <div style="margin-top:15px; font-size: 0.8rem; cursor:pointer;" onclick="window.actions.setAuthMode(!state.authForm.isRegistering)">
                    ${state.authForm.isRegistering ? 'Already have a hero? Login' : 'Need a hero? Register'}
                </div>
            </div>
        </div>`;
        return;
    }

    const player = state.player;
    if (!player) return;

    let contentHtml = '';

    // --- HOME SCREEN ---
    if (state.screen === 'home') {
        const weaponName = WEAPONS.find(w => w.id === player.weaponId).name;
        const armorName = ARMOR.find(a => a.id === player.armorId).name;
        contentHtml = `
            <div style="max-width: 600px; margin: 0 auto;">
                <div class="card text-center">
                    ${getCharacterHTML(player.gender, player.armorId, player.weaponId)}
                    <h2 style="border:none;">${player.name}</h2>
                    <div class="sub-text">Level ${player.level} Ranger</div>
                    
                    <div class="card" style="margin-top: 20px; text-align: left; background: #f5f5f4;">
                        <div class="grid-2">
                            <div><div class="sub-text">Strength</div> <b>${player.str}</b></div>
                            <div><div class="sub-text">Defense</div> <b>${player.def}</b></div>
                            <div><div class="sub-text">Health</div> <b style="color:var(--c-success)">${player.hp}/${player.maxHp}</b></div>
                            <div><div class="sub-text">Exp</div> <b style="color:var(--c-primary)">${player.exp}/${player.expToNext}</b></div>
                            <div style="grid-column: span 2; padding-top:10px; border-top:1px solid #d6d3d1;">
                                <div class="sub-text">Equipment</div>
                                <b>${weaponName}</b> & <b>${armorName}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- MAP SCREEN ---
    else if (state.screen === 'map') {
        contentHtml = `
        <h2>World Map</h2>
        <div class="grid-list">`;
        ZONES.forEach(zone => {
            const locked = player.level < zone.minLvl;
            contentHtml += `
                <div onclick="${locked ? '' : `window.actions.enterZone('${zone.id}')`}" 
                     class="card" 
                     style="cursor: ${locked ? 'default' : 'pointer'}; opacity: ${locked ? '0.6' : '1'}; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <div style="font-weight:bold; font-size:1.1rem; color: ${locked ? '#a8a29e' : 'var(--c-text)'}">${zone.name}</div>
                        <div class="sub-text">Lvl ${zone.minLvl}+</div>
                    </div>
                    ${locked ? '<i data-lucide="lock" style="color:#d6d3d1"></i>' : '<i data-lucide="compass" style="color:var(--c-primary)"></i>'}
                </div>`;
        });
        contentHtml += `</div>`;
    }

    // --- ZONE SCREEN ---
    else if (state.screen === 'zone') {
        contentHtml = `
            <div class="flex-between" style="margin-bottom: 20px;">
                <div>
                    <h2>${state.selectedZone.name}</h2>
                    <div class="sub-text">Enemies Ahead</div>
                </div>
                <button onclick="window.actions.navigate('map')" class="btn btn-secondary">Retreat</button>
            </div>
            <div class="grid-list">
                ${state.selectedZone.enemies.map((e, idx) => `
                    <div class="card flex-between">
                        <div class="flex-center">
                            <div style="width:30px; height:30px; background:#e5e5e5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:15px;">${e.level}</div>
                            <div>
                                <div style="font-weight:bold;">${e.name}</div>
                                <div class="sub-text">HP: ${e.hp}</div>
                            </div>
                        </div>
                        <button onclick="window.actions.startCombat(${idx})" class="btn btn-primary">Fight</button>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // --- SHOP SCREEN ---
    else if (state.screen === 'shop') {
        const type = state.shopType || 'weapon';
        const items = type === 'weapon' ? WEAPONS : ARMOR;
        const currentId = type === 'weapon' ? player.weaponId : player.armorId;
        
        contentHtml = `
            <div style="display:flex; gap:10px; justify-content:center; margin-bottom:20px;">
                <button onclick="state.shopType='weapon'; render()" class="btn ${type==='weapon' ? 'btn-primary' : 'btn-secondary'}">Blacksmith</button>
                <button onclick="state.shopType='armor'; render()" class="btn ${type==='armor' ? 'btn-primary' : 'btn-secondary'}">Armorer</button>
            </div>
            <div class="grid-list">
                ${items.map(item => {
                    const owned = item.id === currentId;
                    return `
                    <div class="card text-center" style="${owned ? 'border-color:var(--c-success); background:#f0fdf4;' : ''}">
                        ${owned ? '<div style="color:var(--c-success); font-size:0.7rem; text-transform:uppercase; font-weight:bold; margin-bottom:5px;">Equipped</div>' : ''}
                        <h3>${item.name}</h3>
                        <div class="sub-text" style="margin: 10px 0;">${type === 'weapon' ? 'Power' : 'Defense'}: ${type === 'weapon' ? item.power : item.defense}</div>
                        <button onclick="window.actions.buyItem('${type}', '${item.id}')" ${owned ? 'disabled' : ''} 
                            class="btn ${owned ? 'btn-success' : 'btn-secondary'} btn-full">
                            ${owned ? 'Owned' : `${item.cost} Gold`}
                        </button>
                    </div>`
                }).join('')}
            </div>
        `;
    }

    // --- COMBAT SCREEN ---
    else if (state.screen === 'combat') {
        const { enemy, log } = state.combat;
        contentHtml = `
            <div style="max-width: 500px; margin: 0 auto;">
                <div class="combat-scene">
                    <div class="scene-flex">
                        <div class="text-center">
                            <div class="sub-text">Ranger</div>
                            ${getCharacterHTML(player.gender, player.armorId, player.weaponId)}
                            <div style="font-weight:bold; color:var(--c-success);">${player.hp} HP</div>
                        </div>
                        <div class="vs-text">vs</div>
                        <div class="text-center">
                            <div class="sub-text">${enemy.name}</div>
                            ${getEnemyPortraitHTML(enemy.name)}
                            <div style="font-weight:bold; color:var(--c-danger);">${enemy.hp} HP</div>
                        </div>
                    </div>
                </div>
                
                <div class="log-box" style="margin-bottom: 20px;">
                    ${log.map(l => `<div class="log-entry">> ${l}</div>`).join('')}
                </div>

                <div class="grid-2">
                    <button onclick="window.actions.combatRound('attack')" class="btn btn-danger btn-full" style="padding: 15px;">Attack</button>
                    <button onclick="window.actions.combatRound('flee')" class="btn btn-secondary btn-full" style="padding: 15px;">Flee</button>
                </div>
            </div>
        `;
    }

    // --- HOSPITAL SCREEN ---
    else if (state.screen === 'hospital') {
        const cost = player.maxHp - player.hp;
        contentHtml = `
            <div class="card text-center" style="max-width:400px; margin: 0 auto; padding: 40px;">
                <i data-lucide="tent" style="width: 64px; height: 64px; color: var(--c-success); margin-bottom: 20px;"></i>
                <h2>Ranger's Camp</h2>
                <p style="color:var(--c-text-muted); margin-bottom: 30px;">Rest by the fire to mend your wounds.</p>
                
                <div style="font-size: 2rem; font-weight: bold; color: var(--c-success); margin-bottom: 30px;">
                    ${player.hp} <span style="font-size: 1.2rem; color: #d6d3d1;">/ ${player.maxHp}</span>
                </div>
                
                <button onclick="window.actions.heal()" ${cost === 0 ? 'disabled' : ''} class="btn btn-success btn-full">
                    ${cost === 0 ? 'Fully Rested' : `Rest (${cost} Gold)`}
                </button>
            </div>
        `;
    }

    // --- MASTER LAYOUT ---
    app.innerHTML = `
    <div class="app-container">
        <div class="sidebar">
            <div style="padding: 20px; text-align: center; border-bottom: 1px solid #292524;">
                <h1 style="color: var(--c-primary); font-size: 1.1rem;">REALMS OF VALOR</h1>
            </div>
            <nav style="flex: 1; padding-top: 20px;">
                <button onclick="window.actions.navigate('home')" class="nav-btn"><i data-lucide="castle"></i> Character</button>
                <button onclick="window.actions.navigate('map')" class="nav-btn"><i data-lucide="map"></i> World Map</button>
                <button onclick="window.actions.navigate('shop')" class="nav-btn"><i data-lucide="hammer"></i> Blacksmith</button>
                <button onclick="window.actions.navigate('hospital')" class="nav-btn"><i data-lucide="tent"></i> Campfire</button>
                <div style="margin: 20px; border-top: 1px solid #292524;"></div>
                <button onclick="window.actions.logout()" class="nav-btn" style="color: #ef4444;"><i data-lucide="log-out"></i> Depart</button>
            </nav>
        </div>

        <div class="main-content">
            <div class="top-bar">
                <div class="stat-tag hp"><i data-lucide="heart" width="14" style="margin-right:5px"></i> ${player.hp}</div>
                <div class="stat-tag en"><i data-lucide="zap" width="14" style="margin-right:5px"></i> ${player.energy}</div>
                <div class="stat-tag gold"><span style="margin-right:5px">●</span> ${player.gold}</div>
                <div class="stat-tag">Lvl ${player.level}</div>
            </div>

            <div class="scroll-area">
                ${contentHtml}
            </div>
            
            <div class="log-box" style="height: 100px; flex-shrink: 0; border-top: 1px solid var(--border-strong);">
                ${state.logs.map(l => `<div class="log-entry">> ${l}</div>`).join('')}
            </div>
        </div>
    </div>
    `;

    if(window.lucide) window.lucide.createIcons();
}

console.log("Game.js loaded. Initializing render...");
render();
