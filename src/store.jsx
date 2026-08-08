import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

const STORAGE_KEY = 'habitly-data-v1'

const ICONS = ['🏃', '📖', '🧘', '💧', '💪', '📝', '😴', '🎯', '🎨', '🧹', '🥗', '🚫', '☎️', '🌱', '🧑‍💻']
const COLORS = ['navy', 'orange', 'sage', 'mustard', 'rust', 'teal']

function loadRaw() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load habitly data', e)
    return null
  }
}

function saveRaw(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('Failed to save habitly data', e)
  }
}

function emptyData() {
  return {
    onboarded: false,
    user: { name: '', startDate: null },
    habits: [], // { id, name, icon, color, createdAt }
    completions: {}, // { [habitId]: string[] of 'YYYY-MM-DD' }
  }
}

// ---------- date helpers ----------
export function toDateStr(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function todayStr() {
  return toDateStr(new Date())
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

export function lastNDates(n, endDateStr = todayStr()) {
  const arr = []
  for (let i = n - 1; i >= 0; i--) {
    arr.push(addDays(endDateStr, -i))
  }
  return arr
}

export function currentWeekDates() {
  // Monday -> Sunday, current week
  const today = new Date()
  const dow = today.getDay() // 0 = Sunday
  const mondayOffset = dow === 0 ? -6 : 1 - dow
  const monday = addDays(todayStr(), mondayOffset)
  const arr = []
  for (let i = 0; i < 7; i++) arr.push(addDays(monday, i))
  return arr
}

export function monthLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export function friendlyDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
}

// ---------- context ----------
const HabitContext = createContext(null)

export function HabitProvider({ children }) {
  const [data, setData] = useState(() => loadRaw() || emptyData())

  useEffect(() => {
    saveRaw(data)
  }, [data])

  const completeOnboarding = useCallback((name, habits) => {
    const created = todayStr()
    setData({
      onboarded: true,
      user: { name, startDate: created },
      habits: habits.map((h, i) => ({
        id: `h_${Date.now()}_${i}`,
        name: h.name,
        icon: h.icon,
        color: h.color,
        createdAt: created,
      })),
      completions: {},
    })
  }, [])

  const addHabit = useCallback((habit) => {
    setData((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          id: `h_${Date.now()}`,
          name: habit.name,
          icon: habit.icon,
          color: habit.color,
          createdAt: todayStr(),
        },
      ],
    }))
  }, [])

  const deleteHabit = useCallback((habitId) => {
    setData((prev) => {
      const completions = { ...prev.completions }
      delete completions[habitId]
      return {
        ...prev,
        habits: prev.habits.filter((h) => h.id !== habitId),
        completions,
      }
    })
  }, [])

  const toggleCompletion = useCallback((habitId, dateStr = todayStr()) => {
    setData((prev) => {
      const list = prev.completions[habitId] || []
      const has = list.includes(dateStr)
      const next = has ? list.filter((d) => d !== dateStr) : [...list, dateStr]
      return {
        ...prev,
        completions: { ...prev.completions, [habitId]: next },
      }
    })
  }, [])

  const updateUserName = useCallback((name) => {
    setData((prev) => ({ ...prev, user: { ...prev.user, name } }))
  }, [])

  const resetAll = useCallback(() => {
    setData(emptyData())
  }, [])

  const value = { data, completeOnboarding, addHabit, deleteHabit, toggleCompletion, updateUserName, resetAll }
  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
}

export function useHabits() {
  const ctx = useContext(HabitContext)
  if (!ctx) throw new Error('useHabits must be used within HabitProvider')
  return ctx
}

export { ICONS, COLORS }

// ---------- derived stats (pure functions, take data as input) ----------

export function isDone(data, habitId, dateStr) {
  return (data.completions[habitId] || []).includes(dateStr)
}

export function habitsActiveOn(data, dateStr) {
  return data.habits.filter((h) => h.createdAt <= dateStr)
}

export function dayStatus(data, dateStr) {
  const active = habitsActiveOn(data, dateStr)
  if (active.length === 0) return { done: 0, total: 0, full: false }
  const done = active.filter((h) => isDone(data, h.id, dateStr)).length
  return { done, total: active.length, full: done === active.length }
}

export function habitCurrentStreak(data, habitId) {
  let streak = 0
  let cursor = todayStr()
  // if today isn't done yet, start checking from yesterday so an in-progress
  // streak doesn't zero out before the day is over
  if (!isDone(data, habitId, cursor)) {
    cursor = addDays(cursor, -1)
  }
  while (isDone(data, habitId, cursor)) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function habitBestStreak(data, habitId) {
  const dates = (data.completions[habitId] || []).slice().sort()
  if (dates.length === 0) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < dates.length; i++) {
    if (addDays(dates[i - 1], 1) === dates[i]) {
      run++
    } else {
      run = 1
    }
    if (run > best) best = run
  }
  return best
}

export function overallCurrentStreak(data) {
  if (data.habits.length === 0) return 0
  let streak = 0
  let cursor = todayStr()
  const s = dayStatus(data, cursor)
  if (!s.full) cursor = addDays(cursor, -1)
  while (true) {
    const st = dayStatus(data, cursor)
    if (st.total > 0 && st.full) {
      streak++
      cursor = addDays(cursor, -1)
    } else {
      break
    }
  }
  return streak
}

export function overallBestStreak(data) {
  if (data.habits.length === 0) return 0
  const earliest = data.habits.reduce((min, h) => (h.createdAt < min ? h.createdAt : min), todayStr())
  let cursor = earliest
  const end = todayStr()
  let best = 0
  let run = 0
  while (cursor <= end) {
    const st = dayStatus(data, cursor)
    if (st.total > 0 && st.full) {
      run++
      if (run > best) best = run
    } else {
      run = 0
    }
    cursor = addDays(cursor, 1)
  }
  return best
}

export function totalCompletions(data) {
  return Object.values(data.completions).reduce((sum, arr) => sum + arr.length, 0)
}

export function completionPercent(data, days = 30) {
  const dates = lastNDates(days)
  let doneSum = 0
  let totalSum = 0
  dates.forEach((d) => {
    const st = dayStatus(data, d)
    doneSum += st.done
    totalSum += st.total
  })
  if (totalSum === 0) return 0
  return Math.round((doneSum / totalSum) * 100)
}

export function monthlyTrend(data, months = 6) {
  const result = []
  const now = new Date()
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const label = d.toLocaleDateString('en-US', { month: 'short' })
    const daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
    let doneSum = 0
    let totalSum = 0
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(d.getFullYear(), d.getMonth(), day)
      if (dateObj > now) break
      const ds = toDateStr(dateObj)
      const st = dayStatus(data, ds)
      doneSum += st.done
      totalSum += st.total
    }
    result.push({ label, pct: totalSum === 0 ? 0 : Math.round((doneSum / totalSum) * 100) })
  }
  return result
}
