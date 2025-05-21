# CBTログ

ブラウザ上でCBTログを作成し、GitHub Gist に非公開投稿して共有できる静的HTMLツールです。  
日付入りのファイル名（`yyyy-mm-dd.md`）が自動設定され、Scrapbox風の記法でMarkdownを出力します。

---

## 🔧 ファイル構成

- `index.html`  
  日報入力フォーム + Gist投稿UI
- `script.js`  
  ローカルストレージ復元・Markdown生成
- `gist-util.js`  
  Gist投稿関数
- `gist.js`  
  出力されたMarkdownをGist APIにPOST
- `style.css`  
  レイアウト・スタイル

---

## 🚀 利用方法

1. リポジトリをクローンまたはZIPを解凍し、Webサーバーまたはローカルで `index.html` を開く  
2. CBTログをフォームに入力  
3. ファイル名欄が自動で `yyyy-mm-dd.md` になるのを確認  
4. **Personal Access Token** を入力  
5. 「Gistに投稿して共有」ボタンをクリック  
6. ボタン下に表示された Gist のURLをコピーして共有

---

## 🔑 GitHub Personal Access Token の取得

1. GitHub にログイン  
2. 右上のプロフィール画像 → **Settings**  
3. 左メニューから **Developer settings**  
4. **Personal access tokens** → **Tokens (classic)** → **Generate new token**  
5. 説明（例：「cbt」）を入力  
6. **Expiration** を任意で選択（例：90 days）  
7. **Select scopes** で **gist** にチェックを入れる  
8. **Generate token** をクリック  
9. 生成されたトークン文字列をコピーして、ツールの入力欄に貼り付け

> **注意**：  
> - トークンは安全に管理し、他人に共有しないでください。  
> - 有効期限が切れたら同様の手順で再発行してください。

---

## 🛠 カスタマイズ例

- **公開Gist** にしたい場合：  
  `gist-util.js` の `public: false` を `public: true` に変更
- **共有用ビューア** を独自構築したい場合：  
  `view.html` を追加し、Gist の `raw` URL を読み込むコードを実装
- **CSS調整**：  
  `style.css` を編集して配色やフォントを変更

---

## ⚠️ 注意事項

- ブラウザのローカルストレージに入力データが一時保存されます。  
- トークンはクライアントサイドで扱うため、完全な秘匿はできません。  
  セキュリティが必要な場合は、バックエンド経由での投稿API実装を検討してください。
- Gist API のレート制限（未認証時 60 req/h、認証時 5000 req/h）に注意。

---

## 📄 LICENSE

MIT License  
詳細は `LICENSE` ファイルをご覧ください。
