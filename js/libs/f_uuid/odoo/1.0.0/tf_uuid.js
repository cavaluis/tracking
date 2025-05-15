const removeTallyPoweredFromIframe = () => {
    const iframe = document.querySelector("iframe#iFrameResizer0");
    if (iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const tallyPowered = iframeDocument.querySelector(".tally-powered");
        if (tallyPowered) {
            tallyPowered.remove();
            console.log("Tally-powered dentro del iframe eliminado.");
        }
    }
};

const tallyObserver = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
        // Si se agrega un nuevo hijo y es un iframe, verificamos dentro de 茅l
        if (mutation.type === "childList") {
            removeTallyPoweredFromIframe();
        }
    });
});

tallyObserver.observe(document.body, { childList: true, subtree: true });
setInterval(removeTallyPoweredFromIframe, 3000);

// debugger;
const tallyElements = [
    document.querySelector("iframe[data-tally-src], iframe[src*='tally.co'], iframe[src*='tally.com']"),
    document.querySelector('[data-tally-open]'),
    document.querySelector('a[href*="tally-open="]')
];

const tallyElement = tallyElements.find(el => el !== null);

if (tallyElement) {
    const uniqueId = uuidv4();  // Generar un ID único

    const url = new URL(window.location.href);  // Obtener la URL actual
    url.searchParams.set('src', uniqueId);  // Agregar el parámetro src

    // Actualizar la URL en el historial del navegador sin recargar la página
    window.history.replaceState({}, '', url);

    console.log('✅ Se actualizó la URL con el parámetro src:', uniqueId);
}

function uuidv4() {
   return uuid.v4();
}
