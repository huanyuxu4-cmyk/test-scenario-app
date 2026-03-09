const SCENARIOS_KEY = 'test_scenarios'
const EXECUTIONS_KEY = 'test_executions'
const EXPORT_VERSION = 2

// --- 场景模板 CRUD（设定：场景名、日期、备注）---
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
  // 同时删除该场景的所有执行记录
  const execs = getExecutions().filter(e => e.scenarioId !== id)
  localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(execs))
  return list
}

export function getScenarioById(id) {
  return getScenarios().find(s => s.id === id)
}

export function getScenariosByCategory(category) {
  if (!category) return getScenarios()
  return getScenarios().filter(s => s.category === category)
}

// --- 执行记录 CRUD（执行时：是否触发、具体时间、地点、情况、图片）---
export function getExecutions() {
  try {
    const raw = localStorage.getItem(EXECUTIONS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveExecution(execution) {
  const list = getExecutions()
  const idx = list.findIndex(e => e.id === execution.id)
  if (idx >= 0) {
    list[idx] = execution
  } else {
    list.unshift(execution)
  }
  localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(list))
  return list
}

export function deleteExecution(id) {
  const list = getExecutions().filter(e => e.id !== id)
  localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(list))
  return list
}

export function getExecutionById(id) {
  return getExecutions().find(e => e.id === id)
}

export function getExecutionsByScenarioId(scenarioId) {
  return getExecutions()
    .filter(e => e.scenarioId === scenarioId)
    .sort((a, b) => (b.executedDate || '').localeCompare(a.executedDate || '') || (b.triggerTime || '').localeCompare(a.triggerTime || ''))
}

export function getExecutionsByDate(date) {
  return getExecutions()
    .filter(e => e.executedDate === date)
    .sort((a, b) => (a.triggerTime || '').localeCompare(b.triggerTime || ''))
}

// --- 导入 / 导出 ---
export function exportData() {
  const data = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    [SCENARIOS_KEY]: getScenarios(),
    [EXECUTIONS_KEY]: getExecutions()
  }
  return JSON.stringify(data, null, 2)
}

export function importData(jsonStr, mode = 'merge') {
  try {
    const data = JSON.parse(jsonStr)
    if (!data || typeof data !== 'object') return { ok: false, error: '无效的 JSON' }

    const scenarios = data[SCENARIOS_KEY] || []
    const executions = data[EXECUTIONS_KEY] || []

    if (mode === 'overwrite') {
      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(Array.isArray(scenarios) ? scenarios : []))
      localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(Array.isArray(executions) ? executions : []))
    } else {
      const existingScenarios = getScenarios()
      const existingExecutions = getExecutions()
      const scenarioIds = new Set(existingScenarios.map(s => s.id))
      const executionIds = new Set(existingExecutions.map(e => e.id))

      const mergedScenarios = [...existingScenarios]
      ;(Array.isArray(scenarios) ? scenarios : []).forEach(s => {
        if (s.id && !scenarioIds.has(s.id)) {
          mergedScenarios.push(migrateScenario(s))
          scenarioIds.add(s.id)
        }
      })

      const mergedExecutions = [...existingExecutions]
      ;(Array.isArray(executions) ? executions : []).forEach(e => {
        if (e.id && !executionIds.has(e.id)) {
          mergedExecutions.push(migrateExecution(e))
          executionIds.add(e.id)
        }
      })

      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(mergedScenarios))
      localStorage.setItem(EXECUTIONS_KEY, JSON.stringify(mergedExecutions))
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message || '解析失败' }
  }
}

// 兼容旧版数据格式
function migrateScenario(s) {
  if (s.plannedDate) return s
  return {
    ...s,
    plannedDate: s.triggerDate || s.plannedDate || ''
  }
}

function migrateExecution(e) {
  if (e.scenarioId) return e
  return { ...e }
}
