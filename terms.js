
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
      var rest = raw.slice(1);
      // Разделяем: строки с отступом в начале = псевдонимы, потом идёт определение
      var aliases = [];
      var defLines = [];
      var inDef = false;
      for (var i = 0; i < rest.length; i++) {
        var l = rest[i];
        var trimmed = l.trim();
        if (!trimmed || trimmed === 'Дополнительно...') continue;
        var code = l.charCodeAt(0);
        var hasIndent = l.length > 0 && (code === 32 || code === 9 || code === 160);
        if (!inDef && hasIndent) {
          aliases.push(trimmed); // псевдоним термина
        } else if (!hasIndent) {
          inDef = true;
          defLines.push(trimmed); // определение
        }
        // строки с отступом после определения = ссылки на модули, пропускаем
      }
      popupTitle.textContent = aliases.join(', ') || term;
      popupBody.innerHTML = defLines.map(l => '<p>' + l + '</p>').join('');
    }
    popup.style.display = 'block';
  });
})();
