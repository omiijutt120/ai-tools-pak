/* The AI Post — app.js: search, dark mode, bookmarks, share, TOC */
(function(){
  // dark mode
  var t=document.documentElement, tb=document.getElementById('themeToggle');
  function apply(d){t.setAttribute('data-theme',d);if(tb)tb.textContent=d==='dark'?'☀️':'🌙';localStorage.setItem('aip-theme',d)}
  if(localStorage.getItem('aip-theme')==='dark')apply('dark');
  if(tb)tb.onclick=function(){apply(t.getAttribute('data-theme')==='dark'?'light':'dark')};

  // search
  var so=document.getElementById('searchOverlay'), inp=document.getElementById('searchInput'), res=document.getElementById('searchResults'), idx=null;
  function loadIdx(){if(idx)return Promise.resolve(idx);return fetch('data/search-index.json').then(function(r){return r.json()}).then(function(d){idx=d;return idx}).catch(function(){idx=[];return idx})}
  var sb=document.getElementById('searchBtn');
  if(sb)sb.onclick=function(){so.classList.add('open');loadIdx().then(function(){setTimeout(function(){inp.focus()},50)})};
  if(so)so.onclick=function(e){if(e.target===so)so.classList.remove('open')};
  if(inp)inp.oninput=function(){
    var q=inp.value.trim().toLowerCase();
    if(!q){res.innerHTML='<div style="padding:14px;color:var(--muted);font-size:14px">Type to search articles…</div>';return}
    var hits=(idx||[]).filter(function(a){return (a.t+' '+(a.e||'')+' '+a.c).toLowerCase().indexOf(q)>-1}).slice(0,8);
    res.innerHTML=hits.length?hits.map(function(a){return '<a class="sr" href="'+a.u+'"><b>'+a.t+'</b><span>'+a.c+' · '+a.d+'</span></a>'}).join(''):'<div style="padding:14px;color:var(--muted);font-size:14px">No results for "'+inp.value+'"</div>';
  };
  document.addEventListener('keydown',function(e){if(e.key==='Escape')so&&so.classList.remove('open');if(e.key==='/'&&document.activeElement!==inp){e.preventDefault();sb&&sb.click()}});

  // bookmarks
  var bm=document.getElementById('bmBtn');
  if(bm){
    var saved=JSON.parse(localStorage.getItem('aip-bm')||'[]');
    var isSaved=saved.indexOf(location.pathname)>-1;
    if(isSaved)bm.classList.add('saved');
    bm.onclick=function(){
      var i=saved.indexOf(location.pathname);
      if(i>-1){saved.splice(i,1);bm.classList.remove('saved');bm.textContent='🔖'}else{saved.push(location.pathname);bm.classList.add('saved');bm.textContent='✅'}
      localStorage.setItem('aip-bm',JSON.stringify(saved));
    };
  }

  // share / copy
  var cp=document.getElementById('copyLink');
  if(cp)cp.onclick=function(){navigator.clipboard.writeText(location.href).then(function(){cp.textContent='✅ Copied!';setTimeout(function(){cp.textContent='🔗 Copy link'},1500)})};
  var tw=document.getElementById('twShare');
  if(tw)tw.onclick=function(){window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(document.title)+'&url='+encodeURIComponent(location.href),'_blank','width=550,height=420')};

  // reading time + TOC build (article pages have [data-rt] placeholder)
  var rt=document.getElementById('readTime');
  if(rt){var words=(document.querySelector('article.post')||{}).textContent?document.querySelector('article.post').textContent.trim().split(/\s+/).length:0;rt.textContent=Math.max(1,Math.round(words/220))+' min read'}
  var toc=document.getElementById('toc');
  if(toc){var hs=document.querySelectorAll('article.post h2[id]');if(hs.length){var items='';hs.forEach(function(h){items+='<a href="#'+h.id+'">'+h.textContent+'</a>'});toc.innerHTML='<b>📑 In this article</b>'+items}else toc.style.display='none'}
})();
