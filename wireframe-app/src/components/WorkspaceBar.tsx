import type { ProjectData } from './types'

interface WorkspaceBarProps {
  project: ProjectData | null
}

// ワークスペース上部のバー。プロジェクト情報だけをコンパクトに表示する。
export default function WorkspaceBar({ project }: WorkspaceBarProps) {
  return (
    <header className="workspace-bar">
      <div className="workspace-title">
        <p className="eyebrow">プロジェクト</p>
        <h2>{project?.name ?? 'プロジェクト未作成'}</h2>
        {project && (
          <p className="sub">
            キャンバス: {project.canvas.width} × {project.canvas.height} {project.canvas.unit}
          </p>
        )}
      </div>
    </header>
  )
}
