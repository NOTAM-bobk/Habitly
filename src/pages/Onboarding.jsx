import React, { useState } from 'react'
import { useHabits, ICONS, COLORS } from '../store.jsx'

export default function Onboarding() {
  const { completeOnboarding } = useHabits()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [pendingHabits, setPendingHabits] = useState([])
  const [draftName, setDraftName] = useState('')
  const [draftIcon, setDraftIcon] = useState(ICONS[0])
  const [draftColor, setDraftColor] = useState(COLORS[0])

  function addDraftHabit() {
    if (!draftName.trim()) return
    setPendingHabits((prev) => [...prev, { name: draftName.trim(), icon: draftIcon, color: draftColor }])
    setDraftName('')
    setDraftIcon(ICONS[0])
    setDraftColor(COLORS[0])
  }

  function removeHabit(idx) {
    setPendingHabits((prev) => prev.filter((_, i) => i !== idx))
  }

  function finish() {
    completeOnboarding(name.trim() || 'Friend', pendingHabits)
  }

  return (
    <div className="onboard-screen">
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <div style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 18 }}>🔥</div>
            <h1 className="page-title" style={{ fontSize: 32 }}>Habitly</h1>
            <p style={{ color: 'var(--text-soft)', fontSize: 15, lineHeight: 1.5, marginTop: 10 }}>
              Build routines that stick. Track daily habits, watch your streaks grow, and see your
              progress over time — all stored right on your device.
            </p>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="eyebrow">Step 1 of 2</p>
            <h1 className="page-title" style={{ fontSize: 26 }}>What should we call you?</h1>
            <p style={{ color: 'var(--text-soft)', fontSize: 14, marginTop: 6 }}>
              Your name shows up on your profile.
            </p>
            <label className="field-label">Your name</label>
            <input
              className="text-input"
              placeholder="e.g. Jordan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="eyebrow">Step 2 of 2</p>
            <h1 className="page-title" style={{ fontSize: 26 }}>Add your first habits</h1>
            <p style={{ color: 'var(--text-soft)', fontSize: 14, marginTop: 6 }}>
              Add at least one habit to start tracking. You can add more anytime.
            </p>

            <label className="field-label">Habit name</label>
            <input
              className="text-input"
              placeholder="e.g. Morning run"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
            />

            <label className="field-label">Icon</label>
            <div className="icon-grid">
              {ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  className={'icon-choice' + (draftIcon === ic ? ' selected' : '')}
                  onClick={() => setDraftIcon(ic)}
                >
                  {ic}
                </button>
              ))}
            </div>

            <label className="field-label">Color</label>
            <div className="swatch-row">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={'swatch tab-' + c + (draftColor === c ? ' selected' : '')}
                  onClick={() => setDraftColor(c)}
                  aria-label={c}
                />
              ))}
            </div>

            <button className="btn-secondary" style={{ marginTop: 16 }} onClick={addDraftHabit}>
              + Add habit
            </button>

            {pendingHabits.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <p className="section-label" style={{ margin: '0 0 4px' }}>Your habits</p>
                {pendingHabits.map((h, i) => (
                  <div className="onboard-habit-row" key={i}>
                    <div className="left">
                      <span>{h.icon}</span>
                      <span>{h.name}</span>
                    </div>
                    <button className="remove-btn" onClick={() => removeHabit(i)}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        {step === 0 && (
          <button className="btn-primary" onClick={() => setStep(1)}>Get started</button>
        )}
        {step === 1 && (
          <button className="btn-primary" disabled={!name.trim()} onClick={() => setStep(2)}>
            Continue
          </button>
        )}
        {step === 2 && (
          <button className="btn-primary" disabled={pendingHabits.length === 0} onClick={finish}>
            Start tracking
          </button>
        )}
        <div className="progress-dots">
          {[0, 1, 2].map((i) => (
            <span key={i} className={i === step ? 'active' : ''} />
          ))}
        </div>
      </div>
    </div>
  )
}
