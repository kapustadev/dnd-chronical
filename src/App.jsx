import React, { useState, useEffect } from 'react';
import {
  Menu, X, Book, Calculator, User, Play, Check, Star, CloudLightning,
  Users, Globe, Mail, MessageSquare, Sword, Shield, Map as MapIcon, Compass,
  AlertCircle, Scroll, Search, Plus, Trash2, Edit3, Download, UserPlus,
  UserCheck, UserX, Trophy, ChevronRight, Copy, Bell
} from 'lucide-react';
import CharacterGenerator from './components/CharacterGenerator';
import { supabase } from './supabaseClient';

// ─── Supabase Auth helpers ────────────────────────────────────────────────────
async function signUp({ email, password, username, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username, role } }
  });
  if (error) return { success: false, message: error.message };
  return { success: true, user: data.user };
}

async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message };
  return { success: true, user: data.user };
}

async function signOut() {
  await supabase.auth.signOut();
}

async function getProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
}

async function updateProfile(userId, updates) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
  return !error;
}

// ─── Header ──────────────────────────────────────────────────────────────────
const Header = ({ currentView, setView, user, profile, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');
  const [systemOpen, setSystemOpen] = useState(false);
  const [currentSystem, setCurrentSystem] = useState('D&D 5e');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const languages = ['English', 'Español', 'Français', 'Deutsch', 'Italiano', 'Русский'];
  const systems = ['D&D 5e', 'Pathfinder 2e'];
  const handleNav = (v) => { setView(v); setMenuOpen(false); };
  const isAppView = ['cabinet','characters','campaigns'].includes(currentView);

  useEffect(() => {
    if (user) loadNotifications();
  }, [user]);

  const loadNotifications = async () => {
    const { data } = await supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
    if (data) setNotifications(data);
  };

  const markAsRead = async (n) => {
    if (!n.is_read) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', n.id);
      setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
    }
    setNotificationsOpen(false);
    if (n.type === 'friend_request') setView('cabinet');
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className={`header-wrapper ${menuOpen ? 'nav-active' : ''}`}>
      <div className="top-bar">
        <div style={{ position: 'relative' }} onMouseLeave={() => setSystemOpen(false)}>
          <div className="language-selector" onClick={() => setSystemOpen(!systemOpen)}>
            <Sword size={12} /> {currentSystem}
          </div>
          <div className={`lang-dropdown ${systemOpen ? 'open' : ''}`} style={{ left: 0, right: 'auto' }}>
            {systems.map(s => <div key={s} className="lang-option" onClick={() => { setCurrentSystem(s); setSystemOpen(false); }}>{s}</div>)}
          </div>
        </div>
        <div style={{ position: 'relative' }} onMouseLeave={() => setLangOpen(false)}>
          <div className="language-selector" onClick={() => setLangOpen(!langOpen)}>
            <Globe size={12} /> {currentLang}
          </div>
          <div className={`lang-dropdown ${langOpen ? 'open' : ''}`}>
            {languages.map(l => <div key={l} className="lang-option" onClick={() => { setCurrentLang(l); setLangOpen(false); }}>{l}</div>)}
          </div>
        </div>
      </div>

      <div className="main-nav">
        <div className="logo-container" onClick={() => handleNav('home')}>
          <img src="/DnD-Symbol.png" alt="D&D" className="logo-image" style={{ objectPosition: 'top' }} />
          <div className="logo-text">CHRONICLE</div>
        </div>
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="nav-links">
          {isAppView ? (
            <>
              <div className={`nav-link ${currentView === 'cabinet' ? 'active' : ''}`} onClick={() => handleNav('cabinet')}>Dashboard</div>
              <div className={`nav-link ${currentView === 'characters' ? 'active' : ''}`} onClick={() => handleNav('characters')}>Characters</div>
              <div className={`nav-link ${currentView === 'campaigns' ? 'active' : ''}`} onClick={() => handleNav('campaigns')}>Campaigns</div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setNotificationsOpen(!notificationsOpen)}>
                  <Bell size={20} color="var(--text-muted)" />
                  {unreadCount > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--accent-red)', color: 'white', fontSize: '0.6rem', fontWeight: 'bold', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unreadCount}</div>}
                </div>
                {notificationsOpen && (
                  <div style={{ position: 'absolute', top: '100%', right: '-10px', marginTop: '10px', width: '320px', background: 'var(--bg-section)', border: '1px solid var(--border-color)', borderRadius: '12px', zIndex: 300, padding: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Notifications</span>
                      {unreadCount > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }} onClick={() => notifications.forEach(n => markAsRead(n))}>Mark all read</span>}
                    </div>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No new notifications</div>
                    ) : (
                      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {notifications.map(n => (
                          <div key={n.id} onClick={() => markAsRead(n)} style={{ padding: '0.75rem', borderRadius: '8px', background: n.is_read ? 'transparent' : 'rgba(228, 7, 18, 0.05)', cursor: 'pointer', marginBottom: '4px', borderLeft: n.is_read ? '3px solid transparent' : '3px solid var(--accent-red)' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px', color: n.is_read ? 'var(--text-muted)' : 'white' }}>{n.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.message}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => handleNav('cabinet')}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: profile?.avatar_url ? `url(${profile.avatar_url}) center/cover` : 'var(--accent-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!profile?.avatar_url && <User size={16} color="white" />}
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{profile?.username}</span>
              </div>
              <button className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={handleLogout}>Log Out</button>
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

// ─── Landing page sections (unchanged) ───────────────────────────────────────
const HeroSliderComponent = ({ setView }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { title: "Roll Initiative.", subtitle: "The definitive digital toolset for D&D. Eliminate the math, maximize the story.", btnText: "Get Started Free", action: () => setView('register'), bgImage: "/wide_dragon_1780139417206.png" },
    { title: "Build a Hero.", subtitle: "Our intuitive wizard guides you through official rules to create a character in minutes.", btnText: "Open Builder", action: () => setView('characters'), bgImage: "/wide_dwarf_1780139431117.png" },
    { title: "Master the Game.", subtitle: "Run campaigns with dynamic fog of war, combat tracking, and instant rules reference.", btnText: "View Plans", action: () => setView('pricing'), bgImage: "/wide_master_1780139445890.png" }
  ];
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);
  return (
    <div className="hero-bento">
      <div className="hero-slider">
        {slides.map((slide, i) => (
          <div key={i} className={`hero-slide ${i === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(to right, rgba(15,16,20,0.95) 0%, rgba(15,16,20,0.5) 50%, rgba(15,16,20,0.1) 100%), url('${slide.bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'right center' }}>
            <h1 style={{ position: 'relative', zIndex: 3 }}>{slide.title}</h1>
            <p style={{ position: 'relative', zIndex: 3 }}>{slide.subtitle}</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', position: 'relative', zIndex: 3 }}>
              <button className="btn-primary" onClick={slide.action}>{slide.btnText} <Play size={12} fill="currentColor" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="progress-bar-container">
        {slides.map((_, i) => (
          <div key={i} className="progress-segment" onClick={() => setCurrentSlide(i)} style={{ cursor: 'pointer' }}>
            <div className={`progress-fill ${i < currentSlide ? 'completed' : i === currentSlide ? 'animating' : ''}`} key={`${i}-${currentSlide === i ? 'a' : 'i'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LandingPage = ({ setView }) => (
  <>
    <div className="hero-container">
      <HeroSliderComponent setView={setView} />
      <div className="hero-side-bento">
        <div className="side-bento-card" onClick={() => setView('characters')}>
          <Book size={20} color="var(--accent-red)" style={{ marginBottom: '0.4rem', zIndex: 2 }} />
          <h3>Character Builder</h3><p>Intuitive creator</p>
        </div>
        <div className="side-bento-card" onClick={() => setView('pricing')}>
          <div className="image-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519080277811-2eb2e48231c6?q=80&w=800&auto=format&fit=crop')" }}></div>
          <h3>Epic Campaigns</h3><p style={{ color: '#fff' }}>Join the adventure</p>
        </div>
      </div>
    </div>
    <section className="section-wrapper alt">
      <div className="section-header">
        <h2 className="section-title">Everything you need to run epic games</h2>
        <p className="section-subtitle">We remove the friction from tabletop gaming so you can focus on what matters most: the story.</p>
      </div>
      <div className="grid-3">
        <div className="feature-card"><div className="feature-icon"><Calculator size={18} /></div><h3>Automated Rules</h3><p>Rolls, modifiers, and damage are calculated instantly based on the official SRD ruleset.</p></div>
        <div className="feature-card"><div className="feature-icon"><CloudLightning size={18} /></div><h3>Cloud Sync</h3><p>Access your sheets and notes from your phone, tablet, or browser seamlessly.</p></div>
        <div className="feature-card"><div className="feature-icon"><Users size={18} /></div><h3>Master the Campaign</h3><p>DMs can see players' stats live, track initiative, and manage inventory.</p></div>
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

const PricingPage = ({ setView }) => (
  <section className="section-wrapper">
    <div className="section-header">
      <h1 className="section-title">Simple, transparent pricing</h1>
      <p className="section-subtitle">Whether you're a casual player or a dedicated Dungeon Master, we have a plan for you.</p>
    </div>
    <div className="grid-3" style={{ width: '80%', margin: '0 auto' }}>
      <div className="pricing-card">
        <div className="pricing-header"><h3 className="pricing-tier">Initiate</h3><div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600 }}>FREE FOREVER</div></div>
        <div className="price-tag">$0<span>/mo</span></div>
        <ul className="pricing-features">
          <li><Check size={14} color="var(--text-muted)" /> Up to 3 Characters</li>
          <li><Check size={14} color="var(--text-muted)" /> Basic Digital Dice</li>
          <li><Check size={14} color="var(--text-muted)" /> Join Campaigns as Player</li>
        </ul>
        <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setView('register')}>Start Free</button>
      </div>
      <div className="pricing-card">
        <div className="pricing-header"><h3 className="pricing-tier">Hero Tier</h3><div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 600 }}>FOR PLAYERS</div></div>
        <div className="price-tag">$4.99<span>/mo</span></div>
        <ul className="pricing-features">
          <li><Check size={14} color="var(--accent-red)" /> Unlimited Character Sheets</li>
          <li><Check size={14} color="var(--accent-red)" /> Premium 3D Dice Skins</li>
          <li><Check size={14} color="var(--accent-red)" /> Custom Avatars & Frames</li>
        </ul>
        <button className="btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setView('register')}>Subscribe as Player</button>
      </div>
      <div className="pricing-card featured">
        <div className="pricing-badge">BEST VALUE</div>
        <div className="pricing-header"><h3 className="pricing-tier" style={{ color: 'var(--accent-red)' }}>Master Tier</h3><div style={{ background: 'var(--accent-red)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '100px', fontSize: '0.6rem', fontWeight: 700 }}>FOR MASTERS</div></div>
        <div className="price-tag">$9.99<span>/mo</span></div>
        <ul className="pricing-features">
          <li style={{ color: 'white', fontWeight: 'bold' }}><Check size={14} color="var(--accent-red)" /> All Hero features included</li>
          <li><Check size={14} color="var(--accent-red)" /> Host fully-featured VTT</li>
          <li><Check size={14} color="var(--accent-red)" /> Encounter Builder & Tracker</li>
        </ul>
        <button className="btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setView('register')}>Upgrade to Master</button>
      </div>
    </div>
  </section>
);

const FaqPage = () => {
  const faqs = [
    { q: "Do I need a subscription to play?", a: "No, Chronicle offers a free tier that allows you to create up to 3 characters and join campaigns." },
    { q: "Can I import my existing characters?", a: "Currently, you must build characters using our intuitive builder, but import tools are coming soon." },
    { q: "Does Chronicle support homebrew content?", a: "Yes! Master Tier subscribers can create custom monsters, items, and spells." },
    { q: "Is the VTT mobile friendly?", a: "Character sheets and dice rolling are fully optimized for mobile. We recommend a tablet or desktop for the VTT." }
  ];
  return (
    <section className="section-wrapper" style={{ width: '80%', margin: '0 auto' }}>
      <div className="section-header"><h1 className="section-title">Frequently Asked Questions</h1></div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {faqs.map((f, i) => (
          <div key={i} style={{ background: 'var(--bg-card)', padding: '1.2rem', borderRadius: 'var(--border-radius-large)', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.4rem' }}>{f.q}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const ContactPage = () => (
  <section className="section-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--border-radius-large)', border: '1px solid var(--border-color)', width: '80%' }}>
      <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Contact Us</h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.85rem' }}>Have a question or feature request? We'd love to hear from you.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <Mail size={20} color="var(--accent-red)" style={{ margin: '0 auto 0.5rem' }} /><h4 style={{ fontSize: '0.85rem' }}>Email Support</h4><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>support@chronicle.app</p>
        </div>
        <div style={{ textAlign: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <MessageSquare size={20} color="var(--accent-red)" style={{ margin: '0 auto 0.5rem' }} /><h4 style={{ fontSize: '0.85rem' }}>Community</h4><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>discord.gg/chronicle</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <input type="text" placeholder="Your Name" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
          <input type="email" placeholder="Your Email" style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
        </div>
        <textarea placeholder="How can we help?" rows="4" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', resize: 'vertical' }}></textarea>
        <button className="btn-primary" style={{ width: '100%', padding: '0.8rem' }}>Send Message</button>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer-section">
    <div className="footer-grid">
      <div className="footer-column">
        <h4 style={{ color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <img src="/DnD-Symbol.png" style={{ width: '24px', objectFit: 'contain' }} alt="D&D" /> Chronicle
        </h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.5 }}>The ultimate digital companion for the world's greatest roleplaying game.</p>
      </div>
      <div className="footer-column"><h4>Platform</h4><ul><li><a href="#">Character Builder</a></li><li><a href="#">Virtual Tabletop</a></li><li><a href="#">Campaign Manager</a></li></ul></div>
      <div className="footer-column"><h4>Resources</h4><ul><li><a href="#">Help Center</a></li><li><a href="#">Forums</a></li><li><a href="#">API Docs</a></li></ul></div>
      <div className="footer-column"><h4>Company</h4><ul><li><a href="#">About Us</a></li><li><a href="#">Privacy Policy</a></li><li><a href="#">Terms of Service</a></li></ul></div>
    </div>
    <div className="footer-bottom"><p>© 2026 Chronicle Inc. Not affiliated with Wizards of the Coast or Hasbro.</p></div>
  </footer>
);

// ─── Auth Form ────────────────────────────────────────────────────────────────
const AuthCard = ({ isLogin, setView, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Player');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (isLogin) {
      const res = await signIn({ email, password });
      if (!res.success) { setError(res.message); setLoading(false); return; }
    } else {
      if (!email || !password || !username) { setError('Please fill all fields'); setLoading(false); return; }
      const res = await signUp({ email, password, username, role });
      if (!res.success) { setError(res.message); setLoading(false); return; }
    }
    setLoading(false);
    onAuthSuccess();
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
                {['Player', 'Dungeon Master'].map(r => (
                  <div key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: '0.6rem', textAlign: 'center', borderRadius: '6px', cursor: 'pointer', border: `1px solid ${role === r ? 'var(--accent-red)' : 'var(--border-color)'}`, background: role === r ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,0,0.5)', fontSize: '0.8rem' }}>
                    {r === 'Player' ? <Sword size={14} style={{ marginBottom: '0.2rem', display: 'block', margin: '0 auto 0.2rem' }} /> : <MapIcon size={14} style={{ marginBottom: '0.2rem', display: 'block', margin: '0 auto 0.2rem' }} />}
                    {r === 'Player' ? 'Player' : 'Master'}
                  </div>
                ))}
              </div>
            </div>
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
          </>
        )}
        <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.8rem', marginBottom: '1.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white' }} />
        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
          {loading ? 'Please wait...' : (isLogin ? 'Log In' : 'Create Account')}
        </button>
        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <span style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => setView(isLogin ? 'register' : 'login')}>
            {isLogin ? 'Sign Up' : 'Log In'}
          </span>
        </p>
      </form>
    </div>
  );
};

// ─── Avatar Selector Modal ────────────────────────────────────────────────────
const PRESET_AVATARS = [
  '/avatar_elf_1780141857357.png', '/avatar_paladin_1780141870423.png',
  '/avatar_tiefling_1780141885008.png', '/avatar_dm_1780141901714.png',
  '/avatar_orc_1780142086104.png', '/avatar_halfling_1780142102199.png',
  '/avatar_dragonborn_1780142115560.png', '/avatar_gnome_1780142128608.png',
  '/avatar_cleric_1780142656621.png', '/avatar_bard_1780142670855.png'
];

const AvatarModal = ({ profile, onSelect, onClose }) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onSelect(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={onClose}>
      <div style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--border-color)', width: '100%', maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <h3 style={{ margin: 0 }}>Choose Avatar</h3>
          <X size={20} style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.7rem', marginBottom: '1.2rem' }}>
          {PRESET_AVATARS.map((url, i) => (
            <img key={i} src={url} alt="Avatar" onClick={() => onSelect(url)}
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '50%', cursor: 'pointer', border: profile?.avatar_url === url ? '2px solid var(--accent-red)' : '2px solid transparent' }} />
          ))}
        </div>
        <label className="btn-secondary" style={{ display: 'block', textAlign: 'center', padding: '0.8rem', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>
          Upload Custom Image
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
        </label>
      </div>
    </div>
  );
};

// ─── Stat Pill ────────────────────────────────────────────────────────────────
const StatPill = ({ icon: Icon, label, value, color }) => (
  <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={18} color={color} />
    </div>
    <div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{label}</div>
    </div>
  </div>
);

// ─── Character Card ───────────────────────────────────────────────────────────
const classImages = {
  Bard: '/assets/images/class_bard.png', Barbarian: '/assets/images/class_barbarian.png',
  Fighter: '/assets/images/class_fighter.png', Wizard: '/assets/images/class_wizard.png',
  Druid: '/assets/images/class_druid.png', Cleric: '/assets/images/class_cleric.png',
  Artificer: '/assets/images/class_artificer.png', Warlock: '/assets/images/class_warlock.png',
  Monk: '/assets/images/class_monk.png', Paladin: '/assets/images/class_paladin.png',
  Rogue: '/assets/images/class_rogue.png', Ranger: '/assets/images/class_ranger.png',
  Sorcerer: '/assets/images/class_sorcerer.png',
};

const CharacterDashCard = ({ char, onEdit, onDelete, onDownload }) => {
  const charData = char.data || {};
  const bg = classImages[charData.className] || '/assets/images/epic_dnd_background.png';
  return (
    <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--border-color)', transition: 'transform 0.2s, box-shadow 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.5)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
      <div style={{ height: '110px', backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,16,20,1) 0%, rgba(15,16,20,0.1) 100%)' }} />
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
          <button onClick={e => { e.stopPropagation(); onEdit(); }} style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', color: 'white', display: 'flex' }}><Edit3 size={13} /></button>
          <button onClick={e => { e.stopPropagation(); onDelete(); }} style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', padding: '4px 6px', cursor: 'pointer', color: '#ff6b6b', display: 'flex' }}><Trash2 size={13} /></button>
        </div>
        <div style={{ position: 'absolute', bottom: '8px', left: '12px' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{charData.name || char.name || 'Unnamed Hero'}</div>
        </div>
      </div>
      <div style={{ background: 'var(--bg-card)', padding: '10px 12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{charData.race || '—'} &bull; </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-red)', fontWeight: 600 }}>{charData.className || '—'}</span>
          </div>
          <div style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.07)', padding: '2px 7px', borderRadius: '100px', fontWeight: 700 }}>Lv {charData.level || 1}</div>
        </div>
        <button onClick={e => { e.stopPropagation(); onDownload(); }}
          style={{ marginTop: '8px', width: '100%', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '5px', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.72rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', transition: 'all 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-red)'; e.currentTarget.style.color = 'var(--accent-red)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
          <Download size={11} /> Download JSON
        </button>
      </div>
    </div>
  );
};

// ─── Dashboard (Supabase-backed) ──────────────────────────────────────────────
const CabinetScreen = ({ setView, user, profile, setProfile }) => {
  const [showAvatar, setShowAvatar] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [friendSearch, setFriendSearch] = useState('');
  const [friendResults, setFriendResults] = useState([]);
  const [searchDone, setSearchDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charToDelete, setCharToDelete] = useState(null);

  const isMaster = profile?.role === 'Dungeon Master';

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    // Characters
    const { data: chars } = await supabase.from('characters').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setCharacters(chars || []);
    // Campaigns
    const { data: campPlayers } = await supabase.from('campaign_players').select('campaign_id').eq('user_id', user.id);
    const campIds = (campPlayers || []).map(c => c.campaign_id);
    const { data: ownedCamps } = await supabase.from('campaigns').select('*').eq('owner_id', user.id);
    let memberCamps = [];
    if (campIds.length > 0) {
      const { data } = await supabase.from('campaigns').select('*').in('id', campIds);
      memberCamps = data || [];
    }
    setCampaigns([...(ownedCamps || []), ...memberCamps]);
    // Friend requests (incoming)
    const { data: reqs } = await supabase.from('friend_requests').select('*, from_profile:from_id(id, username, role, avatar_url)').eq('to_id', user.id).eq('status', 'pending');
    setFriendRequests(reqs || []);
    // Accepted friends
    const { data: accepted } = await supabase.from('friend_requests').select('*, profile:from_id(id, username, role, avatar_url), profile2:to_id(id, username, role, avatar_url)').or(`from_id.eq.${user.id},to_id.eq.${user.id}`).eq('status', 'accepted');
    const friendList = (accepted || []).map(r => r.from_id === user.id ? r.profile2 : r.profile);
    setFriends(friendList);
    setLoading(false);
  };

  const handleAvatarSelect = async (url) => {
    await updateProfile(user.id, { avatar_url: url });
    setProfile(prev => ({ ...prev, avatar_url: url }));
    setShowAvatar(false);
  };

  const deleteCharacter = (char) => {
    setCharToDelete(char);
  };

  const editCharacter = (char) => {
    localStorage.setItem('editingCharacter', JSON.stringify(char));
    setView('characters');
  };

  const downloadCharacter = (char) => {
    const blob = new Blob([JSON.stringify(char.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${char.name}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const searchFriends = async () => {
    const q = friendSearch.trim();
    if (!q) return;
    const { data } = await supabase.from('profiles').select('*').ilike('username', `%${q}%`).neq('id', user.id).limit(10);
    setFriendResults(data || []);
    setSearchDone(true);
  };

  const sendFriendRequest = async (toId) => {
    await supabase.from('friend_requests').insert({ from_id: user.id, to_id: toId });
    await supabase.from('notifications').insert({
      user_id: toId,
      type: 'friend_request',
      title: 'New Friend Request',
      message: `${profile.username} sent you a friend request.`
    });
    setFriendResults(prev => prev.map(u => u.id === toId ? { ...u, requestSent: true } : u));
  };

  const acceptFriend = async (req) => {
    await supabase.from('friend_requests').update({ status: 'accepted' }).eq('id', req.id);
    await supabase.from('notifications').insert({
      user_id: req.from_id,
      type: 'friend_accepted',
      title: 'Friend Request Accepted',
      message: `${profile.username} accepted your friend request.`
    });
    setFriendRequests(prev => prev.filter(r => r.id !== req.id));
    setFriends(prev => [...prev, req.from_profile]);
  };

  const declineFriend = async (reqId) => {
    await supabase.from('friend_requests').update({ status: 'declined' }).eq('id', reqId);
    setFriendRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const isFriend = (id) => friends.some(f => f?.id === id);

  const tabStyle = (t) => ({
    padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
    background: activeTab === t ? 'var(--accent-red)' : 'transparent',
    color: activeTab === t ? 'white' : 'var(--text-muted)',
    border: 'none', transition: 'all 0.15s'
  });

  if (!profile) return null;

  return (
    <div style={{ padding: '2rem 1.5rem', width: '80%', margin: '0 auto', minHeight: '80vh' }}>
      {showAvatar && <AvatarModal profile={profile} onSelect={handleAvatarSelect} onClose={() => setShowAvatar(false)} />}
      
      {charToDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} onClick={() => setCharToDelete(null)}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', width: '90%', maxWidth: '400px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <AlertCircle size={48} color="var(--accent-red)" style={{ margin: '0 auto 1rem' }} />
            <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.2rem' }}>Delete Character?</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>Are you sure you want to permanently delete <strong>{charToDelete.data?.name || charToDelete.name || 'this character'}</strong>? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setCharToDelete(null)}>Cancel</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={async () => {
                await supabase.from('characters').delete().eq('id', charToDelete.id);
                setCharacters(prev => prev.filter(c => c.id !== charToDelete.id));
                setCharToDelete(null);
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Banner */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowAvatar(true)}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: profile.avatar_url ? `url(${profile.avatar_url}) center/cover` : (isMaster ? 'var(--accent-red)' : '#333'), display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid var(--accent-red)', flexShrink: 0 }}>
            {!profile.avatar_url && (isMaster ? <MapIcon size={32} color="white" /> : <Sword size={32} color="white" />)}
          </div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent-red)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Edit3 size={10} color="white" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{profile.username}</div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem', flexWrap: 'wrap' }}>
            <span style={{ background: isMaster ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.08)', color: isMaster ? 'var(--accent-red)' : 'white', padding: '2px 10px', borderRadius: '100px', fontSize: '0.7rem', fontWeight: 700 }}>{profile.role?.toUpperCase()}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => { localStorage.removeItem('editingCharacter'); setView('characters'); }}><Plus size={13} style={{ marginRight: '4px' }} /> New Character</button>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => setView('campaigns')}><Scroll size={13} style={{ marginRight: '4px' }} /> Campaigns</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <StatPill icon={Shield} label="Characters" value={characters.length} color="var(--accent-red)" />
        <StatPill icon={Scroll} label="Campaigns" value={campaigns.length} color="#60a5fa" />
        <StatPill icon={Users} label="Friends" value={friends.length} color="#34d399" />
        <StatPill icon={Trophy} label="Highest Lv" value={characters.length ? Math.max(...characters.map(c => c.data?.level || 1)) : 0} color="#f59e0b" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['overview', 'characters', 'friends'].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>
            {t === 'overview' ? '📊 Overview' : t === 'characters' ? '🛡️ My Characters' : '👥 Friends'}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>}

      {!loading && activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Recent chars */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Shield size={16} color="var(--accent-red)" /> Recent Characters</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)', cursor: 'pointer' }} onClick={() => setActiveTab('characters')}>View all <ChevronRight size={12} style={{ display: 'inline' }} /></span>
            </div>
            {characters.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Shield size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} /><p>No characters yet.</p>
                <button className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setView('characters')}>Create One</button>
              </div>
            ) : characters.slice(0, 3).map(char => (
              <div key={char.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundImage: `url(/assets/images/class_${(char.data?.className || '').toLowerCase()}.png)`, backgroundSize: 'cover', backgroundColor: '#333', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{char.data?.name || char.name || 'Unnamed'}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{char.data?.race} {char.data?.className} Lv{char.data?.level || 1}</div>
                </div>
                <button onClick={() => editCharacter(char)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><Edit3 size={14} /></button>
              </div>
            ))}
          </div>

          {/* Campaigns */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Scroll size={16} color="#60a5fa" /> Active Campaigns</h3>
              <span style={{ fontSize: '0.75rem', color: '#60a5fa', cursor: 'pointer' }} onClick={() => setView('campaigns')}>View all <ChevronRight size={12} style={{ display: 'inline' }} /></span>
            </div>
            {campaigns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Scroll size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} /><p>No campaigns yet.</p>
                <button className="btn-secondary" style={{ marginTop: '0.5rem', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setView('campaigns')}>{isMaster ? 'Create Campaign' : 'Join Campaign'}</button>
              </div>
            ) : campaigns.slice(0, 3).map(camp => (
              <div key={camp.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Scroll size={18} color="#60a5fa" /></div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{camp.name}</div></div>
              </div>
            ))}
          </div>

          {/* Friend requests */}
          {friendRequests.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.2rem', gridColumn: '1 / -1' }}>
              <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>🔔 Friend Requests ({friendRequests.length})</h3>
              {friendRequests.map(req => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: req.from_profile?.avatar_url ? `url(${req.from_profile.avatar_url}) center/cover` : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {!req.from_profile?.avatar_url && <User size={16} />}
                  </div>
                  <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{req.from_profile?.username}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{req.from_profile?.role}</div></div>
                  <button onClick={() => acceptFriend(req)} style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid #34d399', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: '#34d399', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}><UserCheck size={13} /> Accept</button>
                  <button onClick={() => declineFriend(req.id)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}><UserX size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'characters' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>My Characters ({characters.length})</h2>
            <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }} onClick={() => { localStorage.removeItem('editingCharacter'); setView('characters'); }}><Plus size={13} style={{ marginRight: '4px' }} /> New Character</button>
          </div>
          {characters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
              <Shield size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>No characters yet. Create your first hero!</p>
              <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setView('characters')}>Open Builder</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
              {characters.map(char => (
                <CharacterDashCard key={char.id} char={char} onEdit={() => editCharacter(char)} onDelete={() => deleteCharacter(char)} onDownload={() => downloadCharacter(char)} />
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'friends' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Find Players</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Search by username..." value={friendSearch} onChange={e => setFriendSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchFriends()}
                style={{ flex: 1, padding: '0.7rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.85rem' }} />
              <button className="btn-primary" style={{ padding: '0.7rem 1rem' }} onClick={searchFriends}><Search size={15} /></button>
            </div>
            {searchDone && friendResults.length === 0 && <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center' }}>No players found.</p>}
            {friendResults.map(u => (
              <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: u.avatar_url ? `url(${u.avatar_url}) center/cover` : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {!u.avatar_url && <User size={16} />}
                </div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{u.username}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.role}</div></div>
                {isFriend(u.id) ? <span style={{ fontSize: '0.72rem', color: '#34d399' }}>✓ Friends</span> :
                  u.requestSent ? <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Request Sent</span> :
                    <button onClick={() => sendFriendRequest(u.id)} style={{ background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer', color: 'white', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px' }}><UserPlus size={13} /> Add</button>}
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.2rem' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>My Friends ({friends.length})</h3>
            {friends.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <Users size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} /><p>Find players to add as friends!</p>
              </div>
            ) : friends.map(fr => fr && (
              <div key={fr.id} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.7rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', marginBottom: '0.5rem' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: fr.avatar_url ? `url(${fr.avatar_url}) center/cover` : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {!fr.avatar_url && <User size={16} />}
                </div>
                <div style={{ flex: 1 }}><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{fr.username}</div><div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{fr.role}</div></div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Campaigns Screen ─────────────────────────────────────────────────────────
const CampaignsScreen = ({ user, profile }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [copied, setCopied] = useState(null);
  const isMaster = profile?.role === 'Dungeon Master';

  useEffect(() => { if (user) loadCampaigns(); }, [user]);

  const loadCampaigns = async () => {
    setLoading(true);
    const { data: owned } = await supabase.from('campaigns').select('*, campaign_players(count)').eq('owner_id', user.id);
    const { data: joined } = await supabase.from('campaign_players').select('campaigns(*, campaign_players(count))').eq('user_id', user.id);
    const joinedCamps = (joined || []).map(r => r.campaigns).filter(Boolean);
    setCampaigns([...(owned || []), ...joinedCamps]);
    setLoading(false);
  };

  const createCampaign = async () => {
    if (!newName.trim()) return;
    const { data, error } = await supabase.from('campaigns').insert({ owner_id: user.id, name: newName.trim(), description: newDesc.trim() }).select().single();
    if (!error && data) { setCampaigns(prev => [data, ...prev]); setCreating(false); setNewName(''); setNewDesc(''); }
  };

  const joinCampaign = async () => {
    const code = joinCode.trim().toUpperCase();
    if (!code) return;
    const { data: camp } = await supabase.from('campaigns').select('*').eq('invite_code', code).single();
    if (!camp) return alert('Campaign not found. Check the invite code.');
    const { error } = await supabase.from('campaign_players').insert({ campaign_id: camp.id, user_id: user.id });
    if (!error) { 
      await supabase.from('notifications').insert({
        user_id: camp.owner_id,
        type: 'campaign_joined',
        title: 'New Player Joined',
        message: `${profile.username} joined your campaign "${camp.name}".`
      });
      loadCampaigns(); setJoinCode(''); alert(`Joined "${camp.name}" successfully!`); 
    }
    else alert('Already in this campaign.');
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    await supabase.from('campaigns').delete().eq('id', id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ padding: '2rem 1.5rem', width: '80%', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Campaigns</h1>
          <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0', fontSize: '0.85rem' }}>{isMaster ? 'Create and manage your campaigns' : 'Join adventures with friends'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isMaster && <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }} onClick={() => setCreating(true)}><Plus size={14} style={{ marginRight: '4px' }} /> New Campaign</button>}
          {!isMaster && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="text" placeholder="Invite code..." value={joinCode} onChange={e => setJoinCode(e.target.value)}
                style={{ padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.85rem' }} />
              <button className="btn-primary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }} onClick={joinCampaign}>Join</button>
            </div>
          )}
        </div>
      </div>

      {creating && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--accent-red)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Create New Campaign</h3>
          <input type="text" placeholder="Campaign Name *" value={newName} onChange={e => setNewName(e.target.value)}
            style={{ width: '100%', padding: '0.8rem', marginBottom: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', boxSizing: 'border-box' }} />
          <textarea placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows="3"
            style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', resize: 'vertical', boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={createCampaign}>Create Campaign</button>
            <button className="btn-secondary" onClick={() => setCreating(false)}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div> : (
        campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', background: 'var(--bg-card)', borderRadius: '14px', border: '1px dashed var(--border-color)' }}>
            <Scroll size={48} style={{ opacity: 0.2, margin: '0 auto 1rem' }} />
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{isMaster ? 'Create your first campaign!' : 'Enter an invite code to join a campaign.'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {campaigns.map(camp => (
              <div key={camp.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '14px', padding: '1.5rem', position: 'relative' }}>
                {camp.owner_id === user.id && (
                  <button onClick={() => deleteCampaign(camp.id)} style={{ position: 'absolute', top: '12px', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ff6b6b' }}><Trash2 size={15} /></button>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Scroll size={22} color="#60a5fa" /></div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{camp.name}</div>
                    <div style={{ fontSize: '0.72rem', color: camp.owner_id === user.id ? 'var(--accent-red)' : 'var(--text-muted)' }}>{camp.owner_id === user.id ? '👑 Dungeon Master' : 'Player'}</div>
                  </div>
                </div>
                {camp.description && <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{camp.description}</p>}
                {camp.invite_code && camp.owner_id === user.id && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '0.5rem 0.8rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flex: 1 }}>Invite Code: <strong style={{ color: 'white', letterSpacing: '0.1em' }}>{camp.invite_code}</strong></span>
                    <button onClick={() => copyCode(camp.invite_code)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: copied === camp.invite_code ? '#34d399' : 'var(--text-muted)', display: 'flex' }}>
                      <Copy size={14} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

// ─── App root ─────────────────────────────────────────────────────────────────
function App() {
  const [view, setView] = useState(() => window.location.hash.replace('#', '') || 'home');
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Sync hash
  useEffect(() => { window.location.hash = view; }, [view]);
  useEffect(() => {
    const handleHash = () => { const h = window.location.hash.replace('#', ''); if (h) setView(h); };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Listen to Supabase auth
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const prof = await getProfile(session.user.id);
        setProfile(prof);
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        // Small delay to let profile trigger run on signup
        setTimeout(async () => {
          const prof = await getProfile(session.user.id);
          setProfile(prof);
        }, 500);
        if (event === 'SIGNED_IN') setView('cabinet');
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut();
    setView('home');
  };

  const setViewGuarded = (v) => {
    if (['cabinet', 'characters', 'campaigns'].includes(v) && !user) { setView('login'); return; }
    setView(v);
  };

  if (authLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <img src="/DnD-Symbol.png" alt="D&D" style={{ width: '60px', marginBottom: '1rem', opacity: 0.6 }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading Chronicle...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (view) {
      case 'home': return <LandingPage setView={setViewGuarded} />;
      case 'pricing': return <PricingPage setView={setViewGuarded} />;
      case 'faq': return <FaqPage />;
      case 'contact': return <ContactPage />;
      case 'login': return <AuthCard isLogin={true} setView={setView} onAuthSuccess={() => setView('cabinet')} />;
      case 'register': return <AuthCard isLogin={false} setView={setView} onAuthSuccess={() => setView('cabinet')} />;
      case 'cabinet': return user ? <CabinetScreen setView={setViewGuarded} user={user} profile={profile} setProfile={setProfile} /> : <AuthCard isLogin={true} setView={setView} onAuthSuccess={() => setView('cabinet')} />;
      case 'characters': return user ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
          <CharacterGenerator user={user} onSave={() => setView('cabinet')} />
        </div>
      ) : <AuthCard isLogin={true} setView={setView} onAuthSuccess={() => setView('characters')} />;
      case 'campaigns': return user ? <CampaignsScreen user={user} profile={profile} /> : <AuthCard isLogin={true} setView={setView} onAuthSuccess={() => setView('campaigns')} />;
      default: return <LandingPage setView={setViewGuarded} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header currentView={view} setView={setViewGuarded} user={user} profile={profile} handleLogout={handleLogout} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
}

export default App;
