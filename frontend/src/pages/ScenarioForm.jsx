import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveScenario, getScenarioById } from '../utils/storage'
import { uuid } from '../utils/uuid'
import { readAsBase64 } from '../utils/image'
import { SCENARIO_CATEGORIES } from '../utils/constants'
import TimeSelect from '../components/TimeSelect'
import DateSelect from '../components/DateSelect'

export default function ScenarioForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const photoInputRef = useRef(null)

  const [form, setForm] = useState({
    name: '',
    category: 'public_transit',
    triggerDate: new Date().toISOString().slice(0, 10),
    triggerTime: '',
    location: '',
    memo: '',
    photos: []
  })

  useEffect(() => {
    if (id) {
      const s = getScenarioById(id)
      if (s) setForm({ ...s, photos: s.photos || [] })
    }
  }, [id])

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleAddPhoto = async (e) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    try {
      const base64 = await readAsBase64(file)
      update('photos', [...(form.photos || []), base64])
    } catch (err) {
      alert('图片处理失败')
    }
    e.target.value = ''
  }
  const removePhoto = (idx) => {
    update('photos', (form.photos || []).filter((_, i) => i !== idx))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = { ...form, id: form.id || uuid() }
    saveScenario(data)
    navigate('/scenarios')
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{isEdit ? '编辑场景' : '新建测试场景'}</h1>
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>场景名</label>
          <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="如：地铁到站提醒" required />
        </div>
        <div style={styles.field}>
          <label>服务分类</label>
          <select value={form.category} onChange={e => update('category', e.target.value)}>
            {SCENARIO_CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div style={styles.row}>
          <div style={{ ...styles.field, ...styles.fieldInRow }}>
            <label>触发日期</label>
            <DateSelect value={form.triggerDate} onChange={v => update('triggerDate', v)} />
          </div>
          <div style={{ ...styles.field, ...styles.fieldInRow }}>
            <label>触发时间（可选）</label>
            <TimeSelect value={form.triggerTime || ''} onChange={v => update('triggerTime', v)} />
          </div>
        </div>
        <div style={styles.field}>
          <label>触发地点</label>
          <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="如：南京南站" />
        </div>
        <div style={styles.field}>
          <label>备注</label>
          <textarea value={form.memo} onChange={e => update('memo', e.target.value)} placeholder="场景说明、测试要点等" />
        </div>
        <div style={styles.field}>
          <label>图片</label>
          <div style={styles.photoGrid}>
            {(form.photos || []).map((p, i) => (
              <div key={i} style={styles.photoWrap}>
                <img src={p} alt="" style={styles.photoThumb} />
                <button type="button" onClick={() => removePhoto(i)} style={styles.photoDel}>×</button>
              </div>
            ))}
            <button type="button" onClick={() => photoInputRef.current?.click()} style={styles.addPhoto}>+ 添加</button>
          </div>
          <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAddPhoto} />
        </div>
        <button type="submit" style={styles.submit}>保存</button>
      </form>
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 22, marginBottom: 16, fontWeight: 600 },
  field: { marginBottom: 16 },
  row: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  fieldInRow: { flex: '1 1 200px' },
  photoGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  photoWrap: { position: 'relative' },
  photoThumb: { width: 80, height: 80, objectFit: 'cover', borderRadius: 8 },
  photoDel: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', background: '#c00', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1 },
  addPhoto: { width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: 8, background: '#f9f9f9', cursor: 'pointer', fontSize: 14 },
  submit: { width: '100%', padding: 14, marginTop: 8 }
}
