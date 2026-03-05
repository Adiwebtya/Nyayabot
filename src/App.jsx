import React, { useState } from 'react'
import Chatbot from './components/Chatbot'
import './App.css'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="logo">NyayaBot</div>
        <div className="nav-links">
          <span>Home</span>
          <span>Your Rights</span>
          <span>Emergency Help</span>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-content">
          <div className="badge">EDUCATIONAL ASSISTANCE</div>
          <h1>Empowering You with Legal Clarity.</h1>
          <p className="subtitle">Speak to NyayaBot to understand Indian laws, your rights, and the next steps to take.</p>

          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => setIsChatOpen(true)}>
              Talk to NyayaBot
            </button>
            <p className="cta-disclaimer">Privacy first • Supportive guidance</p>
          </div>
        </div>

        <div className="hero-visual">
          <div className="chat-mockup card">
            <div className="mock-header"></div>
            <div className="mock-messages">
              <div className="mock-msg bot">How can I help you today?</div>
              <div className="mock-msg user">I need to report an incident.</div>
            </div>
          </div>
        </div>
      </header>

      <section className="highlights">
        <div className="highlight-card card">
          <div className="icon">🛡️</div>
          <h3>Evidence Tracking</h3>
          <p>Detailed suggestions on what evidence to collect for your specific situation.</p>
        </div>
        <div className="highlight-card card">
          <div className="icon">⚖️</div>
          <h3>BNS Mappings</h3>
          <p>Updated information on Bharatiya Nyaya Sanhita (BNS) and latest legal sections.</p>
        </div>
        <div className="highlight-card card">
          <div className="icon">🚨</div>
          <h3>Immediate Help</h3>
          <p>Direct connections to national helplines and emergency support protocols.</p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">NyayaBot</div>
          <p>This AI provides educational guidance on Indian law. It is not a substitute for a lawyer.</p>
        </div>
        <div className="footer-bottom">
          <p>© 2026 NyayaBot • Educational Legal Assistant</p>
        </div>
      </footer>

      {isChatOpen && <Chatbot onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}

export default App
