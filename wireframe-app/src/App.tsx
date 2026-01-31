import './App.css'
import AppHeader from './components/AppHeader'
import CanvasStage from './components/CanvasStage'
import CanvasToolbar from './components/CanvasToolbar'
import NewCanvasPanel from './components/NewCanvasPanel'
import PagesPanel from './components/PagesPanel'
import PropertiesPanel from './components/PropertiesPanel'
import useCanvasProject from './hooks/useCanvasProject'

function App() {
  const {
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
    handleCreateProject,
    handleOpenFile,
    handleSave,
    handleAddPage,
    handleRenamePage,
    handleRemovePage,
    handleCanvasPointerDown,
    handleNodePointerDown,
    handleResizePointerDown,
    handleDeleteSelected,
    handleReorder,
    updateSelectedNode,
    setActivePage,
    updateCanvas,
  } = useCanvasProject()

  return (
    <div className="app-shell">
      <AppHeader
        onOpen={() => fileInputRef.current?.click()}
        onSave={handleSave}
        hasProject={Boolean(project)}
        isDirty={isDirty}
      />

      <main className="app-main">
        <NewCanvasPanel form={form} onChange={setForm} onCreate={handleCreateProject} error={error} />

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
            {project ? (
              <PagesPanel
                pages={project.pages}
                activePageId={project.activePageId}
                onAdd={handleAddPage}
                onSelect={setActivePage}
                onRename={handleRenamePage}
                onRemove={handleRemovePage}
              />
            ) : (
              <PagesPanel pages={[]} activePageId="" onAdd={handleAddPage} onSelect={() => {}} onRename={() => {}} onRemove={() => {}} />
            )}

            <section className="canvas-panel">
              {project ? (
                <>
                  <CanvasToolbar
                    tool={tool}
                    onToolChange={setTool}
                    canvas={project.canvas}
                    onCanvasChange={updateCanvas}
                    onDelete={handleDeleteSelected}
                    onReorder={handleReorder}
                    canEditSelection={Boolean(selectedNode)}
                  />
                  <CanvasStage
                    canvas={project.canvas}
                    activePage={activePage}
                    nodes={activePage?.nodes ?? []}
                    selectedId={selectedId}
                    canvasRef={canvasRef}
                    onCanvasPointerDown={handleCanvasPointerDown}
                    onNodePointerDown={handleNodePointerDown}
                    onResizePointerDown={handleResizePointerDown}
                  />
                  <PropertiesPanel selectedNode={selectedNode} onUpdateNode={updateSelectedNode} />
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
