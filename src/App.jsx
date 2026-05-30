import React, { useState, useEffect } from 'react';
import { Menu, X, Book, Calculator, User, Play, Check, Star, CloudLightning, Users, Globe, Mail, MessageSquare, ChevronDown, Sword, Shield, Map as MapIcon, Compass, AlertCircle, Scroll, Search, Plus } from 'lucide-react';
import CharacterGenerator from './components/CharacterGenerator';

// Responsive Header with separated System and Language switchers
const Header = ({ currentView, setView, user, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [systemOpen, setSystemOpen] = useState(false);
  const [currentSystem, setCurrentSystem] = useState('D&D 5e');

  const languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Русский'];
  const systems = ['D&D 5e', 'Pathfinder 2e'];

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleNav = (view) => {
    setView(view);
    setMenuOpen(false);
  };

  const isAppView = currentView === 'cabinet' || currentView === 'characters';

  return (
    <div className={`header-wrapper ${menuOpen ? 'nav-active' : ''}`}>
      <div className="top-bar">
        <div style={{ position: 'relative' }} onMouseLeave={() => setSystemOpen(false)}>
          <div className="language-selector" onClick={() => setSystemOpen(!systemOpen)}>
            <Sword size={12} /> {currentSystem}
          </div>
          <div className={`lang-dropdown ${systemOpen ? 'open' : ''}`} style={{ left: 0, right: 'auto' }}>
            {systems.map(sys => (
              <div key={sys} className="lang-option" onClick={() => { setCurrentSystem(sys); setSystemOpen(false); }}>
                {sys}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'relative' }} onMouseLeave={() => setLangOpen(false)}>
          <div className="language-selector" onClick={() => setLangOpen(!langOpen)}>
            <Globe size={12} /> {currentLang}
          </div>
          <div className={`lang-dropdown ${langOpen ? 'open' : ''}`}>
            {languages.map(lang => (
              <div key={lang} className="lang-option" onClick={() => { setCurrentLang(lang); setLangOpen(false); }}>
                {lang}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="logo-container" onClick={() => handleNav('home')}>
          <img src="/DnD-Symbol.png" alt="D&D" className="logo-image" style={{ objectPosition: 'top' }} />
          <div className="logo-text">CHRONICLE</div>
        </div>

        <button className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <div className="nav-links">
          {isAppView ? (
            <>
              <div className={`nav-link ${currentView === 'cabinet' ? 'active' : ''}`} onClick={() => handleNav('cabinet')}>Dashboard</div>
              <div className={`nav-link ${currentView === 'characters' ? 'active' : ''}`} onClick={() => handleNav('characters')}>Characters</div>
              <div className="nav-link">Campaigns</div>
            </>
          ) : (
            <>
              <div className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => handleNav('home')}>Home</div>
              <div className={`nav-link ${currentView === 'pricing' ? 'active' : ''}`} onClick={() => handleNav('pricing')}>Pricing</div>
              <div className={`nav-link ${currentView === 'faq' ? 'active' : ''}`} onClick={() => handleNav('faq')}>FAQ</div>
              <div className={`nav-link ${currentView === 'contact' ? 'active' : ''}`} onClick={() => handleNav('contact')}>Contact Us</div>
            </>
          )}
        </div>
        
        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => handleNav('cabinet')}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} color="white" />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.username}</span>
              </div>
              <button className="btn-secondary" onClick={() => { handleLogout(); handleNav('home'); }}>Log Out</button>
            </div>
          ) : (
            <>
              <button className="btn-secondary" onClick={() => handleNav('login')}>Log In</button>
              <button className="btn-primary" onClick={() => handleNav('register')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Hero Slider Component
const HeroSliderComponent = ({ setView }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Roll Initiative.",
      subtitle: "The definitive digital toolset for D&D. Eliminate the math, maximize the story.",
      btnText: "Get Started Free",
      action: () => setView('register'),
      bgImage: "/wide_dragon_1780139417206.png"
    },
    {
      title: "Build a Hero.",
      subtitle: "Our intuitive wizard guides you through official rules to create a character in minutes.",
      btnText: "Open Builder",
      action: () => setView('characters'),
      bgImage: "/wide_dwarf_1780139431117.png"
    },
    {
      title: "Master the Game.",
      subtitle: "Run campaigns with dynamic fog of war, combat tracking, and instant rules reference.",
      btnText: "View Plans",
      action: () => setView('pricing'),
      bgImage: "/wide_master_1780139445890.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero-bento">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ 
              backgroundImage: `linear-gradient(to right, rgba(15,16,20,0.95) 0%, rgba(15,16,20,0.5) 50%, rgba(15,16,20,0.1) 100%), url('${slide.bgImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center'
            }}
          >
            <h1 style={{ position: 'relative', zIndex: 3 }}>{slide.title}</h1>
            <p style={{ position: 'relative', zIndex: 3 }}>{slide.subtitle}</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', position: 'relative', zIndex: 3 }}>
              <button className="btn-primary" onClick={slide.action}>{slide.btnText} <Play size={12} fill="currentColor" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="progress-bar-container">
        {slides.map((_, index) => (
          <div key={index} className="progress-segment" onClick={() => setCurrentSlide(index)} style={{ cursor: 'pointer' }}>
            <div 
              className={`progress-fill ${
                index < currentSlide ? 'completed' : 
                index === currentSlide ? 'animating' : ''
              }`}
              key={`${index}-${currentSlide === index ? 'active' : 'inactive'}`}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Landing Page (Home)
const LandingPage = ({ setView }) => {
  return (
    <>
      <div className="hero-container">
        <HeroSliderComponent setView={setView} />
        <div className="hero-side-bento">
          <div className="side-bento-card" onClick={() => setView('characters')}>
            <Book size={20} color="var(--accent-red)" style={{ marginBottom: '0.4rem', zIndex: 2 }} />
            <h3>Character Builder</h3>
            <p>Intuitive creator</p>
          </div>
          <div className="side-bento-card" onClick={() => setView('pricing')}>
            <div className="image-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519080277811-2eb2e48231c6?q=80&w=800&auto=format&fit=crop')" }}></div>
            <h3>Epic Campaigns</h3>
            <p style={{ color: '#fff' }}>Join the adventure</p>
          </div>
        </div>
      </div>

      <section className="section-wrapper alt">
        <div className="section-header">
          <h2 className="section-title">Everything you need to run epic games</h2>
          <p className="section-subtitle">We remove the friction from tabletop gaming so you can focus on what matters most: the story.</p>
        </div>
        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon"><Calculator size={18} /></div>
            <h3>Automated Rules</h3>
            <p>Rolls, modifiers, and damage are calculated instantly based on the official SRD ruleset.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><CloudLightning size={18} /></div>
            <h3>Cloud Sync</h3>
            <p>Access your sheets and notes from your phone, tablet, or browser seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Users size={18} /></div>
            <h3>Master the Campaign</h3>
            <p>DMs can see players' stats live, track initiative, and manage inventory.</p>
          </div>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">From zero to hero in minutes</h2>
          <p className="section-subtitle">A streamlined process to get you rolling dice faster.</p>
        </div>
        <div className="grid-3">
          <div className="feature-card" style={{ background: 'transparent', border: 'none', padding: '1rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--border-color)', marginBottom: '-1.5rem', textAlign: 'left' }}>01</div>
            <h3 style={{ textAlign: 'left' }}>Build your character</h3>
            <p style={{ textAlign: 'left' }}>Use our guided wizard to select your race, class, background, and stats without reading hundreds of pages.</p>
          </div>
          <div className="feature-card" style={{ background: 'transparent', border: 'none', padding: '1rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--border-color)', marginBottom: '-1.5rem', textAlign: 'left' }}>02</div>
            <h3 style={{ textAlign: 'left' }}>Join a campaign</h3>
            <p style={{ textAlign: 'left' }}>Click your DM's invite link to instantly drop your character into their virtual world.</p>
          </div>
          <div className="feature-card" style={{ background: 'transparent', border: 'none', padding: '1rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent-glow)', marginBottom: '-1.5rem', textAlign: 'left' }}>03</div>
            <h3 style={{ textAlign: 'left' }}>Roll the dice</h3>
            <p style={{ textAlign: 'left' }}>Experience stunning 3D dice physics directly on your sheet, instantly synced to your entire party.</p>
          </div>
        </div>
      </section>

      <section className="section-wrapper alt">
        <div className="section-header">
          <h2 className="section-title">Play your favorite systems</h2>
          <p className="section-subtitle">Built from the ground up to support multiple TTRPG rulesets.</p>
        </div>
        <div className="grid-2">
          <div className="feature-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
            <img src="/DnD-Symbol.png" alt="D&D 5e" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div>
              <h3>Dungeons & Dragons 5e</h3>
              <p style={{ margin: 0 }}>Full SRD support, monsters, and spells.</p>
            </div>
          </div>
          <div className="feature-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
            <Compass size={40} color="var(--accent-red)" />
            <div>
              <h3>Pathfinder 2e</h3>
              <p style={{ margin: 0 }}>Complete character options and actions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrapper">
        <div className="section-header">
          <h2 className="section-title">The Ultimate Virtual Tabletop</h2>
          <p className="section-subtitle">Dynamic lighting, line of sight, and integrated combat tracking right in your browser.</p>
        </div>
        <div style={{ maxWidth: '1000px', margin: '0 auto', borderRadius: 'var(--border-radius-large)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '100%', height: '350px', backgroundImage: 'url("/wide_master_1780139445890.png")', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>Try Demo</button>
          </div>
        </div>
      </section>

      <section className="section-wrapper alt">
        <div className="section-header">
          <h2 className="section-title">Community Reviews</h2>
        </div>
        <div className="grid-2">
          <div className="feature-card" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', color: '#ffcc00', marginBottom: '0.5rem' }}><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/></div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: 'var(--text-main)' }}>"Chronicle cut my session prep time in half. Having all my players' sheets integrated into the VTT is a game-changer for our group."</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--border-color)' }}></div>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '0.75rem' }}>Matthew M.</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>Dungeon Master</p>
              </div>
            </div>
          </div>
          <div className="feature-card" style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', color: '#ffcc00', marginBottom: '0.5rem' }}><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/><Star fill="currentColor" size={12}/></div>
            <p style={{ fontStyle: 'italic', marginBottom: '1rem', color: 'var(--text-main)' }}>"I was intimidated by D&D math. The character builder holds your hand through the whole process. I absolutely love it!"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--border-color)' }}></div>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0, fontSize: '0.75rem' }}>Sarah J.</p>
                <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-muted)' }}>Player</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrapper" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <Shield size={48} color="var(--accent-red)" style={{ margin: '0 auto 1rem' }} />
        <h2 className="section-title">Join 50,000+ Adventurers</h2>
        <p className="section-subtitle" style={{ marginBottom: '1.5rem' }}>Our Discord community is the best place to find groups, share homebrew, and get direct support from developers.</p>
        <button className="btn-secondary">Join the Tavern</button>
      </section>
    </>
  );
};

// Detailed Pricing Page Component
const PricingPage = ({ setView }) => (
  <section className="section-wrapper">
    <div className="section-header">
      <h1 className="section-title">Simple, transparent pricing</h1>
      <p className="section-subtitle">Whether you're a casual player or a dedicated Dungeon Master, we have a plan for you.</p>
    </div>
    
    <div className="grid-3" style={{ maxWidth: '1000px' }}>
      {/* Free Tier */}
      <div className="pricing-card">
        <div className="pricing-header">
          <h3 className="pricing-tier">Initiate</h3>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600 }}>FREE FOREVER</div>
        </div>
        <div className="price-tag">$0<span>/mo</span></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', minHeight: '40px' }}>Perfect to test the waters and play in a campaign.</p>
        <ul className="pricing-features">
          <li><Check size={14} color="var(--text-muted)" /> Up to 3 Characters</li>
          <li><Check size={14} color="var(--text-muted)" /> Basic Digital Dice</li>
          <li><Check size={14} color="var(--text-muted)" /> Join Campaigns as Player</li>
        </ul>
        <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setView('register')}>Start Free</button>
      </div>

      {/* Hero Tier */}
      <div className="pricing-card">
        <div className="pricing-header">
          <h3 className="pricing-tier">Hero Tier</h3>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600 }}>FOR PLAYERS</div>
        </div>
        <div className="price-tag">$4.99<span>/mo</span></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', minHeight: '40px' }}>Everything a player needs to manage multiple characters.</p>
        <ul className="pricing-features">
          <li><Check size={14} color="var(--accent-red)" /> Unlimited Character Sheets</li>
          <li><Check size={14} color="var(--accent-red)" /> Premium 3D Dice Skins</li>
          <li><Check size={14} color="var(--accent-red)" /> Custom Avatars & Frames</li>
          <li><Check size={14} color="var(--accent-red)" /> Seamless Cloud Sync</li>
        </ul>
        <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setView('register')}>Subscribe as Player</button>
      </div>

      {/* Master Tier */}
      <div className="pricing-card featured">
        <div className="pricing-badge">BEST VALUE</div>
        <div className="pricing-header">
          <h3 className="pricing-tier" style={{ color: 'var(--accent-red)' }}>Master Tier</h3>
          <div style={{ background: 'var(--accent-red)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 700 }}>FOR MASTERS</div>
        </div>
        <div className="price-tag">$9.99<span>/mo</span></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem', minHeight: '40px' }}>The ultimate toolset for Dungeon Masters to run sessions.</p>
        <ul className="pricing-features">
          <li style={{ color: 'white', fontWeight: 'bold' }}><Check size={14} color="var(--accent-red)" /> All Hero features included</li>
          <li><Check size={14} color="var(--accent-red)" /> Host fully-featured VTT</li>
          <li><Check size={14} color="var(--accent-red)" /> Content Sharing with group</li>
          <li><Check size={14} color="var(--accent-red)" /> Encounter Builder & Tracker</li>
        </ul>
        <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setView('register')}>Upgrade to Master</button>
      </div>
    </div>
    
    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>🔒 14-day money-back guarantee. Cancel anytime.</p>
    </div>
  </section>
);

// Detailed FAQ Page Component
const FaqPage = () => {
  const faqsGeneral = [
    { q: "Do I need a subscription to play?", a: "No, Chronicle offers a free tier that allows you to create up to 3 characters and join campaigns. Premium tiers unlock unlimited characters and VTT hosting." },
    { q: "Can I import my existing characters?", a: "Currently, you must build characters using our intuitive builder, but we are working on import tools for popular formats." }
  ];
  
  const faqsVTT = [
    { q: "Does Chronicle support homebrew content?", a: "Yes! Master Tier subscribers can create custom monsters, items, and spells, and share them with their entire campaign." },
    { q: "Is the VTT mobile friendly?", a: "Character sheets and dice rolling are fully optimized for mobile devices. However, we highly recommend using a tablet or desktop for running the Virtual Tabletop." },
    { q: "Can I upload my own maps?", a: "Yes, Master Tier allows up to 2GB of custom map uploads, supporting dynamic lighting boundaries." }
  ];

  return (
    <section className="section-wrapper" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="section-header">
        <h1 className="section-title">Frequently Asked Questions</h1>
        <p className="section-subtitle">Find answers to common questions about Chronicle.</p>
      </div>
      
      <h3 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>General & Billing</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
        {faqsGeneral.map((faq, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: 'var(--border-radius-large)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
              {faq.q}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{faq.a}</p>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: '1rem', color: 'var(--accent-red)' }}>VTT & Features</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {faqsVTT.map((faq, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: 'var(--border-radius-large)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem', display: 'flex', justifyContent: 'space-between' }}>
              {faq.q}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Detailed Contact Page Component
const ContactPage = () => (
  <section className="section-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--border-radius-large)', border: '1px solid var(--border-color)', width: '100%', maxWidth: '600px' }}>
      <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.85rem' }}>Have a question, feature request, or need billing support? We'd love to hear from you.</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <Mail size={20} color="var(--accent-red)" style={{ margin: '0 auto 0.5rem' }} />
          <h4 style={{ fontSize: '0.85rem' }}>Email Support</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>support@chronicle.app</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <MessageSquare size={20} color="var(--accent-red)" style={{ margin: '0 auto 0.5rem' }} />
          <h4 style={{ fontSize: '0.85rem' }}>Community</h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>discord.gg/chronicle</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <input type="text" placeholder="Your Name" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
          <input type="email" placeholder="Your Email" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
        </div>
        <select style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }}>
          <option>General Inquiry</option>
          <option>Billing Support</option>
          <option>Bug Report</option>
          <option>Feature Request</option>
        </select>
        <textarea placeholder="How can we help?" rows="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', resize: 'vertical' }}></textarea>
        <button className="btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '0.5rem' }}>Send Message</button>
      </div>
    </div>
  </section>
);

// Footer
const Footer = () => (
  <footer className="footer-section">
    <div className="footer-grid">
      <div className="footer-column">
        <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img src="/DnD-Symbol.png" style={{ width: '24px', objectFit: 'contain' }} alt="D&D" />
          Chronicle
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>The ultimate digital companion for the world's greatest roleplaying game.</p>
      </div>
      
      <div className="footer-column">
        <h4>Platform</h4>
        <ul>
          <li><a href="#">Character Builder</a></li>
          <li><a href="#">Virtual Tabletop</a></li>
          <li><a href="#">Campaign Manager</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Resources</h4>
        <ul>
          <li><a href="#">Help Center</a></li>
          <li><a href="#">Forums</a></li>
          <li><a href="#">API Docs</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h4>Company</h4>
        <ul>
          <li><a href="#">About Us</a></li>
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 Chronicle Inc. Not affiliated with Wizards of the Coast or Hasbro. Located in Seattle, WA.</p>
    </div>
  </footer>
);

// Advanced Auth Component with Local Storage DB Logic
const AuthCard = ({ isLogin, setView, handleAuthSubmit }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Player');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    
    if (isLogin) {
      if (!email || !password) return setError('Please fill all fields');
      const res = handleAuthSubmit({ type: 'login', email, password });
      if (!res.success) setError(res.message);
    } else {
      if (!email || !password || !username) return setError('Please fill all fields');
      const res = handleAuthSubmit({ type: 'register', email, username, password, role });
      if (!res.success) setError(res.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
      <form onSubmit={submit} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-large)', padding: '2rem', width: '100%', maxWidth: '340px', textAlign: 'center' }}>
        <img src="/DnD-Symbol.png" alt="D&D" style={{ width: '60px', margin: '0 auto 1rem', display: 'block' }} />
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{isLogin ? 'Welcome Back' : 'Join Chronicle'}</h2>
        
        {error && (
          <div style={{ background: 'rgba(255,0,0,0.1)', color: '#ff6b6b', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}
        
        {!isLogin && (
          <>
            <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>Choose Your Role</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div 
                  onClick={() => setRole('Player')}
                  style={{ flex: 1, padding: '0.6rem', textAlign: 'center', borderRadius: '6px', cursor: 'pointer', border: `1px solid ${role === 'Player' ? 'var(--accent-red)' : 'var(--border-color)'}`, background: role === 'Player' ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,0,0.5)' }}
                >
                  <Sword size={16} style={{ marginBottom: '0.2rem' }} />
                  <div style={{ fontSize: '0.8rem' }}>Player</div>
                </div>
                <div 
                  onClick={() => setRole('Dungeon Master')}
                  style={{ flex: 1, padding: '0.6rem', textAlign: 'center', borderRadius: '6px', cursor: 'pointer', border: `1px solid ${role === 'Dungeon Master' ? 'var(--accent-red)' : 'var(--border-color)'}`, background: role === 'Dungeon Master' ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,0,0.5)' }}
                >
                  <MapIcon size={16} style={{ marginBottom: '0.2rem' }} />
                  <div style={{ fontSize: '0.8rem' }}>Master</div>
                </div>
              </div>
            </div>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
          </>
        )}
        
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
        
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>{isLogin ? 'Log In' : 'Create Account'}</button>
        
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isLogin ? "New here? " : "Already have an account? "}
          <span style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setView(isLogin ? 'register' : 'login')}>
            {isLogin ? "Sign Up" : "Log In"}
          </span>
        </p>
      </form>
    </div>
  );
};

// Detailed Role-Based Dashboard
const CabinetScreen = ({ setView, user, handleUpdateUser }) => {
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  if (!user) return null;

  const isMaster = user.role === 'Dungeon Master';

  const baseAvatars = [
    '/avatar_elf_1780141857357.png',
    '/avatar_paladin_1780141870423.png',
    '/avatar_tiefling_1780141885008.png',
    '/avatar_dm_1780141901714.png',
    '/avatar_orc_1780142086104.png',
    '/avatar_halfling_1780142102199.png',
    '/avatar_dragonborn_1780142115560.png',
    '/avatar_gnome_1780142128608.png',
    '/avatar_cleric_1780142656621.png',
    '/avatar_bard_1780142670855.png'
  ];

  // Just use the 10 unique high quality ones
  const PRESET_AVATARS = baseAvatars.map(url => ({ url }));

  const updateAvatar = (url) => {
    handleUpdateUser({ avatar: url });
    setShowAvatarSelector(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateUser({ avatar: reader.result });
        setShowAvatarSelector(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Welcome back, {user.username}</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>Here's what's happening in your adventures.</p>
        </div>
      </div>
      
      <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr' }}>
        {/* Profile Card */}
        <div className="feature-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
          <div 
            style={{ 
              background: user.avatar ? `url(${user.avatar}) center/cover` : (isMaster ? 'var(--accent-red)' : 'var(--border-color)'), 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1rem', 
              border: '4px solid var(--accent-red)'
            }}
          >
            {!user.avatar && (isMaster ? <MapIcon size={40} color="white" /> : <Sword size={40} color="white" />)}
          </div>
          
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>{user.username}</h2>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 600, marginTop: '0.5rem', color: isMaster ? 'var(--accent-red)' : 'white' }}>
            {user.role.toUpperCase()}
          </div>
          
          <div style={{ width: '100%', height: '1px', background: 'var(--border-color)', margin: '1.5rem 0' }}></div>
          
          {/* Avatar Selector Modal */}
          {showAvatarSelector && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowAvatarSelector(false)}>
              <div style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--border-color)', width: '100%', maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0 }}>Choose Avatar</h3>
                  <X size={20} cursor="pointer" onClick={() => setShowAvatarSelector(false)} />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.8rem', marginBottom: '1.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {PRESET_AVATARS.map((preset, i) => (
                    <img 
                      key={i} 
                      src={preset.url} 
                      alt="Preset" 
                      onClick={() => updateAvatar(preset.url)}
                      style={{ 
                        width: '100%', 
                        aspectRatio: '1/1',
                        objectFit: 'cover', 
                        borderRadius: '50%', 
                        cursor: 'pointer', 
                        border: user.avatar === preset.url ? '2px solid var(--accent-red)' : '2px solid transparent'
                      }} 
                    />
                  ))}
                </div>
                
                <label className="btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '0.8rem', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
                  Upload Custom Image
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}

          <div style={{ width: '100%', textAlign: 'left', marginBottom: '1.5rem' }}>
            <button className="btn-secondary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }} onClick={() => setShowAvatarSelector(true)}>Change Avatar</button>
          </div>
          
          <div style={{ width: '100%', textAlign: 'left' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Quick Actions</h4>
            {isMaster ? (
              <>
                <button className="btn-primary" style={{ width: '100%', marginBottom: '0.5rem', padding: '0.6rem', fontSize: '0.8rem' }}><Plus size={14} style={{ marginRight: '0.4rem' }}/> New Campaign</button>
                <button className="btn-secondary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}><Plus size={14} style={{ marginRight: '0.4rem' }}/> Create Homebrew</button>
              </>
            ) : (
              <>
                <button className="btn-primary" style={{ width: '100%', marginBottom: '0.5rem', padding: '0.6rem', fontSize: '0.8rem' }} onClick={() => setView('characters')}><Plus size={14} style={{ marginRight: '0.4rem' }}/> Create Character</button>
                <button className="btn-secondary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}><Search size={14} style={{ marginRight: '0.4rem' }}/> Join Campaign</button>
              </>
            )}
          </div>
        </div>
        
        {/* Main Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Campaigns Section */}
          <div className="feature-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Scroll size={20} color="var(--accent-red)"/> My Campaigns</h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>You don't have any active campaigns yet.</p>
              <button className="btn-secondary" style={{ marginTop: '1rem' }}>{isMaster ? 'Create Your First Campaign' : 'Find a Campaign'}</button>
            </div>
          </div>

          {/* Characters / Homebrew Section */}
          <div className="feature-card" style={{ textAlign: 'left', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {isMaster ? <Book size={20} color="var(--accent-red)"/> : <Shield size={20} color="var(--accent-red)"/>} 
              {isMaster ? 'My Homebrew Content' : 'My Characters'}
            </h3>
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px dashed var(--border-color)', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {isMaster ? "Create custom monsters, items, and spells to use in your campaigns." : "Create your first hero to start your adventure."}
              </p>
              {isMaster ? null : <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setView('characters')}>Open Character Builder</button>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || 'home';
  });
  const [user, setUser] = useState(null);

  // Sync view state to URL hash so refreshing works
  useEffect(() => {
    window.location.hash = view;
  }, [view]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== view) {
        setView(hash || 'home');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [view]);

  // Load user from local mock DB on mount
  useEffect(() => {
    const session = localStorage.getItem('currentUser');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  // Mock DB Logic
  const handleUpdateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  const handleAuthSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (data.type === 'register') {
      if (users.find(u => u.email === data.email)) {
        return { success: false, message: 'Email already in use' };
      }
      const newUser = { id: Date.now(), username: data.username, email: data.email, password: data.password, role: data.role, avatar: null };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Auto login
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      setView('cabinet');
      return { success: true };
    } 
    
    if (data.type === 'login') {
      const foundUser = users.find(u => u.email === data.email && u.password === data.password);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setView('cabinet');
        return { success: true };
      }
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    setView('home');
  };

  const renderContent = () => {
    switch(view) {
      case 'home': return <LandingPage setView={setView} />;
      case 'pricing': return <PricingPage setView={setView} />;
      case 'faq': return <FaqPage />;
      case 'contact': return <ContactPage />;
      case 'characters':
        return (
          <div style={{ padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center' }}>Character Builder</h1>
            <CharacterGenerator />
          </div>
        );
      case 'login': return <AuthCard isLogin={true} setView={setView} handleAuthSubmit={handleAuthSubmit} />;
      case 'register': return <AuthCard isLogin={false} setView={setView} handleAuthSubmit={handleAuthSubmit} />;
      case 'cabinet': return <CabinetScreen setView={setView} user={user} handleUpdateUser={handleUpdateUser} />;
      default: return <LandingPage setView={setView} />;
    }
  };

  return (
    <>
      <Header currentView={view} setView={setView} user={user} handleLogout={handleLogout} />
      {renderContent()}
      <Footer />
    </>
  );
}

export default App;
