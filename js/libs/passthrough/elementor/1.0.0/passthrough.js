const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('testing_code') === null || urlParams.get('testing_code') === undefined || urlParams.get('testing_code') !== 'true') {
    const referer = document.referrer;
    const trkParamNames = ['source', 'source_id', 'utm_source', 'utm_medium', 'utm_campaign', 'campaign_id', 'utm_adset', 'adset_id', 'utm_ad', 'ad_id', 'src', 'testing_code', 'customer_name', 'customer_email', 'customer_contactno', 'name', 'email', 'phone', 'ip', 'latlng'];
    const passthroughHosts = ['cart.tevasamorir.tv', 'ventastvam--tvam.thrivecart.com'];
    const redirectHosts = ['tevasamorir.link'];
    const trkParams = {};
    const dsgParams = {};

    if (!urlParams.has('source_id') && !urlParams.has('passthrough[source_id]')) {
        urlParams.set('source_id', 'or');
    }
    if (!urlParams.has('utm_source') && !urlParams.has('passthrough[utm_source]')) {
        if (referer) {
        const refererURL = new URL(referer);
        const utmSourceValue = refererURL.hostname || 'Direct Search';
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
    const newURL = window.location.origin + window.location.pathname + '?' + urlParams.toString();
    window.history.replaceState({}, '', newURL);

    // Separa los parametros en trkParams y dsgParams
    for (const [name, value] of urlParams.entries()) {
        if (trkParamNames.includes(name) || name.startsWith('passthrough[') && name.endsWith(']') && trkParamNames.includes(name.replace(/^passthrough\[|\]$/g, ''))) {
        trkParams[name.replace(/^passthrough\[|\]$/g, '')] = value;
        } else {
        dsgParams[name.replace(/^passthrough\[|\]$/g, '')] = value;
        }
    }
    // Obtiene todos los links de la pagina.
    const PageLinks = document.getElementsByTagName('a');
    //debugger;
    const WrapperLinks = document.querySelectorAll('[data-eael-wrapper-link]');
    const MyForms = document.querySelectorAll('.elementor-form');
    // Separa los parametros de cada link en trkParams y dsgParams
    for (const link of PageLinks) {
        //if (link.closest('.elementor-widget-theme-site-logo')) {
        //   continue; // Omitir procesamiento si es el enlace del logo
        //}
        let linkURL = new URL(link.href);
        const linkParams = new URLSearchParams(linkURL.search);
        const link_trkParams = {};
        const link_dsgParams = {};
        for (const [name, value] of linkParams.entries()) {
            if (trkParamNames.includes(name) || name.startsWith('passthrough[') && name.endsWith(']') && trkParamNames.includes(name.replace(/^passthrough\[|\]$/g, ''))) {
                link_trkParams[name.replace(/^passthrough\[|\]$/g, '')] = value;
            } else {
                link_dsgParams[name.replace(/^passthrough\[|\]$/g, '')] = value;
            }
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
        let newHref = linkURL.origin + linkURL.pathname + '?' + newLinkParams.toString() + linkURL.hash;
        link.setAttribute('href', newHref);
    }
      // const listURLs = Array.from(document.getElementsByTagName('a')).map(link => new URL(link.href));
      // const listURL = Array.from(document.getElementsByTagName('a')).map(link => decodeURI(link.href));
}
