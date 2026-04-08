document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('privatisation-form');
  const submitBtn = form.querySelector('button[type="submit"]');
  const whatsappLink = form.querySelector('a[href*="wa.me"]');
  const phoneNumber = '237620897603';
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('change', saveFormData);
    input.addEventListener('input', saveFormData);
  });
  loadFormData();
  function saveFormData() {
    const formData = {
      name: document.getElementById('priv-name').value,
      zapp: document.getElementById('priv-phone')?.value || '',
      eventType: document.getElementById('priv-type').value,
      guests: document.getElementById('priv-guests').value,
      message: document.getElementById('priv-message')?.value || ''
    };
    localStorage.setItem('privatisationFormData', JSON.stringify(formData));
  }

  function loadFormData() {
    const saved = localStorage.getItem('privatisationFormData');
    if (saved) {
      const formData = JSON.parse(saved);
      if (document.getElementById('priv-name')) document.getElementById('priv-name').value = formData.name || '';
      if (document.getElementById('priv-type')) document.getElementById('priv-type').value = formData.eventType || '';
      if (document.getElementById('priv-guests')) document.getElementById('priv-guests').value = formData.guests || '';
      if (document.getElementById('priv-phone')) document.getElementById('priv-phone').value = formData.zapp || '';
      if (document.getElementById('priv-message')) document.getElementById('priv-message').value = formData.message || '';
    }
  }
  submitBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const name = document.getElementById('priv-name').value;
    const eventType = document.getElementById('priv-type').value;
    const guests = document.getElementById('priv-guests').value;
    const zapp = document.getElementById('priv-phone')?.value || '';
    const message = document.getElementById('priv-message')?.value || '';
    if (!name || !eventType || !guests) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    const whatsappMessage = `
Bonjour Palm Beach,

Je souhaite faire une privatisation avec les détails suivants :

👤 Nom : ${name}
🎉 Type d'événement : ${eventType}
👥 Nombre de personnes : ${guests}
${zapp ? `📧 Numéro : ${zapp}` : ''}
${message ? `📝 Message : ${message}` : ''}

Merci de me recontacter au plus tôt.
    `.trim();
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
    localStorage.removeItem('privatisationFormData');
  });
});