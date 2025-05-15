const tryRemoveAllRibbons = () => {
  const interval = setInterval(() => {
    const hosts = document.querySelectorAll('.commonninja_component');
    let removedAny = false;
    let remaining = 0;

    hosts.forEach(host => {
      let ribbon = null;

      // Intentar eliminar desde shadowRoot si existe
      if (host.shadowRoot) {
        ribbon = host.shadowRoot.querySelector('.commonninja-ribbon');
        if (ribbon) {
          ribbon.remove();
          removedAny = true;
          console.log('Ribbon eliminado desde shadowRoot ✅');
        }
      }

      // Si no hay shadowRoot o no se encontró ahí, buscar en el DOM del host
      if (!ribbon) {
        ribbon = host.querySelector('.commonninja-ribbon');
        if (ribbon) {
          ribbon.remove();
          removedAny = true;
          console.log('Ribbon eliminado ✅');
        }
      }

      // Si no se eliminó en este host, puede que aparezca después
      if (!removedAny) remaining++;
    });

    if (!removedAny && remaining === 0) {
      clearInterval(interval);
      console.log('Todos los ribbons eliminados (o no existen) 🚀');
    } else if (remaining > 0) {
      console.log(`Quedan ${remaining} hosts sin ribbon aún... esperando`);
    }
  }, 500);
};

tryRemoveAllRibbons();
