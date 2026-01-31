import type { CanvasNode } from './types'

type PropertiesPanelProps = {
  // 選択中ノード。未選択ならnull。
  selectedNode: CanvasNode | null
  // 選択ノードへの変更適用。
  onUpdateNode: (updater: (node: CanvasNode) => CanvasNode) => void
}

// 右側のプロパティ編集パネル。
export default function PropertiesPanel({ selectedNode, onUpdateNode }: PropertiesPanelProps) {
  return (
    <div className="properties">
      <h3>プロパティ</h3>
      {selectedNode ? (
        <div className="properties-grid">
          <label>
            名前
            <input
              value={selectedNode.name}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  name: event.target.value,
                }))
              }
            />
          </label>
          <label>
            X
            <input
              type="number"
              value={Math.round(selectedNode.frame.x)}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  frame: { ...node.frame, x: Number(event.target.value) },
                }))
              }
            />
          </label>
          <label>
            Y
            <input
              type="number"
              value={Math.round(selectedNode.frame.y)}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  frame: { ...node.frame, y: Number(event.target.value) },
                }))
              }
            />
          </label>
          <label>
            幅
            <input
              type="number"
              value={Math.round(selectedNode.frame.w)}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  frame: { ...node.frame, w: Number(event.target.value) },
                }))
              }
            />
          </label>
          <label>
            高さ
            <input
              type="number"
              value={Math.round(selectedNode.frame.h)}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  frame: { ...node.frame, h: Number(event.target.value) },
                }))
              }
            />
          </label>
          <label>
            回転
            <input
              type="number"
              value={Math.round(selectedNode.rotation)}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  rotation: Number(event.target.value),
                }))
              }
            />
          </label>
          <label>
            塗り
            <input
              type="color"
              value={selectedNode.style.fill}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  style: { ...node.style, fill: event.target.value },
                }))
              }
            />
          </label>
          <label>
            線色
            <input
              type="color"
              value={selectedNode.style.stroke}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  style: { ...node.style, stroke: event.target.value },
                }))
              }
            />
          </label>
          <label>
            透明度
            <input
              type="range"
              min={0.1}
              max={1}
              step={0.05}
              value={selectedNode.style.opacity}
              onChange={(event) =>
                onUpdateNode((node) => ({
                  ...node,
                  style: { ...node.style, opacity: Number(event.target.value) },
                }))
              }
            />
          </label>
          {selectedNode.type === 'text' && (
            <>
              <label>
                テキスト
                <input
                  value={selectedNode.text?.value ?? ''}
                  onChange={(event) =>
                    onUpdateNode((node) => ({
                      ...node,
                      text: {
                        value: event.target.value,
                        size: node.text?.size ?? 16,
                        color: node.text?.color ?? '#111827',
                      },
                    }))
                  }
                />
              </label>
              <label>
                フォントサイズ
                <input
                  type="number"
                  min={8}
                  value={selectedNode.text?.size ?? 16}
                  onChange={(event) =>
                    onUpdateNode((node) => ({
                      ...node,
                      text: {
                        value: node.text?.value ?? 'Text',
                        size: Number(event.target.value),
                        color: node.text?.color ?? '#111827',
                      },
                    }))
                  }
                />
              </label>
              <label>
                文字色
                <input
                  type="color"
                  value={selectedNode.text?.color ?? '#111827'}
                  onChange={(event) =>
                    onUpdateNode((node) => ({
                      ...node,
                      text: {
                        value: node.text?.value ?? 'Text',
                        size: node.text?.size ?? 16,
                        color: event.target.value,
                      },
                    }))
                  }
                />
              </label>
            </>
          )}
        </div>
      ) : (
        <p className="muted">オブジェクトを選択してください。</p>
      )}
    </div>
  )
}
