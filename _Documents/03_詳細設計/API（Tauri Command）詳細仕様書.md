# API（Tauri Command）詳細仕様書

作成日: 2026年1月31日
対象: Rust + Tauri によるLinux向けワイヤーフレーム作成アプリ
参照: 基本設計のデータ構造（データ構造.md）

---

## 1. 共通仕様

### 1.1 返却フォーマット（概念）
- 成功: `Result<T, AppError>` の `Ok(T)` を返す
- 失敗: `Result<T, AppError>` の `Err(AppError)` を返す

### 1.2 エラー構造 `AppError`
```json
{
  "code": "FILE_NOT_FOUND",
  "message": "File not found",
  "details": {"path": "/path/to/file"}
}
```

### 1.3 例外処理の方針
- ファイル未存在: `code = "FILE_NOT_FOUND"` を返す
- パース失敗: `code = "INVALID_FORMAT"` を返す
- 権限不足: `code = "PERMISSION_DENIED"` を返す
- 内部例外: `code = "INTERNAL_ERROR"` を返す

---

## 2. API一覧

### 2.1 `create_project`
- 関数名: `create_project`
- 引数と型:
  - `name: String`
  - `canvas: CanvasSpec`
- 戻り値:
  - 成功: `ProjectInfo`
  - 失敗: `AppError`
- 例外処理:
  - `name` が空の場合: `INVALID_ARGUMENT`

---

### 2.2 `open_project`
- 関数名: `open_project`
- 引数と型:
  - `path: String`
- 戻り値:
  - 成功: `ProjectInfo`
  - 失敗: `AppError`
- 例外処理:
  - ファイルが見つからない: `FILE_NOT_FOUND`
  - 形式が不正: `INVALID_FORMAT`

---

### 2.3 `save_project`
- 関数名: `save_project`
- 引数と型:
  - `project: ProjectData`
- 戻り値:
  - 成功: `SaveResult`
  - 失敗: `AppError`
- 例外処理:
  - 保存先に書き込み不可: `PERMISSION_DENIED`
  - データ検証エラー: `INVALID_ARGUMENT`

---

### 2.4 `save_project_as`
- 関数名: `save_project_as`
- 引数と型:
  - `project: ProjectData`
  - `path: String`
- 戻り値:
  - 成功: `SaveResult`
  - 失敗: `AppError`
- 例外処理:
  - 保存先に書き込み不可: `PERMISSION_DENIED`

---

### 2.5 `list_recent_projects`
- 関数名: `list_recent_projects`
- 引数と型: なし
- 戻り値:
  - 成功: `RecentProject[]`
  - 失敗: `AppError`
- 例外処理:
  - 設定ファイルが破損: `INVALID_FORMAT`（空配列を返す運用も検討）

---

### 2.6 `import_assets`
- 関数名: `import_assets`
- 引数と型:
  - `paths: String[]`
- 戻り値:
  - 成功: `AssetInfo[]`
  - 失敗: `AppError`
- 例外処理:
  - 未対応形式: `UNSUPPORTED_MEDIA`
  - ファイル未存在: `FILE_NOT_FOUND`

---

### 2.7 `export_canvas`
- 関数名: `export_canvas`
- 引数と型:
  - `project_id: String`
  - `page_id: String`
  - `export: ExportSpec`
- 戻り値:
  - 成功: `ExportResult`
  - 失敗: `AppError`
- 例外処理:
  - 対象ページ不存在: `NOT_FOUND`
  - 書き込み不可: `PERMISSION_DENIED`

---

### 2.8 `get_settings`
- 関数名: `get_settings`
- 引数と型: なし
- 戻り値:
  - 成功: `AppSettings`
  - 失敗: `AppError`
- 例外処理:
  - 設定ファイル破損: `INVALID_FORMAT`（デフォルトにフォールバック）

---

### 2.9 `update_settings`
- 関数名: `update_settings`
- 引数と型:
  - `settings: AppSettings`
- 戻り値:
  - 成功: `AppSettings`
  - 失敗: `AppError`
- 例外処理:
  - 値が不正: `INVALID_ARGUMENT`

---

### 2.10 `get_app_info`
- 関数名: `get_app_info`
- 引数と型: なし
- 戻り値:
  - 成功: `AppInfo`
  - 失敗: `AppError`
- 例外処理:
  - 失敗時は `INTERNAL_ERROR`

---

### 2.11 `select_file_dialog`
- 関数名: `select_file_dialog`
- 引数と型:
  - `filters: FileFilter[]`
- 戻り値:
  - 成功: `String | null`
  - 失敗: `AppError`
- 例外処理:
  - OSダイアログ呼び出し失敗: `INTERNAL_ERROR`

---

### 2.12 `select_folder_dialog`
- 関数名: `select_folder_dialog`
- 引数と型: なし
- 戻り値:
  - 成功: `String | null`
  - 失敗: `AppError`
- 例外処理:
  - OSダイアログ呼び出し失敗: `INTERNAL_ERROR`

---

### 2.13 `show_notification`
- 関数名: `show_notification`
- 引数と型:
  - `message: String`
  - `level: String`（"info" | "warning" | "error"）
- 戻り値:
  - 成功: `null`
  - 失敗: `AppError`
- 例外処理:
  - OS通知呼び出し失敗: `INTERNAL_ERROR`
