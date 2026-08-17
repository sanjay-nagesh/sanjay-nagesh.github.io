document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  if(!toggle || !nav) return;

  function setExpanded(val){
    toggle.setAttribute('aria-expanded', String(val));
    if(val) nav.classList.add('show'); else nav.classList.remove('show');
  }

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!expanded);
  });

  // Close on escape
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') setExpanded(false);
  });

  // Close when focus leaves nav (for small screens)
  nav.addEventListener('focusout', (e) => {
    // if the newly focused element is outside the nav, close
    if(!nav.contains(e.relatedTarget)) setExpanded(false);
  });
  // Close nav when a link is clicked (good for single-page anchors)
  nav.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', ()=> setExpanded(false));
  });
});
