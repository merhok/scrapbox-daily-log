export async function postToGist(content, filename, token) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm   = String(today.getMonth()+1).padStart(2,'0');
  const dd   = String(today.getDate()).padStart(2,'0');
  const desc = `${yyyy}-${mm}-${dd} のCBTログ`;
  const body = {
    description: desc,
    public: false,
    files: {
      [filename]: { content }
    }
  };
  console.log("▶️ Gist POST body:", JSON.stringify(body, null, 2));
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      "Accept": "application/vnd.github.v3+json"
    },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  if (res.ok) {
    return data.html_url;
  } else {
    console.error("❌ Gist API Error:", data);
    throw new Error(data.message || "Gist投稿に失敗しました");
  }
}
