document.getElementById('year').textContent = new Date().getFullYear();

  try{
    if('IntersectionObserver' in window){
      document.body.classList.add('js-ready');
      const revealEls = document.querySelectorAll('.reveal');
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(el=>io.observe(el));
    }
  }catch(err){
    document.body.classList.remove('js-ready');
  }

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('nav.links');
  if(toggle){
    toggle.addEventListener('click', ()=>{
      const open = links.style.display === 'flex';
      links.style.display = open ? 'none' : 'flex';
      links.style.position = 'absolute';
      links.style.top = '64px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = '#fff';
      links.style.flexDirection = 'column';
      links.style.padding = '16px 32px';
      links.style.borderBottom = '1px solid var(--border)';
      links.style.gap = '16px';
    });
  }
