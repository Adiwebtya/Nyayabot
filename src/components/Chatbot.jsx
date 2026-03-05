import React, { useState, useEffect, useRef } from 'react'
import { analyzeIncident, findHelpByLocation } from '../lib/legalEngine'
import './Chatbot.css'

const Chatbot = ({ onClose }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: "Hello, I'm NyayaBot. I'm here to help you understand your legal situation with empathy and clarity. This is a safe space to describe what happened.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isAwaitingLocation, setIsAwaitingLocation] = useState(false)
    const messagesEndRef = useRef(null)

    const quickActions = [
        { label: "📱 Theft", text: "I want to report a theft" },
        { label: "💻 Cybercrime", text: "I am a victim of online fraud/cybercrime" },
        { label: "🛡️ Harassment", text: "Someone is harassing me" },
        { label: "🥊 Assault", text: "I was physically assaulted" },
        { label: "📍 Nearby Help", text: "FIND_HELP" }
    ]

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async (customText = null) => {
        const textToSend = customText || input
        if (!textToSend.trim()) return

        const userMessage = {
            role: 'user',
            text: textToSend === 'FIND_HELP' ? "I need to find nearby help resources." : textToSend,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsTyping(true)

        if (textToSend === 'FIND_HELP') {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    text: "Please provide your city or current location so I can find the nearest legal resources for you.",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }])
                setIsAwaitingLocation(true)
                setIsTyping(false)
            }, 500)
            return
        }

        try {
            let response;
            if (isAwaitingLocation) {
                response = findHelpByLocation(textToSend)
                setIsAwaitingLocation(false)
            } else {
                response = await analyzeIncident(textToSend)
            }

            const botMessage = {
                role: 'bot',
                text: response.summary,
                type: response.type,
                details: response.details,
                questions: response.questions,
                disclaimer: response.disclaimer,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "I encountered a technical issue. Please try describing it again.", time: "Now" }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="chatbot-overlay">
            <div className="chatbot-window">
                <div className="chatbot-header">
                    <div className="header-info">
                        <div className="bot-avatar">NB</div>
                        <div>
                            <h3>NyayaBot</h3>
                            <span className="status">Online • Legal Assistant</span>
                        </div>
                    </div>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="messages-container">
                    <div className="safety-alert">
                        🛡️ Your conversation is confidential. We provide guidance, not legal advice.
                    </div>

                    {messages.map((m, i) => (
                        <div key={i} className={`message-wrapper ${m.role}`}>
                            <div className="bubble">
                                {m.text}

                                {m.type === 'CLARIFICATION' && (
                                    <div className="questions-list">
                                        {m.questions.map((q, idx) => (
                                            <div key={idx} className="q-item" onClick={() => handleSend(q)}>• {q}</div>
                                        ))}
                                    </div>
                                )}

                                {m.type === 'ANALYSIS' && (
                                    <div className="structured-results">
                                        <div className="entity-grid">
                                            <div className="pill">👤 <b>Victim:</b> {m.details.entities.victim}</div>
                                            <div className="pill">🎭 <b>Offender:</b> {m.details.entities.offender}</div>
                                            <div className="pill">📍 <b>Location:</b> {m.details.entities.location}</div>
                                            <div className="pill">⚡ <b>Severity:</b> {m.details.entities.severity}</div>
                                        </div>

                                        <div className="analysis-section">
                                            <h4>2️⃣ Relevant Legal Sections</h4>
                                            <div className="code-block">{m.details.sections}</div>
                                        </div>

                                        <div className="analysis-section">
                                            <h4>3️⃣ What These Laws Mean</h4>
                                            <p>{m.details.meaning}</p>
                                        </div>

                                        <div className="analysis-section">
                                            <h4>4️⃣ Evidence to Collect</h4>
                                            <ul>
                                                {m.details.evidence.map((item, idx) => <li key={idx}>✅ {item}</li>)}
                                            </ul>
                                        </div>

                                        <div className="analysis-section">
                                            <h4>5️⃣ Formal FIR Draft</h4>
                                            <p style={{ fontSize: '0.8rem', color: '#8696a0', marginBottom: '0.5rem' }}>
                                                You can copy this draft and fill in the bracketed details [ ] before submitting it to the police.
                                            </p>
                                            <div className="fir-container">
                                                <pre className="fir-draft">{m.details.firDraft}</pre>
                                                <button
                                                    className="copy-btn"
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(m.details.firDraft);
                                                        alert("FIR Draft copied to clipboard!");
                                                    }}
                                                >
                                                    Copy Draft
                                                </button>
                                            </div>
                                        </div>

                                        <div className="analysis-section">
                                            <h4>6️⃣ What You Can Do</h4>
                                            <ol>
                                                {m.details.steps.map((step, idx) => <li key={idx}>{step}</li>)}
                                            </ol>
                                        </div>

                                        <div className="analysis-section emergency">
                                            <h4>7️⃣ Emergency Resources</h4>
                                            <div className="resource-pills">
                                                {m.details.resources.split(',').map((r, idx) => (
                                                    <div key={idx} className="res-pill">{r.trim()}</div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="disclaimer-boxed">
                                            {m.disclaimer}
                                        </div>
                                    </div>
                                )}

                                {m.type === 'AWARENESS' && (
                                    <div className="structured-results awareness">
                                        <div className="analysis-section">
                                            <h4>{m.details.title}</h4>
                                            <p>{m.details.meaning}</p>
                                        </div>
                                        <div className="analysis-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                                            <h4 style={{ color: '#ea5656' }}>Punishment / Saja:</h4>
                                            <p>{m.details.punishment}</p>
                                        </div>
                                    </div>
                                )}

                                {m.type === 'LOCATION_RESOURCES' && (
                                    <div className="structured-results help-finder">
                                        <div className="analysis-section">
                                            <p><b>Nearest Police Station:</b> {m.details.station}</p>
                                            <p><b>Cyber Crime Portal:</b> <a href={m.details.portal} target="_blank" rel="noreferrer" style={{ color: '#00a884' }}>{m.details.portal}</a></p>
                                            <p><b>Police Emergency:</b> <span className="res-pill" style={{ background: '#ea5656', marginLeft: 0 }}>{m.details.police}</span></p>
                                            <p><b>Women Helpline:</b> <span className="res-pill" style={{ background: '#00a884', marginLeft: 0 }}>{m.details.women}</span></p>
                                            <p><b>Cyber Fraud Helpline:</b> <span className="res-pill" style={{ background: '#005c4b', marginLeft: 0 }}>{m.details.fraud}</span></p>
                                        </div>
                                        <div className="analysis-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <b>Next Steps:</b> You can visit the nearest station mentioned above or call the helplines for immediate guidance on reporting your situation.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <span className="timestamp">{m.time} {m.role === 'user' ? '✓✓' : ''}</span>
                            </div>
                        </div>
                    ))}
                    {isTyping && <div className="message-wrapper bot"><div className="bubble typing">NyayaBot is typing...</div></div>}
                    <div ref={messagesEndRef} />
                </div>

                <div className="chatbot-footer">
                    <div className="quick-buttons">
                        {quickActions.map((btn, i) => (
                            <button key={i} className="q-btn" onClick={() => handleSend(btn.text)}>
                                {btn.label}
                            </button>
                        ))}
                    </div>
                    <div className="input-area">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                        />
                        <button className="send-btn" onClick={() => handleSend()}>
                            <svg viewBox="0 0 24 24" width="24" height="24">
                                <path fill="currentColor" d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chatbot
