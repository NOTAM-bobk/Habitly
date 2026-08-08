import React, { useState } from 'react'
import { useHabits } from './store.jsx'
import TabBar from './components/TabBar.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Today from './pages/Today.jsx'
import Habits from './pages/Habits.jsx'
import Stats from './pages/Stats.jsx'
import Account from './pages/Account.jsx'

export default function App() {
  const { data } = useHabits()
  const [tab, setTab] = useState('today')

  if (!data.onboarded) {
    return (
      <div className="app-shell">
        <Onboarding />
      </div>
    )
  }

  return (
    <div className="app-shell">
      {tab === 'today' && <Today />}
      {tab === 'habits' && <Habits />}
      {tab === 'stats' && <Stats />}
      {tab === 'account' && <Account />}
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
