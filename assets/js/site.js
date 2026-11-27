(function () {
  var body = document.querySelector(".article-body");
  if (!body) return;

  var tables = body.querySelectorAll("table");
  for (var i = 0; i < tables.length; i++) {
    var table = tables[i];
    if (table.parentNode && table.parentNode.classList && table.parentNode.classList.contains("table-scroll")) {
      continue;
    }
    var wrap = document.createElement("div");
    wrap.className = "table-scroll";
    wrap.tabIndex = 0;
    wrap.setAttribute("role", "region");
    wrap.setAttribute("aria-label", labelFor(table, i));
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  }

  var links = body.querySelectorAll('a[href^="http"]');
  for (var j = 0; j < links.length; j++) {
    var link = links[j];
    var host = link.hostname;
    if (!host || host === window.location.hostname) continue;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    if (!link.querySelector(".sr-only")) {
      var note = document.createElement("span");
      note.className = "sr-only";
      note.textContent = " (opens in a new tab)";
      link.appendChild(note);
    }
  }

  var toc = document.getElementById("toc");
  var list = document.getElementById("toc-list");
  if (!toc || !list) return;
  var heads = body.querySelectorAll("h2");
  if (!heads.length) return;
  for (var h = 0; h < heads.length; h++) {
    var heading = heads[h];
    if (!heading.id) heading.id = "section-" + (h + 1);
    var item = document.createElement("li");
    var anchor = document.createElement("a");
    anchor.href = "#" + heading.id;
    anchor.textContent = heading.textContent.replace(/\s+/g, " ").trim();
    item.appendChild(anchor);
    list.appendChild(item);
  }
  toc.hidden = false;

  function labelFor(table, index) {
    var node = table.previousElementSibling;
    while (node) {
      if (/^H[2-4]$/.test(node.tagName) && node.textContent.trim()) {
        return node.textContent.replace(/\s+/g, " ").trim();
      }
      node = node.previousElementSibling;
    }
    return "Results table " + (index + 1);
  }
})();
