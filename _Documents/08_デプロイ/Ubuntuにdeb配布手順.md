# Ubuntuにdeb配布手順

作成日: 2026年1月31日
対象: WireframeStudio の .deb 配布

--- 

## 0. ビルド

Tauriでリリースビルドを作成します。

```bash
cd wireframe-app/src-tauri/
npx tauri build
```

---

## 1. 配布ファイルの場所

ビルド後に生成される .deb は以下にあります。

- `wireframe-app/src-tauri/target/release/bundle/deb/WireframeStudio_0.1.0_amd64.deb`

---

## 2. 相手PCへ渡す方法（例）

### 2.1 直接ファイル共有（USB/外部ストレージ）
1. .deb をUSB等にコピー
2. 相手PCに挿してコピー

### 2.2 ネットワーク転送（SCP）
発行側（自分のPC）で実行:

```bash
scp wireframe-app/src-tauri/target/release/bundle/deb/WireframeStudio_0.1.0_amd64.deb <user>@<ip>:/home/<user>/Downloads/
```

受け取り側は `~/Downloads/` に保存されます。

### 2.3 クラウド共有（Google Drive/Dropbox 等）
1. .deb をクラウドにアップロード
2. 共有リンクを相手に送付
3. 相手がダウンロード

---

## 3. インストール手順（相手PC側）

ダウンロード済みの場所で以下を実行:

```bash
sudo apt install ./WireframeStudio_0.1.0_amd64.deb
```

※ 依存関係が足りない場合は自動で解決されます。

---

## 4. アンインストール

```bash
sudo apt remove wireframestudio
```

---

## 5. 注意
- ファイル名のバージョンは更新されるため、配布時は最新の `.deb` を選択
- Ubuntu以外では `.deb` を使えないため、必要に応じて `.rpm` を配布
