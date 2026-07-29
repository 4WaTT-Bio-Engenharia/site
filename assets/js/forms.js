/* ============================================================
   4WaTT — Forms JS
   Versão 1.0 · Março 2026
   Validação, máscara de telefone, envio via fetch (Formspree)
   ============================================================ */

(function() {
  'use strict';

  // Endpoint padrão (substituir pelo endpoint real do Formspree ou webhook)
  // Exemplo Formspree: https://formspree.io/f/SEU_ID
  const DEFAULT_ENDPOINT = 'https://formspree.io/f/xpwzdnkl';
  const GLOBAL_SHEETS_ENDPOINT = (window.__INVESTOR_AUTOMATION_ENDPOINT || 'https://script.google.com/macros/s/AKfycbzKxvU_dl3ycekvyhcNrS54cm3UvdyEeA6e7uX8QZ0/exec').trim();

  // --- Máscara de telefone brasileiro ---
  function maskPhone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
      return value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    }
    return value.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
  }

  function applyPhoneMask(input) {
    input.addEventListener('input', () => {
      const cursor = input.selectionStart;
      const raw = input.value.replace(/\D/g, '');
      input.value = maskPhone(raw);
    });
  }

  // --- Capturar UTM params ---
  function getUTMParams() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const value = params.get(key);
      if (value) utms[key] = value;
    });
    // Tentar recuperar de sessionStorage se não estiver na URL
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(key => {
      if (!utms[key]) {
        const stored = sessionStorage.getItem(key);
        if (stored) utms[key] = stored;
      }
    });
    return utms;
  }

  // Salvar UTMs ao entrar na página
  (function saveUTMs() {
    const params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const value = params.get(key);
      if (value) sessionStorage.setItem(key, value);
    });
  })();

  // --- Validação ---
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return phone.replace(/\D/g, '').length >= 10;
  }

  function isInvestorForm(form) {
    return form && (form.id === 'form-investidor' || form.dataset.formName === 'Área do Investidor');
  }

  function classifyInvestorLead(data) {
    const volumeScoreMap = {
      'ate-5mi': 1,
      '5-20mi': 2,
      '20-50mi': 3,
      'acima-50mi': 4
    };

    const message = String(data.mensagem || '').toLowerCase();
    const messageScore = [
      'investimento',
      'fundo',
      'equity',
      'family office',
      'private equity',
      'nda',
      'nda',
      'ticket',
      'capex'
    ].some(term => message.includes(term)) ? 1 : 0;

    const volumeScore = volumeScoreMap[data.volume_interesse] || 0;
    const companyScore = String(data.empresa || '').trim() ? 1 : 0;
    const score = volumeScore + messageScore + companyScore;

    let status = 'NAO_APTO';
    let reason = 'Perfil abaixo da faixa de triagem.';
    if (volumeScore >= 3 || score >= 5) {
      status = 'APTO';
      reason = 'Volume e contexto compatíveis com triagem comercial.';
    } else if (score >= 3) {
      status = 'TRIAGEM';
      reason = 'Lead com potencial, mas ainda pede validação comercial.';
    }

    return {
      lead_status: status,
      lead_score: score,
      lead_reason: reason
    };
  }

  function showError(field, message) {
    const formField = field.closest('.form-field');
    if (!formField) return;
    formField.classList.add('has-error');
    field.classList.add('error');
    const errorEl = formField.querySelector('.form-error-msg');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field) {
    const formField = field.closest('.form-field');
    if (!formField) return;
    formField.classList.remove('has-error');
    field.classList.remove('error');
  }

  function validateForm(form) {
    let isValid = true;

    form.querySelectorAll('[required]').forEach(field => {
      clearError(field);

      if (!field.value.trim()) {
        showError(field, 'Este campo é obrigatório.');
        isValid = false;
        return;
      }

      if (field.type === 'email' && !validateEmail(field.value)) {
        showError(field, 'Informe um e-mail válido.');
        isValid = false;
        return;
      }

      if ((field.type === 'tel' || field.name === 'whatsapp' || field.name === 'phone') && !validatePhone(field.value)) {
        showError(field, 'Informe um telefone válido com DDD.');
        isValid = false;
        return;
      }
    });

    return isValid;
  }

  // --- Envio do formulário ---
  async function submitForm(form) {
    const endpoint = form.dataset.endpoint || DEFAULT_ENDPOINT;
    const submitBtn = form.querySelector('[type="submit"]');

    if (!validateForm(form)) return;

    // Estado loading
    if (submitBtn) {
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
    }

    // Coletar dados
    const data = {};
    new FormData(form).forEach((value, key) => {
      data[key] = value;
    });

    // Adicionar UTMs e metadados
    Object.assign(data, getUTMParams());
    data._page_url = window.location.href;
    data._page_title = document.title;
    data._timestamp = new Date().toISOString();

    const investorLead = isInvestorForm(form) ? classifyInvestorLead(data) : null;
    if (investorLead) {
      Object.assign(data, investorLead, {
        lead_type: 'investidor',
        lead_source: 'site',
        lead_automation: 'google-sheets'
      });
    }

    try {
      const targets = [];
      if (endpoint) {
        targets.push(endpoint);
      }
      
      // Enviar para o Sheets se houver um endpoint configurado (agora global para todos os form-4watt)
      if (GLOBAL_SHEETS_ENDPOINT && GLOBAL_SHEETS_ENDPOINT !== endpoint) {
        targets.push(GLOBAL_SHEETS_ENDPOINT);
      }

      if (!targets.length) {
        throw new Error('Nenhum endpoint configurado para envio do formulário.');
      }

      const responses = [];
      for (const target of targets) {
        const response = await fetch(target, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
        responses.push(response);
      }

      const ok = responses.some(response => response.ok);
      if (ok) {
        showSuccessMessage(form, investorLead);
        form.reset();

        // Disparar evento de conversão (Google Analytics)
        if (window.gtag) {
          gtag('event', 'form_submit', {
            form_id: form.id || 'contact_form',
            form_name: form.dataset.formName || 'Formulário de Contato',
            lead_status: investorLead ? investorLead.lead_status : undefined
          });
        }
      } else {
        throw new Error('Erro ao enviar formulário');
      }
    } catch (err) {
      showErrorMessage(form, 'Ocorreu um erro ao enviar. Tente novamente ou entre em contato pelo WhatsApp.');
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
      }
    }
  }

  function showSuccessMessage(form, investorLead = null) {
    const successEl = form.querySelector('.form-success') || form.parentNode.querySelector('.form-success');
    if (successEl) {
      form.style.display = 'none';
      if (investorLead && investorLead.lead_status) {
        const statusLabel = investorLead.lead_status === 'APTO' ? 'Perfil apto' : 'Recebido';
        successEl.setAttribute('data-lead-status', investorLead.lead_status);
        successEl.innerHTML = `
          <strong>${statusLabel}.</strong><br>
          Sua solicitação foi enviada e será triada pela equipe comercial.
        `;
      }
      successEl.classList.add('show');
    } else {
      // Criar feedback inline
      const msg = document.createElement('div');
      msg.className = 'form-success show';
      msg.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="margin-bottom:8px;display:block;margin-left:auto;margin-right:auto">
          <circle cx="12" cy="12" r="11" stroke="currentColor" stroke-width="1.5"/>
          <path d="M7 12.5L10.5 16L17 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <strong>Mensagem enviada!</strong><br>
        Nosso time entrará em contato em até 24 horas.
      `;
      form.parentNode.insertBefore(msg, form.nextSibling);
      form.style.display = 'none';
    }
  }

  function showErrorMessage(form, message) {
    let errorEl = form.querySelector('.form-send-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-send-error';
      errorEl.style.cssText = 'color:#e53e3e;font-size:14px;margin-top:12px;text-align:center;';
      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.parentNode.insertBefore(errorEl, submitBtn.nextSibling);
      } else {
        form.appendChild(errorEl);
      }
    }
    errorEl.textContent = message;
  }

  // --- Inicializar todos os formulários ---
  function initForms() {
    // Aplicar máscara de telefone
    document.querySelectorAll('input[type="tel"], input[name="whatsapp"], input[name="phone"]').forEach(input => {
      applyPhoneMask(input);
    });

    // Limpar erros ao digitar
    document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(field => {
      field.addEventListener('input', () => clearError(field));
      field.addEventListener('change', () => clearError(field));
    });

    // Capturar submissão dos formulários com classe 4watt-form
    document.querySelectorAll('form.form-4watt').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        submitForm(form);
      });
    });
  }

  // --- Modal de interesse (investidor) ---
  function initInterestModal() {
    const modal = document.querySelector('#modal-interesse');
    if (!modal) return;

    const overlay = document.querySelector('#modal-interesse-overlay');
    const closeBtn = modal.querySelector('.modal__close');

    document.querySelectorAll('[data-open-modal="interesse"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const projectName = btn.dataset.project || '';
        const projectInput = modal.querySelector('[name="projeto"]');
        if (projectInput && projectName) projectInput.value = projectName;

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initForms();
    initInterestModal();
  });

})();
