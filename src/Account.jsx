import React, { useState } from 'react'
import {
  useHabits,
  totalCompletions,
  overallCurrentStreak,
  overallBestStreak,
} from '../store.jsx'

export default function Account() {
  const { data, updateUserName, resetAll } = useHabits()
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(data.user.name)
  const [confirmReset, setConfirmReset] = useState(false)

  const initials = (data.user.name || '?').trim().slice(0, 1).toUpperCase()
  const memberSince = data.user.startDate
    ? new Date(data.user.startDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—'

  function saveName() {
    updateUserName(draftName.trim() || data.user.name)
    setEditing(false)
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'habitly-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="screen">
      <p className="eyebrow">Profile</p>
      <h1 className="page-title" style={{ marginBottom: 20 }}>Account</h1>

      <div className="account-header">
        <div className="avatar-circle">{initials}</div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="text-input"
                style={{ padding: '10px 12px', fontSize: 14 }}
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                autoFocus
              />
              <button className="pill" onClick={saveName}>Save</button>
            </div>
          ) : (
            <>
              <p className="account-name">{data.user.name || 'Friend'}</p>
              <p className="account-sub">Tracking since {memberSince}</p>
            </>
          )}
        </div>
        {!editing && (
          <button className="pill" onClick={() => { setDraftName(data.user.name); setEditing(true) }}>
            Edit
          </button>
        )}
      </div>

      <div className="grid-2">
        <div className="stat-tile tile-sage" style={{ minHeight: 96 }}>
          <span className="label">Habits</span>
          <span className="value" style={{ fontSize: 26 }}>{data.habits.length}</span>
        </div>
        <div className="stat-tile tile-mustard" style={{ minHeight: 96 }}>
          <span className="label">Total Completions</span>
          <span className="value" style={{ fontSize: 26 }}>{totalCompletions(data)}</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="stat-tile tile-navy" style={{ minHeight: 96 }}>
          <span className="label">Current Streak</span>
          <span className="value" style={{ fontSize: 26 }}>{overallCurrentStreak(data)}</span>
        </div>
        <div className="stat-tile tile-orange" style={{ minHeight: 96 }}>
          <span className="label">Best Streak</span>
          <span className="value" style={{ fontSize: 26 }}>{overallBestStreak(data)}</span>
        </div>
      </div>

      <p className="section-label">Data</p>
      <div className="card" style={{ padding: '4px 16px' }}>
        <div className="link-toggle">
          <span>Export your data</span>
          <button className="pill" onClick={exportData}>Download JSON</button>
        </div>
        <div className="link-toggle">
          <span>Everything is stored locally</span>
          <span style={{ color: 'var(--text-faint)', fontWeight: 600 }}>on this device</span>
        </div>
      </div>

      <p className="section-label">Danger zone</p>
      {!confirmReset ? (
        <button className="btn-danger" onClick={() => setConfirmReset(true)}>
          Reset all data
        </button>
      ) : (
        <div className="card" style={{ padding: 16 }}>
          <p style={{ margin: '0 0 14px', fontSize: 14 }}>
            This deletes every habit and completion permanently. This can't be undone.
          </p>
          <button className="btn-danger" onClick={resetAll}>Yes, delete everything</button>
          <button className="btn-secondary" style={{ marginTop: 10 }} onClick={() => setConfirmReset(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
