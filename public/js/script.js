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

  // Lógica de Validação e Envio do Formulário de Contato
  const form = document.getElementById('contactForm');
  if (form) {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagemInput = document.getElementById('mensagem');
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');

    const validators = {
      nome: function(val) {
        if (!val) return 'O nome é obrigatório.';
        if (val.length < 3) return 'O nome deve ter pelo menos 3 caracteres.';
        return '';
      },
      email: function(val) {
        if (!val) return 'O e-mail é obrigatório.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return 'Por favor, insira um e-mail válido.';
        return '';
      },
      mensagem: function(val) {
        if (!val) return 'A descrição do projeto é obrigatória.';
        if (val.length < 10) return 'Por favor, detalhe um pouco mais o seu projeto (mínimo 10 caracteres).';
        return '';
      }
    };

    function validateField(input, errorElement, validator) {
      const errorMsg = validator(input.value.trim());
      if (errorMsg) {
        errorElement.textContent = errorMsg;
        input.setAttribute('aria-invalid', 'true');
        return false;
      } else {
        errorElement.textContent = '';
        input.removeAttribute('aria-invalid');
        return true;
      }
    }

    // Validação nos eventos Blur
    nomeInput.addEventListener('blur', function() {
      validateField(nomeInput, document.getElementById('nomeError'), validators.nome);
    });
    emailInput.addEventListener('blur', function() {
      validateField(emailInput, document.getElementById('emailError'), validators.email);
    });
    mensagemInput.addEventListener('blur', function() {
      validateField(mensagemInput, document.getElementById('mensagemError'), validators.mensagem);
    });

    // Limpar erros no evento Input
    const inputs = [nomeInput, emailInput, mensagemInput];
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        const errorId = this.id + 'Error';
        const errorElement = document.getElementById(errorId);
        errorElement.textContent = '';
        this.removeAttribute('aria-invalid');
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      });
    });

    // Submissão do Formulário
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      // Forçar validação de todos os campos
      const isNomeValid = validateField(nomeInput, document.getElementById('nomeError'), validators.nome);
      const isEmailValid = validateField(emailInput, document.getElementById('emailError'), validators.email);
      const isMensagemValid = validateField(mensagemInput, document.getElementById('mensagemError'), validators.mensagem);

      if (!isNomeValid || !isEmailValid || !isMensagemValid) {
        // Focar no primeiro campo inválido
        if (!isNomeValid) nomeInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isMensagemValid) mensagemInput.focus();
        return;
      }

      // Desabilitar botão e mostrar loading
      submitBtn.disabled = true;
      formStatus.textContent = 'Enviando sua mensagem...';
      formStatus.className = 'form-status loading';

      try {
        const response = await fetch('/api/contato', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            mensagem: mensagemInput.value.trim()
          })
        });

        const result = await response.json();

        if (response.ok) {
          formStatus.textContent = result.success || 'Mensagem enviada com sucesso!';
          formStatus.className = 'form-status success';
          form.reset();
        } else {
          formStatus.textContent = result.error || 'Ocorreu um erro ao enviar. Tente novamente.';
          formStatus.className = 'form-status error';
        }
      } catch (err) {
        console.error('Erro no envio:', err);
        formStatus.textContent = 'Erro de conexão. Verifique sua internet e tente novamente.';
        formStatus.className = 'form-status error';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }
})();