import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getScenarioById } from '../utils/storage'
import { SCENARIO_CATEGORIES } from '../utils/constants'

function getCategoryLabel(value) {
  return SCENARIO_CATEGORIES.find(c => c.value === value)?.label || value
}

export default function ScenarioDetail() {
  const { id } = useParams()
  const scenario = getScenarioById(id)

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
        {scenario.triggerDate && <span>{scenario.triggerDate}</span>}
        {scenario.triggerTime && <span>{scenario.triggerTime}</span>}
      </div>

      {scenario.location && (
        <div style={styles.card}>
          <div style={styles.label}>触发地点</div>
          <p>{scenario.location}</p>
        </div>
      )}

      {scenario.memo && (
        <div style={styles.card}>
          <div style={styles.label}>备注</div>
          <p style={styles.text}>{scenario.memo}</p>
        </div>
      )}

      {(scenario.photos || []).length > 0 && (
        <div style={styles.card}>
          <div style={styles.label}>图片</div>
          <div style={styles.photoGrid}>
            {scenario.photos.map((p, i) => (
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
  label: { fontSize: 13, color: '#666', marginBottom: 8 },
  text: { fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' },
  photoGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  photoThumb: { width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }
}
