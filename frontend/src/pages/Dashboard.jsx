import React from 'react'
import { Link } from 'react-router-dom'
import { getScenarios } from '../utils/storage'
import { SCENARIO_CATEGORIES } from '../utils/constants'

function getCategoryLabel(value) {
  return SCENARIO_CATEGORIES.find(c => c.value === value)?.label || value
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function getTodayScenarios(scenarios) {
  const today = todayStr()
  return scenarios
    .filter(s => (s.plannedDate || s.triggerDate) === today)
    .sort((a, b) => (a.plannedDate || '').localeCompare(b.plannedDate || ''))
}

function getUpcomingScenarios(scenarios, limit = 5) {
  const today = todayStr()
  return scenarios
    .filter(s => (s.plannedDate || s.triggerDate || '') >= today)
    .sort((a, b) => (a.plannedDate || a.triggerDate || '').localeCompare(b.plannedDate || b.triggerDate || ''))
    .slice(0, limit)
}

export default function Dashboard() {
  const scenarios = getScenarios()
  const todayScenarios = getTodayScenarios(scenarios)
  const upcoming = getUpcomingScenarios(scenarios)

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>测试场景概览</h1>

      {todayScenarios.length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>今日计划</div>
          {todayScenarios.map((s, i) => (
            <div key={s.id} style={styles.item}>
              <Link to={`/scenario/${s.id}`} style={styles.itemLink}>
                <span>{s.name}</span>
                <span style={styles.tag}>{getCategoryLabel(s.category)}</span>
              </Link>
              <Link to={`/scenario/${s.id}/execute`} style={styles.execBtn}>记录执行</Link>
            </div>
          ))}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.label}>即将执行</div>
        {upcoming.length === 0 ? (
          <p style={styles.empty}>暂无计划中的场景</p>
        ) : (
          upcoming.map(s => (
            <Link key={s.id} to={`/scenario/${s.id}`} style={styles.scenarioLink}>
              <div style={styles.scenarioName}>{s.name}</div>
              <div style={styles.scenarioMeta}>
                计划：{s.plannedDate || s.triggerDate}
                {s.category && ` · ${getCategoryLabel(s.category)}`}
              </div>
            </Link>
          ))
        )}
      </div>

      <nav style={styles.nav}>
        <Link to="/scenario/new">新建场景</Link>
        <Link to="/scenarios">全部场景</Link>
      </nav>
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 22, marginBottom: 16, fontWeight: 600 },
  card: {
    background: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  label: { fontSize: 13, color: '#666', marginBottom: 10 },
  item: { padding: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, borderBottom: '1px solid #eee' },
  itemLink: { flex: 1, textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 },
  execBtn: { fontSize: 13, color: '#16a34a', textDecoration: 'underline', whiteSpace: 'nowrap' },
  tag: { fontSize: 12, color: '#999', background: '#eee', padding: '2px 8px', borderRadius: 4 },
  empty: { color: '#999', fontSize: 14 },
  scenarioLink: { display: 'block', padding: '10px 0', borderBottom: '1px solid #eee', textDecoration: 'none', color: 'inherit' },
  scenarioName: { fontWeight: 600, marginBottom: 4 },
  scenarioMeta: { fontSize: 13, color: '#666' },
  nav: { display: 'flex', justifyContent: 'space-around', padding: '24px 0', gap: 8 }
}
