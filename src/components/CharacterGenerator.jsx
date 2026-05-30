import React, { useState, useEffect } from 'react';
import { Shield, Sword, Heart, Activity, User, Book, Map as MapIcon, ChevronRight, Check, Music, Axe, Zap, Flame, Wind, Feather, Moon, Crosshair, Star, Hammer, Droplet, Sun } from 'lucide-react';
import './CharacterGenerator.css';
import CharacterSheetPreview from './CharacterSheetPreview';

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

const CharacterGenerator = () => {
  const [char, setChar] = useState(initialCharacter);
  const [activeStep, setActiveStep] = useState('setup');
  const [highestUnlockedStep, setHighestUnlockedStep] = useState(0);
  const [spellsDb, setSpellsDb] = useState([]);
  const [loadingSpells, setLoadingSpells] = useState(false);
  const [spellSearch, setSpellSearch] = useState('');

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
      <h2>Ruleset & Basics</h2>
      <div className="form-group">
        <label>Ruleset Version</label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            className={`btn-${char.ruleset === '2014' ? 'primary' : 'secondary'}`} 
            onClick={() => updateChar('ruleset', '2014')}
            style={{ flex: 1 }}
          >D&D 2014</button>
          <button 
            className={`btn-${char.ruleset === '2024' ? 'primary' : 'secondary'}`} 
            onClick={() => updateChar('ruleset', '2024')}
            style={{ flex: 1 }}
          >D&D 2024 (One D&D)</button>
        </div>
      </div>
      <div className="form-group mt-3">
        <label>Character Name</label>
        <input type="text" value={char.name} onChange={e => updateChar('name', e.target.value)} placeholder="e.g. Drizzt Do'Urden" className="input-styled" />
      </div>
      <div className="form-group mt-3">
        <label>Player Name</label>
        <input type="text" value={char.playerName} onChange={e => updateChar('playerName', e.target.value)} placeholder="Your name" className="input-styled" />
      </div>
    </div>
  );

  const renderRace = () => (
    <div className="builder-step">
      <h2>Select Race</h2>
      <div className="selection-grid">
        {raceData.map(r => {
          const isSelected = char.race === r.id;
          const Icon = r.icon;
          return (
            <div 
              key={r.id} 
              className={`selection-card ${isSelected ? 'active' : ''}`}
              onClick={() => updateChar('race', r.id)}
              style={{ backgroundImage: `url(${r.image})` }}
            >
              <div className="card-overlay"></div>
              <div className="card-content">
                <div className="card-title-ru">{r.name}</div>
                <div className="card-title-en">{r.subtitle}</div>
                <div className="card-source">{r.source}</div>
              </div>
              <div className="card-icon-wrapper">
                <Icon size={64} className="card-icon" />
              </div>
            </div>
          );
        })}
      </div>
      
      {['Elf', 'Dwarf', 'Halfling'].includes(char.race) && (
        <div style={{ marginTop: '2rem' }}>
          <label>Select Subrace</label>
          <select value={char.subrace} onChange={e => updateChar('subrace', e.target.value)} className="input-styled" style={{ marginTop: '0.5rem' }}>
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
      <h2>Select Class</h2>
      
      <div className="selection-grid" style={{ marginBottom: '2rem' }}>
        {classData.map(c => {
          const isSelected = char.className === c.id;
          const Icon = c.icon;
          return (
            <div 
              key={c.id} 
              className={`selection-card ${isSelected ? 'active' : ''}`}
              style={{ backgroundImage: `url(${c.image})` }}
              onClick={() => updateChar('className', c.id)}
            >
              <div className="card-overlay"></div>
              <div className="card-content">
                <div className="card-title-ru">{c.name}</div>
                <div className="card-title-en">{c.subtitle}</div>
                <div className="card-source">{c.source}</div>
              </div>
              <div className="card-icon-wrapper">
                <Icon size={48} className="card-icon" />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', maxWidth: '300px' }}>
        <div style={{ flex: 1 }}>
          <label>Level</label>
          <input type="number" min="1" max="20" value={char.level} onChange={e => updateChar('level', parseInt(e.target.value) || 1)} className="input-styled" />
        </div>
      </div>
      
      <div className="form-group mt-3">
        <label>Saving Throw Proficiencies</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['str', 'dex', 'con', 'int', 'wis', 'cha'].map(ab => (
            <div key={ab} 
                 onClick={() => toggleSavingThrow(ab)}
                 style={{ padding: '0.4rem 0.8rem', border: `1px solid ${char.savingThrows.includes(ab) ? 'var(--accent-red)' : '#333'}`, borderRadius: '4px', cursor: 'pointer', background: char.savingThrows.includes(ab) ? 'rgba(255,0,0,0.1)' : 'transparent' }}>
              {ab.toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAbilities = () => (
    <div className="builder-step">
      <h2>Ability Scores</h2>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Set your core attributes. Modifiers will be calculated automatically.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {Object.keys(char.abilities).map(ab => (
          <div key={ab} style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
            <label style={{ display: 'block', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '0.5rem' }}>{ab}</label>
            <input type="number" min="1" max="30" value={char.abilities[ab]} onChange={e => updateChar(`abilities.${ab}`, parseInt(e.target.value) || 0)} className="input-styled text-center" style={{ fontSize: '1.5rem', padding: '0.5rem' }} />
            <div style={{ marginTop: '0.5rem', color: 'var(--accent-red)', fontWeight: 'bold' }}>
              Mod: {formatMod(getModifier(char.abilities[ab]))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="builder-step">
      <h2>Description & Background</h2>
      <div className="form-group">
        <label>Background</label>
        <select value={char.background} onChange={e => updateChar('background', e.target.value)} className="input-styled">
          <option value="">Choose...</option>
          <option value="Acolyte">Acolyte</option>
          <option value="Criminal">Criminal</option>
          <option value="Folk Hero">Folk Hero</option>
          <option value="Noble">Noble</option>
          <option value="Soldier">Soldier</option>
        </select>
      </div>
      <div className="form-group mt-3">
        <label>Alignment</label>
        <select value={char.alignment} onChange={e => updateChar('alignment', e.target.value)} className="input-styled">
          <option value="">Choose...</option>
          <option value="Lawful Good">Lawful Good</option>
          <option value="Neutral Good">Neutral Good</option>
          <option value="Chaotic Good">Chaotic Good</option>
          <option value="True Neutral">True Neutral</option>
          <option value="Chaotic Evil">Chaotic Evil</option>
        </select>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <textarea placeholder="Personality Traits" value={char.personality} onChange={e => updateChar('personality', e.target.value)} className="input-styled" rows="3"></textarea>
        <textarea placeholder="Ideals" value={char.ideals} onChange={e => updateChar('ideals', e.target.value)} className="input-styled" rows="3"></textarea>
        <textarea placeholder="Bonds" value={char.bonds} onChange={e => updateChar('bonds', e.target.value)} className="input-styled" rows="3"></textarea>
        <textarea placeholder="Flaws" value={char.flaws} onChange={e => updateChar('flaws', e.target.value)} className="input-styled" rows="3"></textarea>
      </div>
    </div>
  );

  const renderEquipment = () => (
    <div className="builder-step">
      <h2>Equipment & Combat Stats</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label>Armor Class (AC)</label>
          <input type="number" value={char.ac} onChange={e => updateChar('ac', parseInt(e.target.value) || 0)} className="input-styled" />
        </div>
        <div>
          <label>Max HP</label>
          <input type="number" value={char.hp.max} onChange={e => updateChar('hp.max', parseInt(e.target.value) || 0)} className="input-styled" />
        </div>
        <div>
          <label>Initiative Bonus</label>
          <input type="number" value={char.initiative} onChange={e => updateChar('initiative', parseInt(e.target.value) || 0)} className="input-styled" />
        </div>
        <div>
          <label>Speed (ft)</label>
          <input type="number" value={char.speed} onChange={e => updateChar('speed', parseInt(e.target.value) || 0)} className="input-styled" />
        </div>
      </div>
      
      <div className="form-group mt-3">
        <label>Features & Traits</label>
        <textarea placeholder="List your class/race features..." value={char.features} onChange={e => updateChar('features', e.target.value)} className="input-styled" rows="4"></textarea>
      </div>
      <div className="form-group mt-3">
        <label>Inventory & Gold</label>
        <textarea placeholder="Starting equipment..." value={char.equipment} onChange={e => updateChar('equipment', e.target.value)} className="input-styled" rows="4"></textarea>
      </div>
    </div>
  );

  const renderSpells = () => {
    const filteredSpells = spellsDb.filter(s => s.name.toLowerCase().includes(spellSearch.toLowerCase()));
    
    // Group spells by level
    const spellsByLevel = {};
    filteredSpells.forEach(s => {
      if (!spellsByLevel[s.level]) spellsByLevel[s.level] = [];
      spellsByLevel[s.level].push(s);
    });

    const selectedCantripsCount = char.spells.filter(s => s.level === 0).length;
    const selectedSpellsCount = char.spells.filter(s => s.level > 0).length;

    return (
      <div className="builder-step">
        <h2>Spells Library</h2>
        
        {!char.className ? (
          <p style={{ color: 'var(--text-muted)' }}>Please select a class first in the Class tab.</p>
        ) : ['Fighter', 'Rogue', 'Barbarian', 'Monk'].includes(char.className) ? (
          <p style={{ color: 'var(--text-muted)' }}>Your chosen class ({char.className}) does not typically cast spells.</p>
        ) : spellsDb.length === 0 && !loadingSpells ? (
          <p style={{ color: 'var(--text-muted)' }}>No spells found for this class in the SRD database.</p>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Select spells for your {char.className}.</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--accent-red)', marginTop: '0.2rem' }}>
                  Selected: {selectedCantripsCount} Cantrips | {selectedSpellsCount} Spells
                </p>
              </div>
              <input 
                type="text" 
                placeholder="Search spells..." 
                value={spellSearch} 
                onChange={e => setSpellSearch(e.target.value)} 
                className="input-styled" 
                style={{ maxWidth: '300px' }}
              />
            </div>
            
            {loadingSpells ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading spells from API...</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingRight: '0.5rem' }}>
                
                {Object.keys(spellsByLevel).sort((a,b) => parseInt(a) - parseInt(b)).map(levelStr => {
                  const level = parseInt(levelStr);
                  const title = level === 0 ? 'Cantrips (Заговоры)' : `Level ${level} Spells`;
                  const spellList = spellsByLevel[level];
                  
                  return (
                    <div key={level}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--accent-red)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.3rem' }}>{title}</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.5rem' }}>
                        {spellList.map(spell => {
                          const isSelected = char.spells.find(s => s.index === spell.index);
                          return (
                            <div 
                              key={spell.index} 
                              onClick={() => toggleSpell(spell)}
                              style={{ 
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                                padding: '0.8rem', background: isSelected ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,0,0.4)', 
                                border: `1px solid ${isSelected ? 'var(--accent-red)' : 'var(--border-color)'}`, 
                                borderRadius: '6px', cursor: 'pointer' 
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{spell.name}</div>
                              {isSelected && <Check size={16} color="var(--accent-red)" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderReview = () => {
    return (
      <div className="builder-step" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Review & Export</h2>
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>Review your character sheet below. You can save your character to your account or download the PDF to print.</p>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button className="btn-primary" onClick={() => alert("Save functionality coming soon!")}>💾 Save Character</button>
        </div>

        <div style={{ width: '100%', height: '75vh', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-large)', overflow: 'auto', background: '#e0e0e0', position: 'relative', marginBottom: '2rem' }}>
          <CharacterSheetPreview char={char} />
        </div>
      </div>
    );
  };

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

  // -------------------------
  // MAIN RENDER
  // -------------------------
  return (
    <div className="character-generator-layout">
      <div className="builder-panel">
        <div className="builder-stepper">
          {steps.map((step, idx) => {
            const isLocked = idx > highestUnlockedStep;
            return (
              <div 
                key={step.id} 
                className={`step-item ${activeStep === step.id ? 'active' : ''}`}
                style={{ 
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.5 : 1
                }}
                onClick={() => {
                  if (!isLocked) setActiveStep(step.id);
                }}
              >
                {step.label}
              </div>
            );
          })}
        </div>
        
        <div className="builder-content">
          {renderActiveStep()}
        </div>
        
        <div className="builder-footer">
          <button 
            className="btn-secondary" 
            disabled={activeStep === steps[0].id}
            onClick={() => setActiveStep(steps[Math.max(0, steps.findIndex(s => s.id === activeStep) - 1)].id)}
          >
            Previous
          </button>
          
          {activeStep === steps[steps.length - 1].id ? (
            <button className="btn-primary" onClick={() => alert("Character Saved!")}>Complete Build</button>
          ) : (
            <button 
              className="btn-primary"
              onClick={() => {
                const currentIdx = steps.findIndex(s => s.id === activeStep);
                if (currentIdx === highestUnlockedStep) {
                  setHighestUnlockedStep(currentIdx + 1);
                }
                setActiveStep(steps[currentIdx + 1].id);
              }}
            >
              Next <ChevronRight size={16} style={{ marginLeft: '0.4rem' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterGenerator;
