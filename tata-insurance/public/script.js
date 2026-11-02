(() => {
  const menu = document.getElementById('menuBtn');
  const nav = document.getElementById('mainNav');
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
  document.getElementById('year').textContent = String(new Date().getFullYear());
  if ('IntersectionObserver' in window) { document.body.classList.add('js-ready'); const obs = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}}), {threshold:.08}); document.querySelectorAll('.reveal').forEach(el => obs.observe(el)); }
  const form = document.getElementById('leadForm'), status = document.getElementById('formStatus');
  document.querySelectorAll('[data-interest]').forEach(a=>a.addEventListener('click',()=>{document.getElementById('interest').value=a.dataset.interest;}));
  fetch('/api/config').then(r=>r.ok?r.json():null).then(cfg=>{if(cfg?.whatsappUrl){const el=document.getElementById('whatsappBtn');el.href=cfg.whatsappUrl;el.classList.remove('hidden');document.getElementById('waNotice').remove();}}).catch(()=>{});
  form?.addEventListener('submit', async e => {
    e.preventDefault(); status.textContent='';status.className='';
    const d = Object.fromEntries(new FormData(form).entries());
    d.mobile = String(d.mobile||'').replace(/\s/g,'');
    if (!form.checkValidity() || !/^[6-9]\d{9}$/.test(d.mobile) || !document.getElementById('consent').checked) {
      status.textContent = 'Please complete all required fields, enter a valid 10-digit Indian mobile number and agree to the contact consent.'; status.className='error';form.reportValidity();return;
    }
    d.consent=true;
    const btn=form.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Sending enquiry…';
    try {const res=await fetch('/api/enquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const data=await res.json().catch(()=>({}));if(!res.ok) throw Error(data.error||'Your enquiry could not be delivered.');status.className='success';status.textContent='Your enquiry was sent successfully. Thank you — the advisor can now follow up.';form.reset();}
    catch(err){status.className='error';status.textContent=`${err.message} Please call or email the advisor using the contact links below.`;}
    finally{btn.disabled=false;btn.innerHTML='Request a Consultation <span>↗</span>';}
  });
})();
