import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveScenario, getScenarioById } from '../utils/storage'
import { uuid } from '../utils/uuid'
import { SCENARIO_CATEGORIES } from '../utils/constants'
import DateSelect from '../components/DateSelect'

export default function ScenarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    category: 'public_transit',
    plannedDate: new Date().toISOString().slice(0, 10),
    memo: ''
  })

  useEffect(() => {
    if (id) {
      const s = getScenarioById(id)
      if (s) setForm({ name: s.name || '', category: s.category || 'public_transit', plannedDate: s.plannedDate || s.triggerDate || '', memo: s.memo || '' })
    }
  }, [id])

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, id: form.id || id || uuid() }
    saveScenario(data)
    navigate('/scenarios')
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{isEdit ? '编辑场景' : '新建场景'}</h1>
      <p style={styles.subtitle}>设定场景名、计划日期与备注，执行时再记录触发情况</p>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>场景名</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="如：车内交通标识标牌展示" required />
        </div>
        <div style={styles.field}>
          <label>服务分类</label>
          <select value={form.category} onChange={e => update('category', e.target.value)}>
            {SCENARIO_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div style={styles.field}>
          <label>计划日期</label>
          <DateSelect value={form.plannedDate} onChange={v => update('plannedDate', v)} />
        </div>
        <div style={styles.field}>
          <label>备注</label>
          <textarea value={form.memo} onChange={e => update('memo', e.target.value)} placeholder="场景说明、测试要点等" />
        </div>
        <button type="submit" style={styles.submit}>保存</button>
      </form>
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 22, marginBottom: 8, fontWeight: 600 },
  subtitle: { fontSize: 13, color: '#666', marginBottom: 16 },
  field: { marginBottom: 16 },
  submit: { width: '100%', padding: 14, marginTop: 8 }
}
