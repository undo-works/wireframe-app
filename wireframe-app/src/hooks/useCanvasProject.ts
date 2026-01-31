import { useRef } from 'react'
import useCanvasInteractions from './useCanvasInteractions'
import useCanvasSelection from './useCanvasSelection'
import useProjectState from './useProjectState'

// キャンバス編集に関わる状態と操作をまとめたカスタムフック。
export default function useCanvasProject() {
  const {
    project,
    error,
    isDirty,
    form,
    setForm,
    activePage,
    updateActivePage,
    handleCreateProject,
    handleOpenFile,
    handleSave,
    handleAddPage,
    handleRenamePage,
    handleRemovePage,
    setActivePage,
    updateCanvas,
  } = useProjectState()

  const {
    tool,
    setTool,
    selectedId,
    setSelectedId,
    getSelectedNode,
    clearSelection,
    handleDeleteSelected,
    handleReorder,
    updateSelectedNode,
  } = useCanvasSelection(updateActivePage)

  const {
    canvasRef,
    handleCanvasPointerDown,
    handleNodePointerDown,
    handleResizePointerDown,
  } = useCanvasInteractions(project, tool, updateActivePage, setSelectedId)

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const selectedNode = getSelectedNode(activePage)

  return {
    project,
    error,
    isDirty,
    tool,
    setTool,
    form,
    setForm,
    fileInputRef,
    canvasRef,
    activePage,
    selectedId,
    selectedNode,
    handleCreateProject: () => {
      handleCreateProject()
      clearSelection()
    },
    handleOpenFile: async (file: File) => {
      await handleOpenFile(file)
      clearSelection()
    },
    handleSave,
    handleAddPage: () => {
      handleAddPage()
      clearSelection()
    },
    handleRenamePage,
    handleRemovePage: (pageId: string) => {
      handleRemovePage(pageId)
      clearSelection()
    },
    handleCanvasPointerDown,
    handleNodePointerDown,
    handleResizePointerDown,
    handleDeleteSelected: () => handleDeleteSelected(activePage),
    handleReorder: (direction: 'forward' | 'backward') =>
      handleReorder(direction, activePage),
    updateSelectedNode,
    setActivePage,
    updateCanvas,
  }
}
