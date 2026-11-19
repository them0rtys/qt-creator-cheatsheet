(async () => {
  const $ = s => document.querySelector(s);
  const base = new URL('./', document.baseURI).href;
  const cache = {};
  const cfg = await (await fetch('./docs/manifest.json')).json();
  const files = cfg.sections.flatMap(s => s.files.map(f => ({ ...f, folder: s.folder })));
  let current = null;

  // ---------- theme ----------
  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    $('#hl-dark').disabled = t !== 'dark'; $('#hl-light').disabled = t === 'dark';
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  let saved = null; try { saved = localStorage.getItem('theme'); } catch (e) {}
  setTheme(saved || 'dark');
  $('#theme').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
  $('#menu').onclick = () => $('#tree').classList.toggle('open');

  // ---------- GitHub links ----------
  const repo = cfg.repo.url.replace(/\/$/, '');
  $('#gh').href = $('#gh2').href = repo;

  // ---------- data ----------
  const load = async p => {
    if (!cache[p]) { const r = await fetch('./' + p); if (!r.ok) throw new Error(r.status + ' ' + p); cache[p] = await r.text(); }
    return cache[p];
  };
  const frontMatter = md => {
    const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/); const meta = {};
    if (!m) return { meta, body: md };
    m[1].split('\n').forEach(l => { const i = l.indexOf(':'); if (i > 0) meta[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
    if (meta.tags) meta.tags = meta.tags.replace(/[\[\]]/g, '').split(',').map(s => s.trim()).filter(Boolean);
    return { meta, body: md.slice(m[0].length) };
  };

  // ---------- tree ----------
  const tree = $('#tree');
  cfg.sections.forEach(s => {
    const d = document.createElement('details'); d.open = true;
    d.innerHTML = `<summary>📁 ${s.folder}/</summary>` +
      s.files.map(f => `<a href="#${f.path}" data-p="${f.path}" title="${f.title}">${f.path.split('/').pop()} <span style="color:var(--mute)">· ${f.title}</span></a>`).join('');
    tree.append(d);
  });

  // ---------- render ----------
  async function show(path) {
    const f = files.find(x => x.path === path) || files[0];
    current = f.path;
    document.querySelectorAll('.tree a').forEach(a => a.classList.toggle('on', a.dataset.p === current));
    $('#tree').classList.remove('open');
    $('#path').textContent = current;
    $('#edit').href = `${repo}/edit/${cfg.repo.branch}/${current}`;
    const doc = $('#doc');
    try {
      const raw = await load(current), { meta, body } = frontMatter(raw);
      doc.innerHTML = marked.parse(body);
      if (meta.tags && meta.tags.length) {
        const t = document.createElement('div'); t.className = 'tags';
        t.innerHTML = meta.tags.map(x => `<span>#${x}</span>`).join('');
        (doc.querySelector('h1') || doc.firstChild).after(t);
      }
      enhance(doc);
      document.title = (meta.title || f.title) + ' · Qt Creator Hub';
    } catch (e) { doc.innerHTML = `<h1>Could not load file</h1><p>${e.message}. Check the path in <code>docs/manifest.json</code>.</p>`; }
    window.scrollTo(0, 0);
  }

  function enhance(doc) {
    // callouts: > [!TIP] / [!NOTE] / [!WARNING] / [!CAUTION]
    doc.querySelectorAll('blockquote').forEach(b => {
      const m = b.textContent.trim().match(/^\[!(TIP|NOTE|WARNING|CAUTION)\]/i);
      if (!m) return;
      const k = m[1].toLowerCase(), p = b.querySelector('p');
      p.innerHTML = p.innerHTML.replace(/\[!\w+\]\s*/i, '');
      b.classList.add('co', 'co-' + k);
      b.insertAdjacentHTML('afterbegin', `<div class="co-title">${{ tip: '💡 Tip', note: 'ℹ️ Note', warning: '⚠️ Common mistake', caution: '🛑 Caution' }[k]}</div>`);
    });
    // code: highlight + copy
    doc.querySelectorAll('pre').forEach(pre => {
      const code = pre.querySelector('code'); if (!code) return;
      if (!/language-/.test(code.className)) code.classList.add('language-plaintext');
      hljs.highlightElement(code);
      const b = document.createElement('button'); b.className = 'copy'; b.textContent = 'Copy';
      b.onclick = async () => { await navigator.clipboard.writeText(code.innerText); b.textContent = 'Copied ✓'; setTimeout(() => b.textContent = 'Copy', 1500); };
      pre.append(b);
    });
    // internal .md links
    doc.querySelectorAll('a[href]').forEach(a => {
      const h = a.getAttribute('href');
      if (/^(https?:|#|mailto:)/.test(h) || !/\.md$/.test(h)) return;
      a.href = '#' + new URL(h, new URL(current, base)).href.replace(base, '');
    });
    // TOC
    const toc = $('#toc'); toc.innerHTML = '';
    const heads = [...doc.querySelectorAll('h2,h3')];
    heads.forEach((h, i) => {
      h.id = 'h-' + i;
      const a = document.createElement('a'); a.href = 'javascript:void 0'; a.textContent = h.textContent;
      a.className = h.tagName === 'H3' ? 'l3' : ''; a.onclick = () => h.scrollIntoView(); a.dataset.id = h.id; toc.append(a);
    });
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) toc.querySelectorAll('a').forEach(a => a.classList.toggle('on', a.dataset.id === e.target.id));
    }), { rootMargin: '-70px 0px -70% 0px' });
    heads.forEach(h => io.observe(h));
  }

  // ---------- search (titles, paths and full text) ----------
  $('#search').addEventListener('input', async e => {
    const q = e.target.value.trim().toLowerCase();
    await Promise.all(files.map(f => load(f.path).catch(() => '')));
    document.querySelectorAll('.tree a').forEach(a => {
      const f = files.find(x => x.path === a.dataset.p);
      a.style.display = !q || (f.title + ' ' + f.path + ' ' + (cache[f.path] || '')).toLowerCase().includes(q) ? '' : 'none';
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#search').focus(); }
  });

  $('#copyMd').onclick = async e => {
    await navigator.clipboard.writeText(cache[current] || ''); e.target.textContent = 'Copied ✓';
    setTimeout(() => e.target.textContent = 'Copy Markdown', 1500);
  };

  const route = () => show(decodeURIComponent(location.hash.slice(1)));
  window.addEventListener('hashchange', route);
  route();
})();
