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

(function () {
  var form = document.getElementById("article-filters");
  var dataNode = document.getElementById("article-index");
  if (!form || !dataNode) return;

  var index = [];
  try {
    index = JSON.parse(dataNode.textContent);
  } catch (error) {
    return;
  }

  var bySlug = {};
  for (var i = 0; i < index.length; i++) bySlug[index[i].slug] = index[i];

  var qInput = document.getElementById("filter-q");
  var regionSelect = document.getElementById("filter-region");
  var clubSelect = document.getElementById("filter-club");
  var swimmerSelect = document.getElementById("filter-swimmer");
  var meetSelect = document.getElementById("filter-meet");
  var status = document.getElementById("filter-status");
  var clearButton = document.getElementById("filter-clear");
  var empty = document.getElementById("filter-empty");
  var cards = document.querySelectorAll("#article-list .story");

  if (regionSelect) fillSelect(regionSelect, unique(index, "region"));
  if (clubSelect) fillSelect(clubSelect, uniqueList(index, "clubs"));
  if (swimmerSelect) fillSelect(swimmerSelect, uniqueList(index, "swimmers"));
  if (meetSelect) fillSelect(meetSelect, unique(index, "meet"));

  var params = new URLSearchParams(window.location.search);
  if (qInput) qInput.value = params.get("q") || "";
  setSelect(regionSelect, params.get("region") || "");
  setSelect(clubSelect, params.get("club") || "");
  setSelect(swimmerSelect, params.get("swimmer") || "");
  setSelect(meetSelect, params.get("meet") || "");

  form.addEventListener("submit", function (event) { event.preventDefault(); apply(); });
  if (qInput) qInput.addEventListener("input", apply);
  if (regionSelect) regionSelect.addEventListener("change", apply);
  if (clubSelect) clubSelect.addEventListener("change", apply);
  if (swimmerSelect) swimmerSelect.addEventListener("change", apply);
  if (meetSelect) meetSelect.addEventListener("change", apply);
  if (clearButton) clearButton.addEventListener("click", function () {
    if (qInput) qInput.value = "";
    if (regionSelect) regionSelect.value = "";
    if (clubSelect) clubSelect.value = "";
    if (swimmerSelect) swimmerSelect.value = "";
    if (meetSelect) meetSelect.value = "";
    apply();
  });

  apply();

  function apply() {
    var q = qInput ? qInput.value.trim().toLowerCase() : "";
    var region = regionSelect ? regionSelect.value : "";
    var club = clubSelect ? clubSelect.value : "";
    var swimmer = swimmerSelect ? swimmerSelect.value : "";
    var meet = meetSelect ? meetSelect.value : "";
    var shown = 0;

    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var item = bySlug[card.getAttribute("data-slug")];
      var match = !item || matches(item, q, region, club, swimmer, meet);
      card.hidden = !match;
      if (match) shown += 1;
    }

    var groups = document.querySelectorAll("#article-list .year-group");
    for (var g = 0; g < groups.length; g++) {
      groups[g].hidden = !groups[g].querySelector(".story:not([hidden])");
    }

    var filtering = q || region || club || swimmer || meet;
    if (status) {
      var listEl = document.getElementById("article-list");
      var nounBase = (listEl && listEl.getAttribute("data-noun")) || "recap";
      var noun = nounBase === "story" ? (shown === 1 ? "story" : "stories") : (shown === 1 ? "recap" : "recaps");
      status.textContent = filtering ? shown + " " + noun + (shown === 1 ? " matches" : " match") : shown + " " + noun;
    }
    if (empty) empty.hidden = shown !== 0;
    if (clearButton) clearButton.hidden = !filtering;

    var next = new URLSearchParams();
    if (q && qInput) next.set("q", qInput.value.trim());
    if (region) next.set("region", region);
    if (club) next.set("club", club);
    if (swimmer) next.set("swimmer", swimmer);
    if (meet) next.set("meet", meet);
    var query = next.toString();
    var url = window.location.pathname + (query ? "?" + query : "") + window.location.hash;
    if (url !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", url);
    }
  }

  function matches(item, q, region, club, swimmer, meet) {
    if (region && !same(item.region, region)) return false;
    if (meet && !same(item.meet, meet)) return false;
    if (club && !has(item.clubs, club)) return false;
    if (swimmer && !has(item.swimmers, swimmer)) return false;
    if (q && haystack(item).indexOf(q) === -1) return false;
    return true;
  }

  function haystack(item) {
    return [item.title, item.summary, item.meet, item.location, item.region]
      .concat(item.clubs || [])
      .concat(item.swimmers || [])
      .join(" ")
      .toLowerCase();
  }

  function has(list, value) {
    if (!list) return false;
    for (var i = 0; i < list.length; i++) if (same(list[i], value)) return true;
    return false;
  }

  function same(a, b) {
    return String(a || "").toLowerCase() === String(b || "").toLowerCase();
  }

  function unique(items, key) {
    var seen = {};
    var values = [];
    for (var i = 0; i < items.length; i++) {
      var value = items[i][key];
      if (!value || seen[value]) continue;
      seen[value] = true;
      values.push(value);
    }
    values.sort(function (a, b) { return a.localeCompare(b); });
    return values;
  }

  function uniqueList(items, key) {
    var seen = {};
    var values = [];
    for (var i = 0; i < items.length; i++) {
      var list = items[i][key] || [];
      for (var j = 0; j < list.length; j++) {
        if (!list[j] || seen[list[j]]) continue;
        seen[list[j]] = true;
        values.push(list[j]);
      }
    }
    values.sort(function (a, b) { return a.localeCompare(b); });
    return values;
  }

  function fillSelect(select, values) {
    for (var i = 0; i < values.length; i++) {
      var option = document.createElement("option");
      option.value = values[i];
      option.textContent = values[i];
      select.appendChild(option);
    }
  }

  function setSelect(select, value) {
    if (!select || !value) return;
    var found = false;
    for (var i = 0; i < select.options.length; i++) {
      if (same(select.options[i].value, value)) {
        select.value = select.options[i].value;
        found = true;
        break;
      }
    }
    if (!found) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
      select.value = value;
    }
  }
})();
