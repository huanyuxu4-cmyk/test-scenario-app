import React, { useState, useCallback, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getScenarioById, getExecutionsByScenarioId, deleteExecution } from '../utils/storage'
import { SCENARIO_CATEGORIES } from '../utils/constants'

function getCategoryLabel(value) {
  return SCENARIO_CATEGORIES.find(c => c.value === value)?.label || value
}

export default function ScenarioDetail() {
  const { id } = useParams()
  const scenario = getScenarioById(id)
  const [executions, setExecutions] = useState([])
  const refreshExecutions = useCallback(() => setExecutions(getExecutionsByScenarioId(id)), [id])
  useEffect(() => { refreshExecutions() }, [id, refreshExecutions])

  const handleDeleteExec = (execId, e) => {
    e.preventDefault()
    if (confirm('确定删除此执行记录？')) {
      deleteExecution(execId)
      refreshExecutions()
    }
  }

  if (!scenario) {
    return (
      <div style={styles.page}>
        <p>场景不存在</p>
        <Link to="/scenarios">返回列表</Link>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.actions}>
        <Link to="/scenarios" style={styles.back}>← 返回</Link>
        <Link to={`/scenario/${scenario.id}/edit`} style={styles.edit}>编辑</Link>
      </div>

      <h1 style={styles.title}>{scenario.name}</h1>
      {scenario.category && (
        <div style={styles.badge}>{getCategoryLabel(scenario.category)}</div>
      )}
      <div style={styles.meta}>
        {scenario.plannedDate && <span>计划日期：{scenario.plannedDate}</span>}
      </div>

      {scenario.memo && (
        <div style={styles.card}>
          <div style={styles.label}>备注</div>
          <p style={styles.text}>{scenario.memo}</p>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.sectionHeader}>
          <span style={styles.label}>执行记录</span>
          <Link to={`/scenario/${id}/execute`} style={styles.addBtn}>+ 添加执行</Link>
        </div>
        {executions.length === 0 ? (
          <p style={styles.empty}>暂无执行记录，点击「添加执行」记录本次测试</p>
        ) : (
          executions.map(exec => (
            <div key={exec.id} style={styles.execItem}>
              <Link to={`/execution/${exec.id}`} style={styles.execLink}>
                <div style={styles.execHeader}>
                  <span style={styles.execDate}>{exec.executedDate}</span>
                  {exec.triggerTime && <span>{exec.triggerTime}</span>}
                  <span style={exec.triggered ? styles.triggeredYes : styles.triggeredNo}>
                    {exec.triggered ? '已触发' : '未触发'}
                  </span>
                </div>
                {exec.location && <div style={styles.execMeta}>{exec.location}</div>}
                {exec.details && <div style={styles.execDetails}>{exec.details.slice(0, 60)}{exec.details.length > 60 ? '…' : ''}</div>}
              </Link>
              <div style={styles.execActions}>
                <Link to={`/execution/${exec.id}/edit`} style={styles.editExec}>编辑</Link>
                <button type="button" onClick={e => handleDeleteExec(exec.id, e)} style={styles.delExec}>删除</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  actions: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  back: { fontSize: 14 },
  edit: { fontSize: 14, color: '#2563eb', textDecoration: 'underline' },
  title: { fontSize: 22, marginBottom: 8, fontWeight: 600 },
  badge: { display: 'inline-block', fontSize: 12, color: '#666', background: '#eee', padding: '4px 10px', borderRadius: 6, marginBottom: 12 },
  meta: { display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 14, color: '#666', marginBottom: 16 },
  card: {
    background: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  label: { fontSize: 13, color: '#666', marginBottom: 8, fontWeight: 600 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addBtn: { fontSize: 14, color: '#2563eb', textDecoration: 'underline' },
  text: { fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  empty: { color: '#999', fontSize: 14 },
  execItem: { padding: 12, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  execLink: { flex: 1, textDecoration: 'none', color: 'inherit' },
  execHeader: { display: 'flex', gap: 8, marginBottom: 4, alignItems: 'center' },
  execDate: { fontWeight: 600 },
  triggeredYes: { fontSize: 12, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 4 },
  triggeredNo: { fontSize: 12, color: '#666', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 },
  execMeta: { fontSize: 13, color: '#666', marginBottom: 4 },
  execDetails: { fontSize: 13, color: '#888' },
  execActions: { display: 'flex', gap: 8 },
  editExec: { fontSize: 13, color: '#2563eb' },
  delExec: { fontSize: 13, background: 'none', color: '#c00', padding: 0 }
}
