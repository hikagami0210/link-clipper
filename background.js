// コンテキストメニューを作成
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyAsLinkText",
    title: "リンクテキストとしてコピー",
    contexts: ["selection"], // テキスト選択時のみ表示
  });
});

// 右クリックメニューのクリックイベント
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyAsLinkText" && info.selectionText) {
    // 選択されたテキストとURLをコンテンツスクリプトに渡す
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: copyToClipboard,
      args: [info.selectionText, info.pageUrl],
    });
  }
});

// コンテンツスクリプトとして実行する関数
function copyToClipboard(selectedText, pageUrl) {
  const formattedText = `[${selectedText}](${pageUrl})`;

  // クリップボードに書き込む
  navigator.clipboard
    .writeText(formattedText)
    .then(() => {
      console.log("リンクテキストがクリップボードにコピーされました");
    })
    .catch((err) => {
      console.error("クリップボードにコピーできませんでした: ", err);
    });
}
