
(function() {
  var terms = null;
  var popup = document.getElementById('term-popup');
  var popupTitle = document.getElementById('term-popup-title');
  var popupBody = document.getElementById('term-popup-body');
  if (!popup) return;

  fetch('/rk6-edu/terms.json')
    .then(r => r.json())
    .then(data => { terms = data; });

  document.addEventListener('click', function(e) {
    // Клик внутри попапа — ничего не делаем
    if (popup.contains(e.target)) return;

    var el = e.target.closest('a.term');
    if (!el) {
      if (popup.style.display === 'block') popup.style.display = 'none';
      return;
    }
    e.preventDefault();
    var term = el.dataset.term;
    if (!terms || !terms[term]) {
      popupTitle.textContent = term;
      popupBody.textContent = 'Определение не найдено.';
    } else {
      var raw = terms[term].split('\n');
      // Пропускаем первую строку (название курса)
      // Пропускаем все строки с отступом (псевдонимы и ссылки на модули)
      // Оставляем только строки определения (без отступа)
      var defLines = raw.slice(1).filter(function(l) {
        var trimmed = l.trim();
        if (!trimmed || trimmed === 'Дополнительно...') return false;
        var code = l.charCodeAt(0);
        return code !== 32 && code !== 9 && code !== 160; // без отступа
      });
      popupTitle.textContent = term;
      popupBody.innerHTML = defLines.map(function(l) { return '<p>' + l.trim() + '</p>'; }).join('');
    }
    popup.style.display = 'block';
  });
})();
