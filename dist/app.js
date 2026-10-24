'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const paths = {
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
 edit:'<path d="m16 3 5 5-12 12-6 1 1-6L16 3ZM14 5l5 5"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 arrowUp:'<path d="M6 18 18 6M6 6h12v12"/>',
 shuffle:'<path d="M3 6h3c5 0 7 12 12 12h3m-4-4 4 4-4 4M3 18h3c2 0 4-2 5-4m2-4c2-3 3-4 5-4h3m-4-4 4 4-4 4"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0l-1 1-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 sliders:'<path d="M4 7h6m4 0h6M4 17h10m4 0h2"/><circle cx="12" cy="7" r="2"/><circle cx="16" cy="17" r="2"/>',
 chat:'<path d="M21 11a9 9 0 0 1-9 9H4l-3 2 2-7A9 9 0 1 1 21 11Z"/><path d="M7 10h9M7 14h6"/>',
 radar:'<circle cx="12" cy="12" r="9"/><path d="m12 12 6-6M16 15a5 5 0 1 1-7-7M12 3v2M3 12h2M12 19v2M19 12h2"/>',
 trophy:'<path d="M7 3h10v7a5 5 0 0 1-10 0V3ZM7 6H3v3c0 3 2 4 5 4m9-7h4v3c0 3-2 4-5 4M12 15v6m-4 0h8"/>',
 x:'<path d="m6 6 12 12M6 18 18 6"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/>',
 map:'<path d="m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3V5Zm6-3v17m6-14v17"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 thumb:'<path d="M7 10 12 3c2 0 2 2 1 6h6c2 0 2 2 1 4l-2 7H7V10ZM3 10h4v10H3V10Z"/>',
 chevron:'<path d="m7 10 5 5 5-5"/>',
 bowl:'<path d="M3 11h18c0 6-4 9-9 9s-9-3-9-9ZM8 4v3m4-4v4m4-3v3M8 23h8"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bowl}</svg>`;
function hydrateIcons(root = document) { $$('[data-icon]', root).forEach(el => el.innerHTML = icon(el.dataset.icon)); }
const DATA = window.FANDIAN_DATA;
// shortcut: reviews and favorites are saved on this device; connect campus accounts when launching a real community.
let storageAvailable = true;
function readStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(`fandian-v1-${key}`)) ?? fallback; } catch { storageAvailable = false; return fallback; }
}
function writeStore(key, value) {
  try { localStorage.setItem(`fandian-v1-${key}`, JSON.stringify(value)); return true; }
  catch { storageAvailable = false; return false; }
}
let saved = readStore('saved', []);
if (!Array.isArray(saved)) saved = [];
saved = new Set(saved.filter(id => DATA.dishes.some(d => d.id === id)));
let userReviews = readStore('reviews', []);
if (!Array.isArray(userReviews)) userReviews = [];
userReviews = userReviews.filter(r => r && typeof r.text === 'string' && Number.isInteger(r.dishId) && Number.isInteger(r.rating) && r.rating >= 1 && r.rating <= 5 && typeof r.name === 'string').slice(0,100);
let agreed = readStore('agreed', []);
agreed = new Set(Array.isArray(agreed) ? agreed : []);
const state = {view:'discover',browse:'windows',canteen:'全部食堂',chips:new Set(),query:'',sort:'recommended',budget:30,maxWait:30,taste:'不限',limit:6,mapCanteen:1};
const chipDefinitions = [{key:'new',label:'今日上新',emoji:'✦'},{key:'budget',label:'15 元吃饱',emoji:'¥'},{key:'mild',label:'不吃辣',emoji:'♧'},{key:'quick',label:'10 分钟内',emoji:'◷'}];
const getDish = id => DATA.dishes.find(d => d.id === Number(id));
function dishStats(d) {
  const extra = userReviews.filter(r => r.dishId === d.id);
  return {rating:((d.rating*d.reviews+extra.reduce((s,r)=>s+r.rating,0))/(d.reviews+extra.length)).toFixed(1),reviews:d.reviews+extra.length};
}
function filteredDishes() {
  return DATA.dishes.filter(d => {
    if (state.view === 'saved' && !saved.has(d.id)) return false;
    if (state.canteen !== '全部食堂' && d.canteen !== state.canteen) return false;
    if (state.query && ![d.name,d.canteen,d.window,d.description,DATA.windows.find(w=>w.dishIds.includes(d.id))?.name,...d.tags].join(' ').toLowerCase().includes(state.query.toLowerCase())) return false;
    if (state.chips.has('new') && !d.isNew) return false;
    if (state.chips.has('budget') && d.price > 15) return false;
    if (state.chips.has('mild') && d.flavor !== '不辣') return false;
    if (state.chips.has('quick') && d.wait > 10) return false;
    if (d.price > state.budget || d.wait > state.maxWait) return false;
    if (state.taste === '不辣' && d.flavor !== '不辣') return false;
    if (state.taste === '素食' && !d.tags.includes('素食')) return false;
    return true;
  }).sort((a,b) => {
    if (state.sort === 'price') return a.price-b.price;
    if (state.sort === 'wait') return a.wait-b.wait;
    if (state.sort === 'rating') return Number(dishStats(b).rating)-Number(dishStats(a).rating);
    return Number(b.available)-Number(a.available) || Number(b.rating >= 4.5)-Number(a.rating >= 4.5) || a.id-b.id;
  });
}
function dishCard(d) {
 const stats=dishStats(d), isSaved=saved.has(d.id);
 return `<article class="dish-card"><button class="card-image-button" data-action="detail" data-id="${d.id}" aria-label="查看${esc(d.name)}详情"><img src="${d.image}" alt="${esc(d.name)}，菜品示意图" loading="lazy"><span class="image-badge ${d.isNew?'new':''}">${!d.available?'本餐已售罄':d.isNew?'✦ 今日上新':d.rating>=4.7?'同学力荐':'校园好味'}</span></button><button class="save-button ${isSaved?'saved':''}" data-action="save" data-id="${d.id}" aria-label="${isSaved?'取消收藏':'收藏'}${esc(d.name)}" aria-pressed="${isSaved}">${icon('heart')}</button><div class="card-body"><div class="card-heading"><button class="card-title" data-action="detail" data-id="${d.id}">${esc(d.name)}</button><span class="card-rating">★ ${stats.rating}</span></div><div class="card-location">${icon('pin')}${esc(d.canteen)} · ${esc(d.floor)} · ${esc(d.window.replace(' 号窗口','号'))}</div><div class="card-tags">${d.tags.filter(t=>t!=='今日上新').slice(0,2).map((t,i)=>`<span class="tag ${i===1?'warm':''}">${esc(t)}</span>`).join('')}<span class="tag">${stats.reviews} 条点评</span></div><div class="card-meta"><div class="price"><small>¥</small>${d.price}</div><span class="queue">${icon('clock')}${d.available?`约等 ${d.wait} 分钟`:'收藏下次吃'}</span></div><div class="card-quote"><span class="quote-avatar">${esc(d.reviewItems[0].avatar)}</span><span>“${esc(d.reviewItems[0].text)}”</span></div></div></article>`;
}
function windowCard(w, dishes) {
 const allDishes=w.dishIds.map(getDish);
 const score=(allDishes.reduce((sum,d)=>sum+Number(dishStats(d).rating),0)/allDishes.length).toFixed(1);
 const preview=dishes.slice(0,3);
 const wait=Math.min(...dishes.filter(d=>d.available).map(d=>d.wait));
 return `<article class="window-card"><div class="window-top"><button class="window-avatar" data-action="window-detail" data-id="${w.id}" aria-label="查看${esc(w.name)}窗口">${icon('bowl')}</button><div class="window-info"><h3><button data-action="window-detail" data-id="${w.id}" style="font:inherit;padding:0;text-align:left">${esc(w.name)}</button></h3><div class="window-location">${esc(w.canteen)} · ${esc(w.floor)} · ${esc(w.window)}</div></div><span class="window-rating">★ ${score}</span></div><p class="window-description">${esc(w.description)}</p><div class="window-menu count-${preview.length}">${preview.map(d=>`<button class="window-dish" data-action="detail" data-id="${d.id}" aria-label="查看${esc(d.name)}详情"><img src="${d.image}" alt="${esc(d.name)}，菜品示意" loading="lazy"><div><strong>${esc(d.name)}</strong><div class="window-dish-meta"><span class="price"><small>¥</small>${d.price}</span><span class="sold-label">${!d.available?'本餐售罄':d.isNew?'今日上新':'★ '+dishStats(d).rating}</span></div></div></button>`).join('')}</div><div class="window-bottom"><span>${icon('clock')}${Number.isFinite(wait)?`出餐约 ${wait} 分钟起`:'本餐菜品已售罄'} · ${dishes.length} 道菜</span><button data-action="window-detail" data-id="${w.id}">了解这个窗口 →</button></div></article>`;
}
function renderWindows(list) {
 const matched=DATA.windows.map(w=>({w,dishes:list.filter(d=>w.dishIds.includes(d.id))})).filter(x=>x.dishes.length).sort((a,b)=>list.indexOf(a.dishes[0])-list.indexOf(b.dishes[0]));
 const hasFilters=state.query||state.canteen!=='全部食堂'||state.chips.size||state.budget<30||state.maxWait<30||state.taste!=='不限';
 $('#resultsLabel').innerHTML=`找到 <strong>${matched.length}</strong> 个窗口，<strong>${list.length}</strong> 道${state.view==='saved'?'收藏':'好'}菜${hasFilters?'<button class="clear-link" data-action="clear">清空筛选</button>':''}`;
 $('#dishGrid').className='window-grid';
 $('#dishGrid').innerHTML=matched.length?matched.slice(0,state.limit).map(x=>windowCard(x.w,x.dishes)).join(''):`<div class="empty-state"><div class="empty-icon">⌕</div><h3>这个条件下，还没有找到好味道</h3><p>试试其他食堂，或者放宽一点预算。</p><button class="primary" data-action="clear">重置筛选</button></div>`;
 $('#loadMoreWrap').innerHTML=matched.length>state.limit?`<button class="load-more" data-action="more">再逛 ${matched.length-state.limit} 个窗口 ${icon('chevron')}</button>`:matched.length?'<span style="font-size:11px;color:#a39478">好吃不分食堂，慢慢发现你的那一口。</span>':'';
}
function windowDetail(id) {
 const w=DATA.windows.find(w=>w.id===id);if(!w)return;
 const dishes=w.dishIds.map(getDish);
 const total=dishes.reduce((s,d)=>s+dishStats(d).reviews,0);
 openModal(`<div class="modal-padding"><div class="modal-eyebrow">A GOOD WINDOW FOR YOUR NEXT MEAL</div><h2 id="dialogTitle">${esc(w.name)}</h2><p class="modal-sub">${esc(w.canteen)} · ${esc(w.floor)} · ${esc(w.window)}</p><p class="detail-desc">${esc(w.description)}</p><div class="detail-stats"><div><strong>${dishes.length}</strong><small>道招牌好菜</small></div><div><strong>${total}</strong><small>条菜品点评</small></div><div><strong>¥${Math.min(...dishes.map(d=>d.price))}起</strong><small>本窗口价格</small></div></div><div class="window-menu count-${Math.min(dishes.length,3)}">${dishes.map(d=>`<button class="window-dish" data-action="detail" data-id="${d.id}"><img src="${d.image}" alt="${esc(d.name)}菜品示意"><div><strong>${esc(d.name)}</strong><div class="window-dish-meta"><span class="price"><small>¥</small>${d.price}</span><span class="sold-label">${d.available?'★ '+dishStats(d).rating:'本餐售罄'}</span></div></div></button>`).join('')}</div><button class="primary full-width" style="margin-top:25px" data-action="locate" data-id="${dishes[0].id}">${icon('map')}去找这个窗口</button><p class="privacy-note">点菜品看具体评价。以上信息为演示数据，非现场实时状态。</p></div>`);
}
function renderBrowseSwitch() { $('#browseSwitch').innerHTML=[['windows','逛窗口','bowl'],['dishes','找菜品','compass']].map(([key,label,i])=>`<button data-action="browse" data-value="${key}" class="${state.browse===key?'active':''}" aria-pressed="${state.browse===key}">${icon(i)}${label}</button>`).join(''); }
function renderControls() {
 renderBrowseSwitch();
 $('#canteenTabs').innerHTML = ['全部食堂',...DATA.canteens.map(c=>c.name)].map((name,i)=>`<button data-action="canteen" data-value="${name}" class="${state.canteen===name?'active':''}" aria-pressed="${state.canteen===name}">${i===0?'<span>▦</span>':''}${name}</button>`).join('');
 $('#quickFilters').innerHTML = chipDefinitions.map(c=>`<button data-action="chip" data-value="${c.key}" class="${state.chips.has(c.key)?'active':''}" aria-pressed="${state.chips.has(c.key)}"><span>${c.emoji}</span>${c.label}</button>`).join('');
 const count=Number(state.budget<30)+Number(state.maxWait<30)+Number(state.taste!=='不限');
 $('#filterCount').textContent = count ? ` ${count}` : '';
}
function renderDishes() {
 renderBrowseSwitch();
 const list = filteredDishes();
 if(state.browse==='windows'){renderWindows(list);return;}
 $('#dishGrid').className='dish-grid';
 const hasFilters = state.canteen!=='全部食堂' || state.chips.size || state.query || state.budget<30 || state.maxWait<30 || state.taste!=='不限';
 $('#resultsLabel').innerHTML = `找到 <strong>${list.length}</strong> 道${state.view==='saved'?'收藏好菜':'校园好味'}${hasFilters?'<button class="clear-link" data-action="clear">清空筛选</button>':' · 同学点评，帮你做选择'}`;
 $('#dishGrid').innerHTML = list.length ? list.slice(0,state.limit).map(dishCard).join('') : `<div class="empty-state"><div class="empty-icon">${state.view==='saved'?'♡':'⌕'}</div><h3>${state.view==='saved'&&!saved.size?'先把好吃的，装进口袋。':'暂时没找到这道好味道'}</h3><p>${state.view==='saved'&&!saved.size?'点击菜品右上角的爱心，下次吃饭就有灵感。':'试试减少筛选条件，或换个关键词。'}</p><button class="primary" data-action="${state.view==='saved'&&!saved.size?'discover':'clear'}">${state.view==='saved'&&!saved.size?'去发现好菜':'重置筛选'}</button></div>`;
 $('#loadMoreWrap').innerHTML = list.length>state.limit?`<button class="load-more" data-action="more">再发现 ${Math.min(6,list.length-state.limit)} 道好菜 ${icon('chevron')}</button>`:list.length?'<span style="font-size:10px;color:#8d867b">每一顿的小确幸，都藏在食堂里。</span>':'';
}
function renderSidebar() {
 const top=[...DATA.dishes].sort((a,b)=>b.reviews-a.reviews).slice(0,3);
 $('#sidebar').innerHTML=`<section class="sidebar-card"><div class="side-title"><span>${icon('radar')}避雷情报站</span><button data-action="radar">全部 ↗</button></div><p class="side-desc">先看一眼，少走一点弯路。</p>${DATA.alerts.slice(0,2).map(a=>`<button class="alert-mini" data-action="detail" data-id="${a.dishId}"><span class="alert-type">${esc(a.type)}</span><strong>${esc(a.title)}</strong><small>${esc(getDish(a.dishId).canteen)} · ${a.agrees+Number(agreed.has(a.id))} 人觉得有帮助</small></button>`).join('')}<div class="mini-bottom">口味因人而异，请结合近期点评判断</div></section><section class="sidebar-card ranking-card"><div class="side-title"><span>${icon('trophy')}同学人气榜</span><button data-action="ranking">看看 ↗</button></div><p class="side-desc">大家都在聊的食堂好味道。</p><div class="ranking-list">${top.map((d,i)=>`<button class="ranking-row" data-action="detail" data-id="${d.id}"><span class="ranking-num">0${i+1}</span><img src="${d.image}" alt="" loading="lazy"><span><strong>${esc(d.name)}</strong><small>${esc(d.canteen)} · ¥${d.price}</small></span><span class="ranking-score">${d.rating}</span></button>`).join('')}</div></section><div class="little-note">好吃没有标准答案<br>你的口味，才是最好的指南。</div>`;
}
function render() {
 const view=state.view;
 $$('[data-nav]').forEach(a=>{a.classList.toggle('active',a.dataset.nav===view);if(a.dataset.nav===view)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
 $('#hero').hidden = view!=='discover';
 const titles={discover:['同学们都在吃什么？','从一道好菜，找到你喜欢的食堂窗口。'],saved:['我的干饭口袋。','先收藏，下一顿就不用再纠结。'],map:['好味道，就在这附近。','找到食堂，再找到属于你的那一口。'],radar:['踩过的雷，替你记着。','客观分享具体体验，让下一顿更有底。']};
 $('#pageTitle').textContent=titles[view][0];
 $('#pageSubtitle').innerHTML=`${titles[view][1]}<span class="muted">当前为演示内容</span>`;
 const isList=['discover','saved'].includes(view);
 $('#discoverControls').hidden=!isList;
 $('#contentLayout').hidden=!isList;
 $('#otherView').hidden=isList;
 $('.search-wrap').hidden=!isList;
 if(isList){renderControls();renderDishes();renderSidebar();} else if(view==='map')renderMap(); else renderRadar();
 hydrateIcons();
}
function navigate(view) {
 if(!['discover','map','radar','saved'].includes(view))view='discover';
 if(state.view!==view){state.canteen='全部食堂';state.chips.clear();state.query='';state.budget=30;state.maxWait=30;state.taste='不限';state.limit=6;$('#searchInput').value='';}
 state.view=view;if(view==='saved')state.browse='dishes';render();
}
function resetFilters() { Object.assign(state,{canteen:'全部食堂',query:'',budget:30,maxWait:30,taste:'不限',limit:6});state.chips.clear();$('#searchInput').value='';render(); }
function toast(message) { const inDialog=$('#appDialog').open, target=inDialog?$('#dialogToast'):$('#toast');target.textContent=message;if(inDialog)target.hidden=false;else target.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>{target.hidden=inDialog;target.classList.remove('visible');},3200); }
function openModal(html) { $('#dialogToast').hidden=true;$('#dialogContent').innerHTML=html;hydrateIcons($('#appDialog'));$('#appDialog').scrollTop=0;if(!$('#appDialog').open)$('#appDialog').showModal();document.body.style.overflow='hidden'; }
function closeModal(){ $('#appDialog').close();document.body.style.overflow=''; }
$('#appDialog').addEventListener('close',()=>document.body.style.overflow='');
$('#appDialog').addEventListener('click',e=>{if(e.target===$('#appDialog')){const b=$('#appDialog').getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeModal();}});
function detail(id) {
 const d=getDish(id);if(!d)return;const stats=dishStats(d);
 const reviews=[...userReviews.filter(r=>r.dishId===d.id).map(r=>({...r,avatar:r.name.slice(0,1),date:(Date.now()-r.createdAt<60000?'刚刚':new Date(r.createdAt).toLocaleDateString('zh-CN'))+' · 本机点评',tags:['我的点评']})).reverse(),...d.reviewItems];
 const alerts=DATA.alerts.filter(a=>a.dishId===d.id);
 openModal(`<img class="detail-image" src="${d.image}" alt="${esc(d.name)}菜品示意"><div class="detail-content"><div class="modal-eyebrow">${d.isNew?'NEW ON THE MENU':'A LITTLE TASTE OF CAMPUS'} · 菜品示意</div><div class="detail-title-row"><h2 id="dialogTitle">${esc(d.name)}</h2><span class="price"><small>¥</small>${d.price}</span></div><p class="detail-location">${icon('pin')}${esc(d.canteen)} · ${esc(d.floor)} · ${esc(d.window)}${DATA.windows?.find(w=>w.dishIds.includes(d.id))?' · '+esc(DATA.windows.find(w=>w.dishIds.includes(d.id)).name):''}</p><div class="review-tags">${d.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}${!d.available?'<span class="tag warm">本餐已售罄</span>':''}</div><div class="detail-stats"><div><strong>★ ${stats.rating}</strong><small>同学综合评分</small></div><div><strong>${stats.reviews}</strong><small>条菜品点评</small></div><div><strong>${d.available?d.wait+' min':'已售罄'}</strong><small>${d.available?'演示排队时长':'下次早点来'}</small></div></div><p class="detail-desc">${esc(d.description)}</p>${alerts.map(a=>`<div class="radar-intro" style="margin:15px 0">${icon('radar')}<span>${esc(a.title)}。${esc(a.time)} · ${a.agrees} 人觉得有帮助。</span></div>`).join('')}<div class="detail-buttons"><button class="primary" data-action="write" data-id="${d.id}">${icon('edit')}我吃过，写点评</button><button class="outline" data-action="save-detail" data-id="${d.id}" aria-pressed="${saved.has(d.id)}">${icon('heart')}${saved.has(d.id)?'已收藏':'收藏下次吃'}</button><button class="outline" data-action="locate" data-id="${d.id}">${icon('map')}找窗口</button></div><div class="detail-reviews-title">同学怎么说<small>${userReviews.filter(r=>r.dishId===d.id).length?'本机点评与演示点评':'以下为演示点评'}</small></div>${reviews.map(r=>`<div class="review-item"><div class="review-top"><span class="review-avatar">${esc(r.avatar)}</span><div><strong>${esc(r.name)}</strong><div class="stars" aria-label="${r.rating}分">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div></div><small>${esc(r.date)}</small></div><p>${esc(r.text)}</p><div class="review-tags">${r.tags.map(t=>`<span class="tag">${esc(t)}</span>`).join('')}</div></div>`).join('')}<p class="privacy-note">价格、评分与排队信息均为演示数据，非现场实时状态。</p></div>`);
}
function toggleSave(id,detailMode=false) {
 id=Number(id);saved.has(id)?saved.delete(id):saved.add(id);
 const persisted=writeStore('saved',[...saved]);
 if(['discover','saved'].includes(state.view))renderDishes();
 if(detailMode)detail(id);
 toast(persisted?(saved.has(id)?'已放进干饭口袋，下次就吃它':'已取消收藏'):'已更新收藏；当前浏览器无法保存，刷新后会重置');
}
function openReview(id) {
 openModal(`<div class="modal-padding"><div class="modal-eyebrow">YOUR VOICE MATTERS</div><h2 id="dialogTitle">这顿，吃得怎么样？</h2><p class="modal-sub">说说口味、分量和排队，帮同学吃得更明白。</p><form id="reviewForm"><div class="form-field"><label for="reviewDish">你吃了哪道菜？</label><select id="reviewDish" name="dishId" required><option value="">请选择菜品与窗口</option>${DATA.dishes.map(d=>`<option value="${d.id}" ${Number(id)===d.id?'selected':''}>${esc(d.name)} · ${esc(d.canteen)} ${esc(d.window)}</option>`).join('')}</select></div><div class="form-field"><span class="form-label" id="ratingLabel">给这一顿打个分</span><div class="rating-picker" role="radiogroup" aria-labelledby="ratingLabel">${[1,2,3,4,5].map(n=>`<label class="on"><input type="radio" name="rating" value="${n}" ${n===5?'checked':''} required aria-label="${n}分"><span aria-hidden="true">★</span></label>`).join('')}<small class="rating-text">超好吃</small></div></div><div class="form-field"><label for="reviewText">具体说说你的体验 <small style="color:#8d867b;font-weight:400">至少 8 个字</small></label><textarea id="reviewText" name="text" placeholder="比如：鸡肉给得很足，微辣偏甜，12点前基本不用排队…" required minlength="8" maxlength="500"></textarea></div><div class="form-field"><label for="reviewName">怎么称呼你？</label><input id="reviewName" name="name" placeholder="校园干饭人" maxlength="16" value="校园干饭人" required></div><button type="submit" class="primary full-width">${icon('check')}保存我的点评</button><p class="privacy-note">体验版：点评仅保存在当前浏览器，不会公开给其他访客。</p></form></div>`);
 $('#reviewForm').addEventListener('change',e=>{if(e.target.name==='rating'){const val=Number(e.target.value);$$('.rating-picker label').forEach((l,i)=>l.classList.toggle('on',i<val));$('.rating-text').textContent=['','不太推荐','有点失望','中规中矩','值得一试','超好吃'][val];}});
 $('#reviewForm').addEventListener('submit',e=>{
  e.preventDefault();const f=new FormData(e.currentTarget),text=String(f.get('text')).trim(),name=String(f.get('name')).trim(),dishId=Number(f.get('dishId')),rating=Number(f.get('rating'));
  if(!getDish(dishId)||!name||text.length<8||text.length>500||name.length>16||!Number.isInteger(rating)||rating<1||rating>5){toast('请选择菜品，并填写至少 8 个字的具体体验');return;}
  userReviews.push({dishId,rating,text,name,createdAt:Date.now()});userReviews=userReviews.slice(-100);const persisted=writeStore('reviews',userReviews);if(['discover','saved'].includes(state.view))renderDishes();detail(dishId);toast(persisted?'点评已保存，你的这一顿有了记录':'点评已添加；浏览器无法保存，刷新后会重置');
 });
}
function openFilters() {
 openModal(`<div class="modal-padding"><div class="modal-eyebrow">YOUR TASTE, YOUR CHOICE</div><h2 id="dialogTitle">这一顿，有什么要求？</h2><p class="modal-sub">和页面上的快捷条件叠加筛选，帮你缩小选择。</p><form id="filterForm"><div class="form-field"><label for="budgetFilter">最高预算</label><select name="budget" id="budgetFilter">${[10,15,20,30].map(n=>`<option value="${n}" ${state.budget===n?'selected':''}>${n===30?'不限（¥30 以内）':`¥${n} 以内`}</option>`).join('')}</select></div><div class="form-field"><label for="waitFilter">最多愿意等多久？</label><select name="maxWait" id="waitFilter">${[5,10,15,30].map(n=>`<option value="${n}" ${state.maxWait===n?'selected':''}>${n===30?'不限':`${n} 分钟以内`}</option>`).join('')}</select></div><div class="form-field"><span class="form-label">饮食偏好</span><div class="choice-grid">${['不限','不辣','素食'].map(t=>`<label><input type="radio" name="taste" value="${t}" ${state.taste===t?'checked':''}>${t}</label>`).join('')}</div></div><button class="primary full-width" type="submit">看看符合的好菜 ${icon('arrow')}</button></form></div>`);
 $('#filterForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);state.budget=Number(f.get('budget'));state.maxWait=Number(f.get('maxWait'));state.taste=String(f.get('taste'));state.limit=6;closeModal();render();});
}
let recPrefs={budget:20,taste:'不限',wait:15};let recLastId=null;
function openRecommendation(){
 openModal(`<div class="modal-padding"><div class="modal-eyebrow">LET'S PICK YOUR NEXT MEAL</div><h2 id="dialogTitle">纠结到此，开饭开始。</h2><p class="modal-sub">告诉饭点你的偏好，从符合条件的好评菜里选一顿。</p><form id="recommendForm"><div class="form-field"><span class="form-label">今天的干饭预算</span><div class="choice-grid">${[10,15,20,30].map(n=>`<label><input type="radio" name="budget" value="${n}" ${recPrefs.budget===n?'checked':''}>${n===30?'不设限':`¥${n} 内`}</label>`).join('')}</div></div><div class="form-field"><span class="form-label">今天想吃什么口味？</span><div class="choice-grid">${['不限','不辣','微辣','素食'].map(t=>`<label><input type="radio" name="taste" value="${t}" ${recPrefs.taste===t?'checked':''}>${t==='不限'?'都可以':t}</label>`).join('')}</div></div><div class="form-field"><span class="form-label">愿意为美味等多久？</span><div class="choice-grid">${[5,10,15,30].map(n=>`<label><input type="radio" name="wait" value="${n}" ${recPrefs.wait===n?'checked':''}>${n===30?'慢慢来':`${n} 分钟`}</label>`).join('')}</div></div><button type="submit" class="primary full-width">${icon('shuffle')}就按这个，帮我选！</button><p class="privacy-note">依据预算、口味和排队时间筛选，优先推荐评分 ≥ 4.5 的菜品。</p></form></div>`);
 $('#recommendForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.currentTarget);recPrefs={budget:Number(f.get('budget')),taste:String(f.get('taste')),wait:Number(f.get('wait'))};recLastId=null;recommendResult();});
}
function recommendationCandidates(prefs){
 return DATA.dishes.filter(d=>d.available&&d.price<=prefs.budget&&d.wait<=prefs.wait&&(prefs.taste==='不限'||prefs.taste==='素食'&&d.tags.includes('素食')||d.flavor===prefs.taste));
}
function recommendResult(){
 let candidates=recommendationCandidates(recPrefs),good=candidates.filter(d=>d.rating>=4.5);if(good.length)candidates=good;
 const alternatives=candidates.filter(d=>d.id!==recLastId);if(alternatives.length)candidates=alternatives;
 if(!candidates.length){openModal(`<div class="modal-padding recommend-result"><div class="modal-eyebrow">A LITTLE MORE ROOM FOR CHOICE</div><h2 id="dialogTitle">这次条件有点严格。</h2><p>¥${recPrefs.budget} 内 · ${esc(recPrefs.taste)} · 等待 ${recPrefs.wait} 分钟内<br>暂时没有同时符合的在售菜品。</p><div class="empty-icon" style="font-size:55px;margin:30px">⌕</div><button class="primary full-width" data-action="recommend">调整一下，再帮我选</button><p class="privacy-note">不会为了推荐，忽略你的饮食偏好。</p></div>`);return;}
 const d=candidates[Math.floor(Math.random()*candidates.length)];recLastId=d.id;
 openModal(`<div class="modal-padding recommend-result"><div class="modal-eyebrow">YOUR NEXT MEAL IS READY</div><h2 id="dialogTitle">这顿，就吃它。</h2><img src="${d.image}" alt="${esc(d.name)}菜品示意"><h3>${esc(d.name)}</h3><p>${esc(d.canteen)} · ${esc(d.floor)} · ${esc(d.window)}</p><div class="match-reason">¥${d.price}，在你的预算内 · ${esc(d.flavor)} · 约等 ${d.wait} 分钟<br>同学评分 ★ ${dishStats(d).rating}，${dishStats(d).reviews} 条点评可参考</div><div class="rec-actions"><button class="outline" data-action="${recommendationCandidates(recPrefs).filter(x=>x.rating>=4.5).length>1?'reroll':'recommend'}">${icon('shuffle')}${recommendationCandidates(recPrefs).filter(x=>x.rating>=4.5).length>1?'换个口味':'调整偏好'}</button><button class="primary" data-action="detail" data-id="${d.id}">看看同学点评 ${icon('arrow')}</button></div><button style="font-size:10px;color:#8d867b;margin-top:18px" data-action="recommend">重新设置偏好</button></div>`);
}
function renderMap(){
 $('#otherView').innerHTML=`<div class="map-layout"><div><div class="campus-map" aria-label="华江大学演示校园示意图"><div class="map-path p1"></div><div class="map-path p2"></div><div class="map-path p3"></div><div class="map-lake"></div><div class="map-building" style="top:9%;left:15%;height:60px;width:120px">主教学楼</div><div class="map-building" style="top:45%;left:67%;height:50px;width:110px">图书馆</div><div class="map-building" style="top:68%;left:5%;height:90px;width:80px;border-radius:50%">运动场</div><div class="map-building" style="top:82%;left:58%;height:50px;width:100px">学生宿舍</div>${DATA.canteens.map(c=>`<button class="map-marker ${state.mapCanteen===c.id?'active':''}" style="left:${c.mapX}%;top:${c.mapY}%" data-action="map-select" data-id="${c.id}" aria-pressed="${state.mapCanteen===c.id}">${icon('bowl')}${esc(c.name)}</button>`).join('')}<span class="map-label">HUAJIANG UNIVERSITY · 示意图，非导航地图</span></div><div class="map-legend">点击食堂查看位置与详情 · 步行时间以校园建筑为起点，仅为演示</div></div><div class="canteen-list">${DATA.canteens.map(c=>`<article class="canteen-item ${state.mapCanteen===c.id?'active':''}" data-action="map-select" data-id="${c.id}"><h3>${esc(c.name)}<small>${c.windowCount} 个窗口</small></h3><p>${esc(c.subtitle)} · ${esc(c.distance)}</p>${state.mapCanteen===c.id?`<p>${esc(c.description)}</p><p style="font-size:10px;line-height:1.8">营业时段：${esc(c.hours)}</p>`:''}<div class="canteen-detail"><span>${DATA.dishes.filter(d=>d.canteen===c.name).length} 道菜等你发现</span><button data-action="map-dishes" data-value="${esc(c.name)}">去看看好菜 →</button></div></article>`).join('')}</div></div>`;
}
function renderRadar(){
 $('#otherView').innerHTML=`<div class="radar-intro">${icon('radar')}<span>避雷 ≠ 差评。这里记录具体时间、窗口和体验，帮你根据自己的口味做判断。以下为演示情报。</span></div><div class="alert-grid">${DATA.alerts.map(a=>`<article class="alert-card"><span class="alert-type">${esc(a.type)}</span><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p><small>${esc(a.time)} · 关联具体菜品点评</small><div class="alert-actions"><button data-action="agree" data-id="${a.id}" aria-pressed="${agreed.has(a.id)}" class="${agreed.has(a.id)?'active':''}">${icon('thumb')}有帮助 ${a.agrees+Number(agreed.has(a.id))}</button><button data-action="detail" data-id="${a.dishId}">看完整点评 ${icon('arrow')}</button></div><button class="alert-reply" data-action="write" data-id="${a.dishId}">体验不同？补充我的点评 ↗</button></article>`).join('')}</div><p class="map-legend">每个人的口味都不同；点评是个人体验，餐品状态请以窗口现场为准。</p>`;
}
async function showAbout(){
 openModal(`<div class="modal-padding text-page"><div class="modal-eyebrow">A BETTER CAMPUS MEAL</div><h2 id="dialogTitle">关于饭点</h2><p>为每天纠结“食堂吃什么”的同学，做一份离餐盘更近的吃饭指南。参考校园食堂按窗口逛的习惯，以窗口聚合招牌菜，同时把点评落到具体菜品。价格、口味、分量和排队信息放在同一个地方。</p><h3>从发现，到放心开饭</h3><p>发现好菜 → 按预算和口味筛选 → 阅读菜品点评 → 查看食堂位置。懒得选时，让“一键选饭”在你的条件内给出推荐；踩过的雷，用具体体验分享。</p><h3>演示数据与隐私</h3><p>华江大学为虚构校园。菜品、价格、评分、点评、排队时长、营业时间与情报均为产品演示数据，不代表真实商家或实时状态。选饭功能按条件筛选并随机推荐，没有连接在线 AI。收藏、点评和“有帮助”仅保存在当前浏览器，不会共享给其他用户，清理浏览器数据会重置。</p><h3>图片来源与许可</h3><p>图片来自 Wikimedia Commons，为菜品示意，页面使用缩略图并通过 CSS 适配裁切。照片保留其原有开放许可；点击作品和许可查看详情。</p><div id="creditsList"><p>正在读取图片署名…</p></div></div>`);
 try { const response=await fetch('assets/credits.json');if(!response.ok)throw Error('credits');const credits=await response.json();const target=$('#creditsList');if(target)target.innerHTML=credits.map(c=>`<p class="credit-links"><a href="${esc(c.source)}" target="_blank" rel="noopener noreferrer">${esc(c.title)}</a><br>${esc(c.author)} · <a href="${esc(c.licenseUrl)}" target="_blank" rel="noopener noreferrer">${esc(c.license)}</a></p>`).join(''); }
 catch { const target=$('#creditsList');if(target)target.innerHTML='<a href="assets/credits.json" target="_blank" style="text-decoration:underline">查看完整图片署名文件</a>'; }
}
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-action]');if(!el)return;
 const {action,id,value}=el.dataset;
 if(action==='close')closeModal();
 else if(action==='detail')detail(id);
 else if(action==='save'||action==='save-detail')toggleSave(id,action==='save-detail');
 else if(action==='write')openReview(id);
 else if(action==='recommend')openRecommendation();
 else if(action==='reroll')recommendResult();
 else if(action==='filters')openFilters();
 else if(action==='browse'){state.browse=value;state.limit=6;renderDishes();}
 else if(action==='browse-windows'){state.browse='windows';state.limit=6;if(state.view!=='discover')navigate('discover');else renderDishes();$('#explore').scrollIntoView({behavior:'smooth'});}
 else if(action==='window-detail')windowDetail(id);
 else if(action==='clear')resetFilters();
 else if(action==='canteen'){state.canteen=value;state.limit=6;render();}
 else if(action==='chip'){state.chips.has(value)?state.chips.delete(value):state.chips.add(value);state.limit=6;render();}
 else if(action==='more'){state.limit+=6;renderDishes();}
 else if(action==='radar'||action==='discover'){closeModal();location.hash=action;}
 else if(action==='ranking'){openModal(`<div class="modal-padding"><div class="modal-eyebrow">THE CAMPUS FAVORITES</div><h2 id="dialogTitle">同学人气榜</h2><p class="modal-sub">演示榜单，按点评量排列。看点评，也记得看口味。</p>${[...DATA.dishes].sort((a,b)=>b.reviews-a.reviews).slice(0,5).map((d,i)=>`<button class="ranking-row" style="padding:15px 0;border-bottom:1px solid var(--line)" data-action="detail" data-id="${d.id}"><span class="ranking-num">0${i+1}</span><img src="${d.image}" alt=""><span><strong style="font-size:13px">${esc(d.name)}</strong><small style="font-size:10px">${esc(d.canteen)} · ${d.reviews} 条点评 · ¥${d.price}</small></span><span class="ranking-score">★ ${d.rating}</span></button>`).join('')}</div>`);}
 else if(action==='map-select'){state.mapCanteen=Number(id);renderMap();}
 else if(action==='map-dishes'){navigate('discover');state.canteen=value;state.limit=12;history.replaceState(null,'','#discover');render();$('#explore').scrollIntoView({behavior:'smooth'});}
 else if(action==='locate'){const d=getDish(id);closeModal();navigate('map');state.mapCanteen=DATA.canteens.find(c=>c.name===d.canteen).id;history.replaceState(null,'','#map');render();$('#explore').scrollIntoView({behavior:'smooth'});}
 else if(action==='agree'){const n=Number(id);agreed.has(n)?agreed.delete(n):agreed.add(n);const ok=writeStore('agreed',[...agreed]);renderRadar();if(!ok)toast('本次已记录，浏览器无法持久保存');}
});
$('#searchInput').addEventListener('input',e=>{state.query=e.target.value.trim();state.limit=6;renderDishes();});
$('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;state.limit=6;renderDishes();});
$('#campusButton').addEventListener('click',()=>openModal(`<div class="modal-padding text-page"><div class="modal-eyebrow">YOUR CAMPUS, YOUR FOOD GUIDE</div><h2 id="dialogTitle">华江大学 · 主校区</h2><p>这里是饭点的演示校园，你可以自由探索 4 个食堂、8 个窗口、15 道菜品。无需注册，所有核心流程均可体验。</p><p>食堂与菜品信息为虚构数据，地图为示意图。</p><button class="primary full-width" data-action="close">开始干饭 ${icon('arrow')}</button></div>`));
$('#aboutButton').addEventListener('click',showAbout);
window.addEventListener('hashchange',()=>{navigate(location.hash.slice(1));if(state.view!=='discover')$('#explore').scrollIntoView({behavior:'smooth'});});
document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#appDialog').open){e.preventDefault();if(['discover','saved'].includes(state.view))$('#searchInput').focus();}});
navigate(location.hash.slice(1));
