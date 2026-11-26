/* Add the project planner to the existing storefront without replacing its catalogue. */
(() => {
  'use strict';
  const target='bill-of-materials.html', scriptKey='pb-materials-entry';
  if(document.getElementById(scriptKey))return;
  const $=s=>document.querySelector(s);
  const card=document.createElement('aside');
  card.id=scriptKey;
  card.className='pb-planner-promo';
  card.innerHTML='<div><h2>Bill of Materials</h2><p>Choose your materials or a house plan and send your list to Sales for a quote.</p></div><a href="'+target+'">Open project planner <span aria-hidden="true">↗</span></a>';
  const section=$('#catalogue');
  if(section)section.before(card);
  else {const hero=$('main .hero');if(hero)hero.after(card);else return;}
  const css=document.createElement('style');
  css.textContent='.pb-planner-promo{box-sizing:border-box;display:flex;align-items:center;justify-content:space-between;gap:18px;width:min(1170px,calc(100% - 36px));margin:24px auto;padding:20px 24px;background:#f5f7f6;border:1px solid #cdd8da;border-left:4px solid #f3ce3c;border-radius:10px;color:#0c2d46}.pb-planner-promo h2{margin:0;font-size:clamp(21px,3vw,30px);line-height:1.2;color:#0c2d46}.pb-planner-promo p{margin:5px 0 0;font-size:15px;line-height:1.45;color:#415b69}.pb-planner-promo a,.pb-branch-quote,.pb-brick-quote{display:inline-flex;justify-content:center;align-items:center;gap:8px;border:0;border-radius:6px;min-height:42px;padding:9px 15px;background:#0c2d46;color:#fff!important;font:inherit;font-size:14px;font-weight:700;text-decoration:none;cursor:pointer}.pb-planner-promo a{white-space:nowrap}.pb-branch-quote{width:100%;grid-column:1/-1}.pb-branch-quote:disabled{opacity:.5;cursor:default}.pb-brick-quote{margin:0 0 12px}.pb-brick-quote[hidden]{display:none!important}@media(max-width:620px){.pb-planner-promo{flex-direction:column;align-items:flex-start;padding:15px}.pb-planner-promo a{white-space:normal}}';
  // Keep missing-image placeholders inside their thumbnails and the open drawer above the sticky header.
  css.textContent += '#quoteDrawer .quote-line-image{position:relative;isolation:isolate;overflow:hidden}#quoteDrawer .quote-line-image .product-placeholder{pointer-events:none}#quoteDrawer.is-open{z-index:1002}body:has(#quoteDrawer.is-open) #scrim{z-index:1001}';
  document.head.append(css);
  const foot=$('footer .footer-links');
  const catalogueLink=foot&&foot.querySelector('a[href="#catalogue"]');
  if(catalogueLink&&!foot.querySelector('a[href="'+target+'"]')){
    const a=document.createElement('a');a.href=target;a.textContent='Bill of Materials';catalogueLink.after(a);
  }
  // Apply the verified Chamdor destination only to the existing branch/contact fields.
  const place='https://www.google.com/maps/dir/?api=1&destination=PowerBuild%20Chamdor%2C%2016%20Jacobs%20St%2C%20Krugersdorp&destination_place_id=ChIJ-V41SpuYlR4RoYlStvEan4I';
  document.querySelectorAll('.utility-links a,.contact-details strong,.footer-links a,.footer-links p,footer address').forEach(el=>{
    if(el.childElementCount||!/^26 Jacobs Road, Chamdor(?:, Krugersdorp)?[.]?$/i.test(el.textContent.trim()))return;
    const full=el.textContent.includes('Krugersdorp');
    el.textContent='16 Jacobs St, Chamdor'+(full?', Krugersdorp':'');
    if(el.tagName==='A')el.href=place;
  });
  const chamdor=Array.from(document.querySelectorAll('.store-card')).find(c=>c.querySelector('h3')?.textContent.trim().toLowerCase()==='powerbuild chamdor');
  if(chamdor){
    const address=chamdor.querySelector('address'),map=chamdor.querySelector('.store-directions');
    if(address)address.textContent='16 Jacobs St, Chamdor, Krugersdorp';
    if(map)map.href=place;
    chamdor.dataset.search=(chamdor.dataset.search||'')+' 16 jacobs st chamdor';
  }
  const grid=$('#productGrid'), category=$('#categorySelect');
  if(grid&&category){
    const a=document.createElement('a');a.href=target+'#bricks';a.className='pb-brick-quote';a.textContent='Add building bricks or blocks to my list ↗';grid.before(a);
    const sync=()=>{const selected=category.value||new URLSearchParams(location.search).get('category')||'';a.hidden=!/bricks?\s*(?:and|&)\s*blocks?/i.test(selected);};
    sync();new MutationObserver(sync).observe(grid,{childList:true});category.addEventListener('change',sync);window.addEventListener('popstate',sync);
  }
  const drawer=$('#quoteItems'),copy=$('#copyQuote');
  if(drawer&&copy){
    const b=document.createElement('button');b.type='button';b.className='pb-branch-quote';b.textContent='Review and send my list →';copy.before(b);
    const sync=()=>{b.disabled=!drawer.querySelector('.quote-line');};sync();new MutationObserver(sync).observe(drawer,{childList:true,subtree:true});
    b.onclick=()=>{
      const lines=Array.from(drawer.querySelectorAll('.quote-line')).map(row=>{
        const name=row.querySelector('.quote-line-copy strong')?.textContent.trim(),code=row.querySelector('.quote-line-copy span')?.textContent.trim(),qty=row.querySelector('.quantity-control span')?.textContent.trim();
        return name&&qty?name+(code?' · '+code:'')+' × '+qty:'';
      }).filter(Boolean);
      if(!lines.length)return;
      const message=lines.join('\n');
      try{
        sessionStorage.setItem('powerbuildMaterialsTransfer.v1',JSON.stringify({token:'catalogue-'+lines.join('|'),text:message}));
        location.href=target+'#list';
      }catch{
        // A browser that denies session storage can still transfer the list via window.name on the same origin.
        try {window.name=JSON.stringify({powerbuildQuote:message,origin:location.origin});location.href=target+'#list';}catch {copy.click();location.href='project-quote.html';}
      }
    };
  }
})();
