import { useRef, useState } from 'react'
import type { CanvasNode, PageData, ProjectData } from '../components/types'

// キャンバスやノードのドラッグ・リサイズなどのインタラクションを管理するカスタムフック
export default function useCanvasInteractions(
  project: ProjectData | null,
  tool: string,
  updateActivePage: (updater: (page: PageData) => PageData) => void,
  setSelectedId: (id: string | null) => void,
) {
  // キャンバスの参照
  const canvasRef = useRef<HTMLDivElement | null>(null)
  // ドラッグ中のノードID
  const [draggingId, setDraggingId] = useState<string | null>(null)
  // リサイズ中のノードID
  const [resizingId, setResizingId] = useState<string | null>(null)
  // リサイズ開始時の座標
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null)

  // キャンバス上の空白をクリックしたときの処理
  const handleCanvasPointerDown = (_e: React.PointerEvent) => {
    if (tool === 'select') {
      setSelectedId(null)
    }
  }

  // ノードをクリック・ドラッグ開始したときの処理
  const handleNodePointerDown = (
    e: React.PointerEvent,
    node: CanvasNode,
  ) => {
    const nodeId = node.id
    if (tool === 'select') {
      setSelectedId(nodeId)
      setDraggingId(nodeId)
      // ドラッグイベントのリスナーをwindowに追加
      const startX = e.clientX
      const startY = e.clientY
      const page = project ? project.pages.find((p) => p.id === project.activePageId) : null
      const found = (page?.nodes ?? []).find((n) => n.id === nodeId)
      if (!found) return
      const origX = found.frame.x
      const origY = found.frame.y
      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        updateActivePage((page) => ({
          ...page,
          nodes: (page.nodes ?? []).map((n) =>
            n.id === nodeId ? { ...n, frame: { ...n.frame, x: origX + dx, y: origY + dy } } : n,
          ),
        }))
      }
      const onPointerUp = () => {
        setDraggingId(null)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    }
  }

  // ノードのリサイズ開始
  const handleResizePointerDown = (
    e: React.PointerEvent,
    node: CanvasNode,
    direction: 'nw' | 'ne' | 'sw' | 'se',
  ) => {
    const nodeId = node.id
    if (tool === 'select') {
      setResizingId(nodeId)
      const startX = e.clientX
      const startY = e.clientY
      const page = project ? project.pages.find((p) => p.id === project.activePageId) : null
      const found = (page?.nodes ?? []).find((n) => n.id === nodeId)
      if (!found) return
      setResizeStart({ x: startX, y: startY, width: found.frame.w, height: found.frame.h })
      const origX = found.frame.x
      const origY = found.frame.y
      const origW = found.frame.w
      const origH = found.frame.h
      const onPointerMove = (moveEvent: PointerEvent) => {
        const dx = moveEvent.clientX - startX
        const dy = moveEvent.clientY - startY
        let newW = origW
        let newH = origH
        let newX = origX
        let newY = origY
        if (direction === 'se') {
          newW = Math.max(10, origW + dx)
          newH = Math.max(10, origH + dy)
        } else if (direction === 'sw') {
          newW = Math.max(10, origW - dx)
          newH = Math.max(10, origH + dy)
          newX = origX + dx
        } else if (direction === 'ne') {
          newW = Math.max(10, origW + dx)
          newH = Math.max(10, origH - dy)
          newY = origY + dy
        } else if (direction === 'nw') {
          newW = Math.max(10, origW - dx)
          newH = Math.max(10, origH - dy)
          newX = origX + dx
          newY = origY + dy
        }
        updateActivePage((page) => ({
          ...page,
          nodes: (page.nodes ?? []).map((n) =>
            n.id === nodeId
              ? { ...n, frame: { ...n.frame, x: newX, y: newY, w: newW, h: newH } }
              : n,
          ),
        }))
      }
      const onPointerUp = () => {
        setResizingId(null)
        setResizeStart(null)
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('pointerup', onPointerUp)
      }
      window.addEventListener('pointermove', onPointerMove)
      window.addEventListener('pointerup', onPointerUp)
    }
  }

  return {
    canvasRef,
    draggingId,
    resizingId,
    resizeStart,
    handleCanvasPointerDown,
    handleNodePointerDown,
    handleResizePointerDown,
  }
}
