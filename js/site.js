// ── Modal ────────────────────────────────────────────────────────────────────
function buildModal(){
  const overlay = document.createElement('div');
  overlay.id = 'proj-modal';
  overlay.className = 'modal-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML = `
    <div class="modal-box">
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-slideshow"></div>
      <div class="modal-body">
        <p class="spec modal-spec"></p>
        <h3 class="modal-title"></h3>
        <div class="modal-details"></div>
        <p class="modal-tech"></p>
        <a class="modal-link btn" target="_blank" rel="noopener noreferrer">View / Demo &rarr;</a>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  // close on overlay click or X button
  overlay.addEventListener('click', e => { if(e.target === overlay) closeModal(); });
  overlay.querySelector('.modal-close').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeModal(); });
  return overlay;
}

function closeModal(){
  const m = document.getElementById('proj-modal');
  if(m){ m.classList.remove('open'); document.body.style.overflow = ''; }
}

function buildSlideshow(imgs, container){
  container.innerHTML = '';
  if(!imgs || !imgs.length) return;

  let idx = 0;
  const track = document.createElement('div'); track.className = 'ss-track';
  imgs.forEach((src,i) => {
    const img = document.createElement('img');
    img.src = src; img.alt = 'Project image ' + (i+1);
    img.className = 'ss-slide' + (i===0?' active':'');
    track.appendChild(img);
  });
  container.appendChild(track);

  if(imgs.length < 2) return;

  const prev = document.createElement('button'); prev.className='ss-btn ss-prev'; prev.innerHTML='&#8249;'; prev.setAttribute('aria-label','Previous');
  const next = document.createElement('button'); next.className='ss-btn ss-next'; next.innerHTML='&#8250;'; next.setAttribute('aria-label','Next');
  const dots = document.createElement('div'); dots.className='ss-dots';
  imgs.forEach((_,i)=>{ const d=document.createElement('span'); d.className='ss-dot'+(i===0?' active':''); dots.appendChild(d); });

  function goTo(n){
    const slides = track.querySelectorAll('.ss-slide');
    const dotsEl = dots.querySelectorAll('.ss-dot');
    idx = ((n % imgs.length) + imgs.length) % imgs.length;
    slides.forEach((s,i)=>s.classList.toggle('active', i===idx));
    dotsEl.forEach((d,i)=>d.classList.toggle('active', i===idx));
  }
  prev.addEventListener('click', ()=>goTo(idx-1));
  next.addEventListener('click', ()=>goTo(idx+1));
  dots.querySelectorAll('.ss-dot').forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
  container.appendChild(prev); container.appendChild(next); container.appendChild(dots);
}

function openModal(p){
  let overlay = document.getElementById('proj-modal') || buildModal();
  const box = overlay.querySelector('.modal-box');

  // slideshow
  const ssEl = overlay.querySelector('.modal-slideshow');
  ssEl.style.display = p.images && p.images.length ? '' : 'none';
  if(p.images && p.images.length) buildSlideshow(p.images, ssEl);

  // text
  overlay.querySelector('.modal-spec').textContent = p.spec || '';
  overlay.querySelector('.modal-title').textContent = p.title;
  const detailsEl = overlay.querySelector('.modal-details');
  detailsEl.innerHTML = '';
  (p.details || p.summary || '').split('\n').forEach(line => {
    if(!line.trim()) return;
    if(line.startsWith('•')){
      let ul = detailsEl.querySelector('ul:last-child');
      if(!ul){ ul = document.createElement('ul'); detailsEl.appendChild(ul); }
      const li = document.createElement('li'); li.textContent = line.replace(/^•\s*/,''); ul.appendChild(li);
    } else {
      const p2 = document.createElement('p'); p2.textContent = line; detailsEl.appendChild(p2);
    }
  });
  const techEl = overlay.querySelector('.modal-tech');
  techEl.textContent = p.tech;

  const linkEl = overlay.querySelector('.modal-link');
  if(p.link && p.link !== '#'){ linkEl.href = p.link; linkEl.textContent = (p.linkText || 'View / Demo') + ' →'; linkEl.style.display=''; }
  else { linkEl.style.display='none'; }

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.querySelector('.modal-close').focus();
}

// ── Cards ────────────────────────────────────────────────────────────────────
// Cards are static HTML in index.html; this only adds the detail modal and
// thumbnail rotation, so the page still works without JavaScript.
async function initProjects(){
  const cards = document.querySelectorAll('.project-card[data-index]');
  if(!cards.length) return;
  let projects = [];
  try{
    const res = await fetch('data/projects.json');
    if(!res.ok) throw new Error('HTTP ' + res.status);
    projects = await res.json();
  } catch(err){ console.error(err); return; }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cards.forEach(card => {
    const p = projects[Number(card.dataset.index)];
    if(!p) return;
    card.addEventListener('click', () => openModal(p));
    card.addEventListener('keydown', e => {
      if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openModal(p); }
    });
    const img = card.querySelector('.card-thumb img');
    if(img && !reduceMotion && p.images && p.images.length > 1){
      let idx = 0;
      setInterval(() => { idx = (idx + 1) % p.images.length; img.src = p.images[idx]; }, 2200);
    }
  });
}

document.addEventListener('DOMContentLoaded', initProjects);
