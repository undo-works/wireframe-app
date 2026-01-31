import type { PageData } from './types'

type PagesPanelProps = {
  // プロジェクト内ページ一覧。
  pages: PageData[]
  // 現在アクティブなページID。
  activePageId: string
  // ページ追加。
  onAdd: () => void
  // ページ選択。
  onSelect: (pageId: string) => void
  // ページ名変更。
  onRename: (pageId: string, name: string) => void
  // ページ削除。
  onRemove: (pageId: string) => void
}

// ページの切替・リネーム・削除を担うサイドバー。
export default function PagesPanel({
  pages,
  activePageId,
  onAdd,
  onSelect,
  onRename,
  onRemove,
}: PagesPanelProps) {
  return (
    <aside className="pages">
      <div className="pages-header">
        <span>ページ</span>
        <button className="mini" onClick={onAdd}>
          +
        </button>
      </div>
      <div className="pages-list">
        {pages.map((page) => (
          <div
            key={page.id}
            className={`page-item ${page.id === activePageId ? 'active' : ''}`}
          >
            <input
              value={page.name}
              onChange={(event) => onRename(page.id, event.target.value)}
              onFocus={() => onSelect(page.id)}
            />
            <button
              className="mini danger"
              onClick={() => onRemove(page.id)}
              aria-label="ページ削除"
            >
              ×
            </button>
          </div>
        ))}
        {pages.length === 0 && <p className="muted">プロジェクトを作成してください。</p>}
      </div>
    </aside>
  )
}
