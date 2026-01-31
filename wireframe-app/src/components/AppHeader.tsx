type AppHeaderProps = {
  // 既存ファイルを開く。
  onOpen: () => void
  // 現在のプロジェクトを保存する。
  onSave: () => void
  // 未保存の変更があるか。
  isDirty: boolean
  // プロジェクトが読み込まれているか。
  hasProject: boolean
}

// アプリ全体のヘッダー。主要なファイル操作を提供する。
export default function AppHeader({ onOpen, onSave, isDirty, hasProject }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="brand">
        <span className="brand-title">Wireframe Studio</span>
        <span className="brand-sub">キャンバス作成 / 管理</span>
      </div>
      <div className="header-actions">
        <button className="ghost" onClick={onOpen}>
          開く
        </button>
        <button className="primary" onClick={onSave} disabled={!hasProject}>
          保存
        </button>
        {hasProject && <span className="status">{isDirty ? '未保存' : '保存済み'}</span>}
      </div>
    </header>
  )
}
