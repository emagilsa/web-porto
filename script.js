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

  // ---------- Constellation / connectivity graph background ----------
  (function initConstellation(){
    const canvas = document.getElementById('constellation');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const heroSection = canvas.closest('.hero');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes = [];
    let rafId = null;

    const NODE_COLOR = '37, 99, 235';   // matches --blue
    const LINK_DIST = 130;              // max distance to draw a connecting line
    const DENSITY = 9000;               // lower = more nodes per area

    function resize(){
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    }

    function createNodes(){
      const count = Math.max(18, Math.min(70, Math.round((width * height) / DENSITY)));
      nodes = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 1.2
      }));
    }

    function step(){
      ctx.clearRect(0, 0, width, height);

      // update positions
      for (const n of nodes){
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      // draw links
      for (let i = 0; i < nodes.length; i++){
        for (let j = i + 1; j < nodes.length; j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST){
            const alpha = (1 - dist / LINK_DIST) * 0.18;
            ctx.strokeStyle = `rgba(${NODE_COLOR}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw nodes
      for (const n of nodes){
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NODE_COLOR}, 0.45)`;
        ctx.fill();
      }

      if (!reduceMotion){
        rafId = requestAnimationFrame(step);
      }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (rafId) cancelAnimationFrame(rafId);
        resize();
        step();
      }, 150);
    });

    resize();
    step(); // draws one static frame if reduced motion, otherwise starts the loop
  })();
