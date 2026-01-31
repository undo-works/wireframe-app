import type { CanvasSpec, CanvasUnit, NodeType } from './types'

type CanvasToolbarProps = {
  // 選択中のツール。
  tool: NodeType | 'select'
  // ツール変更。
  onToolChange: (next: NodeType | 'select') => void
  // 現在のキャンバス設定。
  canvas: CanvasSpec
  // キャンバス設定の更新。
  onCanvasChange: (next: CanvasSpec) => void
  // 選択中のオブジェクト削除。
  onDelete: () => void
  // 前面/背面への並び替え。
  onReorder: (direction: 'forward' | 'backward') => void
  // 選択操作の有効/無効。
  canEditSelection: boolean
}

// ツール選択、キャンバス編集、前後関係操作をまとめたツールバー。
export default function CanvasToolbar({
  tool,
  onToolChange,
  canvas,
  onCanvasChange,
  onDelete,
  onReorder,
  canEditSelection,
}: CanvasToolbarProps) {
  return (
    <div className="canvas-toolbar">
      <div className="tool-group">
        <button className={tool === 'select' ? 'tool active' : 'tool'} onClick={() => onToolChange('select')}>
          選択
        </button>
        <button className={tool === 'rect' ? 'tool active' : 'tool'} onClick={() => onToolChange('rect')}>
          矩形
        </button>
        <button className={tool === 'ellipse' ? 'tool active' : 'tool'} onClick={() => onToolChange('ellipse')}>
          円
        </button>
        <button className={tool === 'line' ? 'tool active' : 'tool'} onClick={() => onToolChange('line')}>
          線
        </button>
        <button className={tool === 'text' ? 'tool active' : 'tool'} onClick={() => onToolChange('text')}>
          テキスト
        </button>
      </div>
      <label>
        幅
        <input
          type="number"
          value={canvas.width}
          min={1}
          onChange={(event) => onCanvasChange({ ...canvas, width: Number(event.target.value) })}
        />
      </label>
      <label>
        高さ
        <input
          type="number"
          value={canvas.height}
          min={1}
          onChange={(event) => onCanvasChange({ ...canvas, height: Number(event.target.value) })}
        />
      </label>
      <label>
        単位
        <select
          value={canvas.unit}
          onChange={(event) => onCanvasChange({ ...canvas, unit: event.target.value as CanvasUnit })}
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
          value={canvas.background}
          onChange={(event) => onCanvasChange({ ...canvas, background: event.target.value })}
        />
      </label>
      <button className="ghost" onClick={onDelete} disabled={!canEditSelection}>
        削除
      </button>
      <button className="ghost" onClick={() => onReorder('backward')} disabled={!canEditSelection}>
        背面
      </button>
      <button className="ghost" onClick={() => onReorder('forward')} disabled={!canEditSelection}>
        前面
      </button>
    </div>
  )
}
