
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
      var lines = terms[term].split('\n')
        .map(l => l.trim())
        .filter(l => l && l !== 'Дополнительно...');
      popupTitle.textContent = lines[0] || term;
      popupBody.innerHTML = lines.slice(1).map(l => '<p>' + l + '</p>').join('');
    }
    popup.style.display = 'block';
  });
})();
