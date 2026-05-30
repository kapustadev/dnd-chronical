import React, { useRef, useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './CharacterSheetPreview.css';

const CharacterSheetPreview = ({ char }) => {
  const sheetRef = useRef(null);
  const containerRef = useRef(null);
  const [autoScale, setAutoScale] = useState(1);
  const [manualScale, setManualScale] = useState(null);

  const currentScale = manualScale !== null ? manualScale : autoScale;

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // A4 width is ~794px, height is ~1123px.
        const widthScale = width / 840;
        // Scale to fit one entire page height in the viewport without scrolling
        const heightScale = height / 1150;
        
        const newScale = Math.min(widthScale, heightScale, 1);
        setAutoScale(newScale);
      }
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDownloadPDF = () => {
    const element = sheetRef.current;
    const opt = {
      margin:       0,
      filename:     `${char.name || 'character'}_sheet.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const getMod = (score) => Math.floor((score - 10) / 2);
  const formatMod = (mod) => mod > 0 ? `+${mod}` : mod;
  const profBonus = Math.ceil(char.level / 4) + 1;

  // Helpers for skills and saves
  const isProf = (skill) => char.proficiencies.includes(skill);
  const isSaveProf = (ab) => char.savingThrows.includes(ab);
  const getSkillMod = (ab, skill) => getMod(char.abilities[ab]) + (isProf(skill) ? profBonus : 0);
  const getSaveMod = (ab) => getMod(char.abilities[ab]) + (isSaveProf(ab) ? profBonus : 0);

  return (
    <div className="sheet-preview-container" ref={containerRef} style={{ width: '100%', height: '100%', boxSizing: 'border-box', position: 'relative', padding: '1rem', display: 'flex', justifyContent: 'center' }}>
      
      {/* ZOOM CONTROLS */}
      <div style={{ position: 'sticky', top: '10px', right: '10px', display: 'flex', gap: '5px', zIndex: 50, background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '8px', alignSelf: 'flex-start', marginLeft: 'auto' }}>
        <button className="btn-secondary" style={{ padding: '5px 10px', minWidth: '40px' }} onClick={() => setManualScale(Math.max(0.3, currentScale - 0.2))}>-</button>
        <button className="btn-secondary" style={{ padding: '5px 10px' }} onClick={() => setManualScale(null)}>Fit</button>
        <button className="btn-secondary" style={{ padding: '5px 10px', minWidth: '40px' }} onClick={() => setManualScale(Math.min(2, currentScale + 0.2))}>+</button>
      </div>

      <div style={{ 
        position: 'absolute',
        top: '2rem',
        width: `${840 * currentScale}px`, 
        height: `${2300 * currentScale}px`,
        transition: 'width 0.2s, height 0.2s'
      }}>
        <div style={{
          transform: `scale(${currentScale})`,
          transformOrigin: 'top left',
          width: '840px',
          position: 'absolute',
          top: 0,
          left: 0,
          transition: 'transform 0.2s ease-out'
        }}>
          <div ref={sheetRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '210mm', margin: '0 auto', background: 'white', paddingBottom: '20px', boxShadow: '0 0 20px rgba(0,0,0,0.2)' }}>
          
          {/* PAGE 1 */}
          <div className="page" id="page-1">
          {/* HEADER */}
          <div className="p1-header">
            <div className="p1-logo">
              <div className="p1-logo-title">DUNGEONS &amp; DRAGONS®</div>
              <input type="text" className="p1-logo-name" value={char.name} readOnly placeholder="Character Name" />
            </div>
            <div className="p1-header-fields">
              <div className="hf"><input type="text" value={`${char.className} ${char.level}`} readOnly /><span className="lbl">Class & Level</span></div>
              <div className="hf"><input type="text" value={char.background} readOnly /><span className="lbl">Background</span></div>
              <div className="hf"><input type="text" value={char.playerName} readOnly /><span className="lbl">Player Name</span></div>
              <div className="hf"><input type="text" value={`${char.race} ${char.subrace}`} readOnly /><span className="lbl">Race</span></div>
              <div className="hf"><input type="text" value={char.alignment} readOnly /><span className="lbl">Alignment</span></div>
              <div className="hf"><input type="text" value={char.xp} readOnly /><span className="lbl">Experience Points</span></div>
            </div>
          </div>

          {/* BODY */}
          <div className="p1-body">
            
            {/* LEFT COLUMN */}
            <div className="col-left">
              <div className="top-stat"><input type="text" value={`+${profBonus}`} readOnly /><span className="lbl">Proficiency Bonus</span></div>
              <div className="top-stat"><input type="text" /><span className="lbl">Inspiration</span></div>
              <div className="top-stat"><input type="text" value={10 + getSkillMod('wis', 'Perception')} readOnly /><span className="lbl">Passive Wisdom (Perception)</span></div>

              {/* STRENGTH */}
              <div className="ab-group">
                <div className="ab-box">
                  <input type="text" className="ab-mod" value={formatMod(getMod(char.abilities.str))} readOnly />
                  <input type="text" className="ab-score" value={char.abilities.str} readOnly />
                  <span className="lbl ab-name">STRENGTH</span>
                </div>
                <div className="ab-skills">
                  <div className="sk save"><div className={`diamond ${isSaveProf('str') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSaveMod('str'))} readOnly /> Saving Throw</div>
                  <div className="sk"><div className={`circle ${isProf('Athletics') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('str', 'Athletics'))} readOnly /> Athletics</div>
                </div>
              </div>

              {/* DEXTERITY */}
              <div className="ab-group">
                <div className="ab-box">
                  <input type="text" className="ab-mod" value={formatMod(getMod(char.abilities.dex))} readOnly />
                  <input type="text" className="ab-score" value={char.abilities.dex} readOnly />
                  <span className="lbl ab-name">DEXTERITY</span>
                </div>
                <div className="ab-skills">
                  <div className="sk save"><div className={`diamond ${isSaveProf('dex') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSaveMod('dex'))} readOnly /> Saving Throw</div>
                  <div className="sk"><div className={`circle ${isProf('Acrobatics') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('dex', 'Acrobatics'))} readOnly /> Acrobatics</div>
                  <div className="sk"><div className={`circle ${isProf('SleightOfHand') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('dex', 'SleightOfHand'))} readOnly /> Sleight of Hand</div>
                  <div className="sk"><div className={`circle ${isProf('Stealth') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('dex', 'Stealth'))} readOnly /> Stealth</div>
                </div>
              </div>

              {/* CONSTITUTION */}
              <div className="ab-group">
                <div className="ab-box">
                  <input type="text" className="ab-mod" value={formatMod(getMod(char.abilities.con))} readOnly />
                  <input type="text" className="ab-score" value={char.abilities.con} readOnly />
                  <span className="lbl ab-name">CONSTITUTION</span>
                </div>
                <div className="ab-skills">
                  <div className="sk save"><div className={`diamond ${isSaveProf('con') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSaveMod('con'))} readOnly /> Saving Throw</div>
                </div>
              </div>

              {/* INTELLIGENCE */}
              <div className="ab-group">
                <div className="ab-box">
                  <input type="text" className="ab-mod" value={formatMod(getMod(char.abilities.int))} readOnly />
                  <input type="text" className="ab-score" value={char.abilities.int} readOnly />
                  <span className="lbl ab-name">INTELLIGENCE</span>
                </div>
                <div className="ab-skills">
                  <div className="sk save"><div className={`diamond ${isSaveProf('int') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSaveMod('int'))} readOnly /> Saving Throw</div>
                  <div className="sk"><div className={`circle ${isProf('Arcana') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('int', 'Arcana'))} readOnly /> Arcana</div>
                  <div className="sk"><div className={`circle ${isProf('History') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('int', 'History'))} readOnly /> History</div>
                  <div className="sk"><div className={`circle ${isProf('Investigation') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('int', 'Investigation'))} readOnly /> Investigation</div>
                  <div className="sk"><div className={`circle ${isProf('Nature') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('int', 'Nature'))} readOnly /> Nature</div>
                  <div className="sk"><div className={`circle ${isProf('Religion') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('int', 'Religion'))} readOnly /> Religion</div>
                </div>
              </div>

              {/* WISDOM */}
              <div className="ab-group">
                <div className="ab-box">
                  <input type="text" className="ab-mod" value={formatMod(getMod(char.abilities.wis))} readOnly />
                  <input type="text" className="ab-score" value={char.abilities.wis} readOnly />
                  <span className="lbl ab-name">WISDOM</span>
                </div>
                <div className="ab-skills">
                  <div className="sk save"><div className={`diamond ${isSaveProf('wis') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSaveMod('wis'))} readOnly /> Saving Throw</div>
                  <div className="sk"><div className={`circle ${isProf('AnimalHandling') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('wis', 'AnimalHandling'))} readOnly /> Animal Handling</div>
                  <div className="sk"><div className={`circle ${isProf('Insight') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('wis', 'Insight'))} readOnly /> Insight</div>
                  <div className="sk"><div className={`circle ${isProf('Medicine') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('wis', 'Medicine'))} readOnly /> Medicine</div>
                  <div className="sk"><div className={`circle ${isProf('Perception') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('wis', 'Perception'))} readOnly /> Perception</div>
                  <div className="sk"><div className={`circle ${isProf('Survival') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('wis', 'Survival'))} readOnly /> Survival</div>
                </div>
              </div>

              {/* CHARISMA */}
              <div className="ab-group">
                <div className="ab-box">
                  <input type="text" className="ab-mod" value={formatMod(getMod(char.abilities.cha))} readOnly />
                  <input type="text" className="ab-score" value={char.abilities.cha} readOnly />
                  <span className="lbl ab-name">CHARISMA</span>
                </div>
                <div className="ab-skills">
                  <div className="sk save"><div className={`diamond ${isSaveProf('cha') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSaveMod('cha'))} readOnly /> Saving Throw</div>
                  <div className="sk"><div className={`circle ${isProf('Deception') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('cha', 'Deception'))} readOnly /> Deception</div>
                  <div className="sk"><div className={`circle ${isProf('Intimidation') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('cha', 'Intimidation'))} readOnly /> Intimidation</div>
                  <div className="sk"><div className={`circle ${isProf('Performance') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('cha', 'Performance'))} readOnly /> Performance</div>
                  <div className="sk"><div className={`circle ${isProf('Persuasion') ? 'filled' : ''}`}></div><input type="text" className="sk-val" value={formatMod(getSkillMod('cha', 'Persuasion'))} readOnly /> Persuasion</div>
                </div>
              </div>

            </div>
            
            {/* MIDDLE COLUMN */}
            <div className="col-mid">
              <div className="combat-box">
                <div className="combat-row1">
                  <div className="ac-box">
                    <input type="text" value={char.ac} readOnly />
                    <span className="lbl" style={{marginTop:'5px'}}>Armor Class</span>
                  </div>
                  <div className="stat-cell"><input type="text" value={formatMod(char.initiative)} readOnly /><span className="lbl">Initiative</span></div>
                  <div className="stat-cell"><input type="text" value={char.speed} readOnly /><span className="lbl">Speed</span></div>
                </div>

                {/* HP */}
                <div className="hp-row">
                  <div className="hp-header">❤ &nbsp; HIT POINTS</div>
                  <div className="hp-body">
                    <div className="hp-cell"><span className="lbl">Max</span><input type="text" value={char.hp.max} readOnly /></div>
                    <div className="hp-cell"><span className="lbl">Current</span><input type="text" value={char.hp.current} readOnly /></div>
                    <div style={{ flex:1, borderLeft:'2px solid rgba(0,0,0,0.3)', padding:'4px' }}>
                      <div className="hp-header" style={{ background:'#555', borderRadius:'4px 4px 0 0' }}>Hit Dice</div>
                      <div className="hp-cell"><span className="lbl">Total</span><input type="text" value={char.level} readOnly /></div>
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop:'4px', border:'1.5px solid rgba(0,0,0,0.2)', borderRadius:'6px', overflow:'hidden' }}>
                  <div className="hp-header" style={{ background:'#444' }}>TEMPORARY HIT POINTS</div>
                  <div style={{ padding:'4px 6px' }}><input type="text" value={char.hp.temp || ''} readOnly /></div>
                </div>

                {/* DEATH SAVES */}
                <div style={{ marginTop:'5px', border:'1.5px solid #ccc', borderRadius:'8px', padding:'5px', background:'#fafafa' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px', justifyContent:'center' }}>
                    <div className="circle"></div><div className="circle"></div><div className="circle"></div>
                    <span style={{ fontSize:'18px' }}>💀</span>
                    <div className="circle"></div><div className="circle"></div><div className="circle"></div>
                  </div>
                  <div className="lbl" style={{ textAlign:'center', marginTop:'2px' }}>Death Saves</div>
                </div>
              </div>

              <div className="attacks-box">
                <div className="attacks-title">
                  <span className="sword-icon">⚔</span>
                  <span className="attacks-title-text">Attacks & Spellcasting</span>
                </div>
                <table className="attacks-table">
                  <thead>
                    <tr>
                      <th style={{ width:'40%' }}>Name</th>
                      <th style={{ width:'20%' }}>ATK Bonus</th>
                      <th style={{ width:'40%' }}>Damage/Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(6)].map((_, i) => (
                      <tr key={i}>
                        <td><input type="text" /></td>
                        <td><input type="text" /></td>
                        <td><input type="text" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="col-right" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <span className="lbl">Personality Traits</span>
                <textarea rows="4" value={char.personality} readOnly style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}></textarea>
              </div>
              <div>
                <span className="lbl">Ideals</span>
                <textarea rows="3" value={char.ideals} readOnly style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}></textarea>
              </div>
              <div>
                <span className="lbl">Bonds</span>
                <textarea rows="3" value={char.bonds} readOnly style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}></textarea>
              </div>
              <div>
                <span className="lbl">Flaws</span>
                <textarea rows="3" value={char.flaws} readOnly style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '5px' }}></textarea>
              </div>
            </div>
            
          </div>
          
          {/* FOOTER */}
          <div style={{ marginTop: '15px' }}>
            <span className="lbl">Features & Traits / Equipment</span>
            <textarea rows="4" value={`${char.features}\n\n${char.equipment}`} readOnly style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', width: '100%', boxSizing: 'border-box' }}></textarea>
          </div>
        </div>
        
        {/* PAGE 2 */}
        <div className="page" id="page-2">
          {/* HEADER */}
          <div className="p2-header">
            <div className="p2-logo">
              <div className="p2-logo-title">D&amp;D SPELLS</div>
            </div>
            <div className="p2-header-fields">
              <div className="p2-hf">
                <input type="text" value={char.className} readOnly />
                <span className="lbl">Spellcasting Class</span>
              </div>
              <div className="p2-hf">
                <input type="text" value={char.className === 'Wizard' ? 'INT' : char.className === 'Cleric' ? 'WIS' : 'CHA'} readOnly />
                <span className="lbl">Spellcasting Ability</span>
              </div>
              <div className="p2-hf">
                <input type="text" value={8 + profBonus + (char.className === 'Wizard' ? getMod(char.abilities.int) : 0)} readOnly />
                <span className="lbl">Spell Save DC</span>
              </div>
            </div>
          </div>

          {/* SLOTS */}
          <div className="slots-wrapper">
            <table className="slots-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>1st</th><th>2nd</th><th>3rd</th><th>4th</th><th>5th</th>
                  <th>6th</th><th>7th</th><th>8th</th><th>9th</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="lbl">Total Slots</td>
                  <td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td>
                  <td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td>
                  <td><input type="text" /></td><td><input type="text" /></td><td><input type="text" /></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SPELL LIST (Simplified rendering for the preview) */}
          <div className="spell-cols">
            <div>
              <div className="sl-panel">
                <div className="sl-header">Cantrips</div>
                {char.spells.filter(s => s.level === 0).map(s => (
                  <div key={s.index} className="sl-spell-row"><input type="text" value={s.name} readOnly /></div>
                ))}
                {[...Array(Math.max(0, 5 - char.spells.filter(s => s.level === 0).length))].map((_, i) => (
                   <div key={`c-${i}`} className="sl-spell-row"><input type="text" /></div>
                ))}
              </div>
              <div className="sl-panel">
                <div className="sl-header">Level 1</div>
                {char.spells.filter(s => s.level === 1).map(s => (
                  <div key={s.index} className="sl-spell-row"><div className="circle"></div><input type="text" value={s.name} readOnly /></div>
                ))}
                {[...Array(Math.max(0, 5 - char.spells.filter(s => s.level === 1).length))].map((_, i) => (
                   <div key={`l1-${i}`} className="sl-spell-row"><div className="circle"></div><input type="text" /></div>
                ))}
              </div>
            </div>
            
            <div>
              <div className="sl-panel">
                <div className="sl-header">Level 2</div>
                {char.spells.filter(s => s.level === 2).map(s => (
                  <div key={s.index} className="sl-spell-row"><div className="circle"></div><input type="text" value={s.name} readOnly /></div>
                ))}
                {[...Array(Math.max(0, 5 - char.spells.filter(s => s.level === 2).length))].map((_, i) => (
                   <div key={`l2-${i}`} className="sl-spell-row"><div className="circle"></div><input type="text" /></div>
                ))}
              </div>
              <div className="sl-panel">
                <div className="sl-header">Level 3</div>
                {char.spells.filter(s => s.level === 3).map(s => (
                  <div key={s.index} className="sl-spell-row"><div className="circle"></div><input type="text" value={s.name} readOnly /></div>
                ))}
                 {[...Array(Math.max(0, 5 - char.spells.filter(s => s.level === 3).length))].map((_, i) => (
                   <div key={`l3-${i}`} className="sl-spell-row"><div className="circle"></div><input type="text" /></div>
                ))}
              </div>
            </div>

            <div>
               <div className="sl-panel">
                <div className="sl-header">Level 4+</div>
                {char.spells.filter(s => s.level >= 4).map(s => (
                  <div key={s.index} className="sl-spell-row"><div className="circle"></div><input type="text" value={s.name} readOnly /></div>
                ))}
                {[...Array(Math.max(0, 8 - char.spells.filter(s => s.level >= 4).length))].map((_, i) => (
                   <div key={`l4-${i}`} className="sl-spell-row"><div className="circle"></div><input type="text" /></div>
                ))}
              </div>
            </div>
            
            </div>
            
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheetPreview;
