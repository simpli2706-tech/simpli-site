(function() {
  // Menu mobile
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    navLinks.classList.toggle('open');
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  document.querySelectorAll('.nav-links a').forEach(function(link) {
    link.addEventListener('click', function() {
      navLinks.classList.remove('open');
      const icon = menuToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-times');
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer').forEach(function(a) { a.classList.remove('open'); });
      document.querySelectorAll('.faq-question').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        answer.classList.add('open');
        this.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Hero visual grid
  const grid = document.getElementById('heroVisual');
  if (grid) {
    const total = 36;
    const onCells = [1,4,7,8,13,14,15,20,21,26,27,28,29,33];
    const accentCell = 15;
    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'hv-cell';
      if (i === accentCell) cell.classList.add('teal');
      else if (onCells.includes(i)) cell.classList.add('on');
      grid.appendChild(cell);
    }
  }
})();