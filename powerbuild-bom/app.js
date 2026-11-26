/* PowerBuild materials planner */
(() => {
  'use strict';
  const branches = ["PowerBuild Chamdor", "PowerBuild Randfontein", "PowerBuild Kagiso Mall", "PowerBuild Krugersdorp", "PowerBuild Sungate", "PowerBuild Azaadville", "PowerBuild Lanseria", "PowerBuild Munsiville", "PowerBuild Mohlakeng", "PowerBuild Midway", "PowerBuild Carletonville", "PowerBuild Jackal Creek", "PowerBuild Cosmo City", "PowerBuild Roodeport"];
  const P = window.PowerBuildPlanner;
  const $ = id => document.getElementById(id);
  const groups = ['DIY', 'Structures', 'House plans'];
  const groupsBySlug = { diy: 'DIY', structures: 'Structures', 'house-plans': 'House plans' };
  const savedKey = 'powerbuildMaterialsList.v1';
  const transferKey = 'powerbuildMaterialsTransfer.v1';
  const esc = input => String(input ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const link = id => '#template/' + id;
  let active = null, currentResult = null, group = 'All', quoteCleanup, lastFocus;
  let project = [];
  let storageOK = true;
  try {
    const raw = JSON.parse(localStorage.getItem(savedKey) || '[]');
    if (Array.isArray(raw)) project = raw.filter(validEntry);
  } catch { /* A restricted browser can still use a list within this visit. */ }
  function validEntry(e) {
    return e && typeof e.id === 'string' && typeof e.title === 'string' && typeof e.text === 'string' && (!e.rows || Array.isArray(e.rows));
  }
  function announce(message) { $('status').textContent = message; }
  function persist() {
    try { localStorage.setItem(savedKey, JSON.stringify(project)); }
    catch { storageOK = false; }
    $('saved-count').textContent = project.length;
  }
  function key() { return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(36).slice(2); }
  function addEntry(e) {
    project.push({ ...e, id: key() });
    persist();
    announce(storageOK ? 'Added to your project list.' : 'Added for this visit. Storage is unavailable in this browser.');
  }
  // The drawing is a generic schematic for browsing the size options.
  function planArt(t, context = 'card') {
    const index = [40,60,80,100,110].indexOf(t.size);
    const x = 55 - 5 * index, y = 17, w = 149 + 10 * index, h = 66 + 3 * index;
    const right = x+w, bottom = y+h, split = x+Math.round(w*.47), split2 = y+Math.round(h*(index%2 ? .44 : .51));
    const grid = 'grid-' + context + '-' + t.size;
    const extra = index > 0 ? '<path d="M'+(split+Math.round((right-split)*.52))+' '+y+'v'+(split2-y-8)+'"/>' : '';
    const walls = '<path d="M'+(split-12)+' '+bottom+'H'+x+'V'+y+'H'+right+'V'+bottom+'H'+(split+2)+' M'+split+' '+y+'V'+(split2-4)+'m0 11v'+(bottom-split2-7)+' M'+split+' '+split2+'H'+(right-20)+'m12 0h8"/>'+extra;
    const furniture='<g stroke="#8dabae" stroke-width=".85" fill="#e6eeeb"><rect x="'+(x+7)+'" y="'+(y+7)+'" width="23" height="13" rx="1"/><path d="M'+(x+9)+' '+(y+10)+'h18m-18 3h18"/><rect x="'+(x+13)+'" y="'+(bottom-22)+'" width="28" height="11" rx="1"/><rect x="'+(right-28)+'" y="'+(bottom-22)+'" width="20" height="15" rx="1"/><path d="M'+(right-28)+' '+(bottom-16)+'h20"/></g>';
    return '<svg class="plan-art" viewBox="0 0 260 118" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false"><defs><pattern id="'+grid+'" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M7 0H0V7" fill="none" stroke="#aec2c2" stroke-width=".4"/></pattern></defs><rect width="260" height="118" fill="#e9efec"/><rect width="260" height="118" fill="url(#'+grid+')"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" fill="#f6f8f2"/>'+furniture+'<g fill="none" stroke="#30505c" stroke-width="2.8" stroke-linejoin="miter">'+walls+'</g><g stroke="#82a4a8" stroke-width=".9" fill="none"><path d="M'+(split-12)+' '+bottom+'v-14a14 14 0 0 1 14 14M'+(right-20)+' '+split2+'v-12a12 12 0 0 1 12 12"/><path d="M'+x+' '+(bottom+9)+'h'+w+'m-'+w+' -3v6m'+w+' -6v6M'+(right+8)+' '+y+'v'+h+'m-3 -'+h+'h6m-6 '+h+'h6"/></g><path d="M'+(x+12)+' '+y+'h25m18 0h12M'+right+' '+(bottom-25)+'v15" stroke="#88b8ca" stroke-width="3"/></svg>';
  }
  function artwork(t) {
    if (t.kind === 'plan') return planArt(t);
    return '<span class="photo" style="--px:'+((t.photo%3)*50)+'%;--py:'+(Math.floor(t.photo/3)*50)+'%" aria-hidden="true"></span>';
  }
  function card(t) {
    const fee = t.kind === 'plan' ? P.planFee(t) : 'Free template';
    return '<a class="card" href="'+link(t.id)+'" aria-label="'+esc(t.name+', '+fee)+'"><div class="thumb">'+artwork(t)+'</div><div class="card-main"><h3>'+esc(t.name)+'</h3><p>'+esc(t.description)+'</p></div><div class="card-foot"><span>'+fee+'</span><span>'+(t.kind==='plan' ? 'View plan' : 'Open template')+' ↗</span></div></a>';
  }
  function catalogue() {
    $('cards').innerHTML = groups.filter(g=>group==='All'||g===group).map(g=>'<section class="group"><div class="topic-head"><h3>'+g+'</h3></div><div class="cards">'+P.all.filter(t=>t.group===g).map(card).join('')+'</div></section>').join('');
    document.querySelectorAll('[data-group]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.group===group)));
  }
  function fieldMarkup(f) {
    const id='f-'+f.key;
    return '<label class="field" for="'+id+'">'+esc(f.label)+'<span class="input-shell"><input id="'+id+'" name="'+f.key+'" type="number" inputmode="'+(f.step===1?'numeric':'decimal')+'" min="'+f.min+'" max="'+f.max+'" step="'+f.step+'" value="'+esc(f.initial)+'" '+(f.optional?'':'required')+'><span class="unit">'+esc(f.unit)+'</span></span></label>';
  }
  function table(rows) {
    return '<table class="values"><thead><tr><th scope="col">Material</th><th scope="col">With allowance</th><th scope="col">Order quantity</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.label)+'</td><td>'+esc(P.fmt(r.allowed)+' '+r.unit)+'</td><td>'+esc(r.order)+'</td></tr>').join('')+'</tbody></table>';
  }
  function calcNotes(result) { return '<div class="fine"><ul>'+result.notes.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul></div>'; }
  function resultText(r) { return [r.title, r.areaLabel+': '+P.fmt(r.net)+' m² · extra '+P.fmt(r.waste)+'%', ...r.rows.map(l=>l.label+' — '+l.order+' ('+P.fmt(l.allowed)+' '+l.unit+' incl. allowance)'), ...r.notes].join('\n'); }
  function summaryEmpty() {
    currentResult=null;
    $('estimate-panel').innerHTML='<h2>Your estimate</h2><p class="help">Enter your measurements and select Calculate materials to see your order quantities.</p>';
  }
  function inputData(form) { return Object.fromEntries(new FormData(form).entries()); }
  function renderCalculator(t) {
    const dims=P.fields(t,'dimensions');
    $('detail').innerHTML='<a class="back" href="#templates">← All templates</a><div class="overline">'+esc(t.group)+' / Free template</div><h1 tabindex="-1">'+esc(t.name)+'</h1><p class="lead">'+esc(t.description)+'</p><div class="detail-layout"><form id="calc-form" class="panel"><h2>Project measurements</h2>'+(t.kind==='garage'?'':'<fieldset class="toggle"><legend class="sr">How will you enter measurements?</legend><label><input type="radio" name="mode" value="dimensions" checked> Dimensions</label><label><input type="radio" name="mode" value="area"> Total area (m²)</label></fieldset>')+'<p class="help">'+(t.kind==='garage'?'Use outside wall dimensions and the roof area from your drawing. Concrete volumes require the slab thicknesses specified on that drawing.':t.roof?'Use the measured sloping roof surface. Measure separate slopes individually or enter the sum of their areas.':t.wall?'For several walls of equal height, add their lengths together. Enter openings once.':'Measure a rectangular section or enter its total area.')+'</p><div class="form-grid" id="dimensions">'+dims.dims.map(fieldMarkup).join('')+'</div><details '+(t.kind==='garage'?'open':'')+' id="specs"><summary>Product sizes and allowance</summary><p class="help">These are starting values. Adjust coverage and pack sizes to match your chosen products.</p><div class="form-grid">'+dims.packs.map(fieldMarkup).join('')+'</div></details><p role="alert" id="calc-error" class="error"></p><button type="submit" class="button navy">Calculate materials <span aria-hidden="true">→</span></button></form><section class="summary sticky" id="estimate-panel" aria-label="Your estimate"></section></div>';
    const form=$('calc-form'); summaryEmpty();
    let dimensionDraft={};
    form.addEventListener('change', e=>{
      if(e.target.name==='mode'){
        $('dimensions').querySelectorAll('input').forEach(el=>{ dimensionDraft[el.name]=el.value; });
        $('dimensions').innerHTML=P.fields(t,e.target.value).dims.map(fieldMarkup).join('');
        $('dimensions').querySelectorAll('input').forEach(el=>{if(el.name in dimensionDraft)el.value=dimensionDraft[el.name];});
      }
    });
    form.addEventListener('input',()=>{
      if(form.elements.primerCoats) {
        for(const name of ['primerSpread','primerTin']) {
          const input=form.elements[name]; input.disabled=form.elements.primerCoats.value==='0';
          input.closest('.field').hidden=input.disabled;
        }
      }
      $('calc-error').textContent=''; if(currentResult)summaryEmpty(); });
    form.addEventListener('invalid', e=>{if($('specs').contains(e.target)) $('specs').open=true;},true);
    form.addEventListener('submit',e=>{
      e.preventDefault();
      try {
        const input=inputData(form);
        const r=P.calculate(t,input.mode||'dimensions',input);
        currentResult=r;
        $('estimate-panel').innerHTML='<h2 tabindex="-1">Your estimate</h2><p class="help">'+r.areaLabel+' <strong>'+P.fmt(r.net)+' m²</strong> · Extra <strong>'+P.fmt(r.waste)+'%</strong></p>'+table(r.rows)+calcNotes(r)+'<details class="fine"><summary>Measurements used</summary><ul>'+r.inputs.map(s=>'<li>'+esc(s)+'</li>').join('')+'</ul></details><div class="actions"><button type="button" class="button navy" id="save-result">Add to my list +</button><button class="button outline" id="print-result" type="button">Print / PDF</button></div>';
        $('calc-error').textContent='';
        $('save-result').onclick=()=>{addEntry({title:r.title,text:resultText(r)+'\nMeasurements: '+r.inputs.join('; '),rows:r.rows,meta:r.areaLabel+' '+P.fmt(r.net)+' m² · '+r.waste+'% extra',type:projectType(t)}); location.hash='list';};
        $('print-result').onclick=()=>window.print();
        $('estimate-panel').querySelector('h2').focus({preventScroll:true});
        if(matchMedia('(max-width:880px)').matches) $('estimate-panel').scrollIntoView({block:'start'});
        announce('Estimate ready for '+P.fmt(r.net)+' square metres.');
      } catch(err) {summaryEmpty();$('calc-error').textContent=err.message;}
    });
  }
  function projectType(t) {
    if(t.kind==='plan') return 'Building a new house';
    if(t.roof) return 'Roofing';
    if(t.kind==='paint') return 'Painting';
    return t.kind==='garage' ? 'Other project' : 'Home renovation';
  }
  function renderPlan(t) {
    $('detail').innerHTML='<a href="#templates" class="back">← All templates</a><div class="overline">House plans</div><h1 tabindex="-1">'+esc(t.name)+'</h1><div class="detail-layout"><section class="panel"><h2>Plan overview</h2><div class="large-plan">'+planArt(t, 'detail')+'</div><p class="caption">Illustrative layout. Your branch will confirm the available drawings, room layout and package contents.</p></section><section class="summary"><h2>Plan fee range</h2><p class="fee">'+P.planFee(t)+'</p><p>Materials, delivery and construction are priced separately. Request the available options for this floor area from your branch.</p><div class="actions"><button class="button navy" id="plan-enquiry" type="button">Enquire about this plan →</button></div></section></div>';
    $('plan-enquiry').onclick=()=>{
      if(!project.some(e=>e.plan===t.id)) addEntry({plan:t.id,title:t.name,text:t.name+' — advertised plan fee '+P.planFee(t)+'. Please confirm plan availability, package contents and final price.',meta:'Plan fee '+P.planFee(t),type:projectType(t)});
      location.hash='list';
    };
  }
  function readTransfer() {
    let text='';
    try {text=sessionStorage.getItem(transferKey)||'';} catch {}
    if (!text && window.name.startsWith('{"powerbuildQuote":')) {
      try { const handoff=JSON.parse(window.name); window.name=''; if(handoff.origin===location.origin && typeof handoff.powerbuildQuote==='string')text=JSON.stringify({token:'catalogue-'+handoff.powerbuildQuote,text:handoff.powerbuildQuote}); } catch {}
    }
    if (!text) return;
    let data;
    try { data=JSON.parse(text); } catch { return; }
    if(typeof data.token!=='string'||typeof data.text!=='string'||!data.text.trim()||data.text.length>120000)return;
    if(!project.some(e=>e.transfer===data.token)) addEntry({title:'Catalogue quote list',meta:'Products selected in the catalogue',text:data.text,transfer:data.token,type:'General hardware'});
    try { sessionStorage.removeItem(transferKey); } catch {}
  }
  let branchChoice='',methodChoice='',extraNotes='';
  function branchOptions(){return '<option value="">Choose your branch</option>'+branches.map(b=>'<option value="'+esc(b)+'"'+(b===branchChoice?' selected':'')+'>'+esc(b)+'</option>').join('');}
  function renderList() {
    readTransfer();
    const box=$('list-view');
    const title='<a href="#templates" class="back">← All templates</a><div class="overline">Project planner</div><h1 tabindex="-1">My materials list</h1>';
    if(!project.length){box.innerHTML=title+'<div class="empty"><h2>Your list is empty</h2><p>Choose a template, calculate quantities and add the result here.</p><a href="#templates" class="button navy">Choose a template →</a></div>';return;}
    const rows=project.map((e,i)=>'<article class="saved-row"><div class="row-head"><h3>'+esc(e.title)+'</h3><button class="text-btn remove" type="button" data-remove="'+i+'" aria-label="Remove '+esc(e.title)+'">Remove</button></div><p class="help">'+esc(e.meta)+'</p>'+(e.rows?table(e.rows):'<p class="fine" style="white-space:pre-line">'+esc(e.text)+'</p>')+'</article>').join('');
    box.innerHTML=title+'<p class="lead" id="list-top-copy">Review your quantities and choose the branch you want a price from.</p><div class="detail-layout"><div><h2>Selected items</h2>'+rows+'<div class="actions"><a class="button outline" href="#templates">Add another template</a><button type="button" class="button outline" id="print-list">Print / PDF</button></div></div><form id="branch-form" class="summary"><h2>Request branch pricing</h2><div class="quote-fields"><label class="field">Preferred branch<select id="branch" required>'+branchOptions()+'</select></label><label class="field">Order method<select id="method" required><option value="">Choose delivery or collection</option><option>Collection</option><option>Delivery</option></select></label><label class="field">Project notes (optional)<textarea id="notes" maxlength="1200" placeholder="Site, preferred product or special requirements"></textarea></label></div><p class="help">Your list carries through to the existing quote form, where you can attach drawings and add your contact details.</p><div class="actions"><button class="button navy" type="submit">Continue to quotation →</button></div><p class="print-only" id="print-branch"></p></form></div>';
    $('method').value=methodChoice; $('notes').value=extraNotes;
    const update=()=>{branchChoice=$('branch').value;methodChoice=$('method').value;extraNotes=$('notes').value;$('print-branch').textContent=[branchChoice,methodChoice,extraNotes].filter(Boolean).join(' · ');};update();
    $('branch-form').addEventListener('input',update); $('print-list').onclick=()=>window.print();
    box.querySelectorAll('[data-remove]').forEach(button=>{button.onclick=()=>{const i=Number(button.dataset.remove);project.splice(i,1);persist();renderList();announce('Item removed.');box.querySelector('h1').focus();};});
    $('branch-form').onsubmit=e=>{e.preventDefault();update();openQuote();};
  }
  function quoteText(){return ['PowerBuild project quotation',branchChoice+' · '+methodChoice,'',...project.map((e,i)=>(i+1)+'. '+e.text+'\n'),extraNotes?'Project notes: '+extraNotes:''].filter((x,i)=>x!==''||i===2).join('\n').trim();}
  function openQuote(){
    const dialog=$('quote-dialog'),frame=$('quote-frame'),fallback=$('quote-fallback'),message=$('quote-progress'),manual=$('handoff-copy');
    lastFocus=document.activeElement;
    if(quoteCleanup)quoteCleanup();
    frame.hidden=true;manual.hidden=true;$('copy-handoff').hidden=true;manual.value=quoteText();message.textContent='Opening your quotation form…';
    const localPreview=location.protocol==='file:' || (document.documentElement.dataset.preview==='true');
    const url=localPreview?'https://maliks.co.za/project-quote.html':new URL('project-quote.html',location.href).href;
    fallback.href=url;
    if(dialog.showModal)dialog.showModal();else dialog.setAttribute('open','');
    const showFallback=()=>{message.textContent='Copy your list below, then open the full quotation form and paste it under project requirements.';manual.hidden=false;$('copy-handoff').hidden=false;};
    if(localPreview){showFallback();return;}
    let observer,timer,applied=false;
    const stopWaiting=()=>{clearTimeout(timer);if(observer)observer.disconnect();};
    const onLoad=()=>{
      if(applied)return;
      let doc;
      try{doc=frame.contentDocument;}catch{showFallback();return;}
      if(!doc){showFallback();return;}
      const fill=()=>{
        const items=doc.getElementById('pq-items'),branch=doc.getElementById('pq-branch'),method=doc.getElementById('pq-method'),type=doc.getElementById('pq-type');
        if(!items||!branch||!method||!type)return false;
        const kinds=new Set(project.map(e=>e.type));
        for(const [control,value] of [[branch,branchChoice],[method,methodChoice],[type,kinds.size===1?project[0].type:'Other project'],[items,manual.value]]){
          control.value=value;control.dispatchEvent(new Event('input',{bubbles:true}));control.dispatchEvent(new Event('change',{bubbles:true}));
        }
        applied=true;stopWaiting();manual.hidden=true;$('copy-handoff').hidden=true;frame.hidden=false;message.textContent='Your list and branch have been filled in. Add your contact details to send the request.';
        const close=doc.querySelector('[aria-label="Close quotation form"]');
        if(close)close.addEventListener('click',ev=>{ev.preventDefault();ev.stopImmediatePropagation();closeQuote();},true);
        return true;
      };
      if(!fill()){if(observer)observer.disconnect();observer=new MutationObserver(fill);observer.observe(doc.documentElement,{subtree:true,childList:true});}
    };
    frame.addEventListener('load',onLoad);
    timer=setTimeout(showFallback,6500);
    quoteCleanup=()=>{stopWaiting();frame.removeEventListener('load',onLoad);quoteCleanup=null;};
    frame.src=url;
  }
  function closeQuote(){const d=$('quote-dialog');if(d.close)d.close();else {d.removeAttribute('open');finishQuote();}}
  function finishQuote(){if(quoteCleanup)quoteCleanup();$('quote-frame').removeAttribute('src');$('quote-frame').hidden=true;if(lastFocus&&lastFocus.isConnected)lastFocus.focus();}
  $('copy-handoff').onclick=async()=>{
    const box=$('handoff-copy');
    try { await navigator.clipboard.writeText(box.value); $('quote-progress').textContent='Materials list copied. Paste it into the full quotation form.'; }
    catch { box.focus();box.select();$('quote-progress').textContent='Your list is selected. Use Copy, then paste it into the full quotation form.'; }
  };
  $('close-dialog').onclick=closeQuote;$('quote-dialog').addEventListener('close',finishQuote);
  document.querySelectorAll('[data-group]').forEach(b=>{b.onclick=()=>{const g=b.dataset.group;const slug=Object.keys(groupsBySlug).find(k=>groupsBySlug[k]===g);location.hash=slug?'group/'+slug:'templates';};});
  function route(initial){
    const h=location.hash.slice(1);
    active=h.startsWith('template/')?P.all.find(t=>t.id===h.slice(9)):null;
    const isList=h==='list'||h==='quote';
    if(h==='bricks'){active={id:'bricks',name:'Building bricks and blocks',group:'DIY',kind:'enquiry'};}
    const browsing=!active&&!isList;
    $('intro').hidden=!browsing;$('templates').hidden=!browsing;$('detail').hidden=!active;$('list-view').hidden=!isList;
    currentResult=null;
    if(active){
      if(active.kind==='plan')renderPlan(active);
      else if(active.kind==='enquiry')renderBrickEnquiry();
      else renderCalculator(active);
    }else if(isList)renderList();
    else {group=h.startsWith('group/')?(groupsBySlug[h.slice(6)]||'All'):'All';catalogue();}
    document.title=(active?active.name:isList?'My materials list':'Bill of Materials')+' | PowerBuild';
    if(!initial||h){
      if(browsing&&(h==='templates'||h.startsWith('group/'))){
        if(!h.startsWith('group/')||initial){$('templates').scrollIntoView();$('browse-title').focus({preventScroll:true});}
      }else{window.scrollTo(0,0);const heading=document.querySelector('#'+(isList?'list-view':'detail')+' h1');if(heading)heading.focus({preventScroll:true});}
    }
  }
  function renderBrickEnquiry(){
    $('detail').innerHTML='<a class="back" href="./#catalogue">← Shop catalogue</a><div class="overline">Building materials</div><h1 tabindex="-1">Building bricks and blocks</h1><p class="lead">Tell your branch the type and quantity you need. They will confirm sizes, stock, delivery and price.</p><form id="brick-form" class="panel" style="margin-top:18px;max-width:570px"><div class="quote-fields"><label class="field">Material<select name="product" required><option value="">Select material</option><option>Clay stock bricks</option><option>Maxi bricks</option><option>Concrete blocks</option><option>Face bricks</option><option>Other bricks or blocks</option></select></label><label class="field">Quantity<input name="qty" type="number" required min="1" max="10000000" step="1"></label><label class="field">Unit<select name="unit"><option>individual units</option><option>pallets</option></select></label><label class="field">Size or specification (optional)<input name="spec" maxlength="180"></label></div><button class="button navy" type="submit">Add to my list +</button></form>';
    $('brick-form').onsubmit=e=>{e.preventDefault();const v=inputData(e.target);addEntry({title:v.product,meta:v.qty+' '+v.unit,text:v.product+' — '+v.qty+' '+v.unit+(v.spec?' · '+v.spec:'')+'. Please confirm availability and price.',type:'General hardware'});location.hash='list';};
  }
  window.addEventListener('storage',e=>{if(e.key!==savedKey)return;try{const incoming=JSON.parse(e.newValue||'[]');if(!Array.isArray(incoming))return;project=incoming.filter(validEntry);$('saved-count').textContent=project.length;if(!$('list-view').hidden&&!$('quote-dialog').open)renderList();}catch{}});
  $('saved-count').textContent=project.length;window.addEventListener('hashchange',()=>route(false));route(true);
})();
