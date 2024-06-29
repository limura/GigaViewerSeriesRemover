(function() {
    // リストコンテナの作成
    let seriesListContainer = document.createElement('div');
    seriesListContainer.id = 'seriesListContainer';
    seriesListContainer.style.display = 'none'; // 初期状態では非表示
    document.body.appendChild(seriesListContainer);
  
    // 閉じるボタンの作成
    let closeButton = document.createElement('button');
    closeButton.id = 'closeSeriesList';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
      seriesListContainer.style.display = 'none';
    });
    seriesListContainer.appendChild(closeButton);
  
    // リストの初期化と表示
    function updateSeriesList() {
      seriesListContainer.innerHTML = ''; // リストの初期化
      seriesListContainer.appendChild(closeButton); // 閉じるボタンを再追加
  
      let historyManager = localStorage.getItem('history_manager');
      if (historyManager) {
        let historyManagerObj = JSON.parse(historyManager);
        historyManagerObj.forEach(item => {
          let seriesItem = document.createElement('div');
          seriesItem.className = 'series-item';
  
          let thumbnail = document.createElement('img');
          thumbnail.src = item.series.thumbnailUrl;
          let thumbnailLink = document.createElement('a');
          thumbnailLink.href = item.episode.permaLink;
          thumbnailLink.target = '_blank';
          thumbnailLink.appendChild(thumbnail);
          seriesItem.appendChild(thumbnailLink);
  
          let title = document.createElement('a');
          title.textContent = item.series.title;
          title.href = item.episode.permaLink;
          title.target = '_blank';
          seriesItem.appendChild(title);
  
          let deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete the history for "${item.series.title}"?`)) {
              historyManagerObj = historyManagerObj.filter(series => series.series.id !== item.series.id);
              localStorage.setItem('history_manager', JSON.stringify(historyManagerObj));
              seriesItem.remove();
            }
          });
          seriesItem.appendChild(deleteButton);
  
          seriesListContainer.appendChild(seriesItem);
        });
      } else {
        let noData = document.createElement('div');
        noData.textContent = 'No history data found.';
        seriesListContainer.appendChild(noData);
      }
    }
  
    function toggleSeriesList() {
      if (!localStorage.getItem('history_manager')) {
        return;
      }
      if (seriesListContainer.style.display === 'block') {
        seriesListContainer.style.display = 'none';
      } else {
        updateSeriesList();
        seriesListContainer.style.display = 'block';
      }
    }
  
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "toggleSeriesList") {
        toggleSeriesList();
      }
      if (request.action === "isGigaViewerSiteCheck") {
        sendResponse({ message: localStorage.getItem('history_manager') });
      }
    });
})();
  