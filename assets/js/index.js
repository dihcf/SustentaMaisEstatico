  // Toggle menu mobile
  document.getElementById("menuToggle").addEventListener("click", toggleMobileMenu)
  
  function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
            }
        }document.addEventListener('DOMContentLoaded', () => {
  const emailCard = document.getElementById('email-card');
  const whatsappCard = document.getElementById('whatsapp-card');

  const emailPopup = document.getElementById('email-popup');
  const whatsappPopup = document.getElementById('whatsapp-popup');
  const whatsappMessage = document.getElementById('whatsapp-message');
  const closeButtons = document.querySelectorAll('.custom-close-btn');
  const confirmWhatsapp = document.getElementById('confirm-whatsapp');

  let currentService = 'contato';

  const serviceMessages = {
    contato: "Olá, gostaria de entrar em contato pelo WhatsApp.",
    mudas: "Olá, gostaria de solicitar mais informações sobre a doação de mudas.",
    composteira: "Olá, gostaria de agendar uma oficina de composteira caseira.",
    sabao: "Olá, gostaria de participar da oficina de sabão ecológico.",
    palestras: "Olá, gostaria de agendar uma palestra educativa.",
    reaproveitamento: "Olá, gostaria de participar da oficina de reaproveitamento alimentar.",
    webdev: "Olá, gostaria de me inscrever na oficina de desenvolvimento web."
  };

  // --- Email: copia e abre popup ---
  if (emailCard) {
    emailCard.addEventListener('click', async () => {
      const email = "gssustenta@gmail.com";
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // fallback antigo
          const ta = document.createElement('textarea');
          ta.value = email;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        if (emailPopup) emailPopup.style.display = 'flex';
      } catch (err) {
        console.error('Erro ao copiar email:', err);
      }
    });
  } else {
    console.warn('#email-card não encontrado no DOM');
  }

  // Função para abrir o popup do WhatsApp com mensagem correta
  function openWhatsappFor(serviceKey) {
    currentService = serviceKey || 'contato';
    const msg = serviceMessages[currentService] || serviceMessages['contato'];

    if (whatsappMessage) {
      whatsappMessage.textContent =
        "Você será redirecionado para o WhatsApp com a mensagem:\n\n" +
        `"${msg}"\n\nDeseja continuar?`;
    } else {
      console.warn('#whatsapp-message não encontrado — exibindo alert como fallback');
    }

    if (whatsappPopup) whatsappPopup.style.display = 'flex';
  }

  // Clique no card de contato WhatsApp (se existir)
  if (whatsappCard) {
    whatsappCard.addEventListener('click', () => openWhatsappFor('contato'));
  }

  // Botões dos serviços (data-service)
  const serviceButtons = document.querySelectorAll('.modal-trigger');
  if (serviceButtons.length === 0) console.warn('Nenhum .modal-trigger encontrado');
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openWhatsappFor(btn.dataset.service);
    });
  });

  // Fechar popups
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (emailPopup) emailPopup.style.display = 'none';
      if (whatsappPopup) whatsappPopup.style.display = 'none';
    });
  });

  // Confirmar redirecionamento
  if (confirmWhatsapp) {
    confirmWhatsapp.addEventListener('click', () => {
      if (whatsappPopup) whatsappPopup.style.display = 'none';
      const numero = "5585994228828";
      const mensagem = encodeURIComponent(serviceMessages[currentService] || serviceMessages['contato']);
      window.open(`https://wa.me/${numero}?text=${mensagem}`, '_blank');
    });
  } else {
    console.warn('#confirm-whatsapp não encontrado');
  }
});