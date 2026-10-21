/* AI Security Interview Field Guide — navigation, TOC, search, theme, Q&A tools */
(function () {
  "use strict";

  var GROUPS = [
    { label: "Start", part: "", items: [["index.html", "Start here · study plan", "00"]] },
    { label: "Part A · Foundations", part: "A", items: [["01-foundations.html", "AI security foundations", "01"]] },
    { label: "Part B · Risk frameworks", part: "B", items: [
      ["02-owasp-web-api.html", "OWASP Top 10 (Web & API)", "02"],
      ["03-owasp-llm-top10.html", "OWASP LLM Top 10 (2025)", "03"],
      ["04-owasp-agentic-top10.html", "OWASP Agentic Top 10", "04"],
      ["05-mitre-atlas.html", "MITRE ATLAS", "05"]] },
    { label: "Part C · Securing AI systems", part: "C", items: [
      ["06-rag-security.html", "Securing RAG", "06"],
      ["07-agents-multiagent-mcp.html", "Agents, multi-agent & MCP", "07"],
      ["08-guardrails-middleware.html", "Guardrails & middleware", "08", "new"],
      ["09-harness-engineering.html", "Agent harness engineering", "09", "new"]] },
    { label: "Part D · Testing & evaluation", part: "D", items: [
      ["10-red-teaming-pyrit.html", "Red teaming & PyRIT", "10"],
      ["11-evaluation-metrics.html", "Eval harnesses & metrics", "11", "new"]] },
    { label: "Part E · Platforms & governance", part: "E", items: [
      ["12-microsoft-ai-security.html", "Microsoft AI security", "12"],
      ["13-governance-frameworks.html", "Governance & frameworks", "13"]] },
    { label: "Part F · Practice", part: "F", items: [
      ["14-interview-questions.html", "Interview Q&A bank", "14"],
      ["15-cheatsheet.html", "Night-before cheat sheet", "15"]] }
  ];
  var PAGES = [];
  GROUPS.forEach(function (g) { g.items.forEach(function (it) { PAGES.push({ href: it[0], title: it[1], num: it[2], isNew: it[3] === "new", group: g }); }); });

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 64) || "section"; }
  function each(list, fn) { Array.prototype.forEach.call(list, fn); }

  var here = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
  var main = document.getElementById("main");
  if (!main) return;
  var cur = null, idx = -1;
  PAGES.forEach(function (p, i) { if (p.href === here) { cur = p; idx = i; } });

  // ---- visited tracking ----
  var visited = {};
  try { visited = JSON.parse(store.get("aisec-visited") || "{}") || {}; } catch (e) { visited = {}; }
  if (cur) { visited[here] = 1; store.set("aisec-visited", JSON.stringify(visited)); }

  // ---- ids for headings ----
  var used = {};
  var h2s = Array.prototype.slice.call(main.querySelectorAll("h2"));
  h2s.concat(Array.prototype.slice.call(main.querySelectorAll("h3"))).forEach(function (h) {
    if (!h.id) {
      var base = slug(h.textContent), id = base, n = 2;
      while (used[id] || document.getElementById(id)) { id = base + "-" + n++; }
      h.id = id;
    }
    used[h.id] = true;
  });
  function shortTitle(h) { return h.getAttribute("data-short") || h.textContent; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }

  // ---- sidebar ----
  var nav = document.getElementById("sidebar");
  if (nav) {
    var html = '<div class="side-head"><div class="brand-row"><a class="brand" href="index.html"><span class="brand-mark">AI</span><span>AI Security<small>Interview Field Guide</small></span></a>' +
      '<button class="icon-btn theme-btn" type="button" title="Toggle light / dark" aria-label="Toggle light or dark theme">◐</button></div>' +
      '<button class="search-btn" type="button" data-open-search>⌕ Search the guide… <kbd>/</kbd></button></div>';
    html += '<div class="side-nav">';
    GROUPS.forEach(function (g) {
      html += '<div class="nav-group"><div class="nav-group-label">' + esc(g.label) + "</div><ol>";
      g.items.forEach(function (it) {
        var isCur = it[0] === here;
        var cls = it[3] === "new" ? ' class="new"' : "";
        html += '<li><a href="' + it[0] + '"' + cls + (isCur ? ' aria-current="page"' : "") + '><span class="num">' + it[2] + "</span><span>" + esc(it[1]) + "</span>" +
          (visited[it[0]] && !isCur ? '<span class="seen" title="Visited">✓</span>' : "") + "</a></li>";
      });
      html += "</ol></div>";
    });
    html += "</div>";
    var nSeen = PAGES.filter(function (p) { return visited[p.href]; }).length;
    html += '<div class="side-foot">Progress: ' + nSeen + " / " + PAGES.length + ' pages opened<div class="bar"><i style="width:' + Math.round(100 * nSeen / PAGES.length) + '%"></i></div></div>';
    nav.innerHTML = html;
  }

  function toggleTheme() {
    var root = document.documentElement;
    var curT = root.getAttribute("data-theme") || (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = curT === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("aisec-theme", next);
  }

  // ---- mobile top bar ----
  var top = document.createElement("div");
  top.className = "topbar";
  top.innerHTML = '<button class="icon-btn" type="button" data-menu aria-label="Open menu">☰</button><span class="t-title">' +
    esc(cur ? cur.num + " · " + cur.title : document.title) + '</span><button class="icon-btn" type="button" data-open-search aria-label="Search">⌕</button>' +
    '<button class="icon-btn theme-btn" type="button" aria-label="Toggle theme">◐</button>';
  var scrim = document.createElement("div"); scrim.className = "scrim";
  var prog = document.createElement("div"); prog.className = "progress";
  document.body.appendChild(top); document.body.appendChild(scrim); document.body.appendChild(prog);
  top.querySelector("[data-menu]").addEventListener("click", function () { document.body.classList.toggle("nav-open"); });
  scrim.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
  if (nav) nav.addEventListener("click", function (e) { if (e.target.closest("a")) document.body.classList.remove("nav-open"); });
  each(document.querySelectorAll(".theme-btn"), function (b) { b.addEventListener("click", toggleTheme); });

  // ---- breadcrumb in page header ----
  var eyebrow = main.querySelector(".page-head .eyebrow");
  if (eyebrow && cur) {
    var crumbs = document.createElement("div");
    crumbs.className = "crumbs";
    crumbs.innerHTML = (cur.num !== "00" ? '<span class="mod">' + cur.num + "</span>" : "") + "<span>" + esc(cur.group.label) + "</span>";
    eyebrow.parentNode.replaceChild(crumbs, eyebrow);
  }

  // ---- table of contents (right rail + inline) ----
  if (h2s.length > 2) {
    var items = h2s.map(function (h, i) { return '<li><a href="#' + h.id + '" data-id="' + h.id + '"><span class="n">' + pad(i + 1) + "</span><span>" + esc(shortTitle(h)) + "</span></a></li>"; }).join("");
    var toc = document.createElement("aside");
    toc.id = "toc";
    toc.setAttribute("aria-label", "On this page");
    toc.innerHTML = '<div class="toc-label">On this page</div><ol>' + items + "</ol>";
    document.body.appendChild(toc);
    document.body.classList.add("has-toc");
    var inl = document.createElement("details");
    inl.className = "toc-inline";
    inl.innerHTML = "<summary>On this page · " + h2s.length + " sections</summary><ol>" + items + "</ol>";
    var head = main.querySelector(".page-head");
    var anchor = main.querySelector(".tldr") || head;
    if (anchor && anchor.parentNode === main) main.insertBefore(inl, anchor.nextSibling);
    inl.addEventListener("click", function (e) { if (e.target.closest("a")) inl.open = false; });

    if ("IntersectionObserver" in window) {
      var links = toc.querySelectorAll("a");
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            each(links, function (a) { a.classList.toggle("active", a.getAttribute("data-id") === en.target.id); });
          }
        });
      }, { rootMargin: "0px 0px -72% 0px" });
      h2s.forEach(function (h) { io.observe(h); });
    }
  }

  // ---- prev / next pager ----
  if (idx >= 0) {
    var pager = document.createElement("nav");
    pager.className = "pager";
    var prev = PAGES[idx - 1], next = PAGES[idx + 1];
    pager.innerHTML =
      (prev ? '<a class="prev" href="' + prev.href + '"><small>← Previous · ' + prev.num + "</small>" + esc(prev.title) + "</a>" : "") +
      (next ? '<a class="next" href="' + next.href + '"><small>Next · ' + next.num + " →</small>" + esc(next.title) + "</a>" : "");
    main.appendChild(pager);
  }

  // ---- back to top + reading progress ----
  var tt = document.createElement("button");
  tt.className = "to-top"; tt.type = "button"; tt.title = "Back to top"; tt.innerHTML = "↑";
  document.body.appendChild(tt);
  tt.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  function onScroll() {
    tt.classList.toggle("show", window.scrollY > 700);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = (max > 0 ? Math.min(100, 100 * window.scrollY / max) : 0) + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- copy buttons on code ----
  each(main.querySelectorAll("pre"), function (pre) {
    var b = document.createElement("button");
    b.className = "copy"; b.type = "button"; b.textContent = "Copy";
    b.addEventListener("click", function () {
      var clone = pre.cloneNode(true);
      var cb = clone.querySelector(".copy");
      if (cb) cb.remove();
      var txt = clone.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(txt).then(function () {
          b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1200);
        }, function () { /* clipboard blocked */ });
      }
    });
    pre.appendChild(b);
  });

  // ---- persistent checklists ----
  each(main.querySelectorAll("ul.check"), function (ul, ui) {
    each(ul.children, function (li, liI) {
      var key = "aisec-chk:" + here + ":" + ui + ":" + liI;
      var cb = document.createElement("input");
      cb.type = "checkbox";
      var span = document.createElement("span");
      while (li.firstChild) span.appendChild(li.firstChild);
      li.appendChild(cb); li.appendChild(span);
      if (store.get(key) === "1") { cb.checked = true; li.classList.add("done"); }
      cb.addEventListener("change", function () { li.classList.toggle("done", cb.checked); store.set(key, cb.checked ? "1" : "0"); });
    });
  });

  // ---- Q&A tools ----
  var qaRoot = document.querySelector("[data-qa]");
  if (qaRoot) {
    var qitems = Array.prototype.slice.call(qaRoot.querySelectorAll("details.qa"));
    var groups = Array.prototype.slice.call(qaRoot.querySelectorAll(".qa-group"));
    var search = document.getElementById("qa-search");
    var countEl = document.getElementById("qa-count");
    var activeCat = "all", hideKnown = false;

    qitems.forEach(function (d, i) {
      if (!d.id) d.id = "q" + (i + 1);
      var sum = d.querySelector("summary");
      var qn = document.createElement("span");
      qn.className = "qn"; qn.textContent = "Q" + (i + 1);
      sum.insertBefore(qn, sum.firstChild);
      var ans = d.querySelector(".ans");
      if (ans) {
        var kb = document.createElement("button");
        kb.type = "button"; kb.className = "btn know";
        var setKb = function () { kb.textContent = d.classList.contains("known") ? "✓ Marked confident (undo)" : "Mark as confident"; };
        if (store.get("aisec-qa:" + d.id) === "1") d.classList.add("known");
        setKb();
        kb.addEventListener("click", function () {
          d.classList.toggle("known");
          store.set("aisec-qa:" + d.id, d.classList.contains("known") ? "1" : "0");
          setKb(); apply();
        });
        ans.appendChild(kb);
      }
    });
    // per-category counts on chips
    each(document.querySelectorAll("[data-filter]"), function (b) {
      var cat = b.getAttribute("data-filter");
      var n = cat === "all" ? qitems.length : qaRoot.querySelectorAll('.qa-group[data-cat="' + cat + '"] details.qa').length;
      var c = document.createElement("span"); c.className = "c"; c.textContent = n;
      b.appendChild(c);
    });

    var apply = function () {
      var q = (search && search.value || "").trim().toLowerCase();
      var shown = 0, known = 0;
      qitems.forEach(function (d) {
        var grp = d.closest(".qa-group");
        var cat = grp ? grp.getAttribute("data-cat") : "";
        var ok = (activeCat === "all" || cat === activeCat) &&
          (!q || d.textContent.toLowerCase().indexOf(q) !== -1) &&
          !(hideKnown && d.classList.contains("known"));
        d.classList.toggle("hidden", !ok);
        if (ok) shown++;
        if (d.classList.contains("known")) known++;
      });
      groups.forEach(function (g) { g.classList.toggle("hidden", !g.querySelector("details.qa:not(.hidden)")); });
      if (countEl) countEl.textContent = shown + " shown · " + known + "/" + qitems.length + " confident";
    };

    if (search) search.addEventListener("input", apply);
    each(document.querySelectorAll("[data-filter]"), function (b) {
      b.addEventListener("click", function () {
        activeCat = b.getAttribute("data-filter");
        each(document.querySelectorAll("[data-filter]"), function (x) { x.classList.toggle("on", x === b); });
        apply();
      });
    });
    var on = function (id, fn) { var el = document.getElementById(id); if (el) el.addEventListener("click", fn); };
    on("qa-expand", function () { qitems.forEach(function (d) { if (!d.classList.contains("hidden")) d.open = true; }); });
    on("qa-collapse", function () { qitems.forEach(function (d) { d.open = false; }); });
    on("qa-hide-known", function () { hideKnown = !hideKnown; this.classList.toggle("on", hideKnown); apply(); });
    on("qa-random", function () {
      var vis = qitems.filter(function (d) { return !d.classList.contains("hidden"); });
      if (!vis.length) return;
      qitems.forEach(function (d) { d.open = false; });
      var pick = vis[Math.floor(Math.random() * vis.length)];
      pick.scrollIntoView({ behavior: "smooth", block: "center" });
      pick.classList.add("pulse");
      setTimeout(function () { pick.classList.remove("pulse"); }, 1400);
    });
    apply();
    if (location.hash) {
      var target = document.getElementById(location.hash.slice(1));
      if (target && target.tagName === "DETAILS") { target.open = true; setTimeout(function () { target.scrollIntoView({ block: "center" }); }, 50); }
    }
  }

  // ---- guide-wide search ----
  var INDEX = window.AISEC_INDEX || [];
  var modal = document.createElement("div");
  modal.className = "search-modal";
  modal.innerHTML = '<div class="search-box" role="dialog" aria-label="Search the guide"><input type="search" placeholder="Search topics, sections and interview questions…" aria-label="Search">' +
    '<ul class="search-results"></ul><div class="search-hint"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span><span>' + INDEX.length + " entries indexed</span></div></div>";
  document.body.appendChild(modal);
  var sInput = modal.querySelector("input"), sList = modal.querySelector(".search-results"), sel = 0, results = [];
  var KIND = { page: "PAGE", h2: "SECTION", h3: "TOPIC", q: "Q&A" };
  function render() {
    var q = sInput.value.trim().toLowerCase();
    if (!q) {
      results = INDEX.filter(function (e) { return e[4] === "page"; });
    } else {
      var terms = q.split(/\s+/);
      results = INDEX.map(function (e) {
        var title = e[2].toLowerCase(), head = (title + " " + e[1]).toLowerCase(), body = e[5] || "", score = 0;
        for (var i = 0; i < terms.length; i++) {
          var t = terms[i];
          if (head.indexOf(t) === -1 && body.indexOf(t) === -1) return null;
          if (title.indexOf(t) === 0) score += 4; else if (title.indexOf(t) !== -1) score += 3;
          else if (head.indexOf(t) !== -1) score += 1.5; else score += 0.5;
        }
        score += { page: 3, h2: 2, h3: 1, q: 0 }[e[4]] || 0;
        return { e: e, s: score };
      }).filter(Boolean).sort(function (a, b) { return b.s - a.s; }).slice(0, 40).map(function (r) { return r.e; });
    }
    sel = 0;
    sList.innerHTML = results.length ? results.map(function (e, i) {
      var href = e[0] + (e[3] ? "#" + e[3] : "");
      return '<li><a href="' + href + '" class="' + (i === 0 ? "sel" : "") + '"><span class="sr-kind">' + (KIND[e[4]] || "") + "</span>" + esc(e[2]) + '<span class="sr-page">' + esc(e[1]) + "</span></a></li>";
    }).join("") : '<li class="search-empty">No matches. Try fewer or different words.</li>';
  }
  function openSearch() { modal.classList.add("open"); sInput.value = ""; render(); setTimeout(function () { sInput.focus(); }, 10); }
  function closeSearch() { modal.classList.remove("open"); }
  function moveSel(d) {
    var as = sList.querySelectorAll("a"); if (!as.length) return;
    as[sel].classList.remove("sel"); sel = (sel + d + as.length) % as.length; as[sel].classList.add("sel");
    as[sel].scrollIntoView({ block: "nearest" });
  }
  sInput.addEventListener("input", render);
  sInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); moveSel(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveSel(-1); }
    else if (e.key === "Enter") { var a = sList.querySelectorAll("a")[sel]; if (a) { closeSearch(); location.href = a.getAttribute("href"); } }
  });
  modal.addEventListener("click", function (e) { if (e.target === modal) closeSearch(); if (e.target.closest("a")) closeSearch(); });
  each(document.querySelectorAll("[data-open-search]"), function (b) { b.addEventListener("click", openSearch); });
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    var typing = tag === "input" || tag === "textarea";
    if (e.key === "Escape") { closeSearch(); document.body.classList.remove("nav-open"); }
    else if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) { e.preventDefault(); openSearch(); }
  });
  window.addEventListener("hashchange", function () {
    var t = document.getElementById(location.hash.slice(1));
    if (t && t.tagName === "DETAILS") t.open = true;
  });

  // ---- print: expand everything ----
  window.addEventListener("beforeprint", function () { each(document.querySelectorAll("details"), function (d) { d.open = true; }); });
})();
