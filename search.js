
(function() {
  var idx = null;
  var input = document.getElementById('search');
  var results = document.getElementById('search-results');
  if (!input) return;

  fetch('/rk6-edu/search-index.json')
    .then(r => r.json())
    .then(data => { idx = data; });

  input.addEventListener('input', function() {
    var q = this.value.trim().toLowerCase();
    if (!idx || q.length < 2) { results.style.display = 'none'; return; }
    var hits = [];
    for (var i = 0; i < idx.length; i++) {
      var item = idx[i];
      if (item.title.toLowerCase().includes(q) || item.text.toLowerCase().includes(q)) {
        var pos = item.text.toLowerCase().indexOf(q);
        var snippet = pos >= 0 ? '...' + item.text.slice(Math.max(0, pos-50), pos+100) + '...' : '';
        hits.push({ title: item.title, course: item.course, url: item.url, snippet: snippet });
        if (hits.length >= 10) break;
      }
    }
    if (hits.length === 0) { results.style.display = 'none'; return; }
    results.innerHTML = hits.map(h =>
      '<a class="search-item" href="' + h.url + '">' +
      '<div class="search-item-title">' + h.title + '</div>' +
      '<div class="search-item-course">' + h.course + '</div>' +
      (h.snippet ? '<div class="search-item-snippet">' + h.snippet + '</div>' : '') +
      '</a>'
    ).join('');
    results.style.display = 'block';
  });

  document.addEventListener('click', function(e) {
    if (!results.contains(e.target) && e.target !== input) results.style.display = 'none';
  });
})();
