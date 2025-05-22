import { postToGist } from './gist-util.js';

document.getElementById('post-gist').addEventListener('click', async () => {
  console.log('▶️ Gist 投稿ボタンがクリックされました');
  const content = document.getElementById('output-text').textContent || '';
  const filenameInput = document.getElementById('filename');
  const status = document.getElementById('status-message');

  // バリデーション
  if (!content.trim()) {
    alert("まずは「Scrapbox用に出力」で Markdown を生成してください");
    return;
  }
  let filename = filenameInput.value.trim();
  if (!/^[\w\-]+\.md$/.test(filename)) {
    alert("ファイル名は半角英数およびハイフンで、末尾に .md を付けてください");
    return;
  }
  const token = document.getElementById('token').value.trim();
  if (!token) {
    alert("GitHub Token を入力してください");
    return;
  }

  console.log({ filename, token: token.slice(0,4) + '…' });
  status.textContent = '投稿中…';

  try {
    const url = await postToGist(content, filename, token);
    console.log('✅ POST 成功:', url);
    status.innerHTML = `✅ 投稿完了！<a href="${url}" target="_blank">${url}</a>`;
  } catch (e) {
    console.error('❌ POST エラー:', e);
    status.textContent = '投稿エラー：' + e.message;
  }
});
