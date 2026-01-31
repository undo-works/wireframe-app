import { useCallback, useMemo, useState } from 'react'
import type { CanvasSpec, CanvasUnit, PageData, ProjectData } from '../components/types'

type CanvasFormState = {
  name: string
  width: number
  height: number
  unit: CanvasUnit
  background: string
}

const defaultCanvas: CanvasSpec = {
  width: 1440,
  height: 900,
  unit: 'px',
  background: '#FFFFFF',
}

// ページ/ノード向けのIDを生成する。
const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`

// 外部から読み込んだプロジェクトを安全な形に整形する。
const ensureProject = (data: Partial<ProjectData>): ProjectData => {
  const canvas = {
    ...defaultCanvas,
    ...(data.canvas ?? {}),
  }
  const pages = (data.pages ?? []).map((page, index) => ({
    id: page.id ?? createId(),
    name: page.name ?? `Page ${index + 1}`,
    nodes: (page.nodes ?? []).map((node) => ({
      id: node.id ?? createId(),
      type: node.type ?? 'rect',
      name: node.name ?? 'Layer',
      frame: node.frame ?? { x: 80, y: 80, w: 160, h: 100 },
      rotation: node.rotation ?? 0,
      style: node.style ?? { fill: '#E2E8F0', stroke: '#94A3B8', opacity: 1 },
      text: node.text,
    })),
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

// プロジェクト本体・ページ・フォームの状態を扱うフック。
export default function useProjectState() {
  const [project, setProject] = useState<ProjectData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [form, setForm] = useState<CanvasFormState>({
    name: 'Untitled',
    width: 1440,
    height: 900,
    unit: 'px',
    background: '#FFFFFF',
  })

  const activePage = useMemo(() => {
    if (!project) return null
    return project.pages.find((page) => page.id === project.activePageId) ?? null
  }, [project])

  // プロジェクト更新時は未保存状態にする。
  const updateProject = useCallback((updater: (prev: ProjectData) => ProjectData) => {
    setProject((prev) => {
      if (!prev) return prev
      return updater(prev)
    })
    setIsDirty(true)
  }, [])

  const updateActivePage = useCallback(
    (updater: (page: PageData) => PageData) => {
      updateProject((prev) => ({
        ...prev,
        pages: prev.pages.map((page) =>
          page.id === prev.activePageId ? updater(page) : page,
        ),
      }))
    },
    [updateProject],
  )

  const handleCreateProject = useCallback(() => {
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
  }, [form])

  const handleOpenFile = useCallback(async (file: File) => {
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
  }, [])

  const handleSave = useCallback(() => {
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
  }, [project])

  const handleAddPage = useCallback(() => {
    updateProject((prev) => {
      const nextPage = { id: createId(), name: `Page ${prev.pages.length + 1}`, nodes: [] }
      return {
        ...prev,
        pages: [...prev.pages, nextPage],
        activePageId: nextPage.id,
      }
    })
  }, [updateProject])

  const handleRenamePage = useCallback(
    (pageId: string, name: string) => {
      updateProject((prev) => ({
        ...prev,
        pages: prev.pages.map((page) =>
          page.id === pageId ? { ...page, name: name.trim() || page.name } : page,
        ),
      }))
    },
    [updateProject],
  )

  const handleRemovePage = useCallback(
    (pageId: string) => {
      updateProject((prev) => {
        const remaining = prev.pages.filter((page) => page.id !== pageId)
        const nextPages =
          remaining.length > 0
            ? remaining
            : [{ id: createId(), name: 'Page 1', nodes: [] }]
        const nextActive = nextPages.some((page) => page.id === prev.activePageId)
          ? prev.activePageId
          : nextPages[0].id
        return {
          ...prev,
          pages: nextPages,
          activePageId: nextActive,
        }
      })
    },
    [updateProject],
  )

  const setActivePage = useCallback(
    (pageId: string) => {
      updateProject((prev) => ({ ...prev, activePageId: pageId }))
    },
    [updateProject],
  )

  const updateCanvas = useCallback(
    (next: CanvasSpec) => {
      updateProject((prev) => ({
        ...prev,
        canvas: next,
      }))
    },
    [updateProject],
  )

  return {
    project,
    error,
    isDirty,
    form,
    setForm,
    activePage,
    updateProject,
    updateActivePage,
    handleCreateProject,
    handleOpenFile,
    handleSave,
    handleAddPage,
    handleRenamePage,
    handleRemovePage,
    setActivePage,
    updateCanvas,
  }
}
