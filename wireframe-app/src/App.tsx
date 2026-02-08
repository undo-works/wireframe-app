import "./App.css";
import AppHeader from "./components/header/AppHeader";
import CanvasStage from "./components/CanvasStage";
import CanvasToolbar from "./components/CanvasToolbar";
import NewCanvasPanel from "./components/NewCanvasPanel";
import PagesPanel from "./components/PagesPanel";
import PropertiesPanel from "./components/PropertiesPanel";
import WorkspaceBar from "./components/WorkspaceBar";
import useCanvasProject from "./hooks/useCanvasProject";

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
  } = useCanvasProject();

  return (
    <div className="app-shell">
      <AppHeader
        onOpen={() => fileInputRef.current?.click()}
        onSave={handleSave}
        hasProject={Boolean(project)}
        isDirty={isDirty}
      />

      <main className="app-main">
        <section className="workspace">
          <WorkspaceBar project={project} />

          <div className="workspace-frame">
            <div className="left-stack">
              <NewCanvasPanel
                form={form}
                onChange={setForm}
                onCreate={handleCreateProject}
                error={error}
              />
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
                <PagesPanel
                  pages={[]}
                  activePageId=""
                  onAdd={handleAddPage}
                  onSelect={() => {}}
                  onRename={() => {}}
                  onRemove={() => {}}
                />
              )}
            </div>

            <div className="canvas-area">
              <div className="canvas-top">
                {project ? (
                  <CanvasToolbar
                    tool={tool}
                    onToolChange={setTool}
                    canvas={project.canvas}
                    onCanvasChange={updateCanvas}
                    onDelete={handleDeleteSelected}
                    onReorder={handleReorder}
                    canEditSelection={Boolean(selectedNode)}
                  />
                ) : (
                  <div className="canvas-top-empty">
                    キャンバス設定を入力して新規作成してください。
                  </div>
                )}
              </div>

              <div className="canvas-shell">
                {project ? (
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
                ) : (
                  <div className="canvas-empty">
                    <p>プロジェクトを作成または読み込んでください。</p>
                  </div>
                )}
              </div>
            </div>

            <aside className="properties-panel">
              <PropertiesPanel
                selectedNode={selectedNode}
                onUpdateNode={updateSelectedNode}
              />
            </aside>
          </div>
        </section>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".wire,.json"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            handleOpenFile(file);
          }
          event.currentTarget.value = "";
        }}
      />
    </div>
  );
}

export default App;
