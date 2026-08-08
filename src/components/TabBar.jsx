import React from 'react'

const TABS = [
  { key: 'today', label: 'Today', icon: '🏠' },
  { key: 'habits', label: 'Habits', icon: '☰' },
  { key: 'stats', label: 'Stats', icon: '📊' },
  { key: 'account', label: 'Profile', icon: '👤' },
]

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.key}
          className={active === t.key ? 'active' : ''}
          onClick={() => onChange(t.key)}
          aria-label={t.label}
        >
          <span className="tab-icon">{t.icon}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
