const SCENARIOS_KEY = 'test_scenarios'
const EXPORT_VERSION = 1

// --- 场景 CRUD ---
export function getScenarios() {
  try {
    const raw = localStorage.getItem(SCENARIOS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveScenario(scenario) {
  const list = getScenarios()
  const idx = list.findIndex(s => s.id === scenario.id)
  if (idx >= 0) {
    list[idx] = scenario
  } else {
    list.unshift(scenario)
  }
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(list))
  return list
}

export function deleteScenario(id) {
  const list = getScenarios().filter(s => s.id !== id)
  localStorage.setItem(SCENARIOS_KEY, JSON.stringify(list))
  return list
}

export function getScenarioById(id) {
  return getScenarios().find(s => s.id === id)
}

// --- 按分类筛选 ---
export function getScenariosByCategory(category) {
  if (!category) return getScenarios()
  return getScenarios().filter(s => s.category === category)
}

// --- 导入 / 导出 ---
export function exportData() {
  const data = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    [SCENARIOS_KEY]: getScenarios()
  }
  return JSON.stringify(data, null, 2)
}

export function importData(jsonStr, mode = 'merge') {
  try {
    const data = JSON.parse(jsonStr)
    if (!data || typeof data !== 'object') return { ok: false, error: '无效的 JSON' }

    const scenarios = data[SCENARIOS_KEY] || []

    if (mode === 'overwrite') {
      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(Array.isArray(scenarios) ? scenarios : []))
    } else {
      const existing = getScenarios()
      const ids = new Set(existing.map(s => s.id))
      const merged = [...existing]
      ;(Array.isArray(scenarios) ? scenarios : []).forEach(s => {
        if (s.id && !ids.has(s.id)) {
          merged.push(s)
          ids.add(s.id)
        }
      })
      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(merged))
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message || '解析失败' }
  }
}
