console.log("Game.js has started loading...");

// --- AUDIO ENGINE ---
const AudioController = {
    ctx: null,
    musicOn: false,
    sfxOn: true,
    currentTheme: null,
    osc: [],
    timer: null,

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    toggleMusic() {
        this.musicOn = !this.musicOn;
        if (this.musicOn) {
            this.init();
            this.playTheme(state.screen);
        } else {
            this.stopMusic();
        }
        render();
    },

    playSFX(type) {
        if (!this.sfxOn || !this.ctx) return;
        this.init();
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        const now = this.ctx.currentTime;
        
        if (type === 'click') {
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(800, now); 
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1); 
            gain.gain.setValueAtTime(0.1, now); 
            gain.gain.linearRampToValueAtTime(0, now + 0.1); 
            osc.start(now); 
            osc.stop(now + 0.1);
        } else if (type === 'attack') {
            osc.type = 'sawtooth'; 
            osc.frequency.setValueAtTime(100, now); 
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.15); 
            gain.gain.setValueAtTime(0.2, now); 
            gain.gain.linearRampToValueAtTime(0, now + 0.15); 
            osc.start(now); 
            osc.stop(now + 0.15);
        } else if (type === 'gold') {
            osc.type = 'triangle'; 
            osc.frequency.setValueAtTime(1200, now); 
            osc.frequency.linearRampToValueAtTime(1800, now + 0.1); 
            gain.gain.setValueAtTime(0.1, now); 
            gain.gain.linearRampToValueAtTime(0, now + 0.3); 
            osc.start(now); 
            osc.stop(now + 0.3);
        } else if (type === 'level') {
            osc.type = 'square'; 
            osc.frequency.setValueAtTime(440, now); 
            osc.frequency.linearRampToValueAtTime(880, now + 0.5); 
            gain.gain.setValueAtTime(0.1, now); 
            gain.gain.linearRampToValueAtTime(0, now + 0.5); 
            osc.start(now); 
            osc.stop(now + 0.5);
        }
    },

    stopMusic() {
        if (this.timer) clearTimeout(this.timer);
        this.osc.forEach(o => { try { o.stop(); o.disconnect(); } catch(e){} });
        this.osc = [];
    },

    playTheme(screen) {
        if (!this.musicOn) return;
        let themeType = 'peaceful';
        
        // Zone Music Mapping
        const zone = state.selectedZone ? state.selectedZone.id : null;
        if (screen === 'zone' || screen === 'combat') {
            if (zone === 'fields' || zone === 'forest') themeType = 'nature';
            else if (zone === 'caves' || zone === 'mines') themeType = 'dungeon';
            else if (zone === 'hills' || zone === 'peaks') themeType = 'windy';
            else if (zone === 'swamp' || zone === 'fortress') themeType = 'ominous';
            else if (zone === 'volcano' || zone === 'spire') themeType = 'intense';
        }
        if (screen === 'arena') themeType = 'intense';
        if (screen === 'tavern') themeType = 'tavern';
        
        if (this.currentTheme === themeType) return;
        this.currentTheme = themeType;
        this.stopMusic();
        this.playNextNote(themeType, 0);
    },

    playNextNote(theme, index) {
        if (!this.musicOn || this.currentTheme !== theme) return;
        const now = this.ctx.currentTime;
        
        const scales = {
            peaceful: { notes: [261.63, 329.63, 392.00, 493.88], tempo: 600, type: 'sine', vol: 0.05 },
            nature: { notes: [261.63, 293.66, 329.63, 392.00, 329.63, 293.66], tempo: 500, type: 'triangle', vol: 0.05 }, 
            dungeon: { notes: [73.42, 0, 82.41, 0, 65.41, 0, 98.00], tempo: 800, type: 'square', vol: 0.03 }, 
            windy: { notes: [440, 0, 493.88, 0, 523.25, 0], tempo: 1000, type: 'sine', vol: 0.02 }, 
            ominous: { notes: [110, 116.54, 110, 103.83], tempo: 900, type: 'sawtooth', vol: 0.04 }, 
            intense: { notes: [110, 110, 146.83, 110, 164.81, 155.56], tempo: 200, type: 'sawtooth', vol: 0.06 }, 
            tavern: { notes: [261.63, 329.63, 392.00, 523.25, 392.00, 329.63], tempo: 400, type: 'triangle', vol: 0.06 } 
        };

        const track = scales[theme] || scales.peaceful;
        const freq = track.notes[index % track.notes.length];

        if (freq > 0) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = track.type;
            osc.frequency.setValueAtTime(freq, now);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(track.vol, now + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, now + (track.tempo/1000));
            osc.start(now);
            osc.stop(now + (track.tempo/1000) + 0.1);
            this.osc.push(osc);
        }
        if (this.osc.length > 5) this.osc.shift();
        this.timer = setTimeout(() => { this.playNextNote(theme, index + 1); }, track.tempo);
    }
};

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

// --- ZONES (FULL DATA: 10 Enemies per Zone) ---
const ZONES = [
  { 
    id: 'fields', name: 'Green Fields', minLvl: 1, bg: '#ecfccb', 
    enemies: [
      { name: 'Garden Rat', level: 1, hp: 15, str: 2, def: 0, exp: 5, gold: 5 },
      { name: 'Hungry Wolf', level: 2, hp: 25, str: 4, def: 1, exp: 10, gold: 10 },
      { name: 'Wild Dog', level: 3, hp: 35, str: 6, def: 2, exp: 15, gold: 15 },
      { name: 'Stray Goblin', level: 4, hp: 40, str: 8, def: 3, exp: 20, gold: 25 },
      { name: 'Road Bandit', level: 5, hp: 50, str: 10, def: 5, exp: 30, gold: 40 },
      { name: 'Large Boar', level: 6, hp: 65, str: 12, def: 6, exp: 40, gold: 50 },
      { name: 'Thief Leader', level: 7, hp: 80, str: 15, def: 8, exp: 55, gold: 65 },
      { name: 'Bear Cub', level: 8, hp: 90, str: 18, def: 10, exp: 70, gold: 80 },
      { name: 'Young Ent', level: 9, hp: 110, str: 20, def: 15, exp: 85, gold: 95 },
      { name: 'Alpha Wolf', level: 10, hp: 130, str: 25, def: 18, exp: 100, gold: 120 }
    ]
  },
  { 
    id: 'forest', name: 'Ancient Forest', minLvl: 11, bg: '#dcfce7', 
    enemies: [
      { name: 'Giant Spider', level: 11, hp: 120, str: 20, def: 10, exp: 80, gold: 100 },
      { name: 'Woodland Sprite', level: 12, hp: 100, str: 30, def: 5, exp: 90, gold: 110 },
      { name: 'Moss Golem', level: 13, hp: 180, str: 25, def: 20, exp: 100, gold: 130 },
      { name: 'Forest Troll', level: 14, hp: 200, str: 30, def: 15, exp: 120, gold: 180 },
      { name: 'Dire Bear', level: 15, hp: 220, str: 35, def: 22, exp: 140, gold: 200 },
      { name: 'Elven Outcast', level: 16, hp: 190, str: 45, def: 18, exp: 150, gold: 220 },
      { name: 'Poison Ivy', level: 17, hp: 160, str: 40, def: 10, exp: 155, gold: 230 },
      { name: 'Corrupted Ent', level: 18, hp: 250, str: 40, def: 25, exp: 160, gold: 250 },
      { name: 'Werewolf', level: 19, hp: 280, str: 50, def: 30, exp: 180, gold: 280 },
      { name: 'Forest Guardian', level: 20, hp: 350, str: 60, def: 40, exp: 250, gold: 350 }
    ]
  },
  { 
    id: 'caves', name: 'Goblin Caves', minLvl: 21, bg: '#e7e5e4', 
    enemies: [
      { name: 'Goblin Scout', level: 21, hp: 300, str: 45, def: 20, exp: 250, gold: 350 },
      { name: 'Cave Bat', level: 22, hp: 280, str: 55, def: 15, exp: 300, gold: 400 },
      { name: 'Goblin Warrior', level: 23, hp: 350, str: 50, def: 25, exp: 320, gold: 420 },
      { name: 'Rock Eater', level: 24, hp: 400, str: 40, def: 40, exp: 340, gold: 450 },
      { name: 'Hobgoblin', level: 25, hp: 380, str: 60, def: 30, exp: 360, gold: 480 },
      { name: 'Cave Troll', level: 26, hp: 500, str: 70, def: 35, exp: 400, gold: 520 },
      { name: 'Dark Dwarf', level: 27, hp: 420, str: 65, def: 45, exp: 420, gold: 550 },
      { name: 'Goblin King', level: 28, hp: 450, str: 65, def: 35, exp: 450, gold: 600 },
      { name: 'Cave Horror', level: 29, hp: 550, str: 80, def: 20, exp: 480, gold: 650 },
      { name: 'Basilisk', level: 30, hp: 600, str: 90, def: 50, exp: 600, gold: 800 }
    ]
  },
  { 
    id: 'hills', name: 'Barrow Hills', minLvl: 31, bg: '#f0f9ff', 
    enemies: [
      { name: 'Restless Spirit', level: 31, hp: 500, str: 70, def: 40, exp: 600, gold: 800 },
      { name: 'Skeleton Warrior', level: 32, hp: 550, str: 75, def: 45, exp: 650, gold: 850 },
      { name: 'Grave Robber', level: 33, hp: 600, str: 80, def: 40, exp: 700, gold: 900 },
      { name: 'Barrow Wight', level: 34, hp: 650, str: 85, def: 50, exp: 750, gold: 1000 },
      { name: 'Specter', level: 35, hp: 500, str: 100, def: 20, exp: 800, gold: 1050 },
      { name: 'Zombie Lord', level: 36, hp: 800, str: 90, def: 60, exp: 850, gold: 1100 },
      { name: 'Vengeful Ghost', level: 37, hp: 700, str: 95, def: 30, exp: 900, gold: 1150 },
      { name: 'Ancient King', level: 38, hp: 800, str: 100, def: 60, exp: 900, gold: 1200 },
      { name: 'Lich', level: 39, hp: 750, str: 120, def: 40, exp: 1000, gold: 1300 },
      { name: 'Bone Dragon', level: 40, hp: 1000, str: 130, def: 80, exp: 1200, gold: 1500 }
    ]
  },
  { 
    id: 'mines', name: 'Deep Mines', minLvl: 41, bg: '#404040', 
    enemies: [
      { name: 'Orc Grunt', level: 41, hp: 1000, str: 120, def: 80, exp: 1200, gold: 1500 },
      { name: 'Deep Goblin', level: 42, hp: 1100, str: 130, def: 85, exp: 1300, gold: 1600 },
      { name: 'Cave Troll', level: 43, hp: 1400, str: 150, def: 100, exp: 1500, gold: 2000 },
      { name: 'Stone Golem', level: 44, hp: 1600, str: 140, def: 150, exp: 1600, gold: 2200 },
      { name: 'Shadow Bat', level: 45, hp: 1200, str: 160, def: 60, exp: 1700, gold: 2300 },
      { name: 'Dark Dwarf', level: 46, hp: 1500, str: 170, def: 110, exp: 1800, gold: 2500 },
      { name: 'Mine Overseer', level: 47, hp: 1700, str: 180, def: 100, exp: 1900, gold: 2800 },
      { name: 'Obsidian Construct', level: 48, hp: 2000, str: 190, def: 180, exp: 2000, gold: 3000 },
      { name: 'Balrog Spawn', level: 49, hp: 2200, str: 200, def: 120, exp: 2200, gold: 3500 },
      { name: 'The Balrog', level: 50, hp: 3000, str: 250, def: 200, exp: 3000, gold: 5000 }
    ]
  },
  { 
    id: 'peaks', name: 'Snowy Peaks', minLvl: 51, bg: '#f0fdfa', 
    enemies: [
      { name: 'Frost Wolf', level: 51, hp: 2000, str: 200, def: 140, exp: 2500, gold: 3500 },
      { name: 'Ice Spirit', level: 52, hp: 2100, str: 210, def: 150, exp: 2600, gold: 3600 },
      { name: 'Snow Leopard', level: 53, hp: 2200, str: 220, def: 160, exp: 2700, gold: 3700 },
      { name: 'Mountain Goat', level: 54, hp: 2300, str: 230, def: 170, exp: 2800, gold: 3800 },
      { name: 'Yeti', level: 55, hp: 2500, str: 240, def: 180, exp: 3000, gold: 4500 },
      { name: 'Ice Troll', level: 56, hp: 2600, str: 250, def: 190, exp: 3100, gold: 4600 },
      { name: 'Frost Giant', level: 57, hp: 2800, str: 260, def: 200, exp: 3200, gold: 4700 },
      { name: 'Winter Wyvern', level: 58, hp: 3000, str: 280, def: 150, exp: 3500, gold: 5000 },
      { name: 'Ice Elemental', level: 59, hp: 3200, str: 300, def: 220, exp: 3700, gold: 5500 },
      { name: 'Titan of Cold', level: 60, hp: 4000, str: 350, def: 300, exp: 4500, gold: 6000 }
    ]
  },
  { 
    id: 'swamp', name: 'Dead Marshes', minLvl: 61, bg: '#ecfdf5', 
    enemies: [
      { name: 'Marsh Leech', level: 61, hp: 3000, str: 320, def: 200, exp: 4500, gold: 6000 },
      { name: 'Giant Mosquito', level: 62, hp: 2800, str: 340, def: 180, exp: 4600, gold: 6200 },
      { name: 'Poison Toad', level: 63, hp: 3200, str: 360, def: 220, exp: 4700, gold: 6400 },
      { name: 'Bog Witch', level: 64, hp: 3500, str: 400, def: 150, exp: 4800, gold: 6600 },
      { name: 'Drowned Soldier', level: 65, hp: 3800, str: 380, def: 250, exp: 5000, gold: 7000 },
      { name: 'Swamp Thing', level: 66, hp: 4200, str: 420, def: 300, exp: 5200, gold: 7200 },
      { name: 'Giant Crocodile', level: 67, hp: 4500, str: 450, def: 350, exp: 5500, gold: 7500 },
      { name: 'Hydra Hatchling', level: 68, hp: 4000, str: 350, def: 250, exp: 6000, gold: 8000 },
      { name: 'Serpent Lord', level: 69, hp: 4800, str: 480, def: 300, exp: 6500, gold: 8500 },
      { name: 'Ancient Hydra', level: 70, hp: 5500, str: 500, def: 400, exp: 7500, gold: 10000 }
    ]
  },
  { 
    id: 'fortress', name: 'Iron Fortress', minLvl: 71, bg: '#78716c', 
    enemies: [
      { name: 'Uruk Scout', level: 71, hp: 4500, str: 450, def: 300, exp: 7500, gold: 9000 },
      { name: 'Armored Archer', level: 72, hp: 4600, str: 480, def: 250, exp: 7800, gold: 9200 },
      { name: 'Warg Rider', level: 73, hp: 5000, str: 500, def: 320, exp: 8000, gold: 9500 },
      { name: 'Siege Troll', level: 74, hp: 6000, str: 550, def: 400, exp: 8200, gold: 9800 },
      { name: 'Dark Sorcerer', level: 75, hp: 3800, str: 600, def: 200, exp: 8500, gold: 10000 },
      { name: 'Elite Guard', level: 76, hp: 5500, str: 520, def: 450, exp: 8800, gold: 10500 },
      { name: 'Assassin', level: 77, hp: 4000, str: 650, def: 250, exp: 9000, gold: 11000 },
      { name: 'War Elephant', level: 78, hp: 7000, str: 500, def: 500, exp: 10000, gold: 12000 },
      { name: 'Uruk Captain', level: 79, hp: 6500, str: 580, def: 480, exp: 11000, gold: 13000 },
      { name: 'Iron Warlord', level: 80, hp: 8000, str: 600, def: 550, exp: 12000, gold: 15000 }
    ]
  },
  { 
    id: 'volcano', name: 'Ash Plains', minLvl: 81, bg: '#fff1f2', 
    enemies: [
      { name: 'Magma Sprite', level: 81, hp: 5500, str: 600, def: 350, exp: 12000, gold: 15000 },
      { name: 'Fire Imp', level: 82, hp: 5800, str: 620, def: 360, exp: 12500, gold: 15500 },
      { name: 'Lava Slime', level: 83, hp: 6000, str: 640, def: 380, exp: 13000, gold: 16000 },
      { name: 'Salamander', level: 84, hp: 6200, str: 660, def: 400, exp: 13500, gold: 17000 },
      { name: 'Hellhound', level: 85, hp: 6500, str: 680, def: 420, exp: 14000, gold: 18000 },
      { name: 'Fire Giant', level: 86, hp: 7000, str: 700, def: 450, exp: 15000, gold: 19000 },
      { name: 'Phoenix', level: 87, hp: 7500, str: 750, def: 300, exp: 16000, gold: 20000 },
      { name: 'Obsidian Golem', level: 88, hp: 8000, str: 650, def: 600, exp: 18000, gold: 25000 },
      { name: 'Fire Drake', level: 89, hp: 8500, str: 800, def: 500, exp: 20000, gold: 30000 },
      { name: 'Volcano Lord', level: 90, hp: 10000, str: 900, def: 700, exp: 25000, gold: 40000 }
    ]
  },
  { 
    id: 'spire', name: 'The Dark Spire', minLvl: 91, bg: '#171717', 
    enemies: [
      { name: 'Shadow Stalker', level: 91, hp: 9000, str: 800, def: 500, exp: 25000, gold: 35000 },
      { name: 'Voidling', level: 92, hp: 9500, str: 850, def: 520, exp: 26000, gold: 36000 },
      { name: 'Nazgul Steed', level: 93, hp: 10000, str: 900, def: 550, exp: 27000, gold: 38000 },
      { name: 'Black Knight', level: 94, hp: 11000, str: 950, def: 600, exp: 28000, gold: 40000 },
      { name: 'Ring Wraith', level: 95, hp: 12000, str: 1000, def: 650, exp: 30000, gold: 45000 },
      { name: 'Dark Sorcerer King', level: 96, hp: 13000, str: 1050, def: 700, exp: 32000, gold: 50000 },
      { name: 'Void Dragon', level: 97, hp: 15000, str: 1100, def: 750, exp: 35000, gold: 60000 },
      { name: 'Eye Watcher', level: 98, hp: 16000, str: 1150, def: 800, exp: 38000, gold: 70000 },
      { name: 'Dark Avatar', level: 99, hp: 18000, str: 1200, def: 850, exp: 40000, gold: 80000 },
      { name: 'The Dark Lord', level: 100, hp: 25000, str: 1500, def: 1000, exp: 50000, gold: 100000 }
    ]
  }
];

// --- STATE MANAGEMENT ---
const state = {
    user: null,
    player: null,
    screen: 'loading',
    selectedZone: null,
    combat: null,
    arenaList: [],
    logs: ['Welcome, Ranger. The world needs you.'],
    authForm: { email: '', password: '', name: '', isRegistering: false, error: '' },
    loading: true,
    tavernMessages: [],
    inboxMessages: [],
    chatInput: '',
    mailTo: '',
    mailBody: ''
};

function updateState(updates) {
    Object.assign(state, updates);
    if (updates.screen) AudioController.playTheme(updates.screen);
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
    return doc(window.db, 'artifacts', window.appId, 'users', uid);
}

// --- ACTIONS ---
window.actions = {
    toggleMusic: () => AudioController.toggleMusic(),
    setAuthMode: (isReg) => { AudioController.playSFX('click'); state.authForm.isRegistering = isReg; state.authForm.error = ''; render(); },
    updateInput: (field, value) => { state.authForm[field] = value; },
    
    handleLogin: async (e) => {
        e.preventDefault();
        AudioController.playSFX('click');
        if(!window.FB) return;
        const { signInWithEmailAndPassword, createUserWithEmailAndPassword, setDoc, doc, serverTimestamp } = window.FB;
        const { email, password, name } = state.authForm;
        
        try {
            if (state.authForm.isRegistering) {
                if(!name || name.trim() === "") throw new Error("Name required");
                const safeName = name.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                const cred = await createUserWithEmailAndPassword(window.auth, email, password);
                const initialProfile = {
                    name: name.trim(), gender: document.getElementById('genderSelect').value,
                    level: 1, exp: 0, expToNext: 100, hp: 30, maxHp: 30, energy: 50, maxEnergy: 50,
                    gold: 50, str: 5, def: 5, spd: 5, weaponId: 'fists', armorId: 'clothes', wins: 0, losses: 0,
                    lastSeen: serverTimestamp(), allowPvp: true
                };
                await setDoc(getPlayerRef(cred.user.uid), initialProfile);
                await setDoc(doc(window.db, 'artifacts', window.appId, 'public', 'data', 'user_map', safeName), { uid: cred.user.uid, realName: name });
            } else {
                await signInWithEmailAndPassword(window.auth, email, password);
            }
        } catch (err) {
            AudioController.playSFX('attack'); state.authForm.error = err.message; render();
        }
    },

    navigate: (screen) => { 
        AudioController.playSFX('click');
        const { setDoc, serverTimestamp } = window.FB;
        if(state.user) setDoc(getPlayerRef(state.user.uid), { lastSeen: serverTimestamp() }, { merge: true });
        updateState({ screen }); 
    },

    enterArena: async () => {
        AudioController.playSFX('click');
        const { getDocs, collection, query, limit } = window.FB;
        updateState({ screen: 'arena', arenaList: [] });
        try {
            const usersRef = collection(window.db, 'artifacts', window.appId, 'users');
            const q = query(usersRef, limit(20)); 
            const snap = await getDocs(q);
            let players = [];
            snap.forEach(doc => { 
                const d = doc.data();
                if(doc.id !== state.user.uid) players.push({ uid: doc.id, ...d }); 
            });
            players.sort((a,b) => b.level - a.level);
            updateState({ arenaList: players });
        } catch(e) { console.error(e); }
    },

    togglePvpStatus: async () => {
        const newVal = !state.player.allowPvp;
        const { setDoc } = window.FB;
        await setDoc(getPlayerRef(state.user.uid), { allowPvp: newVal }, { merge: true });
        AudioController.playSFX('click');
    },

    challengePlayer: async (opponentUid) => {
        const opponent = state.arenaList.find(p => p.uid === opponentUid);
        if(!opponent || !opponent.allowPvp) return;
        if(state.player.energy < 5) { alert("Too tired."); return; }
        const { setDoc } = window.FB;
        await setDoc(getPlayerRef(state.user.uid), { energy: state.player.energy - 5 }, { merge: true });
        AudioController.playSFX('attack');
        updateState({ screen: 'combat', combat: { type: 'pvp', enemy: { ...opponent, hp: opponent.maxHp, exp: opponent.level * 10, gold: opponent.level * 5 }, log: [`Challenged ${opponent.name}!`], round: 1 } });
    },

    updateChatInput: (val) => { state.chatInput = val; },
    sendTavernMessage: async () => {
        if(!state.chatInput.trim()) return;
        AudioController.playSFX('click');
        const { addDoc, collection, serverTimestamp } = window.FB;
        await addDoc(collection(window.db, 'artifacts', window.appId, 'public', 'data', 'chat'), { sender: state.player.name, text: state.chatInput.trim(), timestamp: serverTimestamp() });
        state.chatInput = ''; render();
    },

    updateMailTo: (val) => { state.mailTo = val; },
    updateMailBody: (val) => { state.mailBody = val; },
    sendCourierMessage: async () => {
        if(!state.mailTo.trim() || !state.mailBody.trim()) return;
        AudioController.playSFX('click');
        const { addDoc, collection, serverTimestamp, doc, getDoc } = window.FB;
        const targetName = state.mailTo.trim().replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        try {
            const mapRef = doc(window.db, 'artifacts', window.appId, 'public', 'data', 'user_map', targetName);
            const mapSnap = await getDoc(mapRef);
            if(!mapSnap.exists()) { alert("Ranger not found."); return; }
            await addDoc(collection(window.db, 'artifacts', window.appId, 'users', mapSnap.data().uid, 'inbox'), { sender: state.player.name, text: state.mailBody.trim(), timestamp: serverTimestamp(), read: false });
            alert("Pigeon sent!"); state.mailTo=''; state.mailBody=''; render();
        } catch(e) { console.error(e); }
    },

    enterZone: (zoneId) => {
        const zone = ZONES.find(z => z.id === zoneId);
        if (state.player.level < zone.minLvl) { alert("Level too low."); return; }
        AudioController.playSFX('click');
        updateState({ screen: 'zone', selectedZone: zone });
    },

    startCombat: (enemyIdx) => {
        const enemyTemplate = state.selectedZone.enemies[enemyIdx];
        if (state.player.energy < 3) { alert("Low Energy."); return; }
        const { setDoc } = window.FB;
        setDoc(getPlayerRef(state.user.uid), { energy: state.player.energy - 3 }, { merge: true });
        AudioController.playSFX('attack');
        updateState({ screen: 'combat', combat: { type: 'pve', enemy: { ...enemyTemplate, maxHp: enemyTemplate.hp }, log: [`A wild ${enemyTemplate.name} appears!`], round: 1 } });
    },

    combatRound: async (action) => {
        if(action === 'flee') {
            AudioController.playSFX('click');
            addLog("Retreated.");
            updateState({ screen: state.combat.type === 'pvp' ? 'arena' : 'zone', combat: null });
            return;
        }
        const { player, combat } = state;
        const enemy = combat.enemy;
        const weapon = WEAPONS.find(w => w.id === player.weaponId);
        AudioController.playSFX('attack');
        let log = [...combat.log];
        let pDmg = Math.max(1, Math.floor((player.str + weapon.power) - (enemy.def / 2)));
        let eDmg = Math.max(1, Math.floor(enemy.str - (player.def / 2)));
        enemy.hp -= pDmg;
        log.unshift(`You hit ${enemy.name} for ${pDmg}.`);
        if (enemy.hp <= 0) {
            const { setDoc } = window.FB;
            let newExp = player.exp + enemy.exp;
            let newLevel = player.level;
            let newMaxHp = player.maxHp;
            let msg = `Victory! +${enemy.gold}g +${enemy.exp}xp.`;
            AudioController.playSFX('gold');
            if(newExp >= player.expToNext) { newLevel++; newExp -= player.expToNext; newMaxHp += 15; msg += " LEVEL UP!"; AudioController.playSFX('level'); }
            await setDoc(getPlayerRef(state.user.uid), { gold: player.gold + enemy.gold, exp: newExp, level: newLevel, maxHp: newMaxHp, wins: player.wins + 1 }, { merge: true });
            addLog(msg);
            updateState({ screen: state.combat.type === 'pvp' ? 'arena' : 'zone', combat: null });
            return;
        }
        let newHp = player.hp - eDmg;
        log.unshift(`${enemy.name} hits you for ${eDmg}.`);
        if (newHp <= 0) {
            const { setDoc } = window.FB;
            await setDoc(getPlayerRef(state.user.uid), { hp: 0, losses: player.losses + 1 }, { merge: true });
            AudioController.playSFX('attack');
            addLog("Defeated.");
            updateState({ screen: 'home', combat: null });
            return;
        }
        const { setDoc } = window.FB;
        setDoc(getPlayerRef(state.user.uid), { hp: newHp }, { merge: true });
        updateState({ combat: { ...combat, enemy, log } });
    },

    heal: async () => {
        const cost = state.player.maxHp - state.player.hp;
        if(state.player.gold < cost) return;
        AudioController.playSFX('gold');
        await window.FB.setDoc(getPlayerRef(state.user.uid), { hp: state.player.maxHp, gold: state.player.gold - cost }, { merge: true });
    },
    
    buyItem: async (type, itemId) => {
        const player = state.player;
        const list = type === 'weapon' ? WEAPONS : ARMOR;
        const item = list.find(i => i.id === itemId);
        if (player.gold < item.cost) { alert("Not enough gold."); return; }
        AudioController.playSFX('gold');
        const updates = { gold: player.gold - item.cost };
        if (type === 'weapon') updates.weaponId = itemId; else updates.armorId = itemId;
        await window.FB.setDoc(getPlayerRef(state.user.uid), updates, { merge: true });
        addLog(`Bought: ${item.name}`);
    },

    trainStat: async (stat) => {
        const player = state.player;
        const cost = player[stat] + 1;
        if (player.energy < cost) { alert("Not enough energy."); return; }
        AudioController.playSFX('click');
        const updates = { energy: player.energy - cost, [stat]: player[stat] + 1 };
        await window.FB.setDoc(getPlayerRef(state.user.uid), updates, { merge: true });
        addLog(`Trained ${stat}!`);
    },

    logout: () => { AudioController.stopMusic(); window.FB.signOut(window.auth); window.location.reload(); }
};

// --- FIREBASE LISTENERS ---
window.addEventListener('firebase-ready', () => {
    const { onAuthStateChanged, onSnapshot, setDoc, signOut, collection } = window.FB;
    onAuthStateChanged(window.auth, (u) => {
        state.user = u;
        if (!u) { updateState({ screen: 'auth', loading: false }); } 
        else {
            onSnapshot(getPlayerRef(u.uid), (snap) => {
                if (snap.exists()) {
                    state.player = snap.data();
                    if(state.screen === 'loading' || state.screen === 'auth') { state.screen = 'home'; AudioController.playTheme('home'); }
                    updateState({ loading: false });
                    if(!window.regenInterval) {
                        window.regenInterval = setInterval(() => {
                            const p = state.player;
                            if(p) setDoc(getPlayerRef(u.uid), { energy: Math.min(p.energy + 1, p.maxEnergy), lastSeen: window.FB.serverTimestamp() }, { merge: true });
                        }, 10000);
                    }
                } else { signOut(window.auth); updateState({ player: null, screen: 'auth' }); }
            });
            const chatRef = collection(window.db, 'artifacts', window.appId, 'public', 'data', 'chat');
            onSnapshot(chatRef, (s) => {
                const m = s.docs.map(d => ({id:d.id, ...d.data()})).sort((a,b)=>(b.timestamp?.seconds||0)-(a.timestamp?.seconds||0));
                updateState({ tavernMessages: m.slice(0,50) });
            });
            const inboxRef = collection(window.db, 'artifacts', window.appId, 'users', u.uid, 'inbox');
            onSnapshot(inboxRef, (s) => {
                const m = s.docs.map(d => ({id:d.id, ...d.data()})).sort((a,b)=>(b.timestamp?.seconds||0)-(a.timestamp?.seconds||0));
                updateState({ inboxMessages: m });
            });
        }
    });
});

// --- RENDER ---
function render() {
    const app = document.getElementById('app');
    if (state.screen === 'loading') { app.innerHTML = `<div class="loading-screen"><div class="loading-text">Forging Realm...</div></div>`; return; }
    if (state.screen === 'auth') {
        app.innerHTML = `<div class="auth-container"><div class="auth-box"><h1 style="margin-bottom:20px;">Realms of Valor</h1><form id="authForm" onsubmit="window.actions.handleLogin(event)">${state.authForm.error ? `<div style="color:red; margin-bottom:10px;">${state.authForm.error}</div>` : ''}<input type="email" placeholder="Email" required class="input-field" value="${state.authForm.email || ''}" oninput="window.actions.updateInput('email', this.value)"><input type="password" placeholder="Password" required class="input-field" value="${state.authForm.password || ''}" oninput="window.actions.updateInput('password', this.value)">${state.authForm.isRegistering ? `<input type="text" placeholder="Hero Name" required class="input-field" value="${state.authForm.name || ''}" oninput="window.actions.updateInput('name', this.value)"><select id="genderSelect" class="input-field"><option value="male">Male</option><option value="female">Female</option></select>` : ''}<button type="submit" class="btn btn-primary btn-full">${state.authForm.isRegistering ? 'Create Hero' : 'Load Game'}</button></form><div style="margin-top:15px; font-size: 0.8rem; cursor:pointer;" onclick="window.actions.setAuthMode(!state.authForm.isRegistering)">${state.authForm.isRegistering ? 'Already have a hero? Login' : 'Need a hero? Register'}</div></div></div>`;
        return;
    }
    const player = state.player;
    if (!player) return;

    // BACKGROUND COLOR CHANGE
    let bgStyle = '';
    if(state.selectedZone) bgStyle = `background: ${state.selectedZone.bg};`;
    else if(state.screen === 'combat' && state.combat.type === 'pve' && state.selectedZone) bgStyle = `background: ${state.selectedZone.bg};`;
    else if(state.screen === 'arena' || state.combat?.type === 'pvp') bgStyle = `background: #e5e7eb;`;
    else bgStyle = `background: #fcfbf7;`;

    let contentHtml = '';
    if (state.screen === 'home') {
        const weaponName = WEAPONS.find(w => w.id === player.weaponId).name;
        const armorName = ARMOR.find(a => a.id === player.armorId).name;
        contentHtml = `<div style="max-width: 600px; margin: 0 auto;"><div class="card text-center">${getCharacterHTML(player.gender, player.armorId, player.weaponId)}<h2 style="border:none;">${player.name}</h2><div class="sub-text">Level ${player.level} Ranger</div><div class="card" style="margin-top: 20px; text-align: left; background: #f5f5f4;"><div class="grid-2"><div><div class="sub-text">Strength</div> <b>${player.str}</b></div><div><div class="sub-text">Defense</div> <b>${player.def}</b></div><div><div class="sub-text">Health</div> <b style="color:var(--c-success)">${player.hp}/${player.maxHp}</b></div><div><div class="sub-text">Exp</div> <b style="color:var(--c-primary)">${player.exp}/${player.expToNext}</b></div><div style="grid-column: span 2; padding-top:10px; border-top:1px solid #d6d3d1;"><div class="sub-text">Equipment</div> <b>${weaponName}</b> & <b>${armorName}</b></div></div></div></div></div>`;
    } else if (state.screen === 'map') {
        contentHtml = `<h2>World Map</h2><div class="grid-list">` + ZONES.map(zone => { const locked = player.level < zone.minLvl; return `<div onclick="${locked ? '' : `window.actions.enterZone('${zone.id}')`}" class="card" style="cursor: ${locked ? 'default' : 'pointer'}; opacity: ${locked ? '0.6' : '1'}; display:flex; justify-content:space-between; align-items:center; background:${zone.bg};"><div><div style="font-weight:bold; font-size:1.1rem; color: ${locked ? '#a8a29e' : 'var(--c-text)'}">${zone.name}</div><div class="sub-text">Lvl ${zone.minLvl}+</div></div>${locked ? '<i data-lucide="lock" style="color:#d6d3d1"></i>' : '<i data-lucide="compass" style="color:var(--c-primary)"></i>'}</div>`; }).join('') + `</div>`;
    } else if (state.screen === 'zone') {
        contentHtml = `<div class="flex-between" style="margin-bottom: 20px;"><div><h2>${state.selectedZone.name}</h2><div class="sub-text">Enemies Ahead</div></div><button onclick="window.actions.navigate('map')" class="btn btn-secondary">Retreat</button></div><div class="grid-list">${state.selectedZone.enemies.map((e, idx) => `<div class="card flex-between"><div class="flex-center"><div style="width:30px; height:30px; background:#e5e5e5; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; margin-right:15px;">${e.level}</div><div><div style="font-weight:bold;">${e.name}</div><div class="sub-text">HP: ${e.hp}</div></div></div><button onclick="window.actions.startCombat(${idx})" class="btn btn-primary">Fight</button></div>`).join('')}</div>`;
    } else if (state.screen === 'arena') {
        contentHtml = `<div class="flex-between" style="margin-bottom: 20px;"><div><h2>Battle Arena</h2><div class="sub-text">Challenge other players</div></div><button onclick="window.actions.togglePvpStatus()" class="btn ${player.allowPvp ? 'btn-success' : 'btn-secondary'}">${player.allowPvp ? 'Challenges: ON' : 'Challenges: OFF'}</button></div><div class="grid-list">${state.arenaList.length === 0 ? '<div class="sub-text">No active players found nearby.</div>' : state.arenaList.map(p => `<div class="card flex-between" style="opacity: ${p.allowPvp ? 1 : 0.5}"><div><div style="font-weight:bold;">${p.name} <span class="sub-text">Lvl ${p.level}</span></div><div class="sub-text">${p.allowPvp ? 'Ready to fight' : 'Peaceful'}</div></div>${p.allowPvp ? `<button onclick="window.actions.challengePlayer('${p.uid}')" class="btn btn-danger">Duel (5 En)</button>` : '<span class="sub-text">Passive</span>'}</div>`).join('')}</div>`;
    } else if (state.screen === 'tavern') {
        contentHtml = `<div style="display:flex; flex-direction:column; height:100%;"><div style="margin-bottom:10px;"><h2>The Tavern</h2><div class="sub-text">Gather and chat</div></div><div style="flex:1; overflow-y:auto; background:#f5f5f4; border:1px solid #d6d3d1; border-radius:4px; padding:10px; margin-bottom:10px; display:flex; flex-direction:column-reverse;">${state.tavernMessages.map(msg => `<div style="margin-bottom:8px; border-bottom:1px solid #e7e5e4; padding-bottom:4px;"><span style="font-weight:bold; color:var(--c-primary); font-size:0.8rem;">${msg.sender}</span><span style="color:#78716c; font-size:0.7rem; margin-left:5px;">${new Date(msg.timestamp?.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span><div style="color:var(--c-text);">${msg.text}</div></div>`).join('')}</div><div style="display:flex; gap:10px;"><input type="text" class="input-field" style="margin-bottom:0;" placeholder="Say something..." value="${state.chatInput}" oninput="window.actions.updateChatInput(this.value)" onkeydown="if(event.key==='Enter') window.actions.sendTavernMessage()"><button class="btn btn-primary" onclick="window.actions.sendTavernMessage()">Send</button></div></div>`;
    } else if (state.screen === 'courier') {
        contentHtml = `<div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; height:100%;"><div style="display:flex; flex-direction:column;"><h3>Inbox</h3><div style="flex:1; overflow-y:auto; background:#f5f5f4; border:1px solid #d6d3d1; padding:10px; border-radius:4px;">${state.inboxMessages.length === 0 ? '<div class="sub-text text-center">No messages.</div>' : state.inboxMessages.map(msg => `<div class="card" style="padding:10px; margin-bottom:10px;"><div style="display:flex; justify-content:space-between; border-bottom:1px solid #e7e5e4; padding-bottom:5px; margin-bottom:5px;"><span style="font-weight:bold;">${msg.sender}</span><span style="font-size:0.7rem; color:#78716c;">${new Date(msg.timestamp?.seconds * 1000).toLocaleString()}</span></div><div>${msg.text}</div></div>`).join('')}</div></div><div><h3>Compose</h3><div class="card"><div class="sub-text" style="margin-bottom:5px;">Recipient Name (Exact Match)</div><input type="text" class="input-field" placeholder="Ranger Name" value="${state.mailTo}" oninput="window.actions.updateMailTo(this.value)"><div class="sub-text" style="margin-bottom:5px;">Message</div><textarea class="input-field" style="height:100px; font-family:inherit;" placeholder="Write your letter..." oninput="window.actions.updateMailBody(this.value)">${state.mailBody}</textarea><button class="btn btn-primary btn-full" onclick="window.actions.sendCourierMessage()">Send Pigeon</button></div></div></div>`;
    } else if (state.screen === 'shop') {
        contentHtml = `<div style="display:flex; gap:10px; justify-content:center; margin-bottom:20px;"><button onclick="state.shopType='weapon'; render()" class="btn ${type==='weapon' ? 'btn-primary' : 'btn-secondary'}">Blacksmith</button><button onclick="state.shopType='armor'; render()" class="btn ${type==='armor' ? 'btn-primary' : 'btn-secondary'}">Armorer</button></div><div class="grid-list">${items.map(item => { const owned = item.id === currentId; return `<div class="card text-center" style="${owned ? 'border-color:var(--c-success); background:#f0fdf4;' : ''}">${owned ? '<div style="color:var(--c-success); font-size:0.7rem; text-transform:uppercase; font-weight:bold; margin-bottom:5px;">Equipped</div>' : ''}<h3>${item.name}</h3><div class="sub-text" style="margin: 10px 0;">${type === 'weapon' ? 'Power' : 'Defense'}: ${type === 'weapon' ? item.power : item.defense}</div><button onclick="window.actions.buyItem('${type}', '${item.id}')" ${owned ? 'disabled' : ''} class="btn ${owned ? 'btn-success' : 'btn-secondary'} btn-full">${owned ? 'Owned' : `${item.cost} Gold`}</button></div>`}).join('')}</div>`;
    } else if (state.screen === 'gym') {
        const stats = [ { id: 'str', name: 'Strength', icon: 'swords' }, { id: 'def', name: 'Defense', icon: 'shield' }, { id: 'spd', name: 'Speed', icon: 'zap' } ];
        contentHtml = `<div style="max-width:600px; margin: 0 auto;"><h2 class="text-center">Training Grounds</h2><p class="sub-text text-center">Hone your skills. Training costs 1 more energy than your current stat level.</p><div class="grid-list" style="margin-top:20px;">${stats.map(s => { const cost = player[s.id] + 1; return `<div class="card flex-between"><div class="flex-center"><i data-lucide="${s.icon}" style="margin-right:15px; color:var(--c-primary)"></i><div><div style="font-weight:bold;">${s.name}</div><div class="sub-text">Current: ${player[s.id]}</div></div></div><button onclick="window.actions.trainStat('${s.id}')" class="btn btn-primary">Train (${cost} Energy)</button></div>`; }).join('')}</div></div>`;
    } else if (state.screen === 'combat') {
        const { enemy, log } = state.combat;
        contentHtml = `<div style="max-width: 500px; margin: 0 auto;"><div class="combat-scene"><div class="scene-flex"><div class="text-center"><div class="sub-text">Ranger</div>${getCharacterHTML(player.gender, player.armorId, player.weaponId)}<div style="font-weight:bold; color:var(--c-success);">${player.hp} HP</div></div><div class="vs-text">vs</div><div class="text-center"><div class="sub-text">${enemy.name}</div>${getEnemyPortraitHTML(enemy.name)}<div style="font-weight:bold; color:var(--c-danger);">${enemy.hp} HP</div></div></div></div><div class="log-box" style="margin-bottom: 20px;">${log.map(l => `<div class="log-entry">> ${l}</div>`).join('')}</div><div class="grid-2"><button onclick="window.actions.combatRound('attack')" class="btn btn-danger btn-full" style="padding: 15px;">Attack</button><button onclick="window.actions.combatRound('flee')" class="btn btn-secondary btn-full" style="padding: 15px;">Flee</button></div></div>`;
    } else if (state.screen === 'hospital') {
        contentHtml = `<div class="card text-center" style="max-width:400px; margin: 0 auto; padding: 40px;"><i data-lucide="tent" style="width: 64px; height: 64px; color: var(--c-success); margin-bottom: 20px;"></i><h2>Ranger's Camp</h2><p style="color:var(--c-text-muted); margin-bottom: 30px;">Rest by the fire to mend your wounds.</p><div style="font-size: 2rem; font-weight: bold; color: var(--c-success); margin-bottom: 30px;">${player.hp} <span style="font-size: 1.2rem; color: #d6d3d1;">/ ${player.maxHp}</span></div><button onclick="window.actions.heal()" ${cost === 0 ? 'disabled' : ''} class="btn btn-success btn-full">${cost === 0 ? 'Fully Rested' : `Rest (${cost} Gold)`}</button></div>`;
    }

    app.innerHTML = `
    <div class="app-container">
        <div class="sidebar">
            <div style="padding: 20px; text-align: center; border-bottom: 1px solid #292524;"><h1 style="color: var(--c-primary); font-size: 1.1rem;">REALMS OF VALOR</h1></div>
            <nav style="flex: 1; padding-top: 20px;">
                <button onclick="window.actions.navigate('home')" class="nav-btn"><i data-lucide="castle"></i> Character</button>
                <button onclick="window.actions.navigate('map')" class="nav-btn"><i data-lucide="map"></i> World Map</button>
                <button onclick="window.actions.enterArena()" class="nav-btn"><i data-lucide="swords"></i> Arena (PvP)</button>
                <button onclick="window.actions.navigate('gym')" class="nav-btn"><i data-lucide="dumbbell"></i> Training Gym</button>
                <button onclick="window.actions.navigate('shop')" class="nav-btn"><i data-lucide="hammer"></i> Blacksmith</button>
                <button onclick="window.actions.navigate('hospital')" class="nav-btn"><i data-lucide="tent"></i> Campfire</button>
                <div style="margin: 20px 0 10px 20px; font-size:0.7rem; color:#57534e; text-transform:uppercase;">Social</div>
                <button onclick="window.actions.navigate('tavern')" class="nav-btn"><i data-lucide="message-circle"></i> Tavern</button>
                <button onclick="window.actions.navigate('courier')" class="nav-btn"><i data-lucide="mail"></i> Courier Pigeon</button>
                <div style="margin: 20px 0 10px 20px; font-size:0.7rem; color:#57534e; text-transform:uppercase;">Settings</div>
                <button onclick="window.actions.toggleMusic()" class="nav-btn"><i data-lucide="${AudioController.musicOn ? 'volume-2' : 'volume-x'}"></i> ${AudioController.musicOn ? 'Music: ON' : 'Music: OFF'}</button>
                <div style="margin: 20px; border-top: 1px solid #292524;"></div>
                <button onclick="window.actions.logout()" class="nav-btn" style="color: #ef4444;"><i data-lucide="log-out"></i> Depart</button>
            </nav>
        </div>
        <div class="main-content" style="${bgStyle}">
            <div class="top-bar">
                <div class="stat-tag hp"><i data-lucide="heart" width="14" style="margin-right:5px"></i> ${player.hp}</div>
                <div class="stat-tag en"><i data-lucide="zap" width="14" style="margin-right:5px"></i> ${player.energy}</div>
                <div class="stat-tag gold"><span style="margin-right:5px">●</span> ${player.gold}</div>
                <div class="stat-tag">Lvl ${player.level}</div>
            </div>
            <div class="scroll-area">${contentHtml}</div>
            <div class="log-box" style="height: 100px; flex-shrink: 0; border-top: 1px solid var(--border-strong);">${state.logs.map(l => `<div class="log-entry">> ${l}</div>`).join('')}</div>
        </div>
    </div>`;

    if(window.lucide) window.lucide.createIcons();
}

render();
