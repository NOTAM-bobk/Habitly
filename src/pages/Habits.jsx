import React, { useState } from 'react'
import { useHabits, ICONS, COLORS, todayStr, isDone, habitCurrentStreak, lastNDates } from '../store.jsx'

export default function Habits() {
  const { data, toggleCompletion, addHabit, deleteHabit } = useHabits()
  const [showModal, setShowModal] = useState(false)
  const [manageId, setManageId] = useState(null)
  const [draftName, setDraftName] = useState('')
  const [draftIcon, setDraftIcon] = useState(ICONS[0])
  const [draftColor, setDraftColor] = useState(COLORS[0])
  const today = todayStr()
  const last7 = lastNDates(7)

  function submitNewHabit(e) {
    e.preventDefault()
    if (!draftName.trim()) return
    addHabit({ name: draftName.trim(), icon: draftIcon, color: draftColor })
    setDraftName('')
    setDraftIcon(ICONS[0])
    setDraftColor(COLORS[0])
    setShowModal(false)
  }

  return (
    <div className="screen">
      <div className="title-row">
        <div>
          <p className="eyebrow">Tracked Items</p>
          <h1 className="page-title">My Habits</h1>
        </div>
        <span className="pill">All ({data.habits.length})</span>
      </div>

      {data.habits.length === 0 ? (
        <div className="empty-state">
          <div className="big">🎯</div>
          <p>Nothing tracked yet. Tap the + button to add your first habit.</p>
        </div>
      ) : (
        <div className="grid-2">
          {data.habits.map((h) => {
            const streak = habitCurrentStreak(data, h.id)
            const doneToday = isDone(data, h.id, today)
            return (
              <button
                key={h.id}
                className={'habit-card tab-' + h.color}
                onClick={() => toggleCompletion(h.id, today)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  setManageId(h.id)
                }}
              >
                <div className="top-row">
                  <span className="name">{h.name}</span>
                  <span className="emoji">{h.icon}</span>
                </div>
                <div>
                  <div className="streak-num">{String(streak).padStart(2, '0')}</div>
                  <div className="streak-label">Day streak</div>
                  <div className="dot-row">
                    {last7.map((d) => (
                      <span key={d} className={'dot' + (isDone(data, h.id, d) ? ' on' : '')} />
                    ))}
                  </div>
                </div>
                {doneToday && (
                  <span style={{ position: 'absolute', top: 14, right: 14, fontSize: 14 }}>✓</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <p style={{ color: 'var(--text-faint)', fontSize: 12, marginTop: 18, textAlign: 'center' }}>
        Tap a habit to mark today complete. Long-press (or right-click) to manage it.
      </p>

      <button className="fab" style={{ right: 20 }} onClick={() => setShowModal(true)} aria-label="Add habit">
        +
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <form className="modal-sheet" onClick={(e) => e.stopPropagation()} onSubmit={submitNewHabit}>
            <div className="modal-handle" />
            <h2 className="modal-title">New habit</h2>
            <label className="field-label">Name</label>
            <input
              className="text-input"
              placeholder="e.g. Drink water"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              autoFocus
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
            <button className="btn-primary" style={{ marginTop: 22 }} type="submit" disabled={!draftName.trim()}>
              Add habit
            </button>
          </form>
        </div>
      )}

      {manageId && (
        <div className="modal-overlay" onClick={() => setManageId(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-handle" />
            <h2 className="modal-title">
              {data.habits.find((h) => h.id === manageId)?.name}
            </h2>
            <p style={{ color: 'var(--text-soft)', fontSize: 13, marginBottom: 18 }}>
              Removing a habit also deletes its history.
            </p>
            <button
              className="btn-danger"
              onClick={() => {
                deleteHabit(manageId)
                setManageId(null)
              }}
            >
              Delete habit
            </button>
            <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setManageId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
