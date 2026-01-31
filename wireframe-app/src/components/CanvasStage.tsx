import type React from 'react'
import type { CanvasNode, CanvasSpec, PageData } from './types'

type CanvasStageProps = {
  // キャンバスのサイズ情報。
  canvas: CanvasSpec
  // アクティブページ情報。
  activePage: PageData | null
  // 描画対象ノード一覧。
  nodes: CanvasNode[]
  // 選択中ノードID。
  selectedId: string | null
  // 座標変換に使うキャンバス参照。
  canvasRef: React.RefObject<HTMLDivElement | null>
  // キャンバスクリック時の処理。
  onCanvasPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void
  // ノードのドラッグ開始。
  onNodePointerDown: (event: React.PointerEvent<HTMLDivElement>, node: CanvasNode) => void
  // ノードのリサイズ開始。
  onResizePointerDown: (
    event: React.PointerEvent<HTMLButtonElement>,
    node: CanvasNode,
    handle: 'nw' | 'ne' | 'sw' | 'se',
  ) => void
}

// 中央キャンバス。ノードの描画と操作を担う。
export default function CanvasStage({
  canvas,
  activePage,
  nodes,
  selectedId,
  canvasRef,
  onCanvasPointerDown,
  onNodePointerDown,
  onResizePointerDown,
}: CanvasStageProps) {
  return (
    <div className="canvas-stage">
      <div
        className="canvas"
        ref={canvasRef}
        style={{
          width: `${canvas.width}px`,
          height: `${canvas.height}px`,
          background: canvas.background,
        }}
        onPointerDown={onCanvasPointerDown}
      >
        {nodes.map((node) => {
          const isSelected = node.id === selectedId
          const baseStyle: React.CSSProperties = {
            left: node.frame.x,
            top: node.frame.y,
            width: node.frame.w,
            height: node.frame.h,
            opacity: node.style.opacity,
            transform: `rotate(${node.rotation}deg)`,
          }

          if (node.type === 'line') {
            return (
              <div
                key={node.id}
                className={`node line ${isSelected ? 'selected' : ''}`}
                style={{
                  ...baseStyle,
                  height: 2,
                  background: node.style.stroke,
                }}
                onPointerDown={(event) => onNodePointerDown(event, node)}
              >
                {isSelected && (
                  <div className="selection" style={{ height: 16 }}>
                    <button
                      className="handle ne"
                      onPointerDown={(event) => onResizePointerDown(event, node, 'ne')}
                    />
                    <button
                      className="handle sw"
                      onPointerDown={(event) => onResizePointerDown(event, node, 'sw')}
                    />
                  </div>
                )}
              </div>
            )
          }

          if (node.type === 'text') {
            return (
              <div
                key={node.id}
                className={`node text ${isSelected ? 'selected' : ''}`}
                style={{
                  ...baseStyle,
                  background: 'transparent',
                  color: node.text?.color ?? '#111827',
                  fontSize: node.text?.size ?? 16,
                }}
                onPointerDown={(event) => onNodePointerDown(event, node)}
              >
                {node.text?.value ?? 'Text'}
                {isSelected && (
                  <div className="selection">
                    <button
                      className="handle nw"
                      onPointerDown={(event) => onResizePointerDown(event, node, 'nw')}
                    />
                    <button
                      className="handle ne"
                      onPointerDown={(event) => onResizePointerDown(event, node, 'ne')}
                    />
                    <button
                      className="handle sw"
                      onPointerDown={(event) => onResizePointerDown(event, node, 'sw')}
                    />
                    <button
                      className="handle se"
                      onPointerDown={(event) => onResizePointerDown(event, node, 'se')}
                    />
                  </div>
                )}
              </div>
            )
          }

          return (
            <div
              key={node.id}
              className={`node ${node.type} ${isSelected ? 'selected' : ''}`}
              style={{
                ...baseStyle,
                background: node.style.fill,
                borderColor: node.style.stroke,
              }}
              onPointerDown={(event) => onNodePointerDown(event, node)}
            >
              {isSelected && (
                <div className="selection">
                  <button
                    className="handle nw"
                    onPointerDown={(event) => onResizePointerDown(event, node, 'nw')}
                  />
                  <button
                    className="handle ne"
                    onPointerDown={(event) => onResizePointerDown(event, node, 'ne')}
                  />
                  <button
                    className="handle sw"
                    onPointerDown={(event) => onResizePointerDown(event, node, 'sw')}
                  />
                  <button
                    className="handle se"
                    onPointerDown={(event) => onResizePointerDown(event, node, 'se')}
                  />
                </div>
              )}
            </div>
          )
        })}
        <div className="canvas-meta">
          <span>{activePage?.name ?? 'Page'}</span>
          <span>
            {canvas.width} × {canvas.height} {canvas.unit}
          </span>
        </div>
      </div>
    </div>
  )
}
