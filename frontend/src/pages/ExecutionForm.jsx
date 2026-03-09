import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveExecution, getExecutionById, getScenarioById } from '../utils/storage'
import { uuid } from '../utils/uuid'
import { readAsBase64 } from '../utils/image'
import DateSelect from '../components/DateSelect'
import TimeSelect from '../components/TimeSelect'

export default function ExecutionForm() {
  const params = useParams()
  const scenarioId = params.scenarioId
  const execId = params.id // 编辑时来自 /execution/:id/edit
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const isEdit = !!execId

  const scenario = scenarioId ? getScenarioById(scenarioId) : null
  const existingExec = execId ? getExecutionById(execId) : null

  const [form, setForm] = useState({
    executedDate: new Date().toISOString().slice(0, 10),
    triggered: true,
    triggerTime: '',
    location: '',
    details: '',
    photos: []
  })

  useEffect(() => {
    if (existingExec) {
      setForm({
        executedDate: existingExec.executedDate || new Date().toISOString().slice(0, 10),
        triggered: existingExec.triggered !== false,
        triggerTime: existingExec.triggerTime || '',
        location: existingExec.location || '',
        details: existingExec.details || '',
        photos: existingExec.photos || []
      })
    } else if (scenario?.plannedDate) {
      setForm(prev => ({ ...prev, executedDate: scenario.plannedDate }))
    }
  }, [existingExec, scenario])

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
  const removePhoto = (idx) => update('photos', (form.photos || []).filter((_, i) => i !== idx))

  const handleSubmit = (e) => {
    e.preventDefault()
    const sid = existingExec?.scenarioId || scenarioId
    if (!sid) {
      alert('缺少场景信息')
      return
    }
    const data = {
      ...form,
      id: existingExec?.id || uuid(),
      scenarioId: sid,
      triggered: !!form.triggered
    }
    saveExecution(data)
    navigate(`/scenario/${sid}`)
  }

  const backLink = scenarioId ? `/scenario/${scenarioId}` : (existingExec ? `/scenario/${existingExec.scenarioId}` : '/scenarios')

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>{isEdit ? '编辑执行记录' : '添加执行记录'}</h1>
      {scenario && <p style={styles.subtitle}>场景：{scenario.name}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.field}>
          <label>执行日期</label>
          <DateSelect value={form.executedDate} onChange={v => update('executedDate', v)} />
        </div>
        <div style={styles.field}>
          <label>是否触发</label>
          <div style={styles.radioRow}>
            <label style={styles.radioLabel}>
              <input type="radio" checked={form.triggered} onChange={() => update('triggered', true)} />
              已触发
            </label>
            <label style={styles.radioLabel}>
              <input type="radio" checked={!form.triggered} onChange={() => update('triggered', false)} />
              未触发
            </label>
          </div>
        </div>
        {form.triggered && (
          <>
            <div style={styles.field}>
              <label>触发的具体时间</label>
              <TimeSelect value={form.triggerTime} onChange={v => update('triggerTime', v)} />
            </div>
            <div style={styles.field}>
              <label>触发地点</label>
              <input value={form.location} onChange={e => update('location', e.target.value)} placeholder="如：南京南站" />
            </div>
          </>
        )}
        <div style={styles.field}>
          <label>具体情况</label>
          <textarea value={form.details} onChange={e => update('details', e.target.value)} placeholder="记录触发时的具体情况、测试结果等" />
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
        <div style={styles.btnRow}>
          <button type="button" onClick={() => navigate(backLink)} style={styles.cancelBtn}>取消</button>
          <button type="submit" style={styles.submit}>保存</button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  page: { padding: 16, paddingBottom: 80 },
  title: { fontSize: 22, marginBottom: 8, fontWeight: 600 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 16 },
  field: { marginBottom: 16 },
  radioRow: { display: 'flex', gap: 24 },
  radioLabel: { display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 15 },
  photoGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  photoWrap: { position: 'relative' },
  photoThumb: { width: 80, height: 80, objectFit: 'cover', borderRadius: 8 },
  photoDel: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: '50%', background: '#c00', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 16, lineHeight: 1 },
  addPhoto: { width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', borderRadius: 8, background: '#f9f9f9', cursor: 'pointer', fontSize: 14 },
  btnRow: { display: 'flex', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, padding: 14, background: '#666' },
  submit: { flex: 1, padding: 14 }
}
