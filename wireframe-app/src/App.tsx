import { useMemo, useRef, useState } from 'react'
import './App.css'

type CanvasUnit = 'px' | 'mm' | 'pt'

type CanvasSpec = {
  width: number
  height: number
  unit: CanvasUnit
  background: string
}

type PageData = {
  id: string
  name: string
  nodes?: unknown[]
}

type ProjectData = {
  id: string
  name: string
  canvas: CanvasSpec
  pages: PageData[]
  activePageId: string
}

const defaultCanvas: CanvasSpec = {
  width: 1440,
  height: 900,
  unit: 'px',
  background: '#FFFFFF',
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

const ensureProject = (data: Partial<ProjectData>): ProjectData => {
  const canvas = {
    ...defaultCanvas,
    ...(data.canvas ?? {}),
  }
  const pages = (data.pages ?? []).map((page, index) => ({
    id: page.id ?? createId(),
    name: page.name ?? `Page ${index + 1}`,
    nodes: page.nodes ?? [],
  }))
  const fallbackPage = pages.length > 0 ? pages : [{ id: createId(), name: 'Page 1', nodes: [] }]
  const activePageId =
    data.activePageId && fallbackPage.some((page) => page.id === data.activePageId)
      ? data.activePageId
      : fallbackPage[0].id

  return {
    id: data.id ?? createId(),
    name: data.name?.trim() || 'Untitled',
    canvas,
    pages: fallbackPage,
    activePageId,
  }
}

function App() {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [form, setForm] = useState({
    name: 'Untitled',
    width: 1440,
    height: 900,
    unit: 'px' as CanvasUnit,
    background: '#FFFFFF',
  })

  const activePage = useMemo(() => {
    if (!project) return null
    return project.pages.find((page) => page.id === project.activePageId) ?? null
  }, [project])

  const updateProject = (updater: (prev: ProjectData) => ProjectData) => {
    setProject((prev) => {
      if (!prev) return prev
      const next = updater(prev)
      return next
    })
    setIsDirty(true)
  }

  const handleCreateProject = () => {
    setError(null)
    const newProject = ensureProject({
      name: form.name,
      canvas: {
        width: Number(form.width) || defaultCanvas.width,
        height: Number(form.height) || defaultCanvas.height,
        unit: form.unit,
        background: form.background,
      },
      pages: [{ id: createId(), name: 'Page 1', nodes: [] }],
    })
    setProject(newProject)
    setIsDirty(false)
  }

  const handleOpenFile = async (file: File) => {
    setError(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text) as Partial<ProjectData>
      const normalized = ensureProject(data)
      setProject(normalized)
      setIsDirty(false)
    } catch (err) {
      setError('ファイルの読み込みに失敗しました。形式を確認してください。')
    }
  }

  const handleSave = () => {
    if (!project) return
    const data = {
      id: project.id,
      name: project.name,
      canvas: project.canvas,
      pages: project.pages,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${project.name || 'wireframe'}.wire`
    a.click()
    URL.revokeObjectURL(url)
    setIsDirty(false)
  }

  const handleAddPage = () => {
    updateProject((prev) => {
      const nextPage = { id: createId(), name: `Page ${prev.pages.length + 1}`, nodes: [] }
      return {
        ...prev,
        pages: [...prev.pages, nextPage],
        activePageId: nextPage.id,
      }
    })
  }

  const handleRenamePage = (pageId: string, name: string) => {
    updateProject((prev) => ({
      ...prev,
      pages: prev.pages.map((page) =>
        page.id === pageId ? { ...page, name: name.trim() || page.name } : page,
      ),
    }))
  }

  const handleRemovePage = (pageId: string) => {
    updateProject((prev) => {
      const remaining = prev.pages.filter((page) => page.id !== pageId)
      const nextPages = remaining.length > 0 ? remaining : [{ id: createId(), name: 'Page 1', nodes: [] }]
      const nextActive = nextPages.some((page) => page.id === prev.activePageId)
        ? prev.activePageId
        : nextPages[0].id
      return {
        ...prev,
        pages: nextPages,
        activePageId: nextActive,
      }
    })
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-title">Wireframe Studio</span>
          <span className="brand-sub">キャンバス作成 / 管理</span>
        </div>
        <div className="header-actions">
          <button className="ghost" onClick={() => fileInputRef.current?.click()}>
            開く
          </button>
          <button className="primary" onClick={handleSave} disabled={!project}>
            保存
          </button>
          {project && <span className="status">{isDirty ? '未保存' : '保存済み'}</span>}
        </div>
      </header>

      <main className="app-main">
        <section className="panel">
          <h2>新規キャンバス</h2>
          <div className="form-grid">
            <label>
              プロジェクト名
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Untitled"
              />
            </label>
            <label>
              幅
              <input
                type="number"
                min={1}
                value={form.width}
                onChange={(event) => setForm((prev) => ({ ...prev, width: Number(event.target.value) }))}
              />
            </label>
            <label>
              高さ
              <input
                type="number"
                min={1}
                value={form.height}
                onChange={(event) => setForm((prev) => ({ ...prev, height: Number(event.target.value) }))}
              />
            </label>
            <label>
              単位
              <select
                value={form.unit}
                onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value as CanvasUnit }))}
              >
                <option value="px">px</option>
                <option value="mm">mm</option>
                <option value="pt">pt</option>
              </select>
            </label>
            <label>
              背景色
              <input
                type="color"
                value={form.background}
                onChange={(event) => setForm((prev) => ({ ...prev, background: event.target.value }))}
              />
            </label>
          </div>
          <button className="primary" onClick={handleCreateProject}>
            新規作成
          </button>
          {error && <p className="error-text">{error}</p>}
        </section>

        <section className="workspace">
          <div className="workspace-header">
            <div>
              <h2>{project?.name ?? 'プロジェクト未作成'}</h2>
              {project && (
                <p className="sub">
                  キャンバス: {project.canvas.width} × {project.canvas.height} {project.canvas.unit}
                </p>
              )}
            </div>
            {project && (
              <div className="workspace-actions">
                <button className="ghost" onClick={handleAddPage}>
                  ページ追加
                </button>
                <button className="ghost" onClick={() => fileInputRef.current?.click()}>
                  既存ファイル読み込み
                </button>
              </div>
            )}
          </div>

          <div className="workspace-body">
            <aside className="pages">
              <div className="pages-header">
                <span>ページ</span>
                <button className="mini" onClick={handleAddPage} disabled={!project}>
                  +
                </button>
              </div>
              <div className="pages-list">
                {project?.pages.map((page) => (
                  <div
                    key={page.id}
                    className={`page-item ${page.id === project.activePageId ? 'active' : ''}`}
                  >
                    <input
                      value={page.name}
                      onChange={(event) => handleRenamePage(page.id, event.target.value)}
                      onFocus={() =>
                        updateProject((prev) => ({ ...prev, activePageId: page.id }))
                      }
                    />
                    <button
                      className="mini danger"
                      onClick={() => handleRemovePage(page.id)}
                      aria-label="ページ削除"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {!project && <p className="muted">プロジェクトを作成してください。</p>}
              </div>
            </aside>

            <section className="canvas-panel">
              {project ? (
                <>
                  <div className="canvas-toolbar">
                    <label>
                      幅
                      <input
                        type="number"
                        value={project.canvas.width}
                        min={1}
                        onChange={(event) =>
                          updateProject((prev) => ({
                            ...prev,
                            canvas: { ...prev.canvas, width: Number(event.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      高さ
                      <input
                        type="number"
                        value={project.canvas.height}
                        min={1}
                        onChange={(event) =>
                          updateProject((prev) => ({
                            ...prev,
                            canvas: { ...prev.canvas, height: Number(event.target.value) },
                          }))
                        }
                      />
                    </label>
                    <label>
                      単位
                      <select
                        value={project.canvas.unit}
                        onChange={(event) =>
                          updateProject((prev) => ({
                            ...prev,
                            canvas: { ...prev.canvas, unit: event.target.value as CanvasUnit },
                          }))
                        }
                      >
                        <option value="px">px</option>
                        <option value="mm">mm</option>
                        <option value="pt">pt</option>
                      </select>
                    </label>
                    <label>
                      背景色
                      <input
                        type="color"
                        value={project.canvas.background}
                        onChange={(event) =>
                          updateProject((prev) => ({
                            ...prev,
                            canvas: { ...prev.canvas, background: event.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className="canvas-stage">
                    <div
                      className="canvas"
                      style={{
                        width: `${project.canvas.width}px`,
                        height: `${project.canvas.height}px`,
                        background: project.canvas.background,
                      }}
                    >
                      <div className="canvas-meta">
                        <span>{activePage?.name ?? 'Page'}</span>
                        <span>
                          {project.canvas.width} × {project.canvas.height} {project.canvas.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="canvas-empty">
                  <p>プロジェクトを作成または読み込んでください。</p>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".wire,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) {
            handleOpenFile(file)
          }
          event.currentTarget.value = ''
        }}
      />
    </div>
  )
}

export default App
