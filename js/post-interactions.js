(function () {
  var LABEL_LIKE = '\u70b9\u8d5e';
  var LABEL_LIKED = '\u5df2\u70b9\u8d5e';

  function normalizePath() {
    return window.location.pathname.replace(/\/index\.html$/, '/');
  }

  function createLikePanel() {
    if (document.getElementById('post-like-panel')) return;

    var article = document.getElementById('article-container');
    if (!article || !document.body.classList.contains('post')) return;

    var key = 'post-like:' + normalizePath();
    var liked = localStorage.getItem(key) === '1';
    var countKey = key + ':count';
    var count = Number(localStorage.getItem(countKey) || 0);

    var panel = document.createElement('div');
    panel.id = 'post-like-panel';
    panel.className = liked ? 'post-like-panel is-liked' : 'post-like-panel';

    var button = document.createElement('button');
    button.className = 'post-like-button';
    button.type = 'button';
    button.setAttribute('aria-pressed', liked ? 'true' : 'false');

    var icon = document.createElement('i');
    icon.className = 'fas fa-thumbs-up';

    var text = document.createElement('span');
    text.className = 'post-like-text';
    text.textContent = liked ? LABEL_LIKED : LABEL_LIKE;

    var countNode = document.createElement('span');
    countNode.className = 'post-like-count';
    countNode.textContent = String(count);

    button.appendChild(icon);
    button.appendChild(text);
    button.appendChild(countNode);
    panel.appendChild(button);

    var copyright = document.querySelector('.post-copyright');
    if (copyright) {
      copyright.parentNode.insertBefore(panel, copyright);
    } else {
      article.insertAdjacentElement('afterend', panel);
    }

    button.addEventListener('click', function () {
      liked = !liked;
      count = Math.max(0, count + (liked ? 1 : -1));
      localStorage.setItem(key, liked ? '1' : '0');
      localStorage.setItem(countKey, String(count));
      panel.classList.toggle('is-liked', liked);
      button.setAttribute('aria-pressed', liked ? 'true' : 'false');
      text.textContent = liked ? LABEL_LIKED : LABEL_LIKE;
      countNode.textContent = String(count);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createLikePanel);
  } else {
    createLikePanel();
  }
})();
