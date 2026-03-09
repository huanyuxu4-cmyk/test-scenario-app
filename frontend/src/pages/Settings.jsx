import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { exportData, importData, getScenarios } from '../utils/storage'

export default function Settings() {
  const [importResult, setImportResult] = useState(null)
  const mergeInputRef = useRef(null)
  const overwriteInputRef = useRef(null)

  const handleExport = () => {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `test-scenarios-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = importData(reader.result, 'merge')
        setImportResult(result.ok ? { ok: true } : { ok: false, error: result.error })
        if (result.ok) window.location.reload()
      } catch (err) {
        setImportResult({ ok: false, error: err.message })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleImportOverwrite = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const result = importData(reader.result, 'overwrite')
        setImportResult(result.ok ? { ok: true } : { ok: false, error: result.error })
        if (result.ok) window.location.reload()
      } catch (err) {
        setImportResult({ ok: false, error: err.message })
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const count = getScenarios().length

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>设置</h1>

      <div style={styles.card}>
        <div style={styles.label}>数据统计</div>
        <p>当前共 {count} 个测试场景</p>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>导出数据</div>
        <p style={styles.hint}>将全部场景导出为 JSON 文件备份</p>
        <button type="button" onClick={handleExport} style={styles.btn}>导出</button>
      </div>

      <div style={styles.card}>
        <div style={styles.label}>导入数据</div>
        <p style={styles.hint}>从 JSON 文件恢复场景。合并模式：不覆盖已有 ID；覆盖模式：清空后导入</p>
        <div style={styles.btnRow}>
          <input ref={mergeInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
          <button type="button" onClick={() => mergeInputRef.current?.click()} style={styles.btn}>合并导入</button>
          <input ref={overwriteInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportOverwrite} />
          <button type="button" onClick={() => overwriteInputRef.current?.click()} style={{ ...styles.btn, background: '#c00' }}>覆盖导入</button>
        </div>
      </div>

      {importResult && (
        <div style={{ ...styles.card, background: importResult.ok ? '#e8f5e9' : '#ffebee' }}>
          {importResult.ok ? '导入成功' : `导入失败：${importResult.error}`}
        </div>
      )}

      <Link to="/" style={styles.back}>← 返回首页</Link>
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
  label: { fontSize: 13, color: '#666', marginBottom: 8, fontWeight: 600 },
  hint: { fontSize: 13, color: '#888', marginBottom: 12 },
  btn: { padding: '10px 20px' },
  btnRow: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  back: { display: 'block', marginTop: 24, fontSize: 14 }
}
