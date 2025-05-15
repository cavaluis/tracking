const tryRemoveRibbon = () => {
  const interval = setInterval(() => {
    const host = document.querySelector('.commonninja_component');
    if (!host) {
      console.log('Host no encontrado');
      return;
    }

    // Revisar si hay shadowRoot
    const shadowRoot = host.shadowRoot;
    if (shadowRoot) {
      const ribbon = shadowRoot.querySelector('.commonninja-ribbon');
      if (ribbon) {
        ribbon.remove();
        clearInterval(interval);
        console.log('Ribbon eliminado desde shadowRoot ✅');
        return;
      }
    }

    // Si no hay shadowRoot o no se encontró ahí, buscar en el DOM normal
    const ribbon = host.querySelector('.commonninja-ribbon');
    if (ribbon) {
      ribbon.remove();
      clearInterval(interval);
      console.log('Ribbon eliminado ✅');
    } else {
      console.log('Revisando... aún no aparece el ribbon');
    }
  }, 500); // cada 500ms
};

tryRemoveRibbon();

