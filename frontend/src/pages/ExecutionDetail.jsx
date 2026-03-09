import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getExecutionById, getScenarioById } from '../utils/storage'

export default function ExecutionDetail() {
  const { id } = useParams()
  const execution = getExecutionById(id)
  const scenario = execution ? getScenarioById(execution.scenarioId) : null

  if (!execution) {
    return (
      <div style={styles.page}>
        <p>执行记录不存在</p>
        <Link to="/scenarios">返回列表</Link>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.actions}>
        <Link to={`/scenario/${execution.scenarioId}`} style={styles.back}>← 返回场景</Link>
        <Link to={`/execution/${execution.id}/edit`} style={styles.edit}>编辑</Link>
      </div>

      {scenario && <h2 style={styles.scenarioName}>{scenario.name}</h2>}
      <div style={styles.meta}>
        <span>执行日期：{execution.executedDate}</span>
        <span style={execution.triggered ? styles.triggeredYes : styles.triggeredNo}>
          {execution.triggered ? '已触发' : '未触发'}
        </span>
      </div>

      {execution.triggered && execution.triggerTime && (
        <div style={styles.card}>
          <div style={styles.label}>触发时间</div>
          <p>{execution.triggerTime}</p>
        </div>
      )}
      {execution.location && (
        <div style={styles.card}>
          <div style={styles.label}>触发地点</div>
          <p>{execution.location}</p>
        </div>
      )}
      {execution.details && (
        <div style={styles.card}>
          <div style={styles.label}>具体情况</div>
          <p style={styles.text}>{execution.details}</p>
        </div>
      )}
      {(execution.photos || []).length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>图片</div>
          <div style={styles.photoGrid}>
            {execution.photos.map((p, i) => (
              <img key={i} src={p} alt="" style={styles.photoThumb} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  actions: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  back: { fontSize: 14 },
  edit: { fontSize: 14, color: '#2563eb', textDecoration: 'underline' },
  scenarioName: { fontSize: 18, marginBottom: 8, fontWeight: 600, color: '#666' },
  meta: { display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 16 },
  triggeredYes: { fontSize: 12, color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: 6 },
  triggeredNo: { fontSize: 12, color: '#666', background: '#f3f4f6', padding: '4px 10px', borderRadius: 6 },
  card: {
    background: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
  },
  label: { fontSize: 13, color: '#666', marginBottom: 8 },
  text: { fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  photoGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  photoThumb: { width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }
}
