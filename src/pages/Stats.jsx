import React from 'react'
import {
  useHabits,
  todayStr,
  monthLabel,
  lastNDates,
  dayStatus,
  completionPercent,
  totalCompletions,
  overallBestStreak,
  monthlyTrend,
} from '../store.jsx'

function Ring({ pct }) {
  const size = 88
  const stroke = 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c
  return (
    <div className="ring-wrap">
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--card-flat)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--orange)"
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-value">{pct}%</div>
    </div>
  )
}

function TrendChart({ points }) {
  const w = 300
  const h = 90
  const max = 100
  const stepX = w / (points.length - 1 || 1)
  const coords = points.map((p, i) => {
    const x = i * stepX
    const y = h - (p.pct / max) * (h - 14) - 6
    return [x, y]
  })
  const path = coords.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} width="100%" height={h + 20}>
      <path d={path} fill="none" stroke="var(--orange)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {coords.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3.5" fill="var(--orange)" />
      ))}
      {points.map((p, i) => (
        <text key={i} x={i * stepX} y={h + 16} fontSize="10" fill="var(--text-faint)" textAnchor="middle">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

export default function Stats() {
  const { data } = useHabits()
  const today = todayStr()
  const days35 = lastNDates(35)
  const pct30 = completionPercent(data, 30)
  const total = totalCompletions(data)
  const best = overallBestStreak(data)
  const trend = monthlyTrend(data, 6)

  return (
    <div className="screen">
      <div className="title-row">
        <div>
          <p className="eyebrow">Monthly Review</p>
          <h1 className="page-title">Your Progress</h1>
        </div>
        <span className="pill">📅 {monthLabel(today)}</span>
      </div>

      <div className="card" style={{ padding: '18px 16px' }}>
        <p className="section-label" style={{ margin: '0 0 2px' }}>Habit Heatmap</p>
        <div className="dow-row">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="heatmap-grid">
          {days35.map((d) => {
            const st = dayStatus(data, d)
            let bg = 'var(--card-flat)'
            if (st.total > 0 && st.done > 0) {
              const ratio = st.done / st.total
              if (ratio === 1) bg = 'var(--sage-text)'
              else if (ratio >= 0.5) bg = 'var(--sage)'
              else bg = '#e4dcc3'
            }
            if (d === today) bg = st.total > 0 && st.done === st.total ? 'var(--orange)' : bg
            return <div key={d} className="heat-cell" style={{ background: bg }} title={d} />
          })}
        </div>
        <div className="heat-legend" style={{ marginTop: 12, justifyContent: 'flex-end' }}>
          <span>Less</span>
          <span className="legend-dot" style={{ background: 'var(--card-flat)' }} />
          <span className="legend-dot" style={{ background: '#e4dcc3' }} />
          <span className="legend-dot" style={{ background: 'var(--sage)' }} />
          <span className="legend-dot" style={{ background: 'var(--sage-text)' }} />
          <span>More</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 14 }}>
        <div className="stat-tile tile-navy" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="label">Completion</div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>Last 30 days</div>
          </div>
          <Ring pct={pct30} />
        </div>
        <div className="stat-tile tile-peach">
          <span className="label">Total Tracked</span>
          <span className="value" style={{ fontSize: 30 }}>{total}</span>
        </div>
      </div>

      <p className="section-label">6-Month Trend</p>
      <div className="card tile-navy" style={{ padding: '16px 12px', background: 'var(--navy)' }}>
        <TrendChart points={trend} />
      </div>

      <p className="section-label">All-Time Longest Streak</p>
      <div className="stat-tile tile-orange" style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div className="value">{best}<span className="unit">days</span></div>
          <div className="label" style={{ marginTop: 4 }}>Keep a habit fully complete every day to grow this</div>
        </div>
        <span style={{ fontSize: 30 }}>🏅</span>
      </div>
    </div>
  )
}
