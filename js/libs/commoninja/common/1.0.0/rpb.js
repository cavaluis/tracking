const tryRemoveRibbon = () => {
  const host = document.querySelector('.commonninja_component');
  if (!host) return;

  const shadowRoot = host.shadowRoot;
  if (!shadowRoot) return;

  const ribbon = shadowRoot.querySelector('.commonninja-ribbon');
  if (ribbon) {
    ribbon.remove();
    console.log('Ribbon eliminado ✅');
    clearInterval(checkInterval); // detener una vez eliminado
  } else {
    console.log('Ribbon aún no encontrado...');
  }
};

const checkInterval = setInterval(tryRemoveRibbon, 500);
