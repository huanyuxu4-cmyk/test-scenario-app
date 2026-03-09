import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { getScenarios, deleteScenario, getScenariosByCategory } from '../utils/storage'
import { SCENARIO_CATEGORIES } from '../utils/constants'

function getCategoryLabel(value) {
  return SCENARIO_CATEGORIES.find(c => c.value === value)?.label || value
}

export default function ScenarioList() {
  const [filter, setFilter] = useState('')
  const scenarios = filter ? getScenariosByCategory(filter) : getScenarios()
  const [list, setList] = useState(scenarios)

  const refresh = () => setList(filter ? getScenariosByCategory(filter) : getScenarios())

  const handleDelete = (id, e) => {
    e.preventDefault()
    if (confirm('确定删除此场景？')) {
      deleteScenario(id)
      refresh()
    }
  }

  const handleFilterChange = (e) => {
    const v = e.target.value
    setFilter(v)
    setList(v ? getScenariosByCategory(v) : getScenarios())
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>场景列表</h1>

      <div style={styles.filter}>
        <label>分类筛选</label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="">全部</option>
          {SCENARIO_CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>

      {list.length === 0 ? (
        <div style={styles.empty}>
          暂无场景，<Link to="/scenario/new">新建场景</Link>
        </div>
      ) : (
        list.map(s => (
          <div key={s.id} style={styles.item}>
            <Link to={`/scenario/${s.id}`} style={styles.link}>
              <div style={styles.name}>{s.name}</div>
              <div style={styles.meta}>
                计划日期：{s.plannedDate || s.triggerDate || '-'}
                {s.category && ` · ${getCategoryLabel(s.category)}`}
              </div>
            </Link>
            <Link to={`/scenario/${s.id}/execute`} style={styles.execBtn}>执行</Link>
            <Link to={`/scenario/${s.id}/edit`} style={styles.editBtn}>编辑</Link>
            <button
              type="button"
              onClick={e => handleDelete(s.id, e)}
              style={styles.delBtn}
              className="danger"
            >
              删除
            </button>
          </div>
        ))
      )}
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 22, marginBottom: 16, fontWeight: 600 },
  filter: { marginBottom: 16 },
  empty: { textAlign: 'center', padding: 40, color: '#666' },
  item: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  link: { flex: 1 },
  execBtn: { padding: '8px 12px', fontSize: 13, color: '#16a34a', textDecoration: 'underline' },
  editBtn: { padding: '8px 12px', fontSize: 13, color: '#2563eb', textDecoration: 'underline' },
  name: { fontWeight: 600, marginBottom: 4 },
  meta: { fontSize: 13, color: '#666' },
  delBtn: { padding: '8px 12px', fontSize: 13 }
}
