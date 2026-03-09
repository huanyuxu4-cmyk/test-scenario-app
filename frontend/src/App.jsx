import React, { useState, useRef, useEffect } from 'react'
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ScenarioList from './pages/ScenarioList'
import ScenarioForm from './pages/ScenarioForm'
import ScenarioDetail from './pages/ScenarioDetail'
import Settings from './pages/Settings'

function Nav() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const loc = useLocation()
  useEffect(() => setOpen(false), [loc.pathname])
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [])
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.logo}>测试场景</Link>
      <nav style={styles.nav} ref={ref}>
        <Link to="/" style={styles.navA}>首页</Link>
        <Link to="/scenarios" style={styles.navA}>场景列表</Link>
        <Link to="/scenario/new" style={styles.navA}>新建</Link>
        <div style={styles.moreWrap}>
          <button type="button" onClick={() => setOpen(o => !o)} style={styles.moreBtn}>
            更多 <span style={styles.moreArrow} />
          </button>
          {open && (
            <div style={styles.dropdown}>
              <Link to="/settings" className="nav-drop-a" style={styles.dropA}>设置</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div style={styles.app}>
        <Nav />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scenarios" element={<ScenarioList />} />
            <Route path="/scenario/new" element={<ScenarioForm />} />
            <Route path="/scenario/:id" element={<ScenarioDetail />} />
            <Route path="/scenario/:id/edit" element={<ScenarioForm />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}

const styles = {
  app: { minHeight: '100%', display: 'flex', flexDirection: 'column' },
  header: {
    background: '#2563eb',
    color: '#fff',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  logo: { color: '#fff', fontWeight: 600, fontSize: 18 },
  nav: { display: 'flex', gap: 12, fontSize: 14, alignItems: 'center' },
  navA: { color: 'rgba(255,255,255,0.95)' },
  moreWrap: { position: 'relative' },
  moreBtn: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.9)',
    cursor: 'pointer',
    fontSize: 14,
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 4
  },
  moreArrow: {
    display: 'inline-block',
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '5px solid currentColor'
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 4,
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: '8px 0',
    minWidth: 100
  },
  dropA: { display: 'block', padding: '8px 16px', color: '#333', fontSize: 14, textDecoration: 'none' },
  main: { flex: 1, padding: 0 }
}
