import "./index.modele.css";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

type AppHeaderProps = {
  // 既存ファイルを開く。
  onOpen: () => void;
  // 現在のプロジェクトを保存する。
  onSave: () => void;
  // 未保存の変更があるか。
  isDirty: boolean;
  // プロジェクトが読み込まれているか。
  hasProject: boolean;
};

// アプリ全体のヘッダー。主要なファイル操作のみをコンパクトに配置する。
export default function AppHeader({
  onOpen,
  onSave,
  isDirty,
  hasProject,
}: AppHeaderProps) {
  const appWindow = getCurrentWebviewWindow();
  const handleClose = async () => await appWindow.close();
  const handleMaximize = async () => {
    const isMaximized = await appWindow.isMaximized();
    if (isMaximized) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
  };
  const handleMinimize = async () => {
    const isMinimized = await appWindow.isMinimized();
    if (isMinimized) {
      await appWindow.unminimize();
    } else {
      await appWindow.minimize();
    }
  };

  return (
    <header data-tauri-drag-region className="app-header">
      <div className="app-header-content">
        <a onClick={onOpen}>open</a>
        <a onClick={onSave} aria-disabled={!hasProject}>
          save
        </a>
        {hasProject && <span>{isDirty ? "unsaved" : "saved"}</span>}
      </div>
      <div className="window-controls">
        <button
          className="window-minimize-btn"
          onClick={handleMinimize}
          title="最小化"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7H12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
        <button
          className="window-maximize-btn"
          onClick={handleMaximize}
          title="最大化/元に戻す"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect
              x="2"
              y="2"
              width="10"
              height="10"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </button>
        <button
          className="window-close-btn"
          onClick={handleClose}
          title="閉じる"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
