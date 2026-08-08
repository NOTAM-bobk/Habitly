import React from 'react'
import {
  useHabits,
  todayStr,
  friendlyDate,
  isDone,
  dayStatus,
  overallCurrentStreak,
  overallBestStreak,
  currentWeekDates,
} from '../store.jsx'

export default function Today() {
  const { data, toggleCompletion } = useHabits()
  const today = todayStr()
  const status = dayStatus(data, today)
  const streak = overallCurrentStreak(data)
  const best = overallBestStreak(data)
  const week = currentWeekDates()
  const dowLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

  return (
    <div className="screen">
      <p className="eyebrow">{friendlyDate(today)}</p>
      <div className="title-row">
        <h1 className="page-title">Today's Focus</h1>
      </div>

      <div className="grid-2">
        <div className="stat-tile tile-navy">
          <span className="icon">🔥</span>
          <span className="label">Current Streak</span>
          <span className="value">{streak}<span className="unit">days</span></span>
        </div>
        <div className="stat-tile tile-orange">
          <span className="label">Completed</span>
          <span className="value">{status.done}/{status.total || 0}<span className="unit">habits</span></span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="stat-tile tile-sage" style={{ minHeight: 90 }}>
          <span className="icon">🏆</span>
          <span className="label">Best Streak</span>
          <span className="value" style={{ fontSize: 26 }}>{best}<span className="unit">days</span></span>
        </div>
        <div className="stat-tile tile-cream" style={{ minHeight: 90 }}>
          <span className="label">Total Habits</span>
          <span className="value" style={{ fontSize: 26 }}>{data.habits.length}</span>
        </div>
      </div>

      <p className="section-label">Weekly Overview</p>
      <div className="card" style={{ padding: '16px 14px' }}>
        <div className="dow-row" style={{ marginTop: 0 }}>
          {dowLabels.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="heatmap-grid" style={{ marginTop: 8 }}>
          {week.map((d) => {
            const st = dayStatus(data, d)
            const isToday = d === today
            let bg = 'var(--card-flat)'
            if (st.total > 0) {
              if (st.full) bg = 'var(--orange)'
              else if (st.done > 0) bg = 'var(--peach)'
            }
            return (
              <div
                key={d}
                className="heat-cell"
                style={{
                  background: bg,
                  outline: isToday ? '2px solid var(--navy)' : 'none',
                }}
                title={d}
              />
            )
          })}
        </div>
      </div>

      <p className="section-label">Today's Habits</p>
      {data.habits.length === 0 ? (
        <div className="empty-state">
          <div className="big">🌱</div>
          <p>No habits yet. Head to the Habits tab to add your first one.</p>
        </div>
      ) : (
        <div className="today-list">
          {data.habits.map((h) => {
            const done = isDone(data, h.id, today)
            return (
              <div className="today-item" key={h.id}>
                <div className="left">
                  <div className={'icon-badge tab-' + h.color}>{h.icon}</div>
                  <span className={'habit-name' + (done ? ' done' : '')}>{h.name}</span>
                </div>
                <button
                  className={'check-bubble' + (done ? ' checked' : '')}
                  onClick={() => toggleCompletion(h.id, today)}
                  aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                >
                  {done ? '✓' : ''}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
