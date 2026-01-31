import type { CanvasUnit } from './types'

type CanvasFormState = {
  name: string
  width: number
  height: number
  unit: CanvasUnit
  background: string
}

type NewCanvasPanelProps = {
  // 新規プロジェクトの入力値。
  form: CanvasFormState
  // 入力値の更新。
  onChange: (next: CanvasFormState) => void
  // 入力値から新規作成する。
  onCreate: () => void
  // 表示用のエラーメッセージ。
  error?: string | null
}

// 新規キャンバス設定をまとめる左パネル。
export default function NewCanvasPanel({ form, onChange, onCreate, error }: NewCanvasPanelProps) {
  return (
    <section className="panel">
      <h2>新規キャンバス</h2>
      <div className="form-grid">
        <label>
          プロジェクト名
          <input
            value={form.name}
            onChange={(event) => onChange({ ...form, name: event.target.value })}
            placeholder="Untitled"
          />
        </label>
        <label>
          幅
          <input
            type="number"
            min={1}
            value={form.width}
            onChange={(event) => onChange({ ...form, width: Number(event.target.value) })}
          />
        </label>
        <label>
          高さ
          <input
            type="number"
            min={1}
            value={form.height}
            onChange={(event) => onChange({ ...form, height: Number(event.target.value) })}
          />
        </label>
        <label>
          単位
          <select
            value={form.unit}
            onChange={(event) => onChange({ ...form, unit: event.target.value as CanvasUnit })}
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
            value={form.background}
            onChange={(event) => onChange({ ...form, background: event.target.value })}
          />
        </label>
      </div>
      <button className="primary" onClick={onCreate}>
        新規作成
      </button>
      {error && <p className="error-text">{error}</p>}
    </section>
  )
}
