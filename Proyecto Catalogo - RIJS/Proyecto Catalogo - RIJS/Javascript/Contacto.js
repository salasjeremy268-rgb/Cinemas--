    let rating = 0;

    function setRating(val) {
      rating = val;
      document.querySelectorAll('.estrella').forEach((e, i) => {
        e.classList.toggle('activa', i < val);
      });
    }

    function toggleFaq(btn) {
      const item = btn.closest('.faq-item');
      const abierto = item.classList.contains('abierto');
      document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('abierto'));
      if (!abierto) item.classList.add('abierto');
    }

    function enviarFormulario() {
      const nombre = document.getElementById('nombre').value.trim();
      const email = document.getElementById('email').value.trim();
      const mensaje = document.getElementById('mensaje').value.trim();
      const privacidad = document.getElementById('privacidad').checked;

      if (!nombre || !email || !mensaje) {
        alert('Por favor, rellena los campos obligatorios: nombre, email y mensaje.');
        return;
      }

      if (!privacidad) {
        alert('Debes aceptar la política de privacidad para continuar.');
        return;
      }

      const msg = document.getElementById('msg-exito');
      msg.style.display = 'block';

      setTimeout(() => {
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mensaje').value = '';
        document.getElementById('privacidad').checked = false;
        document.getElementById('newsletter').checked = false;
        setRating(0);
      }, 500);
    }