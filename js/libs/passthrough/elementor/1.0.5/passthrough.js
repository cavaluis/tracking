const trkParamNames = ['source', 'source_id', 'utm_source', 'utm_medium', 'utm_campaign', 'campaign_id', 'utm_adset', 'adset_id', 'utm_ad', 'ad_id', 'src', 'testing_code', 'customer_name', 'customer_email', 'customer_contactno', 'name', 'email', 'phone', 'ip', 'latlng', 'fbclid', 'fbc', 'fbp'];
const passthroughHosts = ['cart.tevasamorir.tv', 'ventastvam--tvam.thrivecart.com'];
const redirectHosts = ['tevasamorir.link'];

function getCookie(name) {
    let cookies = document.cookie.split('; ').filter(cookie => cookie.startsWith(name + '='));
    if (cookies.length > 0) {
        return cookies[0].split('=')[1]; // Usa la del dominio actual
    }
    return '';
}

function getFbParams() {
    return {
        fbp: getCookie('_fbp'),
        fbc: getCookie('_fbc')
    };
}

function getNewLink(old_href, urlParams) {
    let linkURL = new URL(old_href);
    let linkParams = new URLSearchParams(linkURL.search);
    let trkParams, dsgParams;
    ({ trkParams: trkParams, dsgParams: dsgParams } = getTrkAndDsgParams(urlParams));
    //let { trkParams , dsgParams } = getTrkAndDsgParams(urlParams);
    let link_trkParams, link_dsgParams;
    ({ trkParams: link_trkParams, dsgParams: link_dsgParams } = getTrkAndDsgParams(linkParams));
    //let { link_trkParams , link_dsgParams } = getTrkAndDsgParams(linkParams);

    if (trkParams === undefined) {
        trkParams = {};
    }
    if (dsgParams === undefined) {
        dsgParams = {};
    }
    if (link_trkParams === undefined) {
        link_trkParams = {};
    }
    if (link_dsgParams === undefined) {
        link_dsgParams = {};
    }

    // Crea unos search parameters vacios.
    const newLinkParams = new URLSearchParams();
    // PARA DESHACER ESTO, ELIMINAR SIGUIENTE LINEA Y EN EL SIGUIENTE FOR CAMBIAR Object.entries(newTrkParams) POR Object.entries(trkParams)
    const newTrkParams = Object.assign({}, link_trkParams, trkParams);
    // Llena los tracking parameters de la url principal.
    for (const [name, value] of Object.entries(newTrkParams)) {
        if (passthroughHosts.includes(linkURL.host)) {
            newLinkParams.set('passthrough[' + name + ']', value);
        } else {
            newLinkParams.set(name, value);
        }
    }
    // Crea unos nuevos parametros de diseño, respetando los parametros del link, en caso de incluirlos 
    let newDsgParams = {};
    if (redirectHosts.includes(linkURL.hostname)) {
        if (Object.keys(link_dsgParams).length > 0) {
            newDsgParams = Object.assign({}, link_dsgParams);
        }
    } else {
        if ((Object.keys(dsgParams).length > 0) && (Object.keys(link_dsgParams).length > 0)) {
            newDsgParams = Object.assign({}, dsgParams, link_dsgParams);
        } else if (Object.keys(dsgParams).length > 0) {
            newDsgParams = Object.assign({}, dsgParams);
        } else {
            newDsgParams = Object.assign({}, link_dsgParams);
        }
    }
    for (const [name, value] of Object.entries(newDsgParams)) {
        newLinkParams.set(name, value);
    }
    return newHref = linkURL.origin + linkURL.pathname + '?' + newLinkParams.toString() + linkURL.hash;
}

function getTrkAndDsgParams(urlParams) {
    let trkParams = {};
    let dsgParams = {};

    for (const [name, value] of urlParams.entries()) {
        if (trkParamNames.includes(name) || name.startsWith('passthrough[') && name.endsWith(']') && trkParamNames.includes(name.replace(/^passthrough\[|\]$/g, ''))) {
            trkParams[name.replace(/^passthrough\[|\]$/g, '')] = value;
        } else {
            dsgParams[name.replace(/^passthrough\[|\]$/g, '')] = value;
        }
    }

    return { trkParams: trkParams, dsgParams: dsgParams };
}

function checkRequiredParams() {
    const urlParams = new URLSearchParams(window.location.search);
    let referer = document.referrer

    debugger;
    // Obtener los valores actuales de la URL
    let url_fbp = urlParams.get('fbp');
    let url_fbc = urlParams.get('fbc');

    // Obtener los valores de las cookies solo si no están en la URL
    const fbParams = getFbParams();
    let updated = false;
    if (!url_fbp && fbParams.fbp) {
        urlParams.set('fbp', fbParams.fbp);
        updated = true;
    }
    if (!url_fbc && fbParams.fbc) {
        urlParams.set('fbc', fbParams.fbc);
        updated = true;
    }

    if (!urlParams.has('source_id') && !urlParams.has('passthrough[source_id]')) {
        urlParams.set('source_id', 'or');
    }
    if (!urlParams.has('utm_source') && !urlParams.has('passthrough[utm_source]')) {
        if (referer) {
            let refererURL = new URL(referer),
            utmSourceValue = refererURL.hostname || 'Direct Search';
            urlParams.set('utm_source', utmSourceValue);
        } else {
            urlParams.set('utm_source', 'Direct Search');
        }
    }
    if ((!urlParams.has('el') && !urlParams.has('passthrough[el]')) && (urlParams.get('source_id') === 'or' || urlParams.get('passthrough[source_id]') === 'or')) {
        if (urlParams.has('utm_source')) {
            urlParams.set('el', urlParams.get('utm_source'));
        } else if (urlParams.has('passthrough[utm_source]')) {
            urlParams.set('el', urlParams.get('passthrough[utm_source]'));
        } else {
            urlParams.set('el', 'Direct Search');
        }         
    }    
    // Actualiza la URL en la barra de direcciones
     if (updated) {
        const newURL = window.location.origin + window.location.pathname + '?' + urlParams.toString();
        window.history.replaceState({}, '', newURL);
        //window.location.href = newURL;
    }
}

function watchCookiesForFbParams() {
    let lastCookies = document.cookie;

    const observer = new MutationObserver(() => {
        let currentCookies = document.cookie;
        if (currentCookies !== lastCookies) {
            lastCookies = currentCookies;
            const fbParams = getFbParams();
            if (fbParams.fbp || fbParams.fbc) {
                updateUrlWithFbParams();
                observer.disconnect();
            }
        }
    });

    observer.observe(document, { subtree: true, childList: true });
}

function main() {
    checkRequiredParams();
    watchCookiesForFbParams();
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('testing_code') === null || urlParams.get('testing_code') === undefined || urlParams.get('testing_code') !== 'true') {
                
        //const PageLinks = document.getElementsByTagName('a');    
        const validLinkTypes = ['.html', '.htm', '/'];
        const PageLinks = document.getElementsByTagName('a')
        for (let link of PageLinks) {
            link.setAttribute('href', getNewLink(link.href, urlParams));        
        }
        // debugger;
        const WrapperLinks = document.querySelectorAll('[data-eael-wrapper-link]');
        for (let link of WrapperLinks) {
            
            let data = JSON.parse(link.getAttribute('data-eael-wrapper-link'));
            data.url = getNewLink(data.url, urlParams)
            link.setAttribute('data-eael-wrapper-link', JSON.stringify(data));        
        }
        const MyForms = document.querySelectorAll('.elementor-form');
    }
}

main()
