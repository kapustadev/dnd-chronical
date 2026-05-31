import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Activity, User, Book, Map as MapIcon, Check, Music, Axe, Zap, Flame, Wind, Feather, Moon, Crosshair, Star, Hammer, Droplet, Sun, Search, Menu, X } from 'lucide-react';
import './CharacterGenerator.css';
import CharacterSheetPreview from './CharacterSheetPreview';
import { supabase } from '../supabaseClient';

const classImages = {
  Bard: '/assets/images/class_bard.png', Barbarian: '/assets/images/class_barbarian.png',
  Fighter: '/assets/images/class_fighter.png', Wizard: '/assets/images/class_wizard.png',
  Druid: '/assets/images/class_druid.png', Cleric: '/assets/images/class_cleric.png',
  Artificer: '/assets/images/class_artificer.png', Warlock: '/assets/images/class_warlock.png',
  Monk: '/assets/images/class_monk.png', Paladin: '/assets/images/class_paladin.png',
  Rogue: '/assets/images/class_rogue.png', Ranger: '/assets/images/class_ranger.png',
  Sorcerer: '/assets/images/class_sorcerer.png',
};

// Character State Schema
const initialCharacter = {
  ruleset: '2014', // 2014 or 2024
  name: '',
  race: '',
  subrace: '',
  className: '',
  subclass: '',
  level: 1,
  background: '',
  alignment: '',
  playerName: '',
  xp: 0,
  
  abilities: {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
  },
  
  proficiencies: [],
  savingThrows: [],
  
  hp: {
    max: 10,
    current: 10,
    temp: 0
  },
  ac: 10,
  initiative: 0,
  speed: 30,
  
  personality: '',
  ideals: '',
  bonds: '',
  flaws: '',
  features: '',
  equipment: '',
  spells: []
};

// Calculate Modifiers
const getModifier = (score) => Math.floor((score - 10) / 2);
const formatMod = (mod) => mod > 0 ? `+${mod}` : mod;

// Skills Mapping
const skillMap = {
  Acrobatics: 'dex',
  AnimalHandling: 'wis',
  Arcana: 'int',
  Athletics: 'str',
  Deception: 'cha',
  History: 'int',
  Insight: 'wis',
  Intimidation: 'cha',
  Investigation: 'int',
  Medicine: 'wis',
  Nature: 'int',
  Perception: 'wis',
  Performance: 'cha',
  Persuasion: 'cha',
  Religion: 'int',
  SleightOfHand: 'dex',
  Stealth: 'dex',
  Survival: 'wis'
};

// D&D Data for Cards
const classData = [
  { id: 'Bard', name: 'Bard', subtitle: 'Versatile Artist', source: "Player's Handbook", icon: Music, color: '#e8dbba', image: '/assets/images/class_bard.png' },
  { id: 'Barbarian', name: 'Barbarian', subtitle: 'Fierce Warrior', source: "Player's Handbook", icon: Axe, color: '#e6cda8', image: '/assets/images/class_barbarian.png' },
  { id: 'Fighter', name: 'Fighter', subtitle: 'Master of Combat', source: "Player's Handbook", icon: Sword, color: '#d9cdb8', image: '/assets/images/class_fighter.png' },
  { id: 'Wizard', name: 'Wizard', subtitle: 'Arcane Scholar', source: "Player's Handbook", icon: Book, color: '#d4c4b4', image: '/assets/images/class_wizard.png' },
  { id: 'Druid', name: 'Druid', subtitle: 'Nature Adept', source: "Player's Handbook", icon: Feather, color: '#dbe0cd', image: '/assets/images/class_druid.png' },
  { id: 'Cleric', name: 'Cleric', subtitle: 'Divine Agent', source: "Player's Handbook", icon: Shield, color: '#d9dce3', image: '/assets/images/class_cleric.png' },
  { id: 'Artificer', name: 'Artificer', subtitle: 'Magical Inventor', source: "Tasha's Cauldron", icon: Hammer, color: '#d3d7cf', image: '/assets/images/class_artificer.png' },
  { id: 'Warlock', name: 'Warlock', subtitle: 'Pact Magic User', source: "Player's Handbook", icon: Flame, color: '#d8c5d8', image: '/assets/images/class_warlock.png' },
  { id: 'Monk', name: 'Monk', subtitle: 'Martial Artist', source: "Player's Handbook", icon: Wind, color: '#d2dced', image: '/assets/images/class_monk.png' },
  { id: 'Paladin', name: 'Paladin', subtitle: 'Holy Knight', source: "Player's Handbook", icon: Shield, color: '#e8d4cf', image: '/assets/images/class_paladin.png' },
  { id: 'Rogue', name: 'Rogue', subtitle: 'Stealthy Expert', source: "Player's Handbook", icon: Crosshair, color: '#c4c3c0', image: '/assets/images/class_rogue.png' },
  { id: 'Ranger', name: 'Ranger', subtitle: 'Wilderness Survivalist', source: "Player's Handbook", icon: MapIcon, color: '#ccd8c4', image: '/assets/images/class_ranger.png' },
  { id: 'Sorcerer', name: 'Sorcerer', subtitle: 'Innate Spellcaster', source: "Player's Handbook", icon: Zap, color: '#c2dbe6', image: '/assets/images/class_sorcerer.png' },
];

const raceData = [
  { id: 'Human', name: 'Human', subtitle: 'Adaptable & Ambitious', source: "Player's Handbook", icon: User, image: '/assets/images/race_human.png' },
  { id: 'Elf', name: 'Elf', subtitle: 'Graceful & Magical', source: "Player's Handbook", icon: Star, image: '/assets/images/race_elf.png' },
  { id: 'Dwarf', name: 'Dwarf', subtitle: 'Stout & Traditional', source: "Player's Handbook", icon: Hammer, image: '/assets/images/race_dwarf.png' },
  { id: 'Halfling', name: 'Halfling', subtitle: 'Lucky & Nimble', source: "Player's Handbook", icon: Heart, image: '/assets/images/race_halfling.png' },
  { id: 'Dragonborn', name: 'Dragonborn', subtitle: 'Proud & Draconic', source: "Player's Handbook", icon: Flame, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Tiefling', name: 'Tiefling', subtitle: 'Fiendish Heritage', source: "Player's Handbook", icon: Moon, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Gnome', name: 'Gnome', subtitle: 'Inventive & Curious', source: "Player's Handbook", icon: Activity, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Half-Elf', name: 'Half-Elf', subtitle: 'Charismatic & Versatile', source: "Player's Handbook", icon: Star, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Half-Orc', name: 'Half-Orc', subtitle: 'Strong & Fierce', source: "Player's Handbook", icon: Axe, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Aasimar', name: 'Aasimar', subtitle: 'Celestial Champion', source: "Volo's Guide", icon: Sun, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Goliath', name: 'Goliath', subtitle: 'Mountain Dweller', source: "Volo's Guide", icon: Shield, image: '/assets/images/epic_dnd_background.png' },
  { id: 'Tabaxi', name: 'Tabaxi', subtitle: 'Feline Agility', source: "Volo's Guide", icon: Wind, image: '/assets/images/epic_dnd_background.png' },
];

const CharacterGenerator = ({ user, onSave }) => {
  // Check if we're editing an existing character
  const editingRaw = localStorage.getItem('editingCharacter');
  const editingChar = editingRaw ? JSON.parse(editingRaw) : null;
  const editingId = editingChar?.id || null;

  const [char, setChar] = useState(editingChar?.data || initialCharacter);
  const [activeStep, setActiveStep] = useState('setup');
  const [highestUnlockedStep, setHighestUnlockedStep] = useState(editingChar ? 7 : 0);
  const [spellsDb, setSpellsDb] = useState([]);
  const [loadingSpells, setLoadingSpells] = useState(false);
  const [spellSearch, setSpellSearch] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const steps = [
    { id: 'setup', label: '1. Setup' },
    { id: 'race', label: '2. Race' },
    { id: 'class', label: '3. Class' },
    { id: 'abilities', label: '4. Abilities' },
    { id: 'description', label: '5. Description' },
    { id: 'equipment', label: '6. Equipment' },
    { id: 'spells', label: '7. Spells' },
    { id: 'review', label: '8. Review & Export' }
  ];

  // Fetch spells
  useEffect(() => {
    if (activeStep === 'spells') {
      if (!char.className || ['Fighter', 'Rogue', 'Barbarian', 'Monk'].includes(char.className)) {
        setSpellsDb([]);
        return;
      }
      
      setLoadingSpells(true);
      fetch(`https://www.dnd5eapi.co/api/2014/classes/${char.className.toLowerCase()}/spells`)
        .then(res => {
          if (!res.ok) throw new Error('API Error');
          return res.json();
        })
        .then(data => {
          if (data.results) {
            setSpellsDb(data.results);
          } else {
            setSpellsDb([]);
          }
          setLoadingSpells(false);
        })
        .catch(() => {
          setSpellsDb([]);
          setLoadingSpells(false);
        });
    }
  }, [activeStep, char.className]);

  // Clear spells when class changes
  useEffect(() => {
    setChar(prev => ({ ...prev, spells: [] }));
  }, [char.className]);

  const saveCharacter = async () => {
    if (!user) { alert('Please log in to save characters.'); return; }
    setSaving(true);
    const charName = char.name || 'Unnamed Hero';
    if (editingId) {
      await supabase.from('characters').update({ name: charName, data: char, updated_at: new Date().toISOString() }).eq('id', editingId);
    } else {
      await supabase.from('characters').insert({ user_id: user.id, name: charName, data: char });
    }
    localStorage.removeItem('editingCharacter');
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => { setSaveSuccess(false); if (onSave) onSave(); }, 1500);
  };

  const updateChar = (field, value) => {
    setChar(prev => {
      const keys = field.split('.');
      if (keys.length === 1) return { ...prev, [field]: value };
      return {
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value }
      };
    });
  };

  const proficiencyBonus = Math.ceil(char.level / 4) + 1;

  const toggleProficiency = (skill) => {
    setChar(prev => ({
      ...prev,
      proficiencies: prev.proficiencies.includes(skill)
        ? prev.proficiencies.filter(s => s !== skill)
        : [...prev.proficiencies, skill]
    }));
  };
  
  const toggleSavingThrow = (ability) => {
    setChar(prev => ({
      ...prev,
      savingThrows: prev.savingThrows.includes(ability)
        ? prev.savingThrows.filter(s => s !== ability)
        : [...prev.savingThrows, ability]
    }));
  };

  const toggleSpell = (spell) => {
    setChar(prev => ({
      ...prev,
      spells: prev.spells.find(s => s.index === spell.index)
        ? prev.spells.filter(s => s.index !== spell.index)
        : [...prev.spells, spell]
    }));
  };

  // -------------------------
  // FORM RENDERERS (LEFT SIDE)
  // -------------------------
  const renderSetup = () => (
    <div className="builder-step">
      <div className="form-section">
        <div className="form-section-title">Ruleset Version</div>
        <div className="ruleset-toggle">
          <button className={`ruleset-btn ${char.ruleset === '2014' ? 'active' : ''}`} onClick={() => updateChar('ruleset', '2014')}>D&D 2014</button>
          <button className={`ruleset-btn ${char.ruleset === '2024' ? 'active' : ''}`} onClick={() => updateChar('ruleset', '2024')}>D&D 2024 (One D&D)</button>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Identity</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Character Name</label>
            <input type="text" value={char.name} onChange={e => updateChar('name', e.target.value)} placeholder="e.g. Drizzt Do'Urden" />
          </div>
          <div className="form-group">
            <label>Player Name</label>
            <input type="text" value={char.playerName} onChange={e => updateChar('playerName', e.target.value)} placeholder="Your real name" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderRace = () => (
    <div className="builder-step">
      <div className="selection-grid">
        {raceData.map(r => {
          const isSelected = char.race === r.id;
          return (
            <div key={r.id} className={`selection-card ${isSelected ? 'active' : ''}`} onClick={() => updateChar('race', r.id)}>
              <div className="card-bg" style={{ backgroundImage: `url(${r.image})` }}></div>
              <div className="card-overlay"></div>
              {isSelected && <div className="card-selected-badge"><Check size={11} color="white" /></div>}
              <div className="card-content">
                <div className="card-title-ru">{r.name}</div>
                <div className="card-title-en">{r.subtitle}</div>
                <div className="card-source">{r.source}</div>
              </div>
            </div>
          );
        })}
      </div>
      {['Elf', 'Dwarf', 'Halfling'].includes(char.race) && (
        <div className="subrace-section">
          <label>Subrace</label>
          <select value={char.subrace} onChange={e => updateChar('subrace', e.target.value)}>
            <option value="">Choose a Subrace...</option>
            {char.race === 'Elf' && <><option value="High Elf">High Elf</option><option value="Wood Elf">Wood Elf</option></>}
            {char.race === 'Dwarf' && <><option value="Hill Dwarf">Hill Dwarf</option><option value="Mountain Dwarf">Mountain Dwarf</option></>}
            {char.race === 'Halfling' && <><option value="Lightfoot">Lightfoot</option><option value="Stout">Stout</option></>}
          </select>
        </div>
      )}
    </div>
  );

  const renderClass = () => (
    <div className="builder-step">
      <div className="selection-grid" style={{ marginBottom: '1.5rem' }}>
        {classData.map(c => {
          const isSelected = char.className === c.id;
          return (
            <div key={c.id} className={`selection-card ${isSelected ? 'active' : ''}`} onClick={() => updateChar('className', c.id)}>
              <div className="card-bg" style={{ backgroundImage: `url(${c.image})` }}></div>
              <div className="card-overlay"></div>
              {isSelected && <div className="card-selected-badge"><Check size={11} color="white" /></div>}
              <div className="card-content">
                <div className="card-title-ru">{c.name}</div>
                <div className="card-title-en">{c.subtitle}</div>
                <div className="card-source">{c.source}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="form-section">
        <div className="form-section-title">Class Options</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Character Level</label>
            <input type="number" min="1" max="20" value={char.level} onChange={e => updateChar('level', parseInt(e.target.value) || 1)} />
          </div>
          <div className="form-group">
            <label>Saving Throw Proficiencies</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(ab => (
                <div key={ab} onClick={() => toggleSavingThrow(ab)}
                  style={{ padding: '0.4rem 0.8rem', border: `1.5px solid ${char.savingThrows.includes(ab) ? 'var(--accent-red)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '8px', cursor: 'pointer', background: char.savingThrows.includes(ab) ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.03)', fontSize: '0.8rem', fontWeight: 700, transition: 'all 0.15s', color: char.savingThrows.includes(ab) ? 'white' : 'var(--text-muted)' }}>
                  {ab.toUpperCase()}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbilities = () => {
    const abilityNames = { str: 'Strength', dex: 'Dexterity', con: 'Constitution', int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
    const abilityShort = { str: 'STR', dex: 'DEX', con: 'CON', int: 'INT', wis: 'WIS', cha: 'CHA' };
    return (
      <div className="builder-step">
        <div className="form-section">
          <div className="form-section-title">Core Attributes</div>
          <div className="abilities-grid">
            {Object.keys(char.abilities).map(ab => {
              const mod = getModifier(char.abilities[ab]);
              const modClass = mod > 0 ? 'positive' : mod < 0 ? 'negative' : '';
              return (
                <div key={ab} className="ability-card">
                  <div className="ability-name">{abilityShort[ab]}</div>
                  <div className={`ability-modifier ${modClass}`}>{formatMod(mod)}</div>
                  <input type="number" min="1" max="30" value={char.abilities[ab]}
                    onChange={e => updateChar(`abilities.${ab}`, parseInt(e.target.value) || 1)}
                    className="ability-score-input" />
                  <div className="ability-label">{abilityNames[ab]}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="form-section">
          <div className="form-section-title">Skill Proficiencies</div>
          <div className="skills-grid">
            {Object.entries(skillMap).map(([skill, attr]) => {
              const isProficient = char.proficiencies.includes(skill);
              const mod = getModifier(char.abilities[attr]);
              return (
                <div key={skill} className={`skill-toggle ${isProficient ? 'active' : ''}`} onClick={() => toggleProficiency(skill)}>
                  <div className="skill-checkbox">{isProficient && <Check size={10} color="white" />}</div>
                  <div className="skill-toggle-name">{skill}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{attr.toUpperCase()}</div>
                  <div className="skill-toggle-mod">{formatMod(mod + (isProficient ? 2 : 0))}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderDescription = () => (
    <div className="builder-step">
      <div className="form-section">
        <div className="form-section-title">Background</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Background</label>
            <select value={char.background} onChange={e => updateChar('background', e.target.value)}>
              <option value="">Choose...</option>
              <option value="Acolyte">Acolyte</option>
              <option value="Criminal">Criminal / Spy</option>
              <option value="Folk Hero">Folk Hero</option>
              <option value="Noble">Noble</option>
              <option value="Sage">Sage</option>
              <option value="Soldier">Soldier</option>
              <option value="Outlander">Outlander</option>
              <option value="Hermit">Hermit</option>
              <option value="Entertainer">Entertainer</option>
              <option value="Guild Artisan">Guild Artisan</option>
            </select>
          </div>
          <div className="form-group">
            <label>Alignment</label>
            <select value={char.alignment} onChange={e => updateChar('alignment', e.target.value)}>
              <option value="">Choose...</option>
              <option value="Lawful Good">Lawful Good</option>
              <option value="Neutral Good">Neutral Good</option>
              <option value="Chaotic Good">Chaotic Good</option>
              <option value="Lawful Neutral">Lawful Neutral</option>
              <option value="True Neutral">True Neutral</option>
              <option value="Chaotic Neutral">Chaotic Neutral</option>
              <option value="Lawful Evil">Lawful Evil</option>
              <option value="Neutral Evil">Neutral Evil</option>
              <option value="Chaotic Evil">Chaotic Evil</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Personality</div>
        <div className="personality-grid">
          <div className="personality-box">
            <div className="personality-box-label">Personality Traits</div>
            <textarea placeholder="How does your character act, speak, or move?" value={char.personality} onChange={e => updateChar('personality', e.target.value)} />
          </div>
          <div className="personality-box">
            <div className="personality-box-label">Ideals</div>
            <textarea placeholder="What principles guide your character?" value={char.ideals} onChange={e => updateChar('ideals', e.target.value)} />
          </div>
          <div className="personality-box">
            <div className="personality-box-label">Bonds</div>
            <textarea placeholder="What ties your character to the world?" value={char.bonds} onChange={e => updateChar('bonds', e.target.value)} />
          </div>
          <div className="personality-box">
            <div className="personality-box-label">Flaws</div>
            <textarea placeholder="What weakness or vice does your character have?" value={char.flaws} onChange={e => updateChar('flaws', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="builder-step">
      <div className="form-section">
        <div className="form-section-title">Combat Statistics</div>
        <div className="combat-stats-grid">
          {[
            { label: 'Armor Class', field: 'ac', value: char.ac },
            { label: 'Max HP', field: 'hp.max', value: char.hp.max },
            { label: 'Initiative', field: 'initiative', value: char.initiative },
            { label: 'Speed (ft)', field: 'speed', value: char.speed },
          ].map(({ label, field, value }) => (
            <div key={field} className="combat-stat-card">
              <div className="combat-stat-label">{label}</div>
              <input type="number" value={value} onChange={e => updateChar(field, parseInt(e.target.value) || 0)} className="combat-stat-input" />
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">Features & Equipment</div>
        <div className="form-grid">
          <div className="form-group">
            <label>Features & Traits</label>
            <textarea placeholder="List class/race features, special abilities..." value={char.features} onChange={e => updateChar('features', e.target.value)} rows="5" />
          </div>
          <div className="form-group">
            <label>Inventory & Gold</label>
            <textarea placeholder="Starting equipment, coins, items..." value={char.equipment} onChange={e => updateChar('equipment', e.target.value)} rows="5" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSpells = () => {
    const filteredSpells = spellsDb.filter(s => s.name.toLowerCase().includes(spellSearch.toLowerCase()));
    const spellsByLevel = {};
    filteredSpells.forEach(s => {
      if (!spellsByLevel[s.level]) spellsByLevel[s.level] = [];
      spellsByLevel[s.level].push(s);
    });
    const selectedCantripsCount = char.spells.filter(s => s.level === 0).length;
    const selectedSpellsCount = char.spells.filter(s => s.level > 0).length;
    const lvl = char.level || 1;
    const cantripLimit = lvl <= 4 ? 2 : lvl <= 9 ? 3 : lvl <= 17 ? 4 : 5;
    const spellLimit = lvl <= 2 ? 3 : lvl <= 4 ? 5 : lvl <= 6 ? 7 : lvl <= 8 ? 9 : 11;

    return (
      <div className="builder-step">
        {!char.className ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Zap size={40} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p>Select a class first to see available spells.</p>
          </div>
        ) : ['Fighter', 'Rogue', 'Barbarian', 'Monk'].includes(char.className) ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Shield size={40} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p><strong>{char.className}</strong> is a non-spellcasting class. Skip this step.</p>
          </div>
        ) : loadingSpells ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading spells from the D&D 5e API...</div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <div className={`spell-limit-badge ${selectedCantripsCount >= cantripLimit ? 'at-limit' : ''}`}>
                <Star size={12} /> Cantrips: {selectedCantripsCount} / {cantripLimit}
              </div>
              <div className={`spell-limit-badge ${selectedSpellsCount >= spellLimit ? 'at-limit' : ''}`}>
                <Zap size={12} /> Spells: {selectedSpellsCount} / {spellLimit}
              </div>
            </div>

            <div className="spell-search-bar" style={{ position: 'relative' }}>
              <span className="spell-search-icon"><Search size={14} /></span>
              <input type="text" placeholder="Search spells..." value={spellSearch} onChange={e => setSpellSearch(e.target.value)} className="spell-search-input" />
            </div>

            {Object.keys(spellsByLevel).sort((a,b) => parseInt(a) - parseInt(b)).map(levelStr => {
              const level = parseInt(levelStr);
              const title = level === 0 ? 'Cantrips' : `Level ${level}`;
              const spellList = spellsByLevel[level];
              return (
                <div key={level} className="spell-level-group">
                  <div className="spell-level-header">
                    {title}
                    <span className="spell-level-badge">{spellList.length} spells</span>
                  </div>
                  <div className="spells-list">
                    {spellList.map(spell => {
                      const isSelected = char.spells.find(s => s.index === spell.index);
                      return (
                        <div key={spell.index} className={`spell-chip ${isSelected ? 'selected' : ''}`} onClick={() => toggleSpell(spell)}>
                          <div className="spell-chip-dot"></div>
                          <span>{spell.name}</span>
                          {isSelected && <Check size={11} color="var(--accent-red)" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    );
  };

  const renderReview = () => {
    const classImg = classImages[char.className] || '/assets/images/epic_dnd_background.png';
    return (
      <div className="builder-step">
        <div className="review-hero">
          <div className="review-char-art" style={{ backgroundImage: `url(${classImg})` }} />
          <div className="review-char-info">
            <h2>{char.name || 'Unnamed Hero'}</h2>
            <div className="review-tags">
              {char.race && <span className="review-tag">{char.race}</span>}
              {char.className && <span className="review-tag highlight">{char.className}</span>}
              {char.level && <span className="review-tag">Level {char.level}</span>}
              {char.background && <span className="review-tag">{char.background}</span>}
              {char.alignment && <span className="review-tag">{char.alignment}</span>}
            </div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button className="btn-primary" onClick={saveCharacter} disabled={saving} style={{ minWidth: '160px' }}>
              {saving ? '⏳ Saving...' : saveSuccess ? '✅ Saved!' : (editingId ? '💾 Update' : '💾 Save Character')}
            </button>
          </div>
        </div>
        <div className="pdf-preview-wrapper">
          <CharacterSheetPreview char={char} />
        </div>
      </div>
    );
  };

  // ── Step config ────────────────────────────────────────
  const stepConfig = [
    { id: 'setup',       label: 'Setup',        icon: User,       getValue: () => char.name || null },
    { id: 'race',        label: 'Race',          icon: Moon,       getValue: () => char.race || null },
    { id: 'class',       label: 'Class',         icon: Shield,     getValue: () => char.className ? `${char.className} Lv${char.level}` : null },
    { id: 'abilities',   label: 'Abilities',     icon: Activity,   getValue: () => null },
    { id: 'description', label: 'Background',    icon: Book,       getValue: () => char.background || null },
    { id: 'equipment',   label: 'Equipment',     icon: Sword,      getValue: () => null },
    { id: 'spells',      label: 'Spells',        icon: Zap,        getValue: () => char.spells.length ? `${char.spells.length} selected` : null },
    { id: 'review',      label: 'Review',        icon: Star,       getValue: () => null },
  ];

  const stepBanners = {
    setup:       { eyebrow: 'Step 1',   title: 'Character Setup',     subtitle: 'Begin your legend. Name your character and choose the ruleset.' },
    race:        { eyebrow: 'Step 2',   title: 'Choose Your Race',    subtitle: 'Your ancestry shapes your natural abilities and backstory.' },
    class:       { eyebrow: 'Step 3',   title: 'Choose Your Class',   subtitle: 'Your class defines your role in the party and combat style.' },
    abilities:   { eyebrow: 'Step 4',   title: 'Ability Scores',      subtitle: 'Distribute your scores. These drive nearly every roll you make.' },
    description: { eyebrow: 'Step 5',   title: 'Background & Story',  subtitle: 'Give your character a history, personality, and moral code.' },
    equipment:   { eyebrow: 'Step 6',   title: 'Combat & Equipment',  subtitle: 'Define your combat stats and starting inventory.' },
    spells:      { eyebrow: 'Step 7',   title: 'Spellbook',           subtitle: 'Choose cantrips and prepared spells from the official list.' },
    review:      { eyebrow: 'Step 8',   title: 'Review & Save',       subtitle: 'Inspect your full sheet and save your character to the cloud.' },
  };

  const currentIdx = stepConfig.findIndex(s => s.id === activeStep);
  const progressPct = Math.round((Math.min(currentIdx, highestUnlockedStep) / (stepConfig.length - 1)) * 100);
  const banner = stepBanners[activeStep] || {};

  const renderActiveStep = () => {
    switch(activeStep) {
      case 'setup': return renderSetup();
      case 'race': return renderRace();
      case 'class': return renderClass();
      case 'abilities': return renderAbilities();
      case 'description': return renderDescription();
      case 'equipment': return renderEquipment();
      case 'spells': return renderSpells();
      case 'review': return renderReview();
      default: return renderSetup();
    }
  };

  // ── MAIN RENDER ────────────────────────────────────────
  return (
    <div className="character-generator-layout">

      {/* ── Sidebar ── */}
      <aside className={`builder-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-red)', fontWeight: 800, letterSpacing: '0.1em' }}>CHARACTER BUILDER</div>
            <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '0.2rem' }}>{char.name || 'Unnamed Hero'}</div>
          </div>
          <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', display: 'none' }}>
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-progress-track">
          <div className="progress-label">
            <span>Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* Class preview card */}
        {char.className && (
          <div className="sidebar-char-card">
            <div className="sidebar-char-image" style={{ backgroundImage: `url(${classImages[char.className] || '/assets/images/epic_dnd_background.png'})` }} />
            <div className="sidebar-char-meta">
              {[char.race, char.className, char.level ? `Lv ${char.level}` : null].filter(Boolean).join(' · ')}
            </div>
          </div>
        )}

        <nav className="sidebar-steps">
          {stepConfig.map((step, idx) => {
            const isLocked = idx > highestUnlockedStep;
            const isDone = idx < currentIdx;
            const isActive = activeStep === step.id;
            const Icon = step.icon;
            const val = step.getValue();
            return (
              <div
                key={step.id}
                className={`sidebar-step ${isActive ? 'active' : ''} ${isLocked ? 'locked' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => {
                  if (!isLocked) {
                    setActiveStep(step.id);
                    setMobileMenuOpen(false);
                  }
                }}
              >
                <div className="step-number">
                  {isDone ? <Check size={12} /> : <span>{idx + 1}</span>}
                </div>
                <div className="step-info">
                  <div className="step-name">{step.label}</div>
                  {val && <div className="step-value">{val}</div>}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay Close */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 299 }} className="mobile-only-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ── Main ── */}
      <main className="builder-main">
        {/* Step Banner */}
        <div className="step-banner" data-step-num={currentIdx + 1}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <div className="step-eyebrow" style={{ margin: 0 }}>{banner.eyebrow}</div>
            <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(true)} style={{ background: 'transparent', border: 'none', color: 'white', display: 'none' }}>
              <Menu size={24} />
            </button>
          </div>
          <h1 className="step-title">{banner.title}</h1>
          <p className="step-subtitle">{banner.subtitle}</p>
        </div>

        {/* Step Content */}
        <div className="builder-content">
          {renderActiveStep()}
        </div>

        {/* Footer Nav */}
        <div className="builder-footer">
          <button
            className="btn-secondary"
            disabled={currentIdx === 0}
            onClick={() => setActiveStep(stepConfig[Math.max(0, currentIdx - 1)].id)}
          >
            ← Previous
          </button>

          <span className="footer-step-hint">{currentIdx + 1} of {stepConfig.length}</span>

          {currentIdx === stepConfig.length - 1 ? (
            <button className="btn-primary" onClick={saveCharacter} disabled={saving}>
              {saving ? '⏳ Saving...' : saveSuccess ? '✅ Saved!' : (editingId ? '💾 Update' : '💾 Save Character')}
            </button>
          ) : (
            <button
              className="btn-primary"
              onClick={() => {
                if (currentIdx === highestUnlockedStep) setHighestUnlockedStep(currentIdx + 1);
                setActiveStep(stepConfig[currentIdx + 1].id);
              }}
            >
              Next → 
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default CharacterGenerator;
