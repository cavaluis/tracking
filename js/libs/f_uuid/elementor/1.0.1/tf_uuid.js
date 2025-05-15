const tfe = document.querySelector("iframe[src*='typeform.com'], [data-url*='typeform.com'], [id='typeform-container'], [data-tf-widget]");
if (tfe) {
    let uniqueId = uuidv4();  // Agregar para truncar a 8 caracteres '.slice(0, 8)'
    let url = new URL(window.location.href);
    url.searchParams.set('src', uniqueId);
    // Reemplazar la URL actual en el historial del navegador
    window.history.replaceState({}, '', url);
}
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
